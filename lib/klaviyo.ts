const KLAVIYO_API = "https://a.klaviyo.com/api";
const REVISION = "2024-10-15";

type Result = { ok: boolean; error?: string };

type ProfileProperties = Record<string, string | number | boolean | null>;

function klaviyoHeaders(privateKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${privateKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    revision: REVISION,
  };
}

/**
 * Upserts a profile and writes custom properties. The bulk-subscribe
 * endpoint doesn't accept profile properties, so we do this first.
 *
 * Strategy: POST /api/profiles/. If duplicate, Klaviyo returns 409 with
 * the existing profile id; we then PATCH that id with the properties.
 */
async function upsertProfile(
  email: string,
  properties: ProfileProperties,
  privateKey: string
): Promise<Result> {
  try {
    const createRes = await fetch(`${KLAVIYO_API}/profiles/`, {
      method: "POST",
      headers: klaviyoHeaders(privateKey),
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: { email, properties },
        },
      }),
    });

    if (createRes.ok) return { ok: true };

    if (createRes.status === 409) {
      const body = await createRes.json();
      const existingId = body?.errors?.[0]?.meta?.duplicate_profile_id as
        | string
        | undefined;
      if (!existingId) {
        return {
          ok: false,
          error: `Klaviyo 409 with no duplicate id: ${JSON.stringify(body)}`,
        };
      }
      const patchRes = await fetch(
        `${KLAVIYO_API}/profiles/${existingId}/`,
        {
          method: "PATCH",
          headers: klaviyoHeaders(privateKey),
          body: JSON.stringify({
            data: {
              type: "profile",
              id: existingId,
              attributes: { properties },
            },
          }),
        }
      );
      if (!patchRes.ok) {
        const text = await patchRes.text();
        return {
          ok: false,
          error: `Klaviyo profile patch ${patchRes.status}: ${text}`,
        };
      }
      return { ok: true };
    }

    const text = await createRes.text();
    return {
      ok: false,
      error: `Klaviyo profile create ${createRes.status}: ${text}`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

async function bulkSubscribe(
  email: string,
  listId: string,
  privateKey: string
): Promise<Result> {
  try {
    const res = await fetch(
      `${KLAVIYO_API}/profile-subscription-bulk-create-jobs/`,
      {
        method: "POST",
        headers: klaviyoHeaders(privateKey),
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              profiles: {
                data: [
                  {
                    type: "profile",
                    attributes: {
                      email,
                      subscriptions: {
                        email: { marketing: { consent: "SUBSCRIBED" } },
                      },
                    },
                  },
                ],
              },
            },
            relationships: {
              list: { data: { type: "list", id: listId } },
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Klaviyo subscribe ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Adds an email to a Klaviyo list with custom profile properties.
 *
 * Two calls under the hood: profile upsert (sets properties), then bulk
 * subscribe (consent + list membership). Idempotent on email.
 */
export async function subscribeToKlaviyo(
  email: string,
  properties: ProfileProperties = {},
  listId?: string
): Promise<Result> {
  const list = listId || process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY;

  if (!list || !privateKey) {
    console.warn("Klaviyo env not configured. Skipping subscribe.");
    return { ok: true };
  }

  if (Object.keys(properties).length > 0) {
    const upsert = await upsertProfile(email, properties, privateKey);
    if (!upsert.ok) return upsert;
  }

  return bulkSubscribe(email, list, privateKey);
}

/**
 * Fires a server-side Klaviyo metric event (e.g. "Reserved Deposit").
 * Used from the Stripe webhook so reservations land in Klaviyo flows
 * without depending on client-side tracking.
 */
export async function trackKlaviyoEvent(
  email: string,
  metric: string,
  properties: ProfileProperties = {}
): Promise<Result> {
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY;
  if (!privateKey) {
    console.warn("Klaviyo private key not set. Skipping event.");
    return { ok: true };
  }

  try {
    const res = await fetch(`${KLAVIYO_API}/events/`, {
      method: "POST",
      headers: klaviyoHeaders(privateKey),
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            properties,
            metric: {
              data: {
                type: "metric",
                attributes: { name: metric },
              },
            },
            profile: {
              data: {
                type: "profile",
                attributes: { email },
              },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Klaviyo event ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

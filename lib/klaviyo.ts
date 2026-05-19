const KLAVIYO_API = "https://a.klaviyo.com/api";

export async function subscribeToKlaviyo(email: string): Promise<{ ok: boolean; error?: string }> {
  const listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY;

  if (!listId || !privateKey) {
    console.warn("Klaviyo env not configured. Skipping real subscribe.");
    return { ok: true };
  }

  try {
    const res = await fetch(`${KLAVIYO_API}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${privateKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        revision: "2024-10-15",
      },
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
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Klaviyo ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

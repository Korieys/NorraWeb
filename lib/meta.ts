import { createHash } from "crypto";

// Current stable Graph API version. Overridable via env so ops can bump it
// without a code change; do not pin an old version here.
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// Meta requires email normalized (trimmed + lowercased) before hashing.
function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

export type MetaPurchaseInput = {
  eventId: string;
  email: string;
  eventSourceUrl: string;
  reservedPack: string;
  value?: number;
  /** _fbp cookie captured browser-side at checkout, if available. */
  fbp?: string;
  /** _fbc cookie captured browser-side at checkout, if available. */
  fbc?: string;
};

/**
 * Sends a server-side Purchase event to the Meta Conversions API. This is the
 * source-of-truth Purchase signal, fired from the Stripe webhook when the $1
 * deposit clears — never client-side. Returns the HTTP status (never throws so
 * it can't break the webhook's 200 response or the Klaviyo call).
 */
export async function sendPurchaseToMeta(
  input: MetaPurchaseInput
): Promise<{ ok: boolean; status: number; error?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;

  if (!pixelId || !token) {
    console.error("Meta CAPI is not configured.", {
      hasPixelId: Boolean(pixelId),
      hasCapiToken: Boolean(token),
    });
    return { ok: false, status: 0, error: "Meta CAPI not configured" };
  }

  const userData: Record<string, unknown> = {
    em: [hashEmail(input.email)],
  };
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: "USD",
          value: input.value ?? 1.0,
          content_name: "Daypack Deposit",
          contents: [{ id: input.reservedPack, quantity: 1 }],
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${token}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.text();
    // Never log the token or the raw email — only status + response body.
    console.log("Meta CAPI Purchase response", {
      status: res.status,
      eventId: input.eventId,
      body,
    });

    if (!res.ok) {
      console.error("Meta CAPI Purchase error", { status: res.status, body });
      return { ok: false, status: res.status, error: body };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.error("Meta CAPI Purchase request failed", err);
    return { ok: false, status: 0, error: "request failed" };
  }
}

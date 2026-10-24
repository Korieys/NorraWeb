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
  eventTime?: number;
  email: string;
  eventSourceUrl: string;
  reservedPack: string;
  quantity?: number;
  contentName?: string;
  value?: number;
  /** _fbp cookie captured browser-side at checkout, if available. */
  fbp?: string;
  /** _fbc cookie captured browser-side at checkout, if available. */
  fbc?: string;
};

/**
 * Sends a server-side Purchase event to the Meta Conversions API. This is the
 * source-of-truth Purchase signal, fired from the Stripe webhook after payment
 * clears — never client-side. Returns the HTTP status (never throws so
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
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: "USD",
          value: input.value ?? 1.0,
          content_name: input.contentName ?? "Daypack Preorder",
          contents: [{ id: input.reservedPack, quantity: input.quantity ?? 1 }],
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${token}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(8_000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await res.body?.cancel();
    // Provider responses can contain sensitive data; log only status and ID.
    console.log("Meta CAPI Purchase response", {
      status: res.status,
      eventId: input.eventId,
    });

    if (!res.ok) {
      return { ok: false, status: res.status, error: "provider rejected event" };
    }
    return { ok: true, status: res.status };
  } catch {
    console.error("Meta CAPI Purchase request failed", { eventId: input.eventId });
    return { ok: false, status: 0, error: "request failed" };
  }
}

import { NextResponse } from "next/server";
import { subscribeToKlaviyo } from "@/lib/klaviyo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const source = typeof body?.source === "string" ? body.source.slice(0, 80) : "site";

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID || !(process.env.KLAVIYO_PRIVATE_API_KEY || process.env.KLAVIYO_PRIVATE_KEY)) {
      return NextResponse.json({ error: "Updates signup is temporarily unavailable." }, { status: 503 });
    }

    const result = await subscribeToKlaviyo(email, {
      newsletter_signup_source: source,
      newsletter_last_requested_at: new Date().toISOString(),
    });

    if (!result.ok) {
      console.error("Newsletter subscription request failed.");
      return NextResponse.json({ error: "Subscribe failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter subscription request could not be processed.");
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

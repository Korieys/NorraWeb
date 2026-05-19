import { NextResponse } from "next/server";
import { subscribeToKlaviyo } from "@/lib/klaviyo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const result = await subscribeToKlaviyo(email);
    if (!result.ok) {
      console.error("Klaviyo error:", result.error);
      return NextResponse.json({ error: "Subscribe failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

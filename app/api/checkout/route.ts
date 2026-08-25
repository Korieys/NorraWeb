import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Paid Daypack reservations are temporarily paused while the pilot offer and merchant details are updated.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

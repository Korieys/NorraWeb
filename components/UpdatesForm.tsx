"use client";

import { useState } from "react";

export function UpdatesForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "development_updates" }) });
      if (!response.ok) throw new Error("Subscription failed");
      setState("success");
      setEmail("");
    } catch { setState("error"); }
  }
  return <form className="updates-form" onSubmit={submit}>
    <label htmlFor="updates-email">Email address</label>
    <div className="updates-fields"><input id="updates-email" name="email" type="email" autoComplete="email" required value={email} placeholder="you@example.com" onChange={(event) => setEmail(event.target.value)} aria-describedby="updates-note updates-status" /><button className="dp-button" disabled={state === "loading"} type="submit">{state === "loading" ? "Signing up…" : "Get updates"}<span aria-hidden>↗</span></button></div>
    <p id="updates-note">Product news and new planning resources. Unsubscribe whenever you like.</p>
    <p id="updates-status" role="status">{state === "success" ? "Thanks. Your update request is in. Check your inbox for any confirmation step." : state === "error" ? "We could not sign you up. Your address is still here so you can try again." : ""}</p>
  </form>;
}

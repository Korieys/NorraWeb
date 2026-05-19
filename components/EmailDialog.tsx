"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/analytics";

type Props = {
  trigger: React.ReactNode;
};

export function EmailDialog({ trigger }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero_dialog" }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      track("Lead", { value: 0, source: "hero_dialog" });
      setStatus("ok");
      setMessage("You're in. We'll be in touch.");
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>GET NOTIFIED.</DialogTitle>
        <DialogDescription>
          Drop your email. We&apos;ll tell you when Daypack ships. No spam.
        </DialogDescription>
        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
          <Input
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "SENDING..." : "NOTIFY ME"}
          </Button>
          {status === "ok" && (
            <p className="text-[13px] font-semibold uppercase tracking-wide-md text-olive">
              {message}
            </p>
          )}
          {status === "err" && (
            <p className="text-[13px] font-semibold uppercase tracking-wide-md text-sienna">
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

# Daypack order readiness

This branch is a draft. Do not enable customer checkout until the sandbox, email and operating checks below pass. `DAYPACK_CHECKOUT_ENABLED` must equal `true` to create new sessions; absence or any other value returns a customer-facing 503 message. The page also shows disabled preorder buttons and a contact-for-updates notice. Rebuild/redeploy after changing this setting so static page availability and the API agree. The switch does not suppress existing payment webhooks. No live setting is changed by this document.

## Repaired behavior

- Offer totals remain $64.98 for one pack, $159.98 for Core 3 once, and $149.98 for Core 3 monthly, including $9.99 shipping. Prototype property names cannot select an offer.
- Checkout uses dynamic payment methods, retains classic subscription billing behavior, and discloses Q4 2026 first fulfillment. The receipt displays actual paid total, pack quantity, recurring terms and support contact. Completed delayed payments display processing; a temporary Stripe lookup failure never claims the payment failed or encourages a second order.
- Paid one-time Checkout events use the full PaymentIntent ID for deduplication. A subscription's first Checkout and `invoice.paid` both resolve to its invoice ID. Subsequent paid cycle invoices produce separate renewal events. PaymentIntent notifications cannot create duplicate order events.
- Invoice and subscription state is retrieved from Stripe before sending failure or cancellation notices. Late failures for now-paid invoices and stale cancellation updates are ignored. Lifecycle history stays on events rather than mutable profile status fields.
- Missing customer email, provider errors and delivery timeouts return a retryable error. Logs contain event identifiers and status only. Klaviyo requests and Meta requests have eight-second time limits. Stripe requests have an eight-second limit with one network retry.
- The old $1 deposit shape remains a separate `Placed Deposit` event. Full preorders and renewals use `Placed Preorder`; the existing deposit email must not be repurposed for these orders.
- Meta uses full payment/invoice IDs, original payment time and actual pack quantity. Renewal and cancellation events do not add ad tracking.

## Stripe version compatibility

Stripe Node 23.0.1 explicitly uses `2026-09-30.endive`, verified against the official API versioning page. The upgrade removes the retired `payment_method_types` parameter, adds an integration identifier and explicitly retains classic billing instead of inheriting a changed default. Subscription invoices use `parent.subscription_details`.

The live application endpoint still uses `2026-04-22.dahlia`. This branch does not change that setting. Current handlers accept its Checkout/subscription fields; invoice events are re-read using the application's pinned API. Local tests include an older invoice payload shape. This is not a substitute for sandbox provider verification.

## Live configuration observed, read only

The owner-confirmed Norra account is the Daypack payment account. Its application webhook at `https://www.eatdaypack.com/api/stripe-webhook` currently enables only `checkout.session.completed`. The separate Klaviyo integration endpoint is unchanged.

The Daypack Klaviyo account has a live `Placed Deposit` workflow named `Depo Conf-live`. Its email describes a $1 refundable deposit, still mentions other pack tiers, uses smart sending and is not marked transactional. No `Placed Preorder` metric/linked flow appeared in the complete metrics response. New preorder and lifecycle messages have not been created, activated or sent.

After sandbox verification and release approval, the application endpoint needs these six events:

```
checkout.session.completed
checkout.session.async_payment_succeeded
invoice.paid
invoice.payment_failed
customer.subscription.updated
customer.subscription.deleted
```

Keep the separate Klaviyo integration endpoint unchanged. Do not replay historical live events blindly: they can trigger emails. Review failed deliveries and reconcile against Stripe before any controlled replay.

## Message contract

| Metric | Key | Meaning |
| --- | --- | --- |
| Placed Preorder | Full PaymentIntent ID or invoice ID | Confirmed initial payment or monthly renewal; distinguish `order_type` |
| Placed Deposit | Full PaymentIntent ID | Legacy $1 reservation only |
| Daypack Payment Failed | Invoice ID plus `:payment_failed` | One outstanding-payment notice per invoice, only while it is still open |
| Daypack Cancellation Scheduled | Stripe event ID | Current scheduled cancellation matches the delivered change |
| Daypack Cancellation Reversed | Stripe event ID | Current cancellation schedule was removed |
| Daypack Subscription Canceled | Stripe event ID | Stripe confirms the subscription has ended |

Paid events include the actual value, USD currency, offer name, pack quantity and full reference. Invoice events include the subscription ID. Cancellation events do not assert a refund result (`refund_status` is `not_checked`). See [proposed message copy](docs/ORDER_MESSAGES.md).

## Verification and remaining release gates

59 checks cover real SDK signature verification, payment gating, test/live isolation, duplicate and concurrent deliveries, initial/renewal invoice identity, stale events, canceled/reversed schedules, provider failures, timeout aborts, log privacy, three offer totals and receipt states. The hosted workflow repeats the tests, type checking, lint and build on Linux.

Production dependencies have zero audit advisories. Three moderate development advisory entries remain in Tailwind 3's PostCSS selector chain; resolving those through a forced Tailwind 4 upgrade is outside this payment repair.

Before enabling real customer checkout:

1. Configure a dedicated Norra Stripe sandbox and its preview webhook, using sandbox credentials only. The existing preview has no Stripe secret configured. The owner opened Norra's shared test mode; read-only inspection found active test endpoints pointing at the production Daypack URL and the production Klaviyo integration. Do not generate test payments there until those delivery paths are isolated; prefer a separate named Daypack sandbox without those inherited destinations. See the isolation requirements below. Verify all three offers, a delayed payment, invoice renewal, failed payment then recovery, scheduled/reversed/final cancellation, duplicate delivery and refund behavior.
2. Create and review the separate operational email flows. Confirm transactional approval and suppression behavior with Klaviyo; disabling smart sending alone does not make a message transactional. Test delivery only to explicitly approved test recipients. Do not enroll buyers into marketing as part of this repair.
3. Reconcile the Stripe order/invoice, shipping address and customer confirmation. Klaviyo event deduplication is not a warehouse ledger or evidence of shipment. No inventory allocation, shipping-label service, fulfillment tracking, automatic refund system or staff assignment is implemented here.
4. Confirm fulfillment ownership, support coverage, refund handling and the remaining legal identity/statement descriptor details. Review refunds, disputes, nonstandard/proration invoices and zero/off-Stripe payments manually in Stripe; the automated order path deliberately excludes these cases.
5. Complete hosted/mobile checks, approve the production application release and event/settings changes, and only then enable `DAYPACK_CHECKOUT_ENABLED=true` for that environment. Keep monitoring/reconciliation in place for failed deliveries.

No purchases, charges, refunds, emails, live webhook edits, account changes or application releases were performed for this patch.

## Sandbox isolation and preview setup

Only Vercel production (`VERCEL_ENV=production`, supplied by Vercel) accepts `sk_live_` or `rk_live_` Stripe keys. Every preview and local environment accepts only `sk_test_` or `rk_test_` keys. Missing or wrong-mode credentials fail closed; a cached client cannot bypass key removal or replacement. Signed webhook events must have an explicit `livemode` value matching the environment before any Stripe lookup or outbound notification.

In test mode the handler performs the same Stripe state reads and notice classification, then returns/logs a compact diagnostic containing event/reference, metric, amount, quantity and order type. It never calls Klaviyo or Meta, even if their credentials were inherited. Customer email, address and provider payloads are excluded. This validates order classification only: notification delivery, suppression, operational handling and fulfillment remain separate release gates.

Use a separate named Norra/Daypack sandbox with no destinations to production or the live Klaviyo account. Configure only the reviewed `codex/customer-ready-preorder` branch in Vercel's `norra-web` project:

- `STRIPE_SECRET_KEY`: sandbox restricted key, entered by the owner directly in Vercel; Checkout Sessions write and the read permissions needed by Checkout, invoices, subscriptions and customer lookup. Stripe may require permissions for resources that Checkout creates indirectly; verify least privilege in that sandbox. Never place a key in chat or Git.
- `STRIPE_WEBHOOK_SECRET`: signing secret of the sandbox destination pointing to `https://norra-web-git-codex-customer-ready-preorder-korieys-projects.vercel.app/api/stripe-webhook`, entered by the owner directly in Vercel. Subscribe only to the six events above.
- `DAYPACK_CHECKOUT_ENABLED=true` only for that reviewed preview branch after the sandbox connection is ready, then rebuild. Keep production checkout unavailable pending release approval. Keep preview deployment protection in place; establish narrowly scoped authenticated delivery separately if it blocks Stripe.
- Do not add production Klaviyo, Meta, analytics or email-delivery settings to the preview. Test orders use fictional data. No sandbox transaction should be taken as proof of email delivery or physical fulfillment.

The two existing shared-test destinations were inspected only and remain unchanged. No sandbox or credentials were created by this patch.

## References

- [Stripe versioning](https://docs.stripe.com/api/versioning)
- [Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment?ui=full-page)
- [Subscription webhooks](https://docs.stripe.com/billing/subscriptions/webhooks)
- [Endive changes](https://docs.stripe.com/changelog/endive)
- [Basil changes](https://docs.stripe.com/changelog/basil)
- [Clover changes](https://docs.stripe.com/changelog/clover)
- [Dahlia changes](https://docs.stripe.com/changelog/dahlia)

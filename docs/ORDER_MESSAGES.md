# Proposed Daypack operational messages

Review copy. Six templates are saved as unattached Klaviyo drafts, with nine successful provider-render checks. The owner approved six fictional preview emails; Klaviyo accepted those send jobs, and the owner confirmed all six arrived and look good. Automated flows remain inactive. Sender: Daypack Team, team@eatdaypack.com. Reply-to: team@eatdaypack.com. Render bracketed fields from the signed payment event, escape values, and never include marketing enrollment or cross-selling. Use a separate transactional flow for each lifecycle metric after provider approval.

## Initial preorder — Placed Preorder, order_type=preorder

Subject: Your Daypack preorder is confirmed

Your payment for [offer_name] is confirmed.

Packs: [pack_quantity] single-day Daypack 170 packs.
Paid, including shipping: [actual event value formatted as USD].
Order reference: [ReservationId].

First fulfillment is estimated for Q4 2026. We will email you material production and fulfillment updates. You may cancel for a full refund before shipment.

For Core 3 subscribers only: Your subscription renews monthly at $149.98, including $9.99 shipping, until canceled. Email team@eatdaypack.com before the next renewal to cancel.

For help with this order, reply to this email or contact team@eatdaypack.com with your order reference.

Daypack · Daysworth Nutrition LLC

## Renewal — Placed Preorder, order_type=renewal

Subject: Your Daypack Core 3 renewal payment is confirmed

Your monthly Core 3 payment is confirmed for three single-day Daypack 170 packs.

Paid, including shipping: [actual event value formatted as USD].
Order reference: [ReservationId].

This confirms payment, not shipment. Contact team@eatdaypack.com for the fulfillment status of this order.

Your subscription continues monthly until canceled. To stop future renewals, email team@eatdaypack.com before the next renewal. For a refund of an order that has not shipped, reply with the order reference.

Daypack · Daysworth Nutrition LLC

## Payment failed — Daypack Payment Failed

Subject: Action needed for your Daypack payment

We could not confirm payment for your Core 3 invoice. The amount still due is [amount_due formatted as USD].

Invoice reference: [stripe_invoice_id].

Please do not place a second order. Contact team@eatdaypack.com to arrange a secure payment-method update or request cancellation. Never send card details by email.

If you have since paid this invoice, contact us to confirm its status.

Daypack · Daysworth Nutrition LLC

## Cancellation scheduled — Daypack Cancellation Scheduled

Subject: Your Daypack cancellation is scheduled

Stripe has confirmed a scheduled cancellation for your Core 3 subscription.

Subscription reference: [stripe_subscription_id].
Effective cancellation: [cancel_at formatted with an explicit time zone; omit this line if unavailable].

For the current billing status or help with an existing order, contact team@eatdaypack.com. This message confirms a subscription change; it does not confirm a refund. You may request a full refund for an order that has not shipped.

Daypack · Daysworth Nutrition LLC

## Cancellation reversed — Daypack Cancellation Reversed

Subject: Your Daypack subscription will continue

The scheduled cancellation has been removed from your Core 3 subscription. It will continue to renew under your current subscription terms.

Subscription reference: [stripe_subscription_id].

If you did not request this change, or still want to cancel, contact team@eatdaypack.com before the next renewal.

Daypack · Daysworth Nutrition LLC

## Subscription ended — Daypack Subscription Canceled

Subject: Your Daypack subscription has ended

Your Core 3 subscription has ended. Future monthly renewals have stopped.

Subscription reference: [stripe_subscription_id].

Existing orders and refunds are handled separately. This message does not confirm a refund. For an order that has not shipped, contact team@eatdaypack.com with your order reference to request a full refund.

Daypack · Daysworth Nutrition LLC

## Saved drafts

- [Your Daypack preorder is confirmed](https://www.klaviyo.com/email-editor/VFptzU/edit) — Placed Preorder; order_type=preorder and payment_status=paid.
- [Your Daypack Core 3 renewal payment is confirmed](https://www.klaviyo.com/email-editor/UbtBiu/edit) — Placed Preorder; order_type=renewal and payment_status=paid.
- [Action needed for your Daypack payment](https://www.klaviyo.com/email-editor/UHRpzH/edit) — Daypack Payment Failed; payment_status=failed.
- [Your Daypack cancellation is scheduled](https://www.klaviyo.com/email-editor/SQNfHQ/edit) — Daypack Cancellation Scheduled; exact lifecycle metric.
- [Your Daypack subscription will continue](https://www.klaviyo.com/email-editor/Y9sDTT/edit) — Daypack Cancellation Reversed; exact lifecycle metric.
- [Your Daypack subscription has ended](https://www.klaviyo.com/email-editor/UiH7QK/edit) — Daypack Subscription Canceled; subscription_status=canceled.

The scheduled-cancellation draft asks customers to contact support for the effective date rather than formatting an unnormalized Unix timestamp. The branded sending domain hello.eatdaypack.com is Active (Marketing, Dynamic), verified in the Daypack dashboard on October 24, 2026. The account remains on the free plan. Klaviyo requires a paid account and approval of each message for transactional email. An active marketing sending domain can carry approved transactional email; a separate transactional domain is optional. The smallest quoted email plan supports 500 profiles and 5,000 sends for $20/month before tax, with a $19 first-month discount ($1.07 displayed including estimated tax). Automatic upgrades are selected by default and can increase cost. The quote was canceled without purchase. Transactional approval and automated flow delivery remain pending.

The owner chose to remain on Klaviyo’s free plan on October 24, 2026. No upgrade should be purchased. Automated transactional order and subscription emails remain a launch gate; the six previews do not establish automatic delivery or suppression behavior.

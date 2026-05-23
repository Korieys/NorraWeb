# Klaviyo Audit — Degendered Framing Pass

Pass-through review of every customer-facing line that lands in a Klaviyo
profile, event, or flow trigger.

Voice rules being enforced: no em dashes, no listicles, no hyphens as dashes,
no gendered or bodybuilder-coded language.

## Live Klaviyo state (pulled via MCP, 2026-05-23)

Account: Daypack (YiLcAm). Two flows, one campaign, six lists.

| Object | Name | Status | Notes |
|---|---|---|---|
| Flow | `Essential Flow Recommendation_` (Tdpzd6) | Draft | Trigger unconfigured. No template content attached. |
| Flow | `02 — Deposit Confirmation` (WZLm4h) | Draft | Trigger unconfigured. No template content attached. **Flow name uses an em dash — rename to `02. Deposit Confirmation` when editing.** |
| Campaign | `Email 1` (01KS4DHH6VPWYQ2MCCXTGSMBHZ) | Draft | Subject and preview text empty. No template attached. Audience: Daypack — Master list. |
| List | `Daypack — Depositors` (RcREMv) | Active | Em dash in list name (cosmetic, also rename). |
| List | `Daypack — Master` (Yrmenz) | Active | Em dash in list name (cosmetic, also rename). |

**Headline finding: there is no live or even drafted email body copy in
Klaviyo today.** The brief assumed existing flow content needed a
degendering pass. There is nothing yet to degender. The remainder of
this document becomes the style guide for the first templates that get
written, not a list of fixes.

---

## 1. Capture surfaces in this repo

### `components/EmailDialog.tsx`

| Field | Current | Status | Proposed |
|---|---|---|---|
| Dialog title | `GET NOTIFIED.` | OK | Keep |
| Description | `Drop your email. We'll tell you when Daypack ships. No spam.` | OK | Keep |
| Success | `You're in. We'll be in touch.` | OK | Keep |

No gendered language. No changes needed.

### `components/ConversionBlock.tsx` (Option 02 — email path)

| Field | Current | Status | Proposed |
|---|---|---|---|
| Heading | `JUST GET UPDATES.` | OK | Keep |
| Body | `Email only. We'll tell you when it ships.` | OK | Keep |

No changes needed.

### Reserved confirmation (`app/reserved/page.tsx`)

| Field | Current | Status | Proposed |
|---|---|---|---|
| Body | `Your $1 deposit is held. You're locked in for founder pricing and early access to the {protein} pack.` | OK | Keep |

Neutral. No changes.

---

## 2. Klaviyo event payload (server-side)

From `app/api/stripe-webhook/route.ts`, the event `Reserved Deposit` fires
with these properties: `sku`, `amount`, `currency`, `session_id`. Profile
properties written: `source`, `reservation_status`, `reserved_sku`,
`reserved_at`.

No gendered tokens. No changes needed.

Recommendation: add a `recommended_target_grams` property when the new
Find Your Pack tool fires, so flows can segment by daily target rather
than implied build phase. Suggested event name: `Calculated Daily Target`.
This is a new addition, not a fix.

---

## 3. Klaviyo flow copy to rewrite (audit by string match)

These strings almost certainly appear in the existing Welcome and
Reservation flows because they were the live site copy until this branch.
Search each Klaviyo template and replace.

### Strings to find and replace

| Find (old) | Why it fails | Replace (new) |
|---|---|---|
| `Hit your number. Fuel your day.` | Generic but reinforces single-number/gym-bro framing in context | `Pick your daily protein target.` |
| `Complete daily nutrition` | Soft, OK, but pair with new positioning | `Daily protein, sorted` |
| `For serious lifters` | Lifter-coded, narrows audience | `For any adult holding a steady protein target` |
| `Bulking`, `cutting`, `maintaining` (as nouns / phases) | Bodybuilder vocabulary | `Building muscle`, `losing weight`, `holding steady` |
| `The cut.` / `The standard.` / `The push.` | Gym-coded pack names | `Pine.` / `Oak.` / `Granite.` (170 / 200 / 230). New SKUs are `Linen.` (110) and `Olive.` (140). |
| `Real food. Real fuel. No compromises.` | OK but stale | `Real food. Real numbers. Built for any adult.` |
| `Designed for the number` | Vague | `Daily protein, sorted. 110 to 230 grams.` |
| Any use of `gym`, `lifter`, `bodybuilder` as the implied audience | Narrows from "any adult" | Use `you`, `any adult`, `your day`, or remove |
| Any use of `ladies`, `for her`, `girlboss` | Brief explicitly forbids | Remove. Do not replace with a women-coded line. The point is the line is for everyone. |
| Subject lines with `BRO`, `GAINS`, `BEAST MODE`, `CRUSH IT` | Gym-bro coded | Use plain declarative: `Your pack is ready.`, `Pick a number.`, `One day, sorted.` |
| Any em dashes ( — ) used as punctuation | Voice rule violation | Use periods. Short declarative sentences. |
| Listicles in body copy (numbered or bulleted) | Voice rule violation | Reflow as paragraph or single line per idea. |
| Hyphens used as dashes ( - ) between clauses | Voice rule violation | Use a period. |

### Welcome flow — likely audit targets

These are the flows worth opening first in Klaviyo:

- Welcome Series (subscriber, post-EmailDialog or ConversionBlock)
- Reserved Deposit confirmation flow (post-checkout)
- Browse abandonment (if active)
- Pre-launch updates broadcast template

Skim each email body for the strings in the table above. Pay specific
attention to:

- The opening greeting line. If it mentions "fellow lifters", "gym
  rats", or anything similar, replace with a neutral hook.
- Any "who this is for" paragraph that lists athletes, bodybuilders, or
  meal-prep guys. Reframe around body weight and daily protein target.
- CTA buttons. `LOCK YOUR PACK`, `RESERVE`, `BACK TO HOME` are fine.
  Avoid `GET YOURS, BRO` style.

---

## 4. New segmentation worth adding (not a fix, a recommendation)

With five SKUs instead of three, the line now serves a wider audience.
The flows should be able to differentiate by recommended pack.

Add Klaviyo segments based on `reserved_sku` and (once shipping) the
new `recommended_target_grams` property:

- 110 / 140 buyers — lighter-frame messaging, no `serious lifter` copy
- 170 / 200 buyers — current default tone works
- 230 buyers — high-volume / heavy training framing is fine here

The welcome email should not assume a single audience. Either keep the
welcome body fully neutral, or branch on the recommended pack once the
Find Your Pack event is wired up.

---

## 5. Sign-off needed before publishing

- Pack titles are now named after earth-tone color identifiers:
  `Linen / Olive / Pine / Oak / Granite` for 110 / 140 / 170 / 200 / 230.
  Klaviyo templates should mirror this naming.
- Confirm the new event name `Calculated Daily Target` before I wire it
  into the Find Your Pack tool.
- Pricing for 110 and 140 packs has already been approved at $17.99
  and $21.99 per day.

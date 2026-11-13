// January 25 at midnight in America/Chicago (CST, UTC-06:00).
// Reopening also requires a deliberate readiness approval; the date alone never opens checkout.
export const PREORDER_REOPEN_NOT_BEFORE = "2027-01-25T00:00:00-06:00";
export const PREORDER_PAUSE_MESSAGE = "Full product preorders are paused. We plan to reopen January 25, 2027. This is not a shipping date.";

export function canCreatePreorder(now = Date.now(), readinessApproved = process.env.DAYPACK_PREORDER_REOPEN_APPROVED): boolean {
  return readinessApproved === "true" && now >= Date.parse(PREORDER_REOPEN_NOT_BEFORE);
}

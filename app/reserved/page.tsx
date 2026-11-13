import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getStripe } from "@/lib/stripe";
import { reservationSessionState } from "@/lib/reservations";

export const metadata = { title: "Your reservation | Daypack", description: "Your Daypack refundable reservation status." };
export const dynamic = "force-dynamic";

export default async function Reserved({ searchParams }: { searchParams: { session_id?: string } }) {
  const stripe = getStripe();
  if (!stripe || !searchParams.session_id) redirect("/cancelled");
  let session;
  try { session = await stripe.checkout.sessions.retrieve(searchParams.session_id); } catch { redirect("/cancelled"); }
  const state = reservationSessionState(session);
  if (!state) redirect("/cancelled");
  const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const reference = paymentId?.slice(-6).toUpperCase();
  return <><Nav /><main id="main-content" className="dp-site"><section className="dp-section"><div className="dp-wrap dp-direction-grid"><div><p className="dp-label">{state === "paid" ? "Payment received / $1 reservation" : "Payment processing"}</p><h1>{state === "paid" ? "You're on the list." : "Your payment is processing."}</h1></div><div><p>{state === "paid" ? "Your $1 payment is a fully refundable reservation for access to a future preorder opportunity. It is not a full product order." : "Your reservation will be confirmed after payment clears. This page does not confirm a paid reservation yet."}</p>{state === "paid" && reference && <p className="dp-reservation-reference">Reservation reference: <strong>{reference}</strong></p>}<p>Full product preorders are planned to reopen January 25, 2027, subject to readiness. This is not a shipping date.</p><p>Email <a className="underline" href="mailto:team@eatdaypack.com">team@eatdaypack.com</a> for help or to request a refund. A new $1 reservation does not include an automatic purchase credit or discount.</p><div className="dp-actions"><Link className="dp-button" href="/picks">Explore Daypack Picks ↗</Link><Link className="dp-text-link" href="/product-status">Read the product status ↗</Link></div></div></div></section></main><Footer /></>;
}

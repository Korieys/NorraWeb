import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ReservationButton } from "@/components/ReservationButton";
export const metadata = { title: "Checkout not completed | Daypack", description: "Return to the $1 refundable reservation or keep exploring Daypack." };
export default function Cancelled() {
  return <><Nav /><main id="main-content" className="dp-site"><section className="dp-section"><div className="dp-wrap dp-direction-grid"><div><p className="dp-label">Checkout not completed</p><h1>Come back<br />any time.</h1></div><div><p>You can try the $1 fully refundable reservation again or keep exploring our free guides and tools.</p><p>A reservation provides access to a future preorder opportunity. It is not a full product order and includes no automatic purchase credit or discount.</p><p>Full product preorders are paused, with a planned reopening on January 25, 2027, subject to readiness. Shipping is unconfirmed.</p><div className="dp-actions"><ReservationButton /><Link className="dp-text-link" href="/">Back to Daypack ↗</Link></div><p>Questions about a previous payment? Email <a className="underline" href="mailto:team@eatdaypack.com">team@eatdaypack.com</a>.</p></div></div></section></main><Footer /></>;
}

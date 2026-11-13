import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Our story | Daypack",
  description: "Daypack began with a full-day food kit. Today we are building a portable-nutrition media and commerce brand while the flagship kit develops.",
};

export default function StoryPage() {
  return <><Nav /><main id="main-content" className="dp-site">
    <section className="dp-section"><div className="dp-wrap dp-product-grid">
      <div className="dp-product-copy"><Link href="/" className="dp-back">← Back to Daypack</Link><p className="dp-label">Our story / A Daysworth product</p><h1>Built around<br />a full day.</h1><p>Daypack began with a familiar problem: finding food around a busy schedule can become a project of its own.</p><p>The idea was a portable, shelf-stable full-day kit. Breakfast, lunch, dinner, and snacks in one pack, with clear information about what is inside.</p><p>The flagship remains in advanced pilot development. We have tested pilot configurations, and there is still work to do before the commercial version is ready.</p></div>
      <figure><div className="dp-founder-image"><Image src="/founder-kj.jpg" alt="KJ Grotesk, founder of Daypack" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div><figcaption className="dp-label dp-founder-caption">KJ Grotesk · Founder, Daypack</figcaption></figure>
    </div></section>
    <section className="dp-section dp-direction"><div className="dp-wrap dp-direction-grid"><div><p className="dp-label">A bigger reason to visit</p><h2>Useful today.<br />Building what is next.</h2></div><div><p>The need for portable food exists while the kit is being developed. Daypack is becoming a discovery, media, and commerce brand for shift workers, commuters, students, and anyone with a day away from home.</p><p>Daypack Picks brings products and practical comparisons into view. Daypack Media starts with guides and grows toward product tests, short-form stories, and affordable-nutrition challenges.</p><p>Brand partnerships can support that work through sponsored discovery, collaborations, and referrals. Any paid relationship will be identified alongside the content.</p><Link href="/media" className="dp-text-link">Explore Daypack Media <span aria-hidden>↗</span></Link></div></div></section>
    <section className="dp-section"><div className="dp-wrap"><div className="dp-section-head"><div><p className="dp-label">What guides the work</p><h2>Make the details useful.</h2></div></div><div className="dp-partner-grid"><article><p className="dp-label">01 / Practical</p><h3>Start with the day.</h3><p>Consider the schedule, storage, preparation, and equipment. A food choice has to fit where you will actually be.</p></article><article><p className="dp-label">02 / Transparent</p><h3>Say what is known.</h3><p>Distinguish design targets from final nutrition, manufacturer information from testing, and a reservation from a full order.</p></article><article><p className="dp-label">03 / Useful</p><h3>Give people a way in.</h3><p>Guides, discovery, and a free planning tool give you something to use without placing a preorder.</p></article></div></div></section>
    <section className="dp-section dp-status-band"><div className="dp-wrap dp-direction-grid"><div><p className="dp-label">Where we stand</p><h2>The pilot continues.<br />Preorders are paused.</h2></div><div><p>Full product preorders are paused until at least January 25, 2027. Reopening depends on product and operational readiness. This is not a shipping date.</p><p>Existing $1 reservations remain fully refundable. The product-status page explains the unfinished work and what is available today.</p><Link href="/product-status" className="dp-text-link">Read the product status <span aria-hidden>↗</span></Link></div></div></section>
  </main><Footer /></>;
}

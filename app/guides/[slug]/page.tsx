import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { fieldGuides } from "@/lib/field-guides";
export function generateStaticParams() { return fieldGuides.map((guide) => ({ slug: guide.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = fieldGuides.find((item) => item.slug === params.slug);
  return { title: guide ? `${guide.title} | Daypack` : "Guide | Daypack", description: guide?.summary };
}
export default function Guide({ params }: { params: { slug: string } }) {
  const guide = fieldGuides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return <><Nav /><main className="dp-site dp-article" id="main-content"><article className="dp-wrap"><header><Link className="dp-back" href="/#guides">← All field guides</Link><p className="dp-label">Field guide {guide.number} / {guide.minutes}</p><h1>{guide.title}</h1><p className="dp-lead">{guide.summary}</p></header><div className="dp-article-body">{guide.sections.map((section, index) => <section key={section.title}><span className="dp-label">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></section>)}</div><div className="dp-article-close"><h2>Put it on a page.</h2><p>Make your own day plan and keep a copy.</p><Link href="/plan-your-day" className="dp-button">Plan your day <span aria-hidden>↗</span></Link></div></article></main><Footer /></>;
}

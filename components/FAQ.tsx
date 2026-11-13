import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";

const ITEMS = [
  { q: "What stage is Daypack in?", a: "Daypack is in advanced pilot development and prelaunch. Pilot configurations have been tested, but the commercial product and fulfillment process are not yet locked." },
  { q: "Can I preorder today?", a: "Full product preorders are paused. The planned reopening is January 25, 2027, subject to readiness. This is not a shipping date. New $1 fully refundable reservations are open for access to a future preorder opportunity; they are not full product orders." },
  { q: "What is still unfinished?", a: "Final food selection, nutrition and allergen validation, the bill of materials, production packaging and durability, a compliant assembly facility, permits, insurance, inventory, fulfillment, pricing, shipping, quality control, and checkout readiness." },
  { q: "How much protein and how many calories?", a: "At least 170g of protein and approximately 2,000 calories are design targets for the full-day kit. They are not finalized commercial nutrition figures." },
  { q: "I already paid $1. What does that mean?", a: "Your $1 payment is a fully refundable reservation for a future preorder opportunity. It is not a full product order. Your existing reservation stays active and you do not need to reserve again. Historical reservation terms are unchanged. New reservations do not include an automatic purchase credit or discount. For help or a refund, email team@eatdaypack.com." },
  { q: "When will Daypack ship?", a: "An exact shipping date is not confirmed. January 25, 2027 is the planned preorder reopening date, not a fulfillment promise. We will share updated product and shipping details before full preorders reopen." },
];

export function FAQ() {
  return <section id="faq" className="border-t border-ink/15 bg-paper py-20 lg:py-28">
    <div className="mx-auto max-w-[800px] px-6">
      <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-pine">The useful details</p>
      <h2 className="mt-5 text-center font-display text-5xl font-medium uppercase tracking-wide-sm">Questions, answered.</h2>
      <Accordion type="single" collapsible className="mt-12 border-t border-ink/15">
        {ITEMS.map((item, index) => <AccordionItem key={item.q} value={`item-${index}`}><AccordionTrigger>{item.q}</AccordionTrigger><AccordionContent>{item.a}</AccordionContent></AccordionItem>)}
      </Accordion>
    </div>
  </section>;
}

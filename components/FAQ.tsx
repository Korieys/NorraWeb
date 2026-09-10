import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";

const ITEMS = [
  { q: "What is in the current Daypack?", a: "Nine items: a Kodiak Chocolate Chip Protein Muffin Power Cup; Quest Strawberry and Chocolate Protein Milkshakes; two shelf-stable HMR entrées; a Legendary Blueberry Protein Tasty Pastry; a think! 20g Protein Bar; and two H-E-B Hit the Trail Mix packets." },
  { q: "Which HMR entrées will I receive?", a: "Each pack includes two entrées from our rotating HMR selection. The planned rotation includes Chicken Pasta Parmesan, Turkey Chili, Rotini Chicken Alfredo, Beef Stroganoff, Penne Pasta with Meatballs, and Lasagna with Meat Sauce. The exact pair may vary while received-label and taste validation is completed." },
  { q: "How much protein and how many calories?", a: "The current working target is at least 170 grams of protein and roughly 2,000–2,100 calories. Exact totals depend on the two HMR entrées included. The received product labels are the final source for nutrition and allergen information." },
  { q: "Does anything need refrigeration?", a: "The pilot items are shelf stable while unopened. Follow the storage and preparation directions on every received product label, and refrigerate leftovers when a label directs you to." },
  { q: "When will my preorder ship?", a: "First-run fulfillment is estimated for Q4 2026. We will send production updates and tracking to the email used at checkout. You may cancel for a full refund any time before shipment." },
  { q: "What are the purchase options?", a: "One Daypack is $54.99, a one-time Core 3 is $149.99, and the monthly Core 3 subscription is $139.99. Standard U.S. shipping is $9.99 per order or subscription shipment." },
  { q: "Can I cancel the Core 3 subscription?", a: "Yes. The Core 3 subscription renews monthly until canceled. Email team@eatdaypack.com before the next renewal to stop future shipments." },
  { q: "What about allergens?", a: "Ingredients and allergens vary across the branded items and rotating entrées. Review every received label before eating. Do not consume an item containing an ingredient you cannot safely eat." },
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

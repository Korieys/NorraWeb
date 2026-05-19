import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

const ITEMS = [
  {
    q: "When does Norra launch?",
    a: "Targeting Q3 2026. Reserve a pack to lock in early access and founder pricing.",
  },
  {
    q: "How is the food shelf stable?",
    a: "Retort pouches. The same technology used by premium sous-vide brands and high-end field rations. No preservatives needed.",
  },
  {
    q: "What's the shelf life?",
    a: "Twelve to eighteen months unopened. Every pack is dated.",
  },
  {
    q: "How do you hit the protein number exactly?",
    a: "Every component has a verified protein count. We assemble packs from a fixed library so the math always works.",
  },
  {
    q: "What about allergens?",
    a: "Allergens labeled per FDA requirements. Gluten-free and dairy-free variants planned for v2.",
  },
  {
    q: "Where do you ship?",
    a: "Continental US at launch. Canada and UK shortly after.",
  },
  {
    q: "Is the deposit really refundable?",
    a: "Yes. Any time. No questions, no email required. Click the link in your confirmation.",
  },
  {
    q: "Can I customize the meals?",
    a: "Not at launch. We start with a fixed library so the protein math is guaranteed. Customization comes in v2.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[760px] px-6 lg:px-0">
        <p className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          QUESTIONS
        </p>
        <h2 className="mt-6 text-center font-display text-[40px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink lg:text-[48px]">
          ANSWERS.
        </h2>
        <div className="mt-12 lg:mt-16">
          <Accordion type="single" collapsible className="border-t border-ink/15">
            {ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

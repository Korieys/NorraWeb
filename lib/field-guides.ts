export const fieldGuides = [
  {
    slug: "plan-a-day-away",
    number: "01",
    title: "Plan a day away from home.",
    summary: "Start with your schedule. Give each meal a place in it.",
    minutes: "3 minute read",
    sections: [
      { title: "Start with the gaps.", text: "Write down when you leave, when you get home, and the breaks you can realistically take. Decide which meals you need to bring and which you will eat at home." },
      { title: "Check the place.", text: "Find out whether you will have a refrigerator, microwave, water, and somewhere to sit. Choose food that works with the facilities you actually have. Follow the storage and preparation directions on each product." },
      { title: "Choose food you already like.", text: "Start with familiar meals. Put the food, a drink, and any utensils on your list. Use the planner to write down the specific items you intend to take." },
      { title: "Keep a backup in the plan.", text: "Choose a backup you would be happy to eat if a meeting runs late or plans change. Check its label, including storage instructions, before deciding where to keep it." },
      { title: "Make the next day easier.", text: "After the day, note what you ate and what came home. Adjust tomorrow's list instead of rebuilding it from scratch." },
    ],
  },
  {
    slug: "build-a-packing-list",
    number: "02",
    title: "Build a packing list that works.",
    summary: "Food, equipment, and the small things that are easy to leave behind.",
    minutes: "2 minute read",
    sections: [
      { title: "List the actual items.", text: "Replace a vague note like lunch with the food you plan to eat. A specific list makes it easier to see what you already have and what you need to buy." },
      { title: "Check the instructions.", text: "Read each label for ingredients, allergens, storage, and preparation. Note anything you will need to prepare or store that food as directed." },
      { title: "Pack the equipment.", text: "A spoon, fork, napkin, and suitable container can be as easy to forget as the food itself. Add the items your chosen meals need to your list." },
      { title: "Separate buying from packing.", text: "Use the food fields for your shopping list, then check each item only when it is packed. That keeps having something at home separate from having it with you." },
      { title: "Keep the useful version.", text: "Save your plan as a text file or print it. Reuse the parts that worked on a similar day and change the rest." },
    ],
  },
  {
    slug: "understand-a-preorder",
    number: "03",
    title: "Read the details before a preorder.",
    summary: "What is available now, what is estimated, and what to check first.",
    minutes: "3 minute read",
    sections: [
      { title: "Separate ordering from shipping.", text: "A preorder lets you place an order before fulfillment. An open checkout does not mean the product is ready for immediate shipment. Check the current product status and delivery estimate together." },
      { title: "Read the unfinished details.", text: "Daypack is in advanced pilot development. Food selection, nutrition and allergens, packaging, assembly, pricing, and fulfillment are still unfinished. The product-status page explains what remains open." },
      { title: "Check the total.", text: "Review the product price, shipping, and any taxes at checkout. For a subscription, also check the renewal amount, frequency, and cancellation instructions." },
      { title: "Know the cancellation route.", text: "Read the current terms before paying. Existing $1 Daypack reservations are fully refundable and are not full product orders. Contact team@eatdaypack.com for help or a refund." },
      { title: "Choose when to join.", text: "Daypack full product preorders are paused, with a planned reopening on January 25, 2027, subject to readiness. This is not a shipping date. Use the tools and guides now, and decide about the kit later." },
    ],
  },
] as const;

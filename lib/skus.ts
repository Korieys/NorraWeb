export type SkuId = "110" | "140" | "170" | "200" | "230";

export type Meal = {
  slot: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  name: string;
  protein: number;
};

export type Sku = {
  id: SkuId;
  index: string;
  protein: number;
  title: string;
  description: string;
  whoFor: string;
  meals: Meal[];
  pricePerDay: number;
  pricePerWeek: number;
  weeklyDiscount: number;
  color: {
    bg: string;
    text: string;
    name: "linen" | "olive" | "pine" | "oak" | "granite";
  };
};

export const SKUS: Record<SkuId, Sku> = {
  "110": {
    id: "110",
    index: "01",
    protein: 110,
    title: "Linen.",
    description:
      "A full day of food sized for lighter frames or lower-output days. Same shelf-stable build, smaller portions.",
    whoFor:
      "Adults around 110 to 130 lb working a deficit, or adults around 140 to 160 lb at low activity.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 30 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 35 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 35 },
      { slot: "SNACK", name: "Jerky", protein: 10 },
    ],
    pricePerDay: 17.99,
    pricePerWeek: 119.63,
    weeklyDiscount: 5,
    color: {
      bg: "bg-linen",
      text: "text-linen",
      name: "linen",
    },
  },
  "140": {
    id: "140",
    index: "02",
    protein: 140,
    title: "Olive.",
    description:
      "A clean middle target for adults who want structured daily protein without the heavier macro load.",
    whoFor:
      "Adults around 140 to 160 lb holding steady, or adults around 170 to 190 lb working a deficit.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 40 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 45 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 40 },
      { slot: "SNACK", name: "Jerky", protein: 15 },
    ],
    pricePerDay: 21.99,
    pricePerWeek: 143.15,
    weeklyDiscount: 7,
    color: {
      bg: "bg-olive",
      text: "text-olive",
      name: "olive",
    },
  },
  "170": {
    id: "170",
    index: "03",
    protein: 170,
    title: "Pine.",
    description:
      "Built for adults holding a moderate body weight or working a deficit at higher weights. The everyday baseline.",
    whoFor:
      "Adults around 170 to 190 lb holding steady, or adults around 190 to 220 lb working a deficit.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 50 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 60 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 45 },
      { slot: "SNACK", name: "Jerky", protein: 15 },
    ],
    pricePerDay: 24.99,
    pricePerWeek: 157.44,
    weeklyDiscount: 10,
    color: {
      bg: "bg-pine",
      text: "text-pine",
      name: "pine",
    },
  },
  "200": {
    id: "200",
    index: "04",
    protein: 200,
    title: "Oak.",
    description:
      "Daily maintenance for active adults at higher body weights, or a steady build target for moderate frames.",
    whoFor:
      "Adults around 190 to 220 lb holding steady, or adults around 160 to 190 lb building muscle.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 50 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 60 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 60 },
      { slot: "SNACK", name: "Jerky", protein: 30 },
    ],
    pricePerDay: 27.99,
    pricePerWeek: 170.46,
    weeklyDiscount: 13,
    color: {
      bg: "bg-oak",
      text: "text-oak",
      name: "oak",
    },
  },
  "230": {
    id: "230",
    index: "05",
    protein: 230,
    title: "Granite.",
    description:
      "High-volume days. Built for heavy training blocks and steady muscle building at larger body weights.",
    whoFor:
      "Adults around 220 lb and up holding steady, or anyone in a heavy training block building muscle.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 55 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 65 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 75 },
      { slot: "SNACK", name: "Jerky", protein: 35 },
    ],
    pricePerDay: 30.99,
    pricePerWeek: 184.39,
    weeklyDiscount: 15,
    color: {
      bg: "bg-granite",
      text: "text-granite",
      name: "granite",
    },
  },
};

export const SKU_ORDER: SkuId[] = ["110", "140", "170", "200", "230"];

export function recommendSku(input: {
  bodyweightLb: number;
  goal: "lose" | "maintain" | "gain";
  activity: "sedentary" | "moderate" | "active";
}): { skuId: SkuId; targetGrams: number; rationale: string } {
  const { bodyweightLb, goal, activity } = input;

  // Protein per lb of bodyweight, adjusted by goal and activity.
  // Baseline 0.8 g/lb for maintenance; deficit pushes higher to preserve
  // muscle, gain pushes higher still, activity nudges within the range.
  let coefficient = 0.8;
  if (goal === "lose") coefficient = 1.0;
  if (goal === "gain") coefficient = 1.05;

  if (activity === "active") coefficient += 0.05;
  if (activity === "sedentary") coefficient -= 0.05;

  const rawTarget = Math.round(bodyweightLb * coefficient);

  // Snap to the nearest available pack.
  const packs: SkuId[] = ["110", "140", "170", "200", "230"];
  let best: SkuId = "170";
  let bestDelta = Infinity;
  for (const id of packs) {
    const delta = Math.abs(SKUS[id].protein - rawTarget);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = id;
    }
  }

  const goalWord =
    goal === "lose" ? "losing weight" : goal === "gain" ? "building muscle" : "holding steady";
  const rationale = `At ${bodyweightLb} lb ${goalWord}, your daily target lands near ${rawTarget} g of protein. The ${best} pack is the closest fit.`;

  return { skuId: best, targetGrams: rawTarget, rationale };
}

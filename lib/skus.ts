export type SkuId = "170" | "200" | "230";

export type Meal = {
  slot: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  name: string;
  protein: number;
};

export type Sku = {
  id: SkuId;
  index: "01" | "02" | "03";
  protein: number;
  title: string;
  description: string;
  meals: Meal[];
  pricePerDay: number;
  pricePerWeek: number;
  color: {
    bg: string;
    text: string;
    name: "slate" | "olive" | "sienna";
    hex: string;
  };
};

export const SKUS: Record<SkuId, Sku> = {
  "170": {
    id: "170",
    index: "01",
    protein: 170,
    title: "The cut.",
    description:
      "Lower-calorie days when you're leaning out without sacrificing protein.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 50 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 60 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 45 },
      { slot: "SNACK", name: "Jerky", protein: 15 },
    ],
    pricePerDay: 28,
    pricePerWeek: 196,
    color: {
      bg: "bg-slate",
      text: "text-slate",
      name: "slate",
      hex: "#3A5567",
    },
  },
  "200": {
    id: "200",
    index: "02",
    protein: 200,
    title: "The standard.",
    description: "Daily maintenance for serious lifters.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 50 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 60 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 60 },
      { slot: "SNACK", name: "Jerky", protein: 30 },
    ],
    pricePerDay: 28,
    pricePerWeek: 196,
    color: {
      bg: "bg-olive",
      text: "text-olive",
      name: "olive",
      hex: "#5A6340",
    },
  },
  "230": {
    id: "230",
    index: "03",
    protein: 230,
    title: "The push.",
    description: "High-volume training days and bulk phases.",
    meals: [
      { slot: "BREAKFAST", name: "Protein oats and shake", protein: 55 },
      { slot: "LUNCH", name: "Chicken pouch, rice, sauce", protein: 65 },
      { slot: "DINNER", name: "Beef pouch, rice, sauce", protein: 75 },
      { slot: "SNACK", name: "Jerky", protein: 35 },
    ],
    pricePerDay: 32,
    pricePerWeek: 224,
    color: {
      bg: "bg-sienna",
      text: "text-sienna",
      name: "sienna",
      hex: "#8B5A3C",
    },
  },
};

export const SKU_ORDER: SkuId[] = ["170", "200", "230"];

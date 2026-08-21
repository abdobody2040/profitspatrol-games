/** Design reminder: Registry metadata powers one connected business neighborhood, never duplicate hard-coded game cards. */
export const GAME_IDS = [
  "coin", "needs", "sorter", "budget", "savings", "change", "detective", "discount", "cashflow", "maze", "lemonade", "snack", "tshirt", "pet", "cafe", "adagency", "customerquest", "salesmaster", "brandbuilder", "marketingmix",
] as const;

export type GameId = (typeof GAME_IDS)[number];

export type GameDefinition = {
  id: GameId;
  number: string;
  icon: "coins" | "shapes" | "piggy" | "wallet" | "target" | "receipt" | "search" | "badge" | "store" | "route";
  age: string;
  duration: string;
  titleKey: string;
  shortKey: string;
  objectiveKey: string;
  skillKey: string;
  accent: string;
  image?: string;
};

export const GAME_REGISTRY: GameDefinition[] = [
  { id: "coin", number: "01", icon: "coins", age: "7–10", duration: "2–4", titleKey: "games.coin.title", shortKey: "games.coin.short", objectiveKey: "games.coin.objective", skillKey: "games.coin.skill", accent: "#ff6b4a", image: "/manus-storage/profitspatrol-coin-catcher-scene_1297e504.png" },
  { id: "needs", number: "02", icon: "shapes", age: "7–12", duration: "2–4", titleKey: "games.needs.title", shortKey: "games.needs.short", objectiveKey: "games.needs.objective", skillKey: "games.needs.skill", accent: "#47b7a0" },
  { id: "sorter", number: "03", icon: "coins", age: "7–10", duration: "2–4", titleKey: "games.sorter.title", shortKey: "games.sorter.short", objectiveKey: "games.sorter.objective", skillKey: "games.sorter.skill", accent: "#f5b64d" },
  { id: "budget", number: "04", icon: "wallet", age: "8–13", duration: "4–6", titleKey: "games.budget.title", shortKey: "games.budget.short", objectiveKey: "games.budget.objective", skillKey: "games.budget.skill", accent: "#4da2ff", image: "/manus-storage/profitspatrol-budget-scene_a244bb33.png" },
  { id: "savings", number: "05", icon: "piggy", age: "8–13", duration: "3–6", titleKey: "games.savings.title", shortKey: "games.savings.short", objectiveKey: "games.savings.objective", skillKey: "games.savings.skill", accent: "#47b7a0" },
  { id: "change", number: "06", icon: "receipt", age: "7–12", duration: "2–4", titleKey: "games.change.title", shortKey: "games.change.short", objectiveKey: "games.change.objective", skillKey: "games.change.skill", accent: "#ff8a51" },
  { id: "detective", number: "07", icon: "search", age: "8–13", duration: "3–5", titleKey: "games.detective.title", shortKey: "games.detective.short", objectiveKey: "games.detective.objective", skillKey: "games.detective.skill", accent: "#765ce8" },
  { id: "discount", number: "08", icon: "badge", age: "8–14", duration: "2–5", titleKey: "games.discount.title", shortKey: "games.discount.short", objectiveKey: "games.discount.objective", skillKey: "games.discount.skill", accent: "#fd5a7d" },
  { id: "cashflow", number: "09", icon: "store", age: "10–16", duration: "4–7", titleKey: "games.cashflow.title", shortKey: "games.cashflow.short", objectiveKey: "games.cashflow.objective", skillKey: "games.cashflow.skill", accent: "#2a9d8f", image: "/manus-storage/profitspatrol-cashflow-scene_86e90589.png" },
  { id: "maze", number: "10", icon: "route", age: "9–15", duration: "3–6", titleKey: "games.maze.title", shortKey: "games.maze.short", objectiveKey: "games.maze.objective", skillKey: "games.maze.skill", accent: "#356de1" },
  { id: "lemonade", number: "11", icon: "store", age: "7–11", duration: "4–7", titleKey: "games.lemonade.title", shortKey: "games.lemonade.short", objectiveKey: "games.lemonade.objective", skillKey: "games.lemonade.skill", accent: "#f2a93b", image: "/manus-storage/profitspatrol-lemonade-boss_fc5440d1.png" },
  { id: "snack", number: "12", icon: "store", age: "8–12", duration: "4–7", titleKey: "games.snack.title", shortKey: "games.snack.short", objectiveKey: "games.snack.objective", skillKey: "games.snack.skill", accent: "#e7774b", image: "/manus-storage/profitspatrol-snack-shack_45948480.png" },
  { id: "tshirt", number: "13", icon: "store", age: "9–14", duration: "5–8", titleKey: "games.tshirt.title", shortKey: "games.tshirt.short", objectiveKey: "games.tshirt.objective", skillKey: "games.tshirt.skill", accent: "#8c69d6", image: "/manus-storage/profitspatrol-tshirt-tycoon_780eac04.png" },
  { id: "pet", number: "14", icon: "store", age: "9–14", duration: "5–8", titleKey: "games.pet.title", shortKey: "games.pet.short", objectiveKey: "games.pet.objective", skillKey: "games.pet.skill", accent: "#4fab8a", image: "/manus-storage/profitspatrol-pet-shop-manager_8e2030bf.png" },
  { id: "cafe", number: "15", icon: "store", age: "10–15", duration: "6–10", titleKey: "games.cafe.title", shortKey: "games.cafe.short", objectiveKey: "games.cafe.objective", skillKey: "games.cafe.skill", accent: "#b85a43", image: "/manus-storage/profitspatrol-mini-cafe_01d5224d.png" },
  { id: "adagency", number: "16", icon: "badge", age: "9–14", duration: "5–8", titleKey: "games.adagency.title", shortKey: "games.adagency.short", objectiveKey: "games.adagency.objective", skillKey: "games.adagency.skill", accent: "#ff6b4a", image: "/manus-storage/profitspatrol-ad-agency_318db0cb.png" },
  { id: "customerquest", number: "17", icon: "search", age: "9–14", duration: "5–8", titleKey: "games.customerquest.title", shortKey: "games.customerquest.short", objectiveKey: "games.customerquest.objective", skillKey: "games.customerquest.skill", accent: "#47b7a0", image: "/manus-storage/profitspatrol-customer-quest_a18309cc.png" },
  { id: "salesmaster", number: "18", icon: "badge", age: "9–14", duration: "5–8", titleKey: "games.salesmaster.title", shortKey: "games.salesmaster.short", objectiveKey: "games.salesmaster.objective", skillKey: "games.salesmaster.skill", accent: "#f2a93b", image: "/manus-storage/profitspatrol-sales-master_bfa7c59c.png" },
  { id: "brandbuilder", number: "19", icon: "shapes", age: "9–14", duration: "5–8", titleKey: "games.brandbuilder.title", shortKey: "games.brandbuilder.short", objectiveKey: "games.brandbuilder.objective", skillKey: "games.brandbuilder.skill", accent: "#8c69d6", image: "/manus-storage/profitspatrol-brand-builder_1598968b.png" },
  { id: "marketingmix", number: "20", icon: "target", age: "10–15", duration: "5–9", titleKey: "games.marketingmix.title", shortKey: "games.marketingmix.short", objectiveKey: "games.marketingmix.objective", skillKey: "games.marketingmix.skill", accent: "#4da2ff", image: "/manus-storage/profitspatrol-marketing-mix_4ac7d08e.png" },
];

export const getGame = (id: GameId) => GAME_REGISTRY.find((game) => game.id === id)!;

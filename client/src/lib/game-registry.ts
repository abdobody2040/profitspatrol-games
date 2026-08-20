/** Design reminder: Registry metadata powers one connected business neighborhood, never duplicate hard-coded game cards. */
export const GAME_IDS = [
  "coin", "needs", "sorter", "budget", "savings", "change", "detective", "discount", "cashflow", "maze",
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
];

export const getGame = (id: GameId) => GAME_REGISTRY.find((game) => game.id === id)!;

import { describe, expect, it } from "vitest";
import { GAME_IDS, GAME_REGISTRY } from "./game-registry";

describe("ProfitsPatrol game registry", () => {
  it("contains one unique, sequential station for every game in the fifty-game curriculum", () => {
    expect(GAME_IDS).toHaveLength(50);
    expect(new Set(GAME_IDS).size).toBe(50);
    expect(GAME_REGISTRY).toHaveLength(50);
    expect(GAME_REGISTRY.map((game) => game.number)).toEqual(Array.from({ length: 50 }, (_, index) => String(index + 1).padStart(2, "0")));
  });

  it("keeps the two Sales Master stations distinct", () => {
    expect(GAME_IDS).toContain("salesmaster");
    expect(GAME_IDS).toContain("salesmasterten");
    expect(GAME_IDS.indexOf("salesmaster")).toBe(17);
    expect(GAME_IDS.indexOf("salesmasterten")).toBe(45);
  });
});

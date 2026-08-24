import { describe, expect, it } from "vitest";
import { SPATIAL_LANE_MOVE, moveLane } from "./spatial-controls";

describe("spatial lane controls", () => {
  it("keeps left and right movements physical in every language direction", () => {
    expect(SPATIAL_LANE_MOVE.left).toBe(-1);
    expect(SPATIAL_LANE_MOVE.right).toBe(1);
    expect(moveLane(1, "left")).toBe(0);
    expect(moveLane(1, "right")).toBe(2);
  });

  it("does not move beyond the outer lanes", () => {
    expect(moveLane(0, "left")).toBe(0);
    expect(moveLane(2, "right")).toBe(2);
  });
});

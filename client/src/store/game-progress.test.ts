import { afterEach, describe, expect, it } from "vitest";
import { GAME_IDS } from "@/lib/game-registry";
import { useGameProgress } from "./game-progress";

afterEach(() => useGameProgress.getState().reset());

describe("persisted game progression", () => {
  it("awards a meaningful first-completion reward and preserves improved results", () => {
    const first = useGameProgress.getState().recordResult("coin", 72, 2);
    expect(first).toEqual({ xp: 48, coins: 11 });
    expect(useGameProgress.getState().games.coin).toMatchObject({ bestScore: 72, stars: 2, completed: true, plays: 1 });

    const replay = useGameProgress.getState().recordResult("coin", 96, 3);
    expect(replay).toEqual({ xp: 20, coins: 5 });
    expect(useGameProgress.getState().games.coin).toMatchObject({ bestScore: 96, stars: 3, completed: true, plays: 2 });
  });

  it("recognizes Startup Launch and confirms curriculum completion only after all stations are complete", () => {
    GAME_IDS.filter((id) => id !== "startuplaunch").forEach((id) => useGameProgress.getState().recordResult(id, 70, 1));
    expect(useGameProgress.getState().capstone).toEqual({ startupLaunchCompleted: false, curriculumComplete: false });

    useGameProgress.getState().recordResult("startuplaunch", 94, 3);
    expect(useGameProgress.getState().capstone).toEqual({ startupLaunchCompleted: true, curriculumComplete: true });
  });
});

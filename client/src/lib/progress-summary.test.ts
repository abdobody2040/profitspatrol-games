import { describe, expect, it } from "vitest";
import { buildProgressSummary } from "@/lib/progress-summary";

describe("buildProgressSummary", () => {
  it("derives districts, stars, and first-route achievement from stored games", () => {
    const summary = buildProgressSummary({
      games: { coin: { bestScore: 12, stars: 3, completed: true, plays: 1 } },
      capstone: { startupLaunchCompleted: false, curriculumComplete: false },
    });
    expect(summary.completed).toBe(1);
    expect(summary.stars).toBe(3);
    expect(summary.districts[0]).toMatchObject({ completed: 1, total: 10 });
    expect(summary.achievements.find((achievement) => achievement.key === "firstMission")?.earned).toBe(true);
  });

  it("recognises the Startup Launch and full-route achievements independently", () => {
    const summary = buildProgressSummary({
      games: {},
      capstone: { startupLaunchCompleted: true, curriculumComplete: true },
    });
    expect(summary.achievements.find((achievement) => achievement.key === "startupLaunch")?.earned).toBe(true);
    expect(summary.achievements.find((achievement) => achievement.key === "fullJourney")?.earned).toBe(true);
  });
});

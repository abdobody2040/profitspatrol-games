import { GAME_REGISTRY, type GameId } from "@/lib/game-registry";
import type { CapstoneProgress, GameProgress } from "@/store/game-progress";

export type ProgressSnapshot = {
  games: Partial<Record<GameId, GameProgress>>;
  capstone: CapstoneProgress;
};

export type DistrictProgress = {
  key: string;
  titleKey: string;
  completed: number;
  total: number;
};

export type Achievement = {
  key: "firstMission" | "tenStops" | "twentyFiveStops" | "starCollector" | "startupLaunch" | "fullJourney";
  titleKey: string;
  descriptionKey: string;
  earned: boolean;
  current: number;
  target: number;
};

const DISTRICTS = [
  { key: "money", titleKey: "progressCenter.districts.money", start: 1, end: 10 },
  { key: "builders", titleKey: "progressCenter.districts.builders", start: 11, end: 20 },
  { key: "risk", titleKey: "progressCenter.districts.risk", start: 21, end: 25 },
  { key: "operations", titleKey: "progressCenter.districts.operations", start: 26, end: 30 },
  { key: "innovation", titleKey: "progressCenter.districts.innovation", start: 31, end: 35 },
  { key: "leadership", titleKey: "progressCenter.districts.leadership", start: 36, end: 40 },
  { key: "strategy", titleKey: "progressCenter.districts.strategy", start: 41, end: 45 },
  { key: "launch", titleKey: "progressCenter.districts.launch", start: 46, end: 50 },
] as const;

export const TOTAL_STARS = GAME_REGISTRY.length * 3;

export function buildProgressSummary(snapshot: ProgressSnapshot) {
  const completed = GAME_REGISTRY.filter((game) => snapshot.games[game.id]?.completed).length;
  const stars = GAME_REGISTRY.reduce((total, game) => total + (snapshot.games[game.id]?.stars ?? 0), 0);
  const districts: DistrictProgress[] = DISTRICTS.map((district) => {
    const stationSet = GAME_REGISTRY.filter((game) => Number(game.number) >= district.start && Number(game.number) <= district.end);
    return {
      key: district.key,
      titleKey: district.titleKey,
      completed: stationSet.filter((game) => snapshot.games[game.id]?.completed).length,
      total: stationSet.length,
    };
  });
  const achievements: Achievement[] = [
    { key: "firstMission", titleKey: "progressCenter.achievements.firstMission.title", descriptionKey: "progressCenter.achievements.firstMission.description", earned: completed >= 1, current: completed, target: 1 },
    { key: "tenStops", titleKey: "progressCenter.achievements.tenStops.title", descriptionKey: "progressCenter.achievements.tenStops.description", earned: completed >= 10, current: completed, target: 10 },
    { key: "twentyFiveStops", titleKey: "progressCenter.achievements.twentyFiveStops.title", descriptionKey: "progressCenter.achievements.twentyFiveStops.description", earned: completed >= 25, current: completed, target: 25 },
    { key: "starCollector", titleKey: "progressCenter.achievements.starCollector.title", descriptionKey: "progressCenter.achievements.starCollector.description", earned: stars >= 30, current: stars, target: 30 },
    { key: "startupLaunch", titleKey: "progressCenter.achievements.startupLaunch.title", descriptionKey: "progressCenter.achievements.startupLaunch.description", earned: snapshot.capstone.startupLaunchCompleted, current: snapshot.capstone.startupLaunchCompleted ? 1 : 0, target: 1 },
    { key: "fullJourney", titleKey: "progressCenter.achievements.fullJourney.title", descriptionKey: "progressCenter.achievements.fullJourney.description", earned: snapshot.capstone.curriculumComplete || completed === GAME_REGISTRY.length, current: completed, target: GAME_REGISTRY.length },
  ];

  return { completed, total: GAME_REGISTRY.length, stars, districts, achievements, earnedAchievements: achievements.filter((achievement) => achievement.earned) };
}

/** Design reminder: Shared progress is lightweight, device-persisted, and visually expressed as a single neighborhood journey. */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GAME_IDS, type GameId } from "@/lib/game-registry";

export type GameProgress = { bestScore: number; stars: number; completed: boolean; plays: number };
type Reward = { xp: number; coins: number };
export type CapstoneProgress = { startupLaunchCompleted: boolean; curriculumComplete: boolean };
type State = {
  xp: number;
  coins: number;
  games: Partial<Record<GameId, GameProgress>>;
  capstone: CapstoneProgress;
  soundEnabled: boolean;
  recordResult: (id: GameId, score: number, stars: number) => Reward;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  reset: () => void;
};

const freshGame = (): GameProgress => ({ bestScore: 0, stars: 0, completed: false, plays: 0 });

export const useGameProgress = create<State>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      games: {},
      capstone: { startupLaunchCompleted: false, curriculumComplete: false },
      soundEnabled: true,
      recordResult: (id, score, stars) => {
        const previous = get().games[id] ?? freshGame();
        const improvedStars = Math.max(0, stars - previous.stars);
        const firstCompletion = !previous.completed;
        const reward = {
          xp: (firstCompletion ? 12 : 2) + improvedStars * 18,
          coins: (firstCompletion ? 3 : 1) + improvedStars * 4,
        };
        set((state) => {
          const nextGames = {
            ...state.games,
            [id]: { bestScore: Math.max(previous.bestScore, score), stars: Math.max(previous.stars, stars), completed: true, plays: previous.plays + 1 },
          };
          const startupLaunchCompleted = state.capstone.startupLaunchCompleted || id === "startuplaunch";
          const curriculumComplete = state.capstone.curriculumComplete || (startupLaunchCompleted && GAME_IDS.every((gameId) => nextGames[gameId]?.completed));
          return { xp: state.xp + reward.xp, coins: state.coins + reward.coins, games: nextGames, capstone: { startupLaunchCompleted, curriculumComplete } };
        });
        return reward;
      },
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      reset: () => set({ xp: 0, coins: 0, games: {}, capstone: { startupLaunchCompleted: false, curriculumComplete: false } }),
    }),
    { name: "kidcap-profitspatrol-progress-v1" },
  ),
);

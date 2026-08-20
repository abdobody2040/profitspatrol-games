/** Design reminder: Shared progress is lightweight, device-persisted, and visually expressed as a single neighborhood journey. */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameId } from "@/lib/game-registry";

export type GameProgress = { bestScore: number; stars: number; completed: boolean; plays: number };
type Reward = { xp: number; coins: number };
type State = {
  xp: number;
  coins: number;
  games: Partial<Record<GameId, GameProgress>>;
  recordResult: (id: GameId, score: number, stars: number) => Reward;
  reset: () => void;
};

const freshGame = (): GameProgress => ({ bestScore: 0, stars: 0, completed: false, plays: 0 });

export const useGameProgress = create<State>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      games: {},
      recordResult: (id, score, stars) => {
        const previous = get().games[id] ?? freshGame();
        const improvedStars = Math.max(0, stars - previous.stars);
        const firstCompletion = !previous.completed;
        const reward = {
          xp: (firstCompletion ? 12 : 2) + improvedStars * 18,
          coins: (firstCompletion ? 3 : 1) + improvedStars * 4,
        };
        set((state) => ({
          xp: state.xp + reward.xp,
          coins: state.coins + reward.coins,
          games: {
            ...state.games,
            [id]: { bestScore: Math.max(previous.bestScore, score), stars: Math.max(previous.stars, stars), completed: true, plays: previous.plays + 1 },
          },
        }));
        return reward;
      },
      reset: () => set({ xp: 0, coins: 0, games: {} }),
    }),
    { name: "kidcap-profitspatrol-progress-v1" },
  ),
);

/** Design reminder: The shell makes every game feel like one ProfitsPatrol expedition, with compact status, clear actions, and a learning receipt. */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Coins, Pause, Play, RotateCcw, Star, Target, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getGame, type GameId } from "@/lib/game-registry";
import { useGameProgress } from "@/store/game-progress";
import { GameRunner, type GameResult } from "@/components/games/GameRunner";

type Props = { gameId: GameId; onExit: () => void };
type Phase = "intro" | "playing" | "paused" | "results";

export default function GameShell({ gameId, onExit }: Props) {
  const { t } = useTranslation();
  const game = getGame(gameId);
  const saved = useGameProgress((state) => state.games[gameId]);
  const capstone = useGameProgress((state) => state.capstone);
  const recordResult = useGameProgress((state) => state.recordResult);
  const [phase, setPhase] = useState<Phase>("intro");
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<(GameResult & { xp: number; coins: number }) | null>(null);
  const learning = t(`games.${gameId}.learning`, { returnObjects: true }) as string[];

  const begin = () => { setRunKey((key) => key + 1); setResult(null); setPhase("playing"); };
  const complete = (nextResult: GameResult) => {
    const reward = nextResult.achieved ? recordResult(gameId, nextResult.score, nextResult.stars) : { xp: 0, coins: 0 };
    setResult({ ...nextResult, ...reward });
    setPhase("results");
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f1e8] text-[#102b4b]">
      <header className="game-topbar">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <button type="button" onClick={onExit} className="back-link"><ArrowLeft size={18} /> {t("common.back")}</button>
          <div className="hidden items-center gap-2 sm:flex"><span className="top-badge">{game.number}</span><span className="font-display text-xl">{t(game.titleKey)}</span></div>
          {phase === "playing" || phase === "paused" ? <button type="button" onClick={() => setPhase(phase === "paused" ? "playing" : "paused")} className="pause-button">{phase === "paused" ? <Play size={16} /> : <Pause size={16} />}{phase === "paused" ? t("common.resume") : t("common.pause")}</button> : <span className="top-badge">{game.number}</span>}
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
        <aside className="order-2 rounded-[2rem] bg-[#102b4b] p-6 text-white shadow-[0_18px_44px_rgba(16,43,75,0.16)] lg:order-1 lg:min-h-[630px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-[#ffd765]"><Target size={14} /> {t("common.mission")}</div>
          <h1 className="mt-5 font-display text-4xl leading-none">{t(game.titleKey)}</h1>
          <p className="mt-4 text-sm leading-6 text-white/72">{t(game.objectiveKey)}</p>
          <div className="mt-8 border-t border-white/12 pt-6">
            <p className="text-xs font-black uppercase tracking-[0.13em] text-white/55">{t("common.progress")}</p>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/8 px-3 py-3 text-sm"><span>{t("common.best")}</span><strong>{saved?.bestScore ?? 0}</strong></div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/8 px-3 py-3 text-sm"><span>{t("common.stars")}</span><strong className="text-[#ffd765]">{"★".repeat(saved?.stars ?? 0)}{"☆".repeat(3 - (saved?.stars ?? 0))}</strong></div>
          </div>
          <div className="mt-8 rounded-2xl bg-[#ff6b4a] p-4 text-sm leading-6 text-white"><p className="font-display text-xl">{t("common.objective")}</p><p className="mt-1 text-white/88">{t(game.shortKey)}</p></div>
        </aside>
        <section className="order-1 relative min-h-[630px] overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_44px_rgba(40,59,70,0.10)] lg:order-2">
          <AnimatePresence mode="wait">
            {phase === "intro" && <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="game-intro">
              <div className="game-intro__shape" style={{ backgroundColor: game.accent }} />
              <img src="/manus-storage/profitspatrol-compass-coin-logo_eaaf0464.png" alt="" className="h-24 w-24 object-contain" />
              <p className="mt-7 text-sm font-black uppercase tracking-[0.17em] text-[#f26545]">{game.number} · {t("hub.skill", { skill: t(game.skillKey) })}</p>
              <h2 className="mt-3 max-w-lg font-display text-5xl leading-[0.92] text-[#102b4b]">{t(game.titleKey)}</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#54708d]">{t(game.objectiveKey)}</p>
              <button type="button" onClick={begin} className="primary-action mt-8">{t("common.start")} <Play size={18} fill="currentColor" /></button>
            </motion.div>}
            {(phase === "playing" || phase === "paused") && <motion.div key={`game-${runKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[630px]"><GameRunner gameId={gameId} onEnd={complete} paused={phase === "paused"} /></motion.div>}
            {phase === "results" && result && <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="results-stage">
              <div className={`results-medallion ${result.achieved ? "results-medallion--win" : "results-medallion--retry"}`}>{result.achieved ? <Star size={42} fill="currentColor" /> : <RotateCcw size={42} />}</div>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.17em] text-[#f26545]">{t("common.result")}</p>
              <h2 className="mt-2 font-display text-5xl leading-none">{result.achieved ? t("common.win") : t("common.loss")}</h2>
              <p className="mt-4 max-w-md text-center leading-7 text-[#54708d]">{result.message}</p>
              <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3"><div className="result-stat"><span>{t("common.score")}</span><b>{result.score}</b></div><div className="result-stat"><span>{t("common.stars")}</span><b className="text-[#f5b64d]">{"★".repeat(result.stars)}</b></div><div className="result-stat"><span>{t("common.xp")}</span><b>+{result.xp}</b></div></div>
              <div className="receipt mt-8 w-full max-w-md"><div className="flex items-center justify-between"><p className="font-display text-xl">{t("common.learningReceipt")}</p><Coins size={20} className="text-[#f26545]" /></div><ol className="mt-3 space-y-2">{learning.slice(0, 3).map((point, index) => <li key={point}><span>{index + 1}</span>{point}</li>)}</ol></div>
              {gameId === "startuplaunch" && result.achieved && <div className="mt-5 w-full max-w-md rounded-[1.45rem] border-2 border-[#ffd765] bg-[#fff8df] p-5 text-center shadow-[0_8px_0_rgba(245,182,77,.2)]"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#a86c10]">{t("games.startuplaunch.capstoneBadge")}</p><h3 className="mt-2 font-display text-3xl leading-none text-[#102b4b]">{t("games.startuplaunch.capstoneTitle")}</h3><p className="mt-3 text-sm leading-6 text-[#54708d]">{t(capstone.curriculumComplete ? "games.startuplaunch.curriculumComplete" : "games.startuplaunch.capstoneCertificate")}</p></div>}
              <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={begin} className="primary-action">{t("common.retry")} <RotateCcw size={17} /></button><button type="button" onClick={onExit} className="secondary-action">{t("common.back")} <X size={17} /></button></div>
            </motion.div>}
          </AnimatePresence>
          {phase === "paused" && <div className="paused-overlay"><Pause size={42} fill="currentColor" /><p className="font-display text-4xl">{t("common.pause")}</p><button type="button" onClick={() => setPhase("playing")} className="primary-action">{t("common.resume")}</button></div>}
        </section>
      </section>
    </main>
  );
}

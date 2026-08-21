/**
 * ProfitsPatrol design reminder: the Marketing & Sales district is a child-friendly,
 * decision-led business neighborhood. Ink blue conveys trust, coral marks choices,
 * and mint signals useful customer outcomes.
 */
import { CheckCircle2, Megaphone, Search, Sparkles, Target, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { GameResult } from "./GameRunner";

type SharedProps = { paused: boolean; onEnd: (result: GameResult) => void };

function PickGroup({ title, value, options, onPick, disabled, label }: { title: string; value: string; options: string[]; onPick: (value: string) => void; disabled: boolean; label: (key: string) => string }) {
  return <section className="venture-choice"><p>{title}</p><div>{options.map((option) => <button type="button" key={option} disabled={disabled} onClick={() => onPick(option)} className={value === option ? "venture-choice__active" : ""}>{label(option)}</button>)}</div></section>;
}

function AdMetric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return <div className={`venture-metric ${positive ? "venture-metric--mint" : ""}`}><span>{label}</span><b>{value}</b></div>;
}

export function AdAgency({ paused, onEnd }: SharedProps) {
  const { t } = useTranslation();
  const [product, setProduct] = useState("snack");
  const [audience, setAudience] = useState("teens");
  const [message, setMessage] = useState("healthy");
  const [visual, setVisual] = useState("bright");
  const [cta, setCta] = useState("try");
  const [stage, setStage] = useState<"build" | "results">("build");
  const audienceFit = (product === "snack" && (audience === "teens" || audience === "parents")) || (product === "sports" && audience === "athletes") || (product === "game" && audience === "gamers");
  const messageFit = (product === "snack" && (message === "healthy" || message === "value")) || (product === "sports" && (message === "premium" || message === "fast")) || (product === "game" && message === "fun");
  const visualFit = (product === "sports" && visual === "action") || (product === "game" && visual === "creative") || (product === "snack" && (visual === "bright" || visual === "clear"));
  const ctaFit = (product === "game" && (cta === "try" || cta === "learn")) || (product === "snack" && (cta === "try" || cta === "visit")) || (product === "sports" && (cta === "learn" || cta === "visit"));
  const score = (audienceFit ? 30 : 9) + (messageFit ? 27 : 8) + (visualFit ? 21 : 7) + (ctaFit ? 22 : 6);
  const reach = 120 + (visualFit ? 70 : 25) + (audienceFit ? 45 : 0);
  const engagement = Math.round(reach * (messageFit ? .47 : .21));
  const conversions = Math.round(engagement * (ctaFit ? .34 : .12));
  const finish = () => onEnd({ achieved: score >= 70, score, stars: score >= 90 ? 3 : score >= 70 ? 2 : 1, message: t("games.adagency.result", { reach, engagement, conversions, fit: score }) });
  return <div className="game-stage venture-stage"><div className="game-play-header"><span className="game-play-header__icon"><Megaphone size={20}/></span><div><p className="stage-kicker">{t("games.adagency.objective")}</p><div className="stage-scoreline"><b>{t("games.adagency.fit")}: {stage === "results" ? `${score}%` : "—"}</b><span>{t("games.adagency.reach")}: {stage === "results" ? reach : "—"}</span></div></div></div><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-ad-agency_318db0cb.png" alt=""/><div><span>{t("games.adagency.audience")}</span><b>📣 {t("games.adagency.title")}</b></div></div>{stage === "build" ? <><div className="venture-grid"><PickGroup title={t("games.adagency.product")} value={product} options={["snack", "sports", "game"]} onPick={setProduct} disabled={paused} label={(key) => t(`games.adagency.${key}`)}/><PickGroup title={t("games.adagency.audience")} value={audience} options={["kids", "teens", "parents", "athletes", "gamers"]} onPick={setAudience} disabled={paused} label={(key) => t(`games.adagency.${key}`)}/><PickGroup title={t("games.adagency.message")} value={message} options={["fun", "healthy", "fast", "premium", "value"]} onPick={setMessage} disabled={paused} label={(key) => t(`games.adagency.${key}`)}/><PickGroup title={t("games.adagency.visual")} value={visual} options={["bright", "action", "clear", "creative"]} onPick={setVisual} disabled={paused} label={(key) => t(`games.adagency.${key}`)}/><PickGroup title={t("games.adagency.cta")} value={cta} options={["try", "learn", "visit", "buy"]} onPick={setCta} disabled={paused} label={(key) => t(`games.adagency.${key}`)}/></div><button type="button" disabled={paused} onClick={() => setStage("results")} className="primary-action mt-6">{t("games.adagency.launch")} <Megaphone size={17}/></button></> : <div className="venture-results"><div className="venture-metrics"><AdMetric label={t("games.adagency.reach")} value={`${reach}`}/><AdMetric label={t("games.adagency.engagement")} value={`${engagement}`} positive={messageFit}/><AdMetric label={t("games.adagency.conversions")} value={`${conversions}`} positive={ctaFit}/><AdMetric label={t("games.adagency.fit")} value={`${score}%`} positive={score >= 70}/><AdMetric label={t("games.adagency.score")} value={`${score}/100`} positive={score >= 70}/></div><p className="venture-insight"><b>{t("games.adagency.reaction")}:</b> {score >= 70 ? t("games.adagency.strong") : t("games.adagency.weak")}</p><div className="flex flex-wrap justify-center gap-3"><button type="button" disabled={paused} onClick={() => setStage("build")} className="secondary-action">{t("games.adagency.improve")} <Sparkles size={17}/></button><button type="button" disabled={paused} onClick={finish} className="primary-action">{t("games.adagency.review")} <Trophy size={17}/></button></div></div>}</div></div>;
}

type CustomerScenario = { customer: string; need: string; product: string; questions: string[]; correctQuestion: number; recommendations: string[]; correctRecommendation: number };

export function CustomerQuest({ paused, onEnd }: SharedProps) {
  const { t } = useTranslation();
  const scenarios = t("games.customerquest.scenarios", { returnObjects: true }) as unknown as CustomerScenario[];
  const [round, setRound] = useState(0);
  const [stage, setStage] = useState<"ask" | "inspect" | "recommend" | "review">("ask");
  const [question, setQuestion] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<number | null>(null);
  const [trust, setTrust] = useState(48);
  const [score, setScore] = useState(0);
  const scenario = scenarios[round];
  const questionFit = question === scenario.correctQuestion;
  const recommendationFit = recommendation === scenario.correctRecommendation;
  const chooseQuestion = (index: number) => { if (paused || question !== null) return; setQuestion(index); setStage("inspect"); };
  const chooseRecommendation = (index: number) => {
    if (paused || recommendation !== null) return;
    const gained = (questionFit ? 16 : 4) + (index === scenario.correctRecommendation ? 18 : 5);
    setRecommendation(index); setScore((value) => value + gained); setTrust((value) => Math.min(100, value + gained)); setStage("review");
  };
  const moveOn = () => {
    if (round === scenarios.length - 1) {
      const achieved = score >= 70;
      onEnd({ achieved, score, stars: score >= 88 ? 3 : score >= 70 ? 2 : 1, message: t("games.customerquest.result", { trust, score }) });
      return;
    }
    setRound((value) => value + 1); setStage("ask"); setQuestion(null); setRecommendation(null);
  };
  return <div className="game-stage venture-stage">
    <div className="game-play-header"><span className="game-play-header__icon"><Search size={20}/></span><div><p className="stage-kicker">{t("games.customerquest.objective")}</p><div className="stage-scoreline"><b>{t("games.customerquest.trust")}: {trust}%</b><span>{round + 1}/{scenarios.length}</span></div></div></div>
    <div className="venture-board customer-quest">
      <div className="venture-banner"><img src="/manus-storage/profitspatrol-customer-quest_a18309cc.png" alt=""/><div><span>{t("games.customerquest.customer")}</span><b>🧭 {scenario.customer}</b></div></div>
      <div className="customer-quest__brief"><p className="stage-kicker">{t("games.customerquest.need")}</p><h2>{scenario.need}</h2><div className="customer-quest__product"><Search size={18}/><span>{scenario.product}</span></div></div>
      {stage === "ask" && <section className="venture-choice"><p>{t("games.customerquest.ask")}</p><div>{scenario.questions.map((item, index) => <button type="button" key={item} disabled={paused} onClick={() => chooseQuestion(index)}>{item}</button>)}</div></section>}
      {stage === "inspect" && <div className="customer-quest__inspection"><div><CheckCircle2 size={20}/><div><b>{t("games.customerquest.productNotes")}</b><p>{scenario.product}</p></div></div><p className="venture-insight">{questionFit ? t("games.customerquest.goodQuestion") : t("games.customerquest.missedQuestion")}</p><button type="button" disabled={paused} onClick={() => setStage("recommend")} className="primary-action">{t("games.customerquest.inspect")} <Search size={17}/></button></div>}
      {stage === "recommend" && <section className="venture-choice"><p>{t("games.customerquest.recommend")}</p><div>{scenario.recommendations.map((item, index) => <button type="button" key={item} disabled={paused} onClick={() => chooseRecommendation(index)}>{item}</button>)}</div></section>}
      {stage === "review" && <div className="venture-results"><div className="venture-metrics"><AdMetric label={t("games.customerquest.questionFit")} value={questionFit ? "✓" : "↻"} positive={questionFit}/><AdMetric label={t("games.customerquest.needsMatch")} value={recommendationFit ? "✓" : "↻"} positive={recommendationFit}/><AdMetric label={t("games.customerquest.trust")} value={`${trust}%`} positive={trust >= 70}/></div><p className="venture-insight">{recommendationFit ? t("games.customerquest.helpful") : t("games.customerquest.needsMore")}</p><button type="button" disabled={paused} onClick={moveOn} className="primary-action">{round === scenarios.length - 1 ? t("games.customerquest.finish") : t("games.customerquest.nextCustomer")} <Trophy size={17}/></button></div>}
    </div>
  </div>;
}

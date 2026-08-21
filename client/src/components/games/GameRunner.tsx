/** Design reminder: Every interaction is a tangible money decision with immediate feedback inside one playful business-adventure world. */
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CircleDollarSign, Coins, HandCoins, HeartHandshake, Lightbulb, Minus, Plus, ReceiptText, RefreshCcw, RotateCcw, Route, ShieldCheck, Sparkles, Store, Target, TrendingUp, Trophy, WalletCards, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { GameId } from "@/lib/game-registry";
import { AdAgency, CustomerQuest } from "./Batch04Games";
import { BrandBuilder, MarketingMix, SalesMaster } from "./Batch04More";
import { CompoundMountain, InvestmentIsland, PortfolioQuest, RiskRadar, ScamDetective } from "./Batch05Games";
import "./game-ui.css";

export type GameResult = { achieved: boolean; score: number; stars: number; message: string };
type Props = { gameId: GameId; paused: boolean; onEnd: (result: GameResult) => void };
const resultFor = (achieved: boolean, score: number, t: (key: string) => string): GameResult => ({ achieved, score, stars: achieved ? (score >= 90 ? 3 : score >= 65 ? 2 : 1) : 0, message: achieved ? t("common.win") : t("common.notYet") });

export function GameRunner({ gameId, paused, onEnd }: Props) {
  switch (gameId) {
    case "coin": return <CoinCatcher paused={paused} onEnd={onEnd} />;
    case "needs": return <NeedsVsWants paused={paused} onEnd={onEnd} />;
    case "sorter": return <MoneySorter paused={paused} onEnd={onEnd} />;
    case "budget": return <BudgetHero paused={paused} onEnd={onEnd} />;
    case "savings": return <SavingsSprint paused={paused} onEnd={onEnd} />;
    case "change": return <ChangeMaster paused={paused} onEnd={onEnd} />;
    case "detective": return <PriceDetective paused={paused} onEnd={onEnd} />;
    case "discount": return <DiscountDash paused={paused} onEnd={onEnd} />;
    case "cashflow": return <CashFlowRunner paused={paused} onEnd={onEnd} />;
    case "maze": return <MoneyMaze paused={paused} onEnd={onEnd} />;
    case "lemonade": return <LemonadeBoss paused={paused} onEnd={onEnd} />;
    case "snack": return <SnackShack paused={paused} onEnd={onEnd} />;
    case "tshirt": return <TShirtTycoon paused={paused} onEnd={onEnd} />;
    case "pet": return <PetShopManager paused={paused} onEnd={onEnd} />;
    case "cafe": return <MiniCafe paused={paused} onEnd={onEnd} />;
    case "adagency": return <AdAgency paused={paused} onEnd={onEnd} />;
    case "customerquest": return <CustomerQuest paused={paused} onEnd={onEnd} />;
    case "salesmaster": return <SalesMaster paused={paused} onEnd={onEnd} />;
    case "brandbuilder": return <BrandBuilder paused={paused} onEnd={onEnd} />;
    case "marketingmix": return <MarketingMix paused={paused} onEnd={onEnd} />;
    case "investisland": return <InvestmentIsland paused={paused} onEnd={onEnd} />;
    case "riskradar": return <RiskRadar paused={paused} onEnd={onEnd} />;
    case "portfolioquest": return <PortfolioQuest paused={paused} onEnd={onEnd} />;
    case "compoundmtn": return <CompoundMountain paused={paused} onEnd={onEnd} />;
    case "scamdetective": return <ScamDetective paused={paused} onEnd={onEnd} />;
  }
}

function PlayHeader({ children, icon: Icon = Sparkles }: { children: ReactNode; icon?: ComponentType<{ size?: number }> }) {
  return <div className="game-play-header"><span className="game-play-header__icon"><Icon size={20} /></span><div>{children}</div></div>;
}

function CoinCatcher({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [lane, setLane] = useState(1);
  const [balance, setBalance] = useState(20);
  const [caught, setCaught] = useState(0);
  const [feedback, setFeedback] = useState(t("games.coin.instruction"));
  const ended = useRef(false);
  const initialItems = useMemo(() => Array.from({ length: 13 }, (_, id) => ({ id, lane: [0, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 1, 2][id], kind: ["coin", "coin", "trap", "coin", "coin", "trap", "coin", "trap", "coin", "coin", "trap", "coin", "coin"][id] as "coin" | "trap", y: -1 - id * 1.35, active: true })), []);
  const [items, setItems] = useState(initialItems);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (paused) return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setLane((current) => Math.max(0, current - 1));
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setLane((current) => Math.min(2, current + 1));
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [paused]);
  useEffect(() => {
    if (paused || ended.current) return;
    const timer = window.setInterval(() => {
      setItems((previous) => previous.map((item) => {
        if (!item.active) return item;
        const nextY = item.y + 0.62;
        if (nextY >= 5.35) {
          const hit = item.lane === lane;
          if (hit) {
            const delta = item.kind === "coin" ? 10 : -10;
            setBalance((value) => Math.max(0, value + delta));
            if (item.kind === "coin") { setCaught((value) => value + 1); setFeedback("+$10"); } else setFeedback("-$10");
          }
          return { ...item, y: nextY, active: false };
        }
        return { ...item, y: nextY };
      }));
    }, 360);
    return () => window.clearInterval(timer);
  }, [lane, paused]);
  useEffect(() => {
    if (ended.current) return;
    const allDone = items.every((item) => !item.active);
    if (balance <= 0) { ended.current = true; onEnd(resultFor(false, caught * 10, t)); }
    else if (allDone) { ended.current = true; const achieved = balance >= 50; onEnd(resultFor(achieved, Math.min(100, caught * 12 + balance), t)); }
  }, [balance, caught, items, onEnd, t]);
  return <div className="game-stage game-stage--coin">
    <PlayHeader icon={Coins}><p className="stage-kicker">{t("games.coin.instruction")}</p><div className="stage-scoreline"><b>{t("games.coin.balance")}: ${balance}</b><span>{t("games.coin.target")}: $50</span><span>{t("games.coin.caught")}: {caught}</span></div></PlayHeader>
    <div className="catcher-board" aria-label={t("games.coin.title")}>
      <div className="catcher-sky" />
      {[0, 1, 2].map((column) => <div className="catcher-lane" key={column} style={{ left: `${column * 33.333}%` }} />)}
      {items.filter((item) => item.active).map((item) => <div key={item.id} className={`falling-token falling-token--${item.kind}`} style={{ left: `calc(${item.lane * 33.333}% + 16.666%)`, top: `${item.y * 15}%` }}>{item.kind === "coin" ? <Coins size={25} /> : <ReceiptText size={24} />}</div>)}
      <div className="catcher-player" style={{ left: `calc(${lane * 33.333}% + 16.666%)` }}><span>👜</span></div>
      <div className="catcher-feedback">{feedback}</div>
    </div>
    <div className="mobile-steer"><button type="button" disabled={paused} onClick={() => setLane((current) => Math.max(0, current - 1))}><ArrowLeft /> </button><div><span className="text-[#54708d]">A</span> / <span className="text-[#54708d]">D</span></div><button type="button" disabled={paused} onClick={() => setLane((current) => Math.min(2, current + 1))}><ArrowRight /></button></div>
  </div>;
}

function NeedsVsWants({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const scenarios = t("scenarios.needs", { returnObjects: true }) as unknown as Array<{ item: string; context: string; answer: "need" | "want"; explain: string }>;
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answer, setAnswer] = useState<"need" | "want" | null>(null);
  const current = scenarios[index];
  const choose = (choice: "need" | "want") => { if (paused || answer) return; setAnswer(choice); if (choice === current.answer) setCorrect((value) => value + 1); };
  const next = () => { if (!answer) return; if (index === scenarios.length - 1) { const score = (correct + (answer === current.answer ? 1 : 0)) * 20; onEnd(resultFor(score >= 60, score, t)); } else { setIndex((value) => value + 1); setAnswer(null); } };
  const isCorrect = answer === current.answer;
  return <div className="game-stage">
    <PlayHeader icon={HeartHandshake}><p className="stage-kicker">{t("games.needs.prompt")}</p><div className="stage-scoreline"><b>{t("games.needs.streak")}: {correct}</b><span>{index + 1}/{scenarios.length}</span></div></PlayHeader>
    <div className="decision-card"><div className="decision-card__orb">{index % 2 ? "✦" : "◉"}</div><p className="text-sm font-black uppercase tracking-[.15em] text-[#f26545]">{t("common.mission")} {index + 1}</p><h2>{current.item}</h2><p>{current.context}</p><div className="choice-grid"><button type="button" disabled={paused || !!answer} onClick={() => choose("need")} className={`choice-button choice-button--need ${answer === "need" ? (isCorrect ? "choice-button--right" : "choice-button--wrong") : ""}`}><ShieldCheck size={29}/><span>{t("games.needs.need")}</span></button><button type="button" disabled={paused || !!answer} onClick={() => choose("want")} className={`choice-button choice-button--want ${answer === "want" ? (isCorrect ? "choice-button--right" : "choice-button--wrong") : ""}`}><Sparkles size={29}/><span>{t("games.needs.want")}</span></button></div>{answer && <div className={`answer-note ${isCorrect ? "answer-note--right" : "answer-note--wrong"}`}><b>{isCorrect ? t("common.correct") : t("common.tryAgain")}</b><p>{current.explain}</p><button type="button" className="primary-action" onClick={next}>{index === scenarios.length - 1 ? t("common.check") : t("common.next")} <ArrowRight size={17}/></button></div>}</div>
  </div>;
}

function MoneySorter({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const rounds = [{ target: 25, pieces: [5, 10, 20, 25] }, { target: 35, pieces: [5, 10, 15, 20, 25] }, { target: 50, pieces: [5, 10, 20, 25, 30] }];
  const [round, setRound] = useState(0); const [picked, setPicked] = useState<number[]>([]); const [correct, setCorrect] = useState(0); const [note, setNote] = useState("");
  const current = rounds[round]; const total = picked.reduce((sum, value) => sum + value, 0);
  const select = (value: number) => { if (paused) return; const at = picked.indexOf(value); setPicked((list) => at === -1 ? [...list, value] : list.filter((_, index) => index !== at)); setNote(""); };
  const check = () => { if (paused) return; if (total !== current.target) { setNote(t("common.tryAgain")); return; } const nextCorrect = correct + 1; if (round === 2) onEnd(resultFor(true, 50 + nextCorrect * 16, t)); else { setCorrect(nextCorrect); setRound((value) => value + 1); setPicked([]); setNote(t("common.correct")); } };
  return <div className="game-stage">
    <PlayHeader icon={Coins}><p className="stage-kicker">{t("games.sorter.rounds", { current: round + 1 })}</p><div className="stage-scoreline"><b>{t("games.sorter.target")}: ${current.target}</b><span>{t("games.sorter.yourBuild")}: ${total}</span></div></PlayHeader>
    <div className="sorter-board"><div className="target-vault"><p>{t("games.sorter.target")}</p><b>${current.target}</b><span className={total === current.target ? "match-pill match-pill--yes" : "match-pill"}>{total === current.target ? "✓" : `$${total}`}</span></div><div><p className="money-label">{t("games.sorter.available")}</p><div className="money-pieces">{current.pieces.map((value, index) => <button key={`${value}-${index}`} type="button" disabled={paused} onClick={() => select(value)} className={`money-piece ${picked.includes(value) ? "money-piece--selected" : ""}`}><span>${value}</span></button>)}</div><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" disabled={paused} onClick={() => setPicked([])} className="secondary-action"><RotateCcw size={16}/>{t("common.retry")}</button><button type="button" disabled={paused} onClick={check} className="primary-action">{t("common.check")} <Trophy size={17}/></button></div>{note && <p className="answer-inline">{note}</p>}</div></div>
  </div>;
}


function BudgetHero({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  type Category = "needs" | "savings" | "fun" | "unexpected";
  const entries: Array<{ id: Category; icon: typeof ShieldCheck; color: string }> = [{ id: "needs", icon: ShieldCheck, color: "#4da2ff" }, { id: "savings", icon: WalletCards, color: "#47b7a0" }, { id: "fun", icon: Sparkles, color: "#f5b64d" }, { id: "unexpected", icon: Zap, color: "#ff6b4a" }];
  const [budget, setBudget] = useState<Record<Category, number>>({ needs: 40, savings: 20, fun: 20, unexpected: 20 });
  const assigned = Object.values(budget).reduce((sum, value) => sum + value, 0); const remaining = 100 - assigned;
  const adjust = (id: Category, delta: number) => { if (paused) return; setBudget((state) => { const next = Math.max(0, Math.min(100, state[id] + delta)); if (delta > 0 && remaining <= 0) return state; return { ...state, [id]: next }; }); };
  const simulate = () => { if (paused) return; const safe = assigned === 100 && budget.needs >= 40 && budget.savings >= 20 && budget.unexpected >= 10; const score = Math.min(100, budget.needs + budget.savings + budget.unexpected); onEnd(resultFor(safe, score, t)); };
  return <div className="game-stage"><PlayHeader icon={WalletCards}><p className="stage-kicker">{t("games.budget.objective")}</p><div className="stage-scoreline"><b>{t("games.budget.remaining")}: ${remaining}</b><span>$100</span></div></PlayHeader><div className="budget-board"><div className="budget-total"><div><span>{t("games.budget.remaining")}</span><b>${remaining}</b></div><div className="budget-meter"><i style={{ width: `${assigned}%` }} /></div></div><div className="budget-list">{entries.map(({ id, icon: Icon, color }) => <div className="budget-row" key={id}><div className="budget-row__label"><span style={{ background: color }}><Icon size={18}/></span><b>{t(`games.budget.${id}`)}</b></div><div className="budget-row__controls"><button type="button" disabled={paused || budget[id] === 0} onClick={() => adjust(id, -10)}><Minus size={16}/></button><strong>${budget[id]}</strong><button type="button" disabled={paused || remaining <= 0} onClick={() => adjust(id, 10)}><Plus size={16}/></button></div></div>)}</div><button type="button" disabled={paused || remaining !== 0} onClick={simulate} className="primary-action mt-6">{t("games.budget.simulate")} <Zap size={17}/></button></div></div>;
}
function SavingsSprint({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation(); const [wallet, setWallet] = useState(40); const [savings, setSavings] = useState(0); const [turn, setTurn] = useState(1); const [note, setNote] = useState("");
  const act = (kind: "save" | "earn" | "spend") => { if (paused) return; let nextWallet = wallet; let nextSavings = savings; if (kind === "save" && wallet >= 20) { nextWallet -= 20; nextSavings += 20; } if (kind === "earn") nextWallet += 20; if (kind === "spend" && wallet >= 8) nextWallet -= 8; else if (kind === "spend" && wallet < 8) return; setWallet(nextWallet); setSavings(nextSavings); setNote(kind === "save" ? "+$20" : kind === "earn" ? "+$20" : "-$8"); if (nextSavings >= 60) { onEnd(resultFor(true, 100 - (turn - 1) * 6, t)); return; } if (turn === 6) { onEnd(resultFor(false, nextSavings, t)); return; } setTurn((value) => value + 1); };
  return <div className="game-stage"><PlayHeader icon={Target}><p className="stage-kicker">{t("games.savings.turn", { current: turn })}</p><div className="stage-scoreline"><b>{t("games.savings.savings")}: ${savings}/$60</b><span>{t("games.savings.wallet")}: ${wallet}</span></div></PlayHeader><div className="sprint-board"><div className="goal-track"><div className="goal-track__finish"><Trophy size={28}/><span>$60</span></div><div className="goal-track__fill" style={{ width: `${Math.min(100, savings / 60 * 100)}%` }} /><div className="goal-track__runner" style={{ left: `${Math.min(92, savings / 60 * 100)}%` }}>🏃</div></div><p className="sprint-note">{note || t("games.savings.objective")}</p><div className="action-trio"><button type="button" disabled={paused || wallet < 20} onClick={() => act("save")}><WalletCards size={24}/><span>{t("games.savings.save")}</span></button><button type="button" disabled={paused} onClick={() => act("earn")}><BriefcaseBusiness size={24}/><span>{t("games.savings.earn")}</span></button><button type="button" disabled={paused || wallet < 8} onClick={() => act("spend")}><Sparkles size={24}/><span>{t("games.savings.spend")}</span></button></div></div></div>;
}

function ChangeMaster({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation();
  const rounds = [{ price: 13, paid: 20, time: 52 }, { price: 28, paid: 50, time: 42 }, { price: 34, paid: 50, time: 34 }, { price: 67, paid: 100, time: 28 }];
  const pieces = [1, 2, 5, 10, 20];
  const [round, setRound] = useState(0); const [picked, setPicked] = useState<number[]>([]); const [correct, setCorrect] = useState(0); const [note, setNote] = useState(""); const [seconds, setSeconds] = useState(rounds[0].time); const ended = useRef(false);
  const current = rounds[round]; const due = current.paid - current.price; const total = picked.reduce((sum, value) => sum + value, 0);
  useEffect(() => { if (paused || ended.current) return; const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [paused]);
  useEffect(() => { if (seconds > 0 || ended.current) return; ended.current = true; onEnd({ ...resultFor(false, correct * 22, t), message: i18n.language.startsWith("ar") ? "انتهى الوقت. في المتجر الحقيقي، الدقة أهم من الاستعجال." : "Time is up. In a real shop, accuracy matters more than rushing." }); }, [seconds, correct, onEnd, t, i18n.language]);
  const addPiece = (value: number) => { if (!paused) { setPicked((list) => [...list, value]); setNote(""); } }; const removePiece = (index: number) => { if (!paused) setPicked((list) => list.filter((_, itemIndex) => itemIndex !== index)); };
  const check = () => { if (paused) return; if (total !== due) { setNote(t("common.tryAgain")); return; } const next = correct + 1; if (round === rounds.length - 1) { ended.current = true; onEnd({ ...resultFor(true, 46 + next * 13 + Math.floor(seconds / 4), t), message: i18n.language.startsWith("ar") ? "أنهيت عمليات الشراء بدقة حتى مع زيادة الضغط." : "You completed every checkout accurately as the pressure increased." }); } else { setCorrect(next); const nextRound = round + 1; setRound(nextRound); setSeconds(rounds[nextRound].time); setPicked([]); setNote(t("common.correct")); } };
  return <div className="game-stage"><PlayHeader icon={ReceiptText}><p className="stage-kicker">{t("games.change.checkout", { current: round + 1 })}</p><div className="stage-scoreline"><b>{t("games.change.changeDue")}: ${due}</b><span>{t("games.change.selected")}: ${total}</span><span>⏱ {seconds}s</span></div></PlayHeader><div className="change-board"><div className="checkout-receipt"><div><span>{t("games.change.price")}</span><b>${current.price}</b></div><div><span>{t("games.change.paid")}</span><b>${current.paid}</b></div><div className="checkout-receipt__due"><span>{t("games.change.changeDue")}</span><b>${due}</b></div></div><div className="change-composer"><div className="selected-change">{picked.length ? picked.map((value, index) => <button type="button" onClick={() => removePiece(index)} key={`${value}-${index}`}>${value}</button>) : <span>—</span>}</div><div className="money-pieces">{pieces.map((value) => <button key={value} type="button" disabled={paused} onClick={() => addPiece(value)} className="money-piece"><span>${value}</span></button>)}</div><div className="mt-6 flex justify-center gap-3"><button type="button" disabled={paused} onClick={() => setPicked([])} className="secondary-action"><RotateCcw size={16}/>{t("common.retry")}</button><button type="button" disabled={paused} onClick={check} className="primary-action">{t("common.check")} <HandCoins size={17}/></button></div>{note && <p className="answer-inline">{note}</p>}</div></div></div>;
}

function PriceDetective({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const rounds = [{ a: { price: 5, units: 4, fee: 0 }, b: { price: 7, units: 6, fee: 0 }, best: "b" }, { a: { price: 8, units: 8, fee: 1 }, b: { price: 6, units: 5, fee: 0 }, best: "a" }, { a: { price: 12, units: 12, fee: 0 }, b: { price: 9, units: 8, fee: 0 }, best: "a" }] as const; const [round, setRound] = useState(0); const [correct, setCorrect] = useState(0); const [answer, setAnswer] = useState<"a" | "b" | null>(null); const current = rounds[round];
  const choose = (choice: "a" | "b") => { if (paused || answer) return; setAnswer(choice); };
  const next = () => { if (!answer) return; const wasCorrect = answer === current.best; const totalCorrect = correct + (wasCorrect ? 1 : 0); if (round === 2) onEnd(resultFor(totalCorrect >= 2, totalCorrect * 33, t)); else { setCorrect(totalCorrect); setRound((value) => value + 1); setAnswer(null); } };
  const offer = (key: "a" | "b") => { const item = current[key]; const unit = (item.price + item.fee) / item.units; const picked = answer === key; const isRight = key === current.best; return <button type="button" disabled={paused || !!answer} onClick={() => choose(key)} className={`offer-card ${picked ? (isRight ? "offer-card--right" : "offer-card--wrong") : ""}`}><p>{t("games.detective.offer", { letter: key.toUpperCase() })}</p><b>${item.price}</b><span>{item.units} {t("games.detective.unit")}</span>{item.fee > 0 && <small>{t("games.detective.fee")}: ${item.fee}</small>}<small>{i18n.language.startsWith("ar") ? "السعر النهائي" : "Checkout total"}: ${(item.price + item.fee).toFixed(2)}</small><strong>${unit.toFixed(2)} {t("games.detective.unit")}</strong></button>; };
  const isCorrect = answer === current.best;
  const winningOffer = current[current.best]; const winningUnit = ((winningOffer.price + winningOffer.fee) / winningOffer.units).toFixed(2);
  return <div className="game-stage"><PlayHeader icon={Lightbulb}><p className="stage-kicker">{t("games.detective.choose")}</p><div className="stage-scoreline"><b>{round + 1}/3</b><span>{t("games.detective.skill")}</span></div></PlayHeader><div className="detective-board"><div className="offer-grid">{offer("a")}{offer("b")}</div>{answer && <div className={`answer-note ${isCorrect ? "answer-note--right" : "answer-note--wrong"}`}><b>{isCorrect ? t("common.correct") : t("common.tryAgain")}</b><p>{i18n.language.startsWith("ar") ? `أفضل قيمة هي ${current.best.toUpperCase()} بسعر $${winningUnit} لكل وحدة بعد الرسوم.` : `Offer ${current.best.toUpperCase()} wins at $${winningUnit} per unit after fees.`}</p><button type="button" className="primary-action" onClick={next}>{round === 2 ? t("common.check") : t("common.next")} <ArrowRight size={17}/></button></div>}</div></div>;
}

function DiscountDash({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const rounds = [{ original: 50, sale: "20%", options: [40, 30, 35], correct: 40, working: "$50 × 0.80 = $40" }, { original: 80, sale: "25%", options: [60, 55, 65], correct: 60, working: "$80 × 0.75 = $60" }, { original: 100, sale: "20% → 10%", options: [70, 72, 80], correct: 72, working: "$100 × 0.80 × 0.90 = $72" }]; const [round, setRound] = useState(0); const [correct, setCorrect] = useState(0); const [answer, setAnswer] = useState<number | null>(null); const current = rounds[round];
  const choose = (choice: number) => { if (!paused && answer === null) setAnswer(choice); }; const next = () => { if (answer === null) return; const did = answer === current.correct; const total = correct + (did ? 1 : 0); if (round === 2) onEnd(resultFor(total >= 2, total * 33, t)); else { setCorrect(total); setRound((value) => value + 1); setAnswer(null); } }; const ok = answer === current.correct;
  return <div className="game-stage"><PlayHeader icon={TrendingUp}><p className="stage-kicker">{t("games.discount.choose")}</p><div className="stage-scoreline"><b>{round + 1}/3</b><span>{t("games.discount.skill")}</span></div></PlayHeader><div className="discount-board"><div className="sale-ticket"><span>{t("games.discount.original")}</span><b>${current.original}</b><i>{t("games.discount.sale")} {current.sale}</i></div><div className="price-options">{current.options.map((option) => <button key={option} type="button" disabled={paused || answer !== null} onClick={() => choose(option)} className={answer === option ? (ok ? "price-option--right" : "price-option--wrong") : ""}>${option}</button>)}</div>{answer !== null && <div className={`answer-note ${ok ? "answer-note--right" : "answer-note--wrong"}`}><b>{ok ? t("common.correct") : t("common.tryAgain")}</b><p>{current.working}{round === 2 && ` — ${i18n.language.startsWith("ar") ? "لا تجمع التخفيضين." : "do not add the discounts together."}`}</p><button type="button" className="primary-action" onClick={next}>{round === 2 ? t("common.check") : t("common.next")} <ArrowRight size={17}/></button></div>}</div></div>;
}

function CashFlowRunner({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const isArabic = i18n.language.startsWith("ar");
  const text = isArabic ? { safe: "طلب نقدي اليوم", invoice: "فاتورة تُدفع لاحقاً", restock: "أعد التخزين الآن", delay: "أجّل المخزون", repair: "أصلح الجهاز", patch: "ترقيع مؤقت", marketing: "عرض سريع للعملاء", reserve: "احفظ النقد للطوارئ", reserveStock: "اطلب مخزوناً مع هامش أمان", preorder: "اقبل الطلبات المسبقة فقط", prompts: ["عميل كبير يطلب اليوم.", "المخزون بدأ ينفد.", "حدث غير متوقع: تعطلت آلة التعبئة.", "هل تبحث عن زبائن جدد أم تحافظ على النقد؟", "عطلة نهاية الأسبوع تقترب."] } : { safe: "Take a cash order today", invoice: "Invoice a bigger order later", restock: "Restock for this week", delay: "Delay restocking", repair: "Repair the machine", patch: "Use a short-term patch", marketing: "Run a quick customer offer", reserve: "Keep a cash reserve", reserveStock: "Order stock with a safety buffer", preorder: "Take preorders only", prompts: ["A big customer wants an order today.", "Your shop is running low on stock.", "Unexpected event: the packing machine breaks.", "Do you chase new customers or protect cash?", "The weekend rush is coming."] };
  const weeks = [{ choices: [{ label: text.safe, cash: 20, profit: 20 }, { label: text.invoice, cash: 0, profit: 30, due: 2 }] }, { choices: [{ label: text.restock, cash: -15, profit: 10 }, { label: text.delay, cash: 0, profit: 0 }] }, { choices: [{ label: text.repair, cash: -18, profit: 0 }, { label: text.patch, cash: -5, profit: 0 }] }, { choices: [{ label: text.marketing, cash: -8, profit: 22 }, { label: text.reserve, cash: 0, profit: 6 }] }, { choices: [{ label: text.reserveStock, cash: -12, profit: 18 }, { label: text.preorder, cash: 0, profit: 9, due: 5 }] }];
  const [week, setWeek] = useState(0); const [cash, setCash] = useState(35); const [profit, setProfit] = useState(0); const [pending, setPending] = useState<Array<{ due: number; amount: number }>>([]); const [note, setNote] = useState("");
  const choose = (choice: { label: string; cash: number; profit: number; due?: number }) => { if (paused) return; const collected = pending.filter((item) => item.due === week).reduce((sum, item) => sum + item.amount, 0); const remaining = pending.filter((item) => item.due !== week); const nextCash = cash + choice.cash + collected; const nextProfit = profit + choice.profit; const nextPending = choice.due ? [...remaining, { due: choice.due, amount: choice.profit }] : remaining; setCash(nextCash); setProfit(nextProfit); setPending(nextPending); setNote(collected ? `+$${collected}` : ""); if (nextCash < 0) { onEnd({ ...resultFor(false, Math.max(0, nextProfit), t), message: isArabic ? "ظهر الربح على الورق، لكن لم يبقَ نقد كافٍ لدفع الفواتير." : "Profit may look good on paper, but the shop ran out of cash for its bills." }); return; } if (week === weeks.length - 1) { const achieved = nextCash > 0 && nextProfit >= 32; onEnd({ ...resultFor(achieved, Math.min(100, nextCash + nextProfit * 2), t), message: achieved ? (isArabic ? `بقي لديك ${nextCash}$ نقداً رغم المفاجآت. هذا هو الفرق بين الربح وتوفر النقد.` : `You kept $${nextCash} available through surprises. That is the difference between profit and cash.`) : (isArabic ? "انتهى الأسبوع، لكن النقد أو الربح لم يكفيا لتوسيع المتجر بأمان." : "The week ended, but cash or profit was not strong enough to grow the shop safely.") }); return; } setWeek((value) => value + 1); };
  return <div className="game-stage"><PlayHeader icon={Store}><p className="stage-kicker">{t("games.cashflow.week", { current: week + 1 })}</p><div className="stage-scoreline"><b>{t("games.cashflow.cash")}: ${cash}</b><span>{t("games.cashflow.profit")}: ${profit}</span>{pending.length > 0 && <span>{isArabic ? "دفعات قادمة" : "Payments due"}: ${pending.reduce((sum, item) => sum + item.amount, 0)}</span>}</div></PlayHeader><div className="cashflow-board"><div className="cashflow-visual"><img src="/manus-storage/profitspatrol-cashflow-scene_86e90589.png" alt=""/><div className="cash-bubble">{note || `$${cash}`}</div></div><p className="cashflow-question">{text.prompts[week]}</p><p className="text-center text-sm font-bold text-[#54708d]">{t("games.cashflow.choose")}</p><div className="cash-choices">{weeks[week].choices.map((choice) => <button type="button" key={choice.label} disabled={paused} onClick={() => choose(choice)}><strong>{choice.label}</strong><span>{choice.cash >= 0 ? "+" : ""}${choice.cash} {t("games.cashflow.cash")}</span><small>{choice.profit >= 0 ? "+" : ""}${choice.profit} {t("games.cashflow.profit")}</small></button>)}</div></div></div>;
}

function MoneyMaze({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const ar = i18n.language.startsWith("ar"); const copy = ar ? { save: "ضع 15$ في الادخار", invest: "جرّب فرصة المتجر الصغير", guard: "احتفظ بصندوق للطوارئ", skill: "استثمر في مهارة جديدة", strong: "طريق آمن", chance: "طريق فرصة" } : { save: "Put $15 into savings", invest: "Try the tiny shop opportunity", guard: "Keep an emergency fund", skill: "Invest in a new skill", strong: "Safe route", chance: "Opportunity route" };
  const [step, setStep] = useState(0); const [cash, setCash] = useState(50); const [savings, setSavings] = useState(20); const [risk, setRisk] = useState(0); const [opportunity, setOpportunity] = useState(0); const [route, setRoute] = useState(""); const [event, setEvent] = useState<number | null>(null);
  const decide = (choice: "save" | "invest" | "guard" | "skill") => { if (paused) return; if (choice === "save") { setCash((value) => value - 15); setSavings((value) => value + 15); setRisk((value) => Math.max(0, value - 1)); setRoute(copy.strong); } if (choice === "invest") { setCash((value) => value - 20); setOpportunity((value) => value + 30); setRisk((value) => value + 2); setRoute(copy.chance); } if (choice === "guard") { setCash((value) => value - 10); setSavings((value) => value + 10); setRisk((value) => Math.max(0, value - 1)); } if (choice === "skill") { setCash((value) => value - 15); setOpportunity((value) => value + 20); setRisk((value) => Math.max(0, value - 1)); } setStep((value) => value + 1); };
  const reveal = () => { if (paused || event !== null) return; const roll = Math.random() >= .5 ? 15 : -6; setEvent(roll); const finalCash = cash + roll; const finalValue = finalCash + savings + opportunity; const achieved = finalCash >= 0 && finalValue >= 60; const eventText = roll > 0 ? (ar ? "يوم سوق ممتاز: +15$ نقداً." : "Great market day: +$15 cash.") : (ar ? "إصلاح صغير مفاجئ: -6$ نقداً." : "A small surprise repair: -$6 cash."); window.setTimeout(() => onEnd({ ...resultFor(achieved, Math.min(100, finalValue + (risk ? 0 : 8)), t), message: `${eventText} ${ar ? "يمكن أن تنجح الطرق الآمنة وطرق الفرص حين توازنها جيداً." : "Both safe and opportunity routes can work when you balance them well."}` }), 720); };
  return <div className="game-stage"><PlayHeader icon={Route}><p className="stage-kicker">{step < 2 ? t("games.maze.objective") : t("games.maze.fairEvent")}</p><div className="stage-scoreline"><b>{t("games.maze.cash")}: ${cash}</b><span>{t("games.maze.savings")}: ${savings}</span><span>{t("games.maze.opportunity")}: ${opportunity}</span><span>{t("games.maze.risk")}: {risk}</span></div></PlayHeader><div className="maze-board"><div className="maze-path"><i/><i/><i/><span className="maze-marker">{step === 0 ? "01" : step === 1 ? "02" : "★"}</span></div>{step === 0 && <div className="maze-choices"><button type="button" disabled={paused} onClick={() => decide("save")}><ShieldCheck/><span>{copy.save}</span></button><button type="button" disabled={paused} onClick={() => decide("invest")}><TrendingUp/><span>{copy.invest}</span></button></div>}{step === 1 && <div className="maze-choices"><button type="button" disabled={paused} onClick={() => decide("guard")}><WalletCards/><span>{copy.guard}</span></button><button type="button" disabled={paused} onClick={() => decide("skill")}><Lightbulb/><span>{copy.skill}</span></button></div>}{step === 2 && <div className="fair-event"><p>{route}</p><p className="text-sm text-[#54708d]">{ar ? "الحدث التالي يملك احتمالاً متساوياً للنتيجتين." : "The next event gives both outcomes an equal chance."}</p><button type="button" disabled={paused || event !== null} onClick={reveal} className="primary-action">{t("games.maze.flip")} <Sparkles size={17}/></button></div>}</div></div>;
}

function LemonadeBoss({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState<"cheap" | "standard" | "premium">("standard");
  const [price, setPrice] = useState<"low" | "medium" | "high">("medium");
  const [quantity, setQuantity] = useState<8 | 12 | 16>(12);
  const [opened, setOpened] = useState(false);
  const recipeCost = { cheap: 1, standard: 1.5, premium: 2 }[recipe];
  const cupPrice = { low: 2, medium: 3, high: 4 }[price];
  const customerSignals = [
    { id: "priceSensitive", emoji: "🪙", buys: price !== "high" },
    { id: "qualitySensitive", emoji: "✨", buys: recipe !== "cheap" && price !== "high" },
    { id: "thirsty", emoji: "☀️", buys: true },
    { id: "impatient", emoji: "⚡", buys: price === "low" || price === "medium" },
  ] as const;
  const potentialDemand = customerSignals.reduce((total, customer) => total + (customer.buys ? 3 : 0), 0);
  const sold = opened ? Math.min(quantity, potentialDemand) : 0;
  const waste = opened ? quantity - sold : 0;
  const revenue = sold * cupPrice;
  const cost = quantity * recipeCost;
  const profit = revenue - cost;
  const satisfaction = opened ? Math.round((sold / 12) * 100) : 0;
  const review = () => {
    const achieved = profit >= 12 && satisfaction >= 75 && waste <= 4;
    const score = Math.max(0, Math.min(100, Math.round(45 + profit * 3 + satisfaction / 3 - waste * 5)));
    onEnd({ ...resultFor(achieved, score, t), message: t("games.lemonade.result", { sold, quantity, revenue, cost, waste }) });
  };
  return <div className="game-stage venture-stage"><PlayHeader icon={Store}><p className="stage-kicker">{t("games.lemonade.objective")}</p><div className="stage-scoreline"><b>{t("games.lemonade.capital")}: $30</b><span>{t("games.lemonade.weather")}: {t("games.lemonade.weatherHot")}</span></div></PlayHeader><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-lemonade-boss_fc5440d1.png" alt=""/><div><span>{t("games.lemonade.weather")}</span><b>☀️ {t("games.lemonade.weatherHot")}</b></div></div>{!opened ? <><div className="venture-grid"><DecisionGroup title={t("games.lemonade.recipe")} value={recipe} onPick={(value) => setRecipe(value as "cheap" | "standard" | "premium")} options={["cheap", "standard", "premium"]} label={(key) => `${t(`games.lemonade.${key}`)} · $${{ cheap: 1, standard: 1.5, premium: 2 }[key as "cheap" | "standard" | "premium"]}/cup`} disabled={paused}/><DecisionGroup title={t("games.lemonade.price")} value={price} onPick={(value) => setPrice(value as "low" | "medium" | "high")} options={["low", "medium", "high"]} label={(key) => `${t(`games.lemonade.${key}`)} · $${{ low: 2, medium: 3, high: 4 }[key as "low" | "medium" | "high"]}`} disabled={paused}/><DecisionGroup title={t("games.lemonade.quantity")} value={String(quantity)} onPick={(value) => setQuantity(Number(value) as 8 | 12 | 16)} options={["8", "12", "16"]} label={(key) => `${key} cups`} disabled={paused}/></div><div className="venture-customer-signals"><p>{t("games.lemonade.customers")}</p>{customerSignals.map((customer) => <span key={customer.id} className={customer.buys ? "signal--ready" : "signal--cautious"}>{customer.emoji} {t(`games.lemonade.${customer.id}`)}</span>)}</div><button type="button" disabled={paused} onClick={() => setOpened(true)} className="primary-action mt-6">{t("games.lemonade.open")} <Store size={17}/></button></> : <div className="venture-results"><div className="venture-metrics"><Metric label={t("games.lemonade.sales")} value={`${sold}/${quantity}`}/><Metric label={t("games.lemonade.revenue")} value={`$${revenue}`}/><Metric label={t("games.lemonade.cost")} value={`$${cost}`}/><Metric label={t("games.lemonade.profit")} value={`$${profit}`} accent={profit >= 0 ? "mint" : "coral"}/><Metric label={t("games.lemonade.waste")} value={`${waste}`} accent={waste <= 4 ? "mint" : "coral"}/><Metric label={t("games.lemonade.satisfaction")} value={`${satisfaction}%`} accent={satisfaction >= 75 ? "mint" : "coral"}/></div><p className="venture-insight">{t("games.lemonade.result", { sold, quantity, revenue, cost, waste })}</p><button type="button" disabled={paused} onClick={review} className="primary-action">{t("games.lemonade.review")} <Trophy size={17}/></button></div>}</div></div>;
}

function DecisionGroup({ title, value, onPick, options, label, disabled }: { title: string; value: string; onPick: (value: string) => void; options: string[]; label: (value: string) => string; disabled: boolean }) {
  return <section className="venture-choice"><p>{title}</p><div>{options.map((option) => <button type="button" key={option} disabled={disabled} onClick={() => onPick(option)} className={value === option ? "venture-choice__active" : ""}>{label(option)}</button>)}</div></section>;
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: "mint" | "coral" }) {
  return <div className={`venture-metric ${accent ? `venture-metric--${accent}` : ""}`}><span>{label}</span><b>{value}</b></div>;
}

function SnackShack({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [product, setProduct] = useState<"chips" | "premiumSnack">("chips");
  const [supplier, setSupplier] = useState<"cheapSupplier" | "premiumSupplier">("cheapSupplier");
  const [stock, setStock] = useState<6 | 10 | 14>(10);
  const [priceBand, setPriceBand] = useState<"low" | "suggested" | "high">("suggested");
  const [stage, setStage] = useState<"setup" | "results" | "restock">("setup");
  const [restock, setRestock] = useState<0 | 4 | 8>(0);
  const productCost = product === "chips" ? 1 : 3;
  const suggestedPrice = product === "chips" ? 2 : 5;
  const price = suggestedPrice + ({ low: -1, suggested: 0, high: 1 }[priceBand]);
  const supplierFactor = supplier === "cheapSupplier" ? 0.85 : 1.15;
  const delivered = supplier === "cheapSupplier" ? Math.max(0, stock - 2) : stock;
  const customerSignals = [
    { id: "bargain", emoji: "🪙", buys: priceBand !== "high" },
    { id: "regular", emoji: "🙂", buys: priceBand !== "high" },
    { id: "premiumBuyer", emoji: "⭐", buys: product === "premiumSnack" && priceBand !== "high" },
    { id: "impatient", emoji: "⚡", buys: supplier === "premiumSupplier" || stock >= 10 },
  ] as const;
  const demand = customerSignals.reduce((total, customer) => total + (customer.buys ? 3 : 0), 0);
  const sold = Math.min(delivered, demand);
  const leftover = delivered - sold;
  const inventoryCost = Math.round(stock * productCost * supplierFactor + restock * productCost * supplierFactor);
  const revenue = sold * price;
  const profit = revenue - inventoryCost;
  const finish = () => {
    const achieved = profit >= 6 && leftover <= 4 && sold >= 6;
    const score = Math.max(0, Math.min(100, Math.round(42 + profit * 4 + sold * 3 - leftover * 4)));
    onEnd({ ...resultFor(achieved, score, t), message: t("games.snack.result", { delivered, sold, leftover }) });
  };
  return <div className="game-stage venture-stage"><PlayHeader icon={Store}><p className="stage-kicker">{t("games.snack.objective")}</p><div className="stage-scoreline"><b>{t("games.snack.reliability")}: {supplier === "cheapSupplier" ? "75%" : "100%"}</b><span>{t("games.snack.margin")}: ${price - productCost}</span></div></PlayHeader><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-snack-shack_45948480.png" alt=""/><div><span>{t("games.snack.customers")}</span><b>🍿 {t("games.snack.objective")}</b></div></div>{stage === "setup" && <><div className="venture-grid"><DecisionGroup title={t("games.snack.product")} value={product} onPick={(value) => setProduct(value as "chips" | "premiumSnack")} options={["chips", "premiumSnack"]} label={(key) => `${t(`games.snack.${key}`)} · $${key === "chips" ? 1 : 3} cost`} disabled={paused}/><DecisionGroup title={t("games.snack.supplier")} value={supplier} onPick={(value) => setSupplier(value as "cheapSupplier" | "premiumSupplier")} options={["cheapSupplier", "premiumSupplier"]} label={(key) => `${t(`games.snack.${key}`)} · ${key === "cheapSupplier" ? "75%" : "100%"}`} disabled={paused}/><DecisionGroup title={t("games.snack.inventory")} value={String(stock)} onPick={(value) => setStock(Number(value) as 6 | 10 | 14)} options={["6", "10", "14"]} label={(key) => `${key} items`} disabled={paused}/><DecisionGroup title={t("games.snack.price")} value={priceBand} onPick={(value) => setPriceBand(value as "low" | "suggested" | "high")} options={["low", "suggested", "high"]} label={(key) => `${t(`games.snack.${key}`)} · $${suggestedPrice + ({ low: -1, suggested: 0, high: 1 }[key as "low" | "suggested" | "high"])}`} disabled={paused}/></div><div className="venture-customer-signals"><p>{t("games.snack.customers")}</p>{customerSignals.map((customer) => <span key={customer.id} className={customer.buys ? "signal--ready" : "signal--cautious"}>{customer.emoji} {t(`games.snack.${customer.id}`)}</span>)}</div><button type="button" disabled={paused} onClick={() => setStage("results")} className="primary-action mt-6">{t("games.snack.open")} <Store size={17}/></button></>}{stage === "results" && <div className="venture-results"><div className="venture-metrics"><Metric label={t("games.snack.delivered")} value={`${delivered}/${stock}`}/><Metric label={t("games.snack.sold")} value={`${sold}`}/><Metric label={t("games.snack.revenue")} value={`$${revenue}`}/><Metric label={t("games.snack.cost")} value={`$${inventoryCost}`} accent="coral"/><Metric label={t("games.snack.profit")} value={`$${profit}`} accent={profit >= 0 ? "mint" : "coral"}/><Metric label={t("games.snack.leftover")} value={`${leftover}`} accent={leftover <= 4 ? "mint" : "coral"}/></div><p className="venture-insight">{t("games.snack.result", { delivered, sold, leftover })}</p><button type="button" disabled={paused} onClick={() => setStage("restock")} className="primary-action">{t("games.snack.restock")} <RefreshCcw size={17}/></button></div>}{stage === "restock" && <div className="venture-results"><p className="venture-insight">{t("games.snack.restock")}: {t("games.snack.reliability")} {supplier === "cheapSupplier" ? "75%" : "100%"}</p><div className="price-options"><button type="button" disabled={paused} onClick={() => setRestock(0)} className={restock === 0 ? "price-option--right" : ""}>{t("games.snack.noRestock")}</button><button type="button" disabled={paused} onClick={() => setRestock(4)} className={restock === 4 ? "price-option--right" : ""}>{t("games.snack.smallRestock")}</button><button type="button" disabled={paused} onClick={() => setRestock(8)} className={restock === 8 ? "price-option--right" : ""}>{t("games.snack.bigRestock")}</button></div><button type="button" disabled={paused} onClick={finish} className="primary-action mt-5">{t("games.snack.review")} <Trophy size={17}/></button></div>}</div></div>;
}

function TShirtTycoon({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [design, setDesign] = useState<"sporty" | "funny" | "premium">("sporty");
  const [audience, setAudience] = useState<"kids" | "athletes" | "gamers">("athletes");
  const [quality, setQuality] = useState<"basic" | "standard" | "premiumQuality">("standard");
  const [quantity, setQuantity] = useState<6 | 10 | 14>(10);
  const [priceBand, setPriceBand] = useState<"low" | "suggested" | "high">("suggested");
  const [launched, setLaunched] = useState(false);
  const match = (design === "sporty" && audience === "athletes") || (design === "funny" && (audience === "kids" || audience === "gamers")) || (design === "premium" && audience === "gamers");
  const baseDemand = match ? 12 : 5;
  const qualityBonus = quality === "premiumQuality" ? 2 : quality === "standard" ? 1 : 0;
  const pricePenalty = priceBand === "high" ? 3 : priceBand === "low" ? -1 : 0;
  const demand = Math.max(1, baseDemand + qualityBonus - pricePenalty);
  const sold = launched ? Math.min(quantity, demand) : 0;
  const leftover = launched ? quantity - sold : 0;
  const missed = launched ? Math.max(0, demand - quantity) : 0;
  const costPer = { basic: 4, standard: 6, premiumQuality: 8 }[quality];
  const sellingPrice = { low: 9, suggested: 12, high: 15 }[priceBand];
  const revenue = sold * sellingPrice;
  const cost = quantity * costPer;
  const profit = revenue - cost;
  const finish = () => {
    const achieved = match && profit >= 20 && leftover <= 4;
    const score = Math.max(0, Math.min(100, Math.round(30 + (match ? 25 : 0) + profit * 2 + sold * 2 - leftover * 4)));
    onEnd({ ...resultFor(achieved, score, t), message: t("games.tshirt.result", { design: t(`games.tshirt.${design}`), audience: t(`games.tshirt.${audience}`), sold, leftover, missed }) });
  };
  return <div className="game-stage venture-stage"><PlayHeader icon={BriefcaseBusiness}><p className="stage-kicker">{t("games.tshirt.objective")}</p><div className="stage-scoreline"><b>{t("games.tshirt.match")}: {match ? t("games.tshirt.greatFit") : t("games.tshirt.weakFit")}</b><span>{t("games.tshirt.profitPer")}: ${sellingPrice - costPer}</span></div></PlayHeader><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-tshirt-tycoon_780eac04.png" alt=""/><div><span>{t("games.tshirt.match")}</span><b>👕 {t("games.tshirt.objective")}</b></div></div>{!launched ? <><div className="venture-grid"><DecisionGroup title={t("games.tshirt.design")} value={design} onPick={(value) => setDesign(value as "sporty" | "funny" | "premium")} options={["sporty", "funny", "premium"]} label={(key) => t(`games.tshirt.${key}`)} disabled={paused}/><DecisionGroup title={t("games.tshirt.audience")} value={audience} onPick={(value) => setAudience(value as "kids" | "athletes" | "gamers")} options={["kids", "athletes", "gamers"]} label={(key) => t(`games.tshirt.${key}`)} disabled={paused}/><DecisionGroup title={t("games.tshirt.quality")} value={quality} onPick={(value) => setQuality(value as "basic" | "standard" | "premiumQuality")} options={["basic", "standard", "premiumQuality"]} label={(key) => `${t(`games.tshirt.${key}`)} · $${{ basic: 4, standard: 6, premiumQuality: 8 }[key as "basic" | "standard" | "premiumQuality"]}`} disabled={paused}/><DecisionGroup title={t("games.tshirt.quantity")} value={String(quantity)} onPick={(value) => setQuantity(Number(value) as 6 | 10 | 14)} options={["6", "10", "14"]} label={(key) => `${key} shirts`} disabled={paused}/><DecisionGroup title={t("games.tshirt.price")} value={priceBand} onPick={(value) => setPriceBand(value as "low" | "suggested" | "high")} options={["low", "suggested", "high"]} label={(key) => `${t(`games.tshirt.${key}`)} · $${{ low: 9, suggested: 12, high: 15 }[key as "low" | "suggested" | "high"]}`} disabled={paused}/></div><button type="button" disabled={paused} onClick={() => setLaunched(true)} className="primary-action mt-6">{t("games.tshirt.launch")} <TrendingUp size={17}/></button></> : <div className="venture-results"><div className="venture-metrics"><Metric label={t("games.tshirt.costPer")} value={`$${costPer}`}/><Metric label={t("games.tshirt.profitPer")} value={`$${sellingPrice - costPer}`}/><Metric label={t("games.tshirt.sold")} value={`${sold}/${quantity}`}/><Metric label={t("games.tshirt.missed")} value={`${missed}`} accent={missed <= 2 ? "mint" : "coral"}/><Metric label={t("games.tshirt.leftover")} value={`${leftover}`} accent={leftover <= 4 ? "mint" : "coral"}/><Metric label={t("games.tshirt.profit")} value={`$${profit}`} accent={profit >= 20 ? "mint" : "coral"}/></div><p className="venture-insight">{t("games.tshirt.result", { design: t(`games.tshirt.${design}`), audience: t(`games.tshirt.${audience}`), sold, leftover, missed })}</p><button type="button" disabled={paused} onClick={finish} className="primary-action">{t("games.tshirt.review")} <Trophy size={17}/></button></div>}</div></div>;
}

function PetShopManager({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [care, setCare] = useState<"essential" | "proactive">("proactive");
  const [staffing, setStaffing] = useState<"quick" | "attentive">("attentive");
  const [stage, setStage] = useState<"prepare" | "recommend" | "results">("prepare");
  const [recommendation, setRecommendation] = useState<"starterPlan" | "luxuryExtras" | "toyOnly" | null>(null);
  const careScore = care === "proactive" ? 100 : 72;
  const served = staffing === "attentive" ? 6 : 8;
  const careCost = care === "proactive" ? 7 : 4;
  const staffCost = staffing === "attentive" ? 6 : 3;
  const recommendationRevenue = recommendation === "starterPlan" ? 16 : recommendation === "luxuryExtras" ? 20 : 5;
  const trust = recommendation === "starterPlan" ? (care === "proactive" ? 100 : 88) : recommendation === "luxuryExtras" ? 42 : 30;
  const profit = recommendation ? recommendationRevenue + served * 2 - careCost - staffCost : 0;
  const finish = () => {
    const achieved = recommendation === "starterPlan" && careScore >= 72 && trust >= 85;
    const score = Math.max(0, Math.min(100, Math.round(trust * .6 + careScore * .25 + profit * 1.5)));
    onEnd({ ...resultFor(achieved, score, t), message: t("games.pet.result", { recommendation: recommendation ? t(`games.pet.${recommendation}`) : "", trust, profit }) });
  };
  return <div className="game-stage venture-stage"><PlayHeader icon={HeartHandshake}><p className="stage-kicker">{t("games.pet.objective")}</p><div className="stage-scoreline"><b>{t("games.pet.responsible")}</b><span>{t("games.pet.careScore")}: {careScore}%</span></div></PlayHeader><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-pet-shop-manager_8e2030bf.png" alt=""/><div><span>{t("games.pet.responsible")}</span><b>🐾 {t("games.pet.objective")}</b></div></div>{stage === "prepare" && <><div className="venture-grid"><DecisionGroup title={t("games.pet.care")} value={care} onPick={(value) => setCare(value as "essential" | "proactive")} options={["essential", "proactive"]} label={(key) => `${t(`games.pet.${key}`)} · $${key === "proactive" ? 7 : 4}`} disabled={paused}/><DecisionGroup title={t("games.pet.staffing")} value={staffing} onPick={(value) => setStaffing(value as "quick" | "attentive")} options={["quick", "attentive"]} label={(key) => `${t(`games.pet.${key}`)} · ${key === "attentive" ? "6" : "8"} visits`} disabled={paused}/></div><p className="venture-insight">{t("games.pet.puppyFamily")}</p><button type="button" disabled={paused} onClick={() => setStage("recommend")} className="primary-action mt-5">{t("games.pet.prepare")} <HeartHandshake size={17}/></button></>}{stage === "recommend" && <div className="venture-results"><p className="venture-insight">{t("games.pet.customer")}: {t("games.pet.puppyFamily")}</p><div className="choice-grid"><button type="button" disabled={paused} onClick={() => { setRecommendation("starterPlan"); setStage("results"); }} className="choice-button choice-button--need">🧺 {t("games.pet.starterPlan")}</button><button type="button" disabled={paused} onClick={() => { setRecommendation("luxuryExtras"); setStage("results"); }} className="choice-button choice-button--want">✨ {t("games.pet.luxuryExtras")}</button><button type="button" disabled={paused} onClick={() => { setRecommendation("toyOnly"); setStage("results"); }} className="choice-button choice-button--want">🧸 {t("games.pet.toyOnly")}</button></div></div>}{stage === "results" && <div className="venture-results"><div className="venture-metrics"><Metric label={t("games.pet.careScore")} value={`${careScore}%`} accent="mint"/><Metric label={t("games.pet.staff")} value={`${served}`}/><Metric label={t("games.pet.trust")} value={`${trust}%`} accent={trust >= 85 ? "mint" : "coral"}/><Metric label={t("games.pet.revenue")} value={`$${recommendationRevenue}`}/><Metric label={t("games.pet.costs")} value={`$${careCost + staffCost}`}/><Metric label={t("games.pet.profit")} value={`$${profit}`} accent={recommendation === "starterPlan" ? "mint" : "coral"}/></div><p className="venture-insight">{t("games.pet.result", { recommendation: recommendation ? t(`games.pet.${recommendation}`) : "", trust, profit })}</p><button type="button" disabled={paused} onClick={finish} className="primary-action">{t("games.pet.review")} <Trophy size={17}/></button></div>}</div></div>;
}

function MiniCafe({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation();
  const [menu, setMenu] = useState<("coffee" | "juice" | "sandwich" | "dessert")[]>(["coffee", "sandwich"]);
  const [stock, setStock] = useState<"small" | "medium" | "large">("medium");
  const [pricing, setPricing] = useState<"low" | "suggested" | "high">("suggested");
  const [staff, setStaff] = useState<"quick" | "balanced" | "careful">("balanced");
  const [stage, setStage] = useState<"setup" | "orders" | "event" | "results">("setup");
  const [orderIndex, setOrderIndex] = useState(0);
  const [fulfilled, setFulfilled] = useState(0);
  const [eventChoice, setEventChoice] = useState<"speed" | "quality" | "repair" | null>(null);
  const orders = ["coffee", "juice", "sandwich"] as const;
  const stockCount = { small: 5, medium: 8, large: 12 }[stock];
  const unitPrice = { low: 4, suggested: 5, high: 6 }[pricing];
  const baseCost = Math.round(stockCount * (menu.includes("sandwich") ? 1.8 : 1.3));
  const serveOrder = () => {
    if (orderIndex >= orders.length) return;
    if (menu.includes(orders[orderIndex])) setFulfilled((count) => count + 1);
    const next = orderIndex + 1;
    setOrderIndex(next);
    if (next === orders.length) setStage("event");
  };
  const served = Math.min(stockCount, fulfilled + (staff === "quick" ? 1 : 0) + (eventChoice === "speed" ? 1 : 0));
  const satisfaction = Math.max(15, Math.min(100, 38 + fulfilled * 16 + ({ quick: -10, balanced: 4, careful: 11 }[staff]) + ({ low: 5, suggested: 0, high: -12 }[pricing]) + ({ speed: -10, quality: 10, repair: 7 }[eventChoice ?? "speed"])));
  const eventCost = eventChoice === "repair" ? 5 : 0;
  const revenue = served * unitPrice;
  const waste = Math.max(0, stockCount - served - (eventChoice === "quality" ? 1 : 0));
  const cost = baseCost + eventCost;
  const profit = revenue - cost;
  const finish = () => {
    const achieved = fulfilled >= 2 && satisfaction >= 60 && profit >= 8;
    const score = Math.max(0, Math.min(100, Math.round(satisfaction * .45 + profit * 3 + fulfilled * 8 - waste * 3)));
    onEnd({ ...resultFor(achieved, score, t), message: t("games.cafe.result", { served, revenue, costs: cost, profit }) });
  };
  const toggleMenu = (item: "coffee" | "juice" | "sandwich" | "dessert") => {
    setMenu((current) => current.includes(item) ? (current.length > 1 ? current.filter((value) => value !== item) : current) : (current.length < 2 ? [...current, item] : current));
  };
  return <div className="game-stage venture-stage"><PlayHeader icon={ReceiptText}><p className="stage-kicker">{t("games.cafe.objective")}</p><div className="stage-scoreline"><b>{t("games.cafe.queue")}: {orderIndex}/{orders.length}</b><span>{t("games.cafe.satisfaction")}: {stage === "results" ? `${satisfaction}%` : "—"}</span></div></PlayHeader><div className="venture-board"><div className="venture-banner"><img src="/manus-storage/profitspatrol-mini-cafe_01d5224d.png" alt=""/><div><span>{t("games.cafe.menu")}</span><b>☕ {t("games.cafe.objective")}</b></div></div>{stage === "setup" && <><div className="decision-group"><p>{t("games.cafe.menu")} <span>2 max</span></p><div className="decision-options">{(["coffee", "juice", "sandwich", "dessert"] as const).map((item) => <button key={item} type="button" disabled={paused} onClick={() => toggleMenu(item)} className={menu.includes(item) ? "decision-option decision-option--selected" : "decision-option"}>{t(`games.cafe.${item}`)}</button>)}</div></div><div className="venture-grid"><DecisionGroup title={t("games.cafe.ingredients")} value={stock} onPick={(value) => setStock(value as "small" | "medium" | "large")} options={["small", "medium", "large"]} label={(key) => `${t(`games.cafe.${key}`)} · $${{ small: 8, medium: 14, large: 20 }[key as "small" | "medium" | "large"]}`} disabled={paused}/><DecisionGroup title={t("games.cafe.pricing")} value={pricing} onPick={(value) => setPricing(value as "low" | "suggested" | "high")} options={["low", "suggested", "high"]} label={(key) => `${t(`games.cafe.${key}`)} · $${{ low: 4, suggested: 5, high: 6 }[key as "low" | "suggested" | "high"]}`} disabled={paused}/><DecisionGroup title={t("games.cafe.staff")} value={staff} onPick={(value) => setStaff(value as "quick" | "balanced" | "careful")} options={["quick", "balanced", "careful"]} label={(key) => t(`games.cafe.${key}`)} disabled={paused}/></div><button type="button" disabled={paused} onClick={() => setStage("orders")} className="primary-action mt-6">{t("games.cafe.prepare")} <ReceiptText size={17}/></button></>}{stage === "orders" && <div className="venture-results"><p className="venture-insight">{t("games.cafe.orders")} · {orderIndex < orders.length ? t(`games.cafe.${orders[orderIndex]}`) : ""}</p><div className="venture-customer-signals"><p>{t("games.cafe.queue")}</p>{orders.map((order, index) => <span key={order} className={index < orderIndex ? (menu.includes(order) ? "signal--ready" : "signal--cautious") : ""}>{index < orderIndex ? "✓" : index === orderIndex ? "→" : "○"} {t(`games.cafe.${order}`)} {menu.includes(order) ? "" : ` · ${t("games.cafe.unavailable")}`}</span>)}</div><button type="button" disabled={paused} onClick={serveOrder} className="primary-action mt-5">{t("games.cafe.serve")} <ArrowRight size={17}/></button></div>}{stage === "event" && <div className="venture-results"><p className="venture-insight"><b>{t("games.cafe.rush")}</b> — {t("games.cafe.rushDescription")}</p><div className="choice-grid"><button type="button" disabled={paused} onClick={() => { setEventChoice("speed"); setStage("results"); }} className="choice-button choice-button--need">⚡ {t("games.cafe.speedResponse")}</button><button type="button" disabled={paused} onClick={() => { setEventChoice("quality"); setStage("results"); }} className="choice-button choice-button--need">✨ {t("games.cafe.qualityResponse")}</button><button type="button" disabled={paused} onClick={() => { setEventChoice("repair"); setStage("results"); }} className="choice-button choice-button--want">🛠️ {t("games.cafe.repairResponse")}</button></div></div>}{stage === "results" && <div className="venture-results"><div className="venture-metrics"><Metric label={t("games.cafe.revenue")} value={`$${revenue}`}/><Metric label={t("games.cafe.costs")} value={`$${cost}`} accent="coral"/><Metric label={t("games.cafe.profit")} value={`$${profit}`} accent={profit >= 8 ? "mint" : "coral"}/><Metric label={t("games.cafe.served")} value={`${served}`}/><Metric label={t("games.cafe.satisfaction")} value={`${satisfaction}%`} accent={satisfaction >= 60 ? "mint" : "coral"}/><Metric label={t("games.cafe.waste")} value={`${waste}`} accent={waste <= 4 ? "mint" : "coral"}/></div><div className="venture-insight"><b>{t("games.cafe.strongest")}:</b> {eventChoice === "repair" || eventChoice === "quality" ? t("games.cafe.queueFit") : t("games.cafe.menuFit")}<br/><b>{t("games.cafe.weakest")}:</b> {pricing === "high" ? t("games.cafe.priceWeak") : t("games.cafe.stockWeak")}</div><button type="button" disabled={paused} onClick={finish} className="primary-action">{t("games.cafe.close")} <Trophy size={17}/></button></div>}</div></div>;
}

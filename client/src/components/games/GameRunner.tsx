/** Design reminder: Every interaction is a tangible money decision with immediate feedback inside one playful business-adventure world. */
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CircleDollarSign, Coins, HandCoins, HeartHandshake, Lightbulb, Minus, Plus, ReceiptText, RotateCcw, Route, ShieldCheck, Sparkles, Store, Target, TrendingUp, Trophy, WalletCards, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { GameId } from "@/lib/game-registry";
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
  const { t } = useTranslation(); const rounds = [{ price: 13, paid: 20 }, { price: 28, paid: 50 }, { price: 34, paid: 50 }]; const pieces = [1, 2, 5, 10, 20];
  const [round, setRound] = useState(0); const [picked, setPicked] = useState<number[]>([]); const [correct, setCorrect] = useState(0); const [note, setNote] = useState(""); const current = rounds[round]; const due = current.paid - current.price; const total = picked.reduce((sum, value) => sum + value, 0);
  const addPiece = (value: number) => { if (!paused) { setPicked((list) => [...list, value]); setNote(""); } }; const removePiece = (index: number) => { if (!paused) setPicked((list) => list.filter((_, itemIndex) => itemIndex !== index)); };
  const check = () => { if (paused) return; if (total !== due) { setNote(t("common.tryAgain")); return; } const next = correct + 1; if (round === 2) onEnd(resultFor(true, 52 + next * 16, t)); else { setCorrect(next); setRound((value) => value + 1); setPicked([]); setNote(t("common.correct")); } };
  return <div className="game-stage"><PlayHeader icon={ReceiptText}><p className="stage-kicker">{t("games.change.checkout", { current: round + 1 })}</p><div className="stage-scoreline"><b>{t("games.change.changeDue")}: ${due}</b><span>{t("games.change.selected")}: ${total}</span></div></PlayHeader><div className="change-board"><div className="checkout-receipt"><div><span>{t("games.change.price")}</span><b>${current.price}</b></div><div><span>{t("games.change.paid")}</span><b>${current.paid}</b></div><div className="checkout-receipt__due"><span>{t("games.change.changeDue")}</span><b>${due}</b></div></div><div className="change-composer"><div className="selected-change">{picked.length ? picked.map((value, index) => <button type="button" onClick={() => removePiece(index)} key={`${value}-${index}`}>${value}</button>) : <span>—</span>}</div><div className="money-pieces">{pieces.map((value) => <button key={value} type="button" disabled={paused} onClick={() => addPiece(value)} className="money-piece"><span>${value}</span></button>)}</div><div className="mt-6 flex justify-center gap-3"><button type="button" disabled={paused} onClick={() => setPicked([])} className="secondary-action"><RotateCcw size={16}/>{t("common.retry")}</button><button type="button" disabled={paused} onClick={check} className="primary-action">{t("common.check")} <HandCoins size={17}/></button></div>{note && <p className="answer-inline">{note}</p>}</div></div></div>;
}

function PriceDetective({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation(); const rounds = [{ a: { price: 5, units: 4, fee: 0 }, b: { price: 7, units: 6, fee: 0 }, best: "b" }, { a: { price: 8, units: 8, fee: 1 }, b: { price: 6, units: 5, fee: 0 }, best: "a" }, { a: { price: 12, units: 12, fee: 0 }, b: { price: 9, units: 8, fee: 0 }, best: "a" }]; const [round, setRound] = useState(0); const [correct, setCorrect] = useState(0); const [answer, setAnswer] = useState<"a" | "b" | null>(null); const current = rounds[round];
  const choose = (choice: "a" | "b") => { if (paused || answer) return; setAnswer(choice); };
  const next = () => { if (!answer) return; const wasCorrect = answer === current.best; const totalCorrect = correct + (wasCorrect ? 1 : 0); if (round === 2) onEnd(resultFor(totalCorrect >= 2, totalCorrect * 33, t)); else { setCorrect(totalCorrect); setRound((value) => value + 1); setAnswer(null); } };
  const offer = (key: "a" | "b") => { const item = current[key]; const unit = (item.price + item.fee) / item.units; const picked = answer === key; const isRight = key === current.best; return <button type="button" disabled={paused || !!answer} onClick={() => choose(key)} className={`offer-card ${picked ? (isRight ? "offer-card--right" : "offer-card--wrong") : ""}`}><p>{t("games.detective.offer", { letter: key.toUpperCase() })}</p><b>${item.price}</b><span>{item.units} {t("games.detective.unit")}</span>{item.fee > 0 && <small>{t("games.detective.fee")}: ${item.fee}</small>}<strong>${unit.toFixed(2)} {t("games.detective.unit")}</strong></button>; };
  const isCorrect = answer === current.best;
  return <div className="game-stage"><PlayHeader icon={Lightbulb}><p className="stage-kicker">{t("games.detective.choose")}</p><div className="stage-scoreline"><b>{round + 1}/3</b><span>{t("games.detective.skill")}</span></div></PlayHeader><div className="detective-board"><div className="offer-grid">{offer("a")}{offer("b")}</div>{answer && <div className={`answer-note ${isCorrect ? "answer-note--right" : "answer-note--wrong"}`}><b>{isCorrect ? t("common.correct") : t("common.tryAgain")}</b><p>{t("games.detective.unit")}</p><button type="button" className="primary-action" onClick={next}>{round === 2 ? t("common.check") : t("common.next")} <ArrowRight size={17}/></button></div>}</div></div>;
}

function DiscountDash({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t } = useTranslation(); const rounds = [{ original: 50, sale: "20%", options: [40, 30, 35], correct: 40 }, { original: 80, sale: "25%", options: [60, 55, 65], correct: 60 }, { original: 100, sale: "20% → 10%", options: [70, 72, 80], correct: 72 }]; const [round, setRound] = useState(0); const [correct, setCorrect] = useState(0); const [answer, setAnswer] = useState<number | null>(null); const current = rounds[round];
  const choose = (choice: number) => { if (!paused && answer === null) setAnswer(choice); }; const next = () => { if (answer === null) return; const did = answer === current.correct; const total = correct + (did ? 1 : 0); if (round === 2) onEnd(resultFor(total >= 2, total * 33, t)); else { setCorrect(total); setRound((value) => value + 1); setAnswer(null); } }; const ok = answer === current.correct;
  return <div className="game-stage"><PlayHeader icon={TrendingUp}><p className="stage-kicker">{t("games.discount.choose")}</p><div className="stage-scoreline"><b>{round + 1}/3</b><span>{t("games.discount.skill")}</span></div></PlayHeader><div className="discount-board"><div className="sale-ticket"><span>{t("games.discount.original")}</span><b>${current.original}</b><i>{t("games.discount.sale")} {current.sale}</i></div><div className="price-options">{current.options.map((option) => <button key={option} type="button" disabled={paused || answer !== null} onClick={() => choose(option)} className={answer === option ? (ok ? "price-option--right" : "price-option--wrong") : ""}>${option}</button>)}</div>{answer !== null && <div className={`answer-note ${ok ? "answer-note--right" : "answer-note--wrong"}`}><b>{ok ? t("common.correct") : t("common.tryAgain")}</b><p>{current.sale}</p><button type="button" className="primary-action" onClick={next}>{round === 2 ? t("common.check") : t("common.next")} <ArrowRight size={17}/></button></div>}</div></div>;
}

function CashFlowRunner({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const isArabic = i18n.language.startsWith("ar");
  const text = isArabic ? { safe: "طلب نقدي اليوم", invoice: "فاتورة تُدفع لاحقاً", restock: "أعد التخزين الآن", delay: "أجّل المخزون", repair: "أصلح الجهاز", patch: "ترقيع مؤقت", marketing: "عرض سريع للعملاء", reserve: "احفظ النقد للطوارئ" } : { safe: "Take a cash order today", invoice: "Invoice a bigger order later", restock: "Restock for this week", delay: "Delay restocking", repair: "Repair the machine", patch: "Use a short-term patch", marketing: "Run a quick customer offer", reserve: "Keep a cash reserve" };
  const weeks = [{ choices: [{ label: text.safe, cash: 20, profit: 20 }, { label: text.invoice, cash: 0, profit: 30, due: 2 }] }, { choices: [{ label: text.restock, cash: -15, profit: 10 }, { label: text.delay, cash: 0, profit: 0 }] }, { choices: [{ label: text.repair, cash: -18, profit: 0 }, { label: text.patch, cash: -5, profit: 0 }] }, { choices: [{ label: text.marketing, cash: -8, profit: 22 }, { label: text.reserve, cash: 0, profit: 6 }] }];
  const [week, setWeek] = useState(0); const [cash, setCash] = useState(35); const [profit, setProfit] = useState(0); const [pending, setPending] = useState<Array<{ due: number; amount: number }>>([]); const [note, setNote] = useState("");
  const choose = (choice: { label: string; cash: number; profit: number; due?: number }) => { if (paused) return; const collected = pending.filter((item) => item.due === week).reduce((sum, item) => sum + item.amount, 0); const remaining = pending.filter((item) => item.due !== week); const nextCash = cash + choice.cash + collected; const nextProfit = profit + choice.profit; const nextPending = choice.due ? [...remaining, { due: choice.due, amount: choice.profit }] : remaining; setCash(nextCash); setProfit(nextProfit); setPending(nextPending); setNote(collected ? `+$${collected}` : ""); if (nextCash < 0) { onEnd(resultFor(false, Math.max(0, nextProfit), t)); return; } if (week === 3) { onEnd(resultFor(nextCash > 0 && nextProfit >= 20, Math.min(100, nextCash + nextProfit * 2), t)); return; } setWeek((value) => value + 1); };
  return <div className="game-stage"><PlayHeader icon={Store}><p className="stage-kicker">{t("games.cashflow.week", { current: week + 1 })}</p><div className="stage-scoreline"><b>{t("games.cashflow.cash")}: ${cash}</b><span>{t("games.cashflow.profit")}: ${profit}</span></div></PlayHeader><div className="cashflow-board"><div className="cashflow-visual"><img src="/manus-storage/profitspatrol-cashflow-scene_86e90589.png" alt=""/><div className="cash-bubble">{note || `$${cash}`}</div></div><p className="cashflow-question">{t("games.cashflow.choose")}</p><div className="cash-choices">{weeks[week].choices.map((choice) => <button type="button" key={choice.label} disabled={paused} onClick={() => choose(choice)}><strong>{choice.label}</strong><span>{choice.cash >= 0 ? "+" : ""}${choice.cash} {t("games.cashflow.cash")}</span><small>{choice.profit >= 0 ? "+" : ""}${choice.profit} {t("games.cashflow.profit")}</small></button>)}</div></div></div>;
}

function MoneyMaze({ paused, onEnd }: Omit<Props, "gameId">) {
  const { t, i18n } = useTranslation(); const ar = i18n.language.startsWith("ar"); const copy = ar ? { save: "ضع 15$ في الادخار", invest: "جرّب فرصة المتجر الصغير", guard: "احتفظ بصندوق للطوارئ", skill: "استثمر في مهارة جديدة", strong: "طريق آمن", chance: "طريق فرصة" } : { save: "Put $15 into savings", invest: "Try the tiny shop opportunity", guard: "Keep an emergency fund", skill: "Invest in a new skill", strong: "Safe route", chance: "Opportunity route" };
  const [step, setStep] = useState(0); const [cash, setCash] = useState(50); const [savings, setSavings] = useState(20); const [risk, setRisk] = useState(0); const [route, setRoute] = useState(""); const [event, setEvent] = useState<number | null>(null);
  const decide = (choice: "save" | "invest" | "guard" | "skill") => { if (paused) return; if (choice === "save") { setCash((value) => value - 15); setSavings((value) => value + 15); setRoute(copy.strong); } if (choice === "invest") { setCash((value) => value - 20); setRisk((value) => value + 2); setRoute(copy.chance); } if (choice === "guard") { setCash((value) => value - 10); setSavings((value) => value + 10); } if (choice === "skill") { setCash((value) => value - 15); setRisk((value) => Math.max(0, value - 1)); } setStep((value) => value + 1); };
  const reveal = () => { if (paused || event !== null) return; const roll = Math.random() >= .5 ? 15 : -8; setEvent(roll); const finalCash = cash + roll; const achieved = finalCash + savings >= 55 && finalCash >= 0; onEnd(resultFor(achieved, Math.min(100, finalCash + savings + (risk ? 5 : 15)), t)); };
  return <div className="game-stage"><PlayHeader icon={Route}><p className="stage-kicker">{step < 2 ? t("games.maze.objective") : t("games.maze.fairEvent")}</p><div className="stage-scoreline"><b>{t("games.maze.cash")}: ${cash}</b><span>{t("games.maze.savings")}: ${savings}</span><span>{t("games.maze.risk")}: {risk}</span></div></PlayHeader><div className="maze-board"><div className="maze-path"><i/><i/><i/><span className="maze-marker">{step === 0 ? "01" : step === 1 ? "02" : "★"}</span></div>{step === 0 && <div className="maze-choices"><button type="button" disabled={paused} onClick={() => decide("save")}><ShieldCheck/><span>{copy.save}</span></button><button type="button" disabled={paused} onClick={() => decide("invest")}><TrendingUp/><span>{copy.invest}</span></button></div>}{step === 1 && <div className="maze-choices"><button type="button" disabled={paused} onClick={() => decide("guard")}><WalletCards/><span>{copy.guard}</span></button><button type="button" disabled={paused} onClick={() => decide("skill")}><Lightbulb/><span>{copy.skill}</span></button></div>}{step === 2 && <div className="fair-event"><p>{route}</p><button type="button" disabled={paused || event !== null} onClick={reveal} className="primary-action">{t("games.maze.flip")} <Sparkles size={17}/></button></div>}</div></div>;
}

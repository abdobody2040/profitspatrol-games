/** Design reminder: This hub is a tactile business-neighborhood map with coral decision points and playful asymmetric motion. */
import { motion } from "framer-motion";
import { BadgePercent, CircleDollarSign, Coins, MapPinned, PiggyBank, ReceiptText, Route, Search, Shapes, Store, Target, WalletCards } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GAME_REGISTRY, type GameDefinition, type GameId } from "@/lib/game-registry";
import { useGameProgress } from "@/store/game-progress";

type Props = { onSelect: (id: GameId) => void };

const ICONS = { coins: Coins, shapes: Shapes, piggy: PiggyBank, wallet: WalletCards, target: Target, receipt: ReceiptText, search: Search, badge: BadgePercent, store: Store, route: Route };
const LANDMARKS = ["Coin Park", "Choice Corner", "Mint Market", "Budget Plaza", "Goal Track", "Change Counter", "Value Lookout", "Sale Street", "Shop Square", "Decision Garden"];
const STATION_TONES = ["coral", "navy", "navy", "coral", "mint", "coral", "navy", "coral", "navy", "mint"];

function StationCard({ game, onSelect }: { game: GameDefinition; onSelect: (id: GameId) => void }) {
  const { t, i18n } = useTranslation();
  const progress = useGameProgress((state) => state.games[game.id]);
  const Icon = ICONS[game.icon];
  const stars = progress?.stars ?? 0;
  const index = Number(game.number) - 1;
  const isArabic = i18n.language.startsWith("ar");
  const moveCopy = isArabic ? "اختر الحركة وشاهد أثرها" : "Pick the move. Watch the shop react.";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Number(game.number) * 0.028 }}
      className={`route-stop route-stop--${game.number} station-stop station-stop--${STATION_TONES[index]} group relative`}
      style={{ "--station": game.accent } as React.CSSProperties}
    >
      <span className="station-stop__sidewalk" aria-hidden="true" />
      <span className="station-stop__coin" aria-hidden="true">$</span>
      {game.image ? <img src={game.image} alt="" className="station-stop__image" /> : <div className="station-stop__pattern" aria-hidden="true"><span /><span /><span /></div>}
      <div className="station-stop__shade" />
      <div className="relative z-10 flex min-h-[255px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="station-number">{game.number}</span>
          <div className="station-stop__landmark"><Icon size={21} strokeWidth={2.4} /></div>
        </div>
        <div>
          <p className="station-stop__sign">{isArabic ? `محطة ${game.number}` : LANDMARKS[index]}</p>
          <div className="mb-2 flex items-center gap-1 text-sm" aria-label={`${stars} ${t("common.stars")}`}>
            {[1, 2, 3].map((star) => <span key={star} className={star <= stars ? "text-[#ffc84d]" : "text-white/50"}>★</span>)}
          </div>
          <h3 className="font-display text-2xl leading-none text-white">{t(game.titleKey)}</h3>
          <p className="mt-2 text-sm leading-5 text-white/88">{moveCopy}</p>
          <button type="button" onClick={() => onSelect(game.id)} className="station-play mt-4">
            {progress?.completed ? t("hub.replay") : t("common.play")} <span className="station-stop__next">{progress?.completed ? "↻" : "→"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function GameHub({ onSelect }: Props) {
  const { t, i18n } = useTranslation();
  const xp = useGameProgress((state) => state.xp);
  const coins = useGameProgress((state) => state.coins);
  const games = useGameProgress((state) => state.games);
  const completeCount = GAME_REGISTRY.filter((game) => games[game.id]?.completed).length;
  const toggleLanguage = () => void i18n.changeLanguage(i18n.language.startsWith("ar") ? "en" : "ar");

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f1e8] text-[#102b4b]">
      <section className="hero-neighborhood relative isolate overflow-hidden px-4 pb-16 pt-5 sm:px-6 lg:px-10">
        <div className="hero-neighborhood__image" />
        <div className="hero-neighborhood__veil" />
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/profitspatrol-compass-coin-logo_eaaf0464.png" alt="ProfitsPatrol" className="h-12 w-12 object-contain" />
            <div><p className="font-display text-xl leading-none text-white">ProfitsPatrol</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/70">KidCap HQ</p></div>
          </div>
          <button type="button" onClick={toggleLanguage} className="language-toggle">{t("common.language")}</button>
        </header>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 pb-4 pt-16 lg:grid-cols-[minmax(0,0.78fr)_330px] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 font-bold uppercase tracking-[0.17em] text-[#ffd765]">{t("hub.eyebrow")}</p>
            <h1 className="font-display text-5xl leading-[0.9] text-white sm:text-6xl lg:text-7xl">{t("hub.title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-white/86">{t("hub.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#stations" className="hero-cta">{t("hub.route")} <span aria-hidden="true">↓</span></a>
              <span className="hero-chip"><MapPinned size={17} /> {t("hub.stations")}</span>
            </div>
          </div>
          <aside className="profile-pocket" aria-label={t("hub.profile")}>
            <div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#54708d]">{t("hub.profile")}</p><span className="status-dot" /></div>
            <p className="mt-3 font-display text-3xl text-[#102b4b]">{completeCount}/10 <span className="font-sans text-sm font-bold text-[#54708d]">{t("common.completed")}</span></p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="profile-stat"><span><Target size={17} /> {t("common.xp")}</span><b>{xp}</b></div>
              <div className="profile-stat"><span><CircleDollarSign size={17} /> {t("common.coins")}</span><b>{coins}</b></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#54708d]">{t("hub.saved")}</p>
          </aside>
        </div>
      </section>

      <section id="stations" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="relative z-10 mb-9 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#f26545]">{t("hub.mapLabel")}</p><h2 className="mt-1 font-display text-4xl text-[#102b4b]">{t("hub.ready")}</h2></div>
          <div className="route-status"><MapPinned size={18}/><span>{completeCount}/10</span><small>{i18n.language.startsWith("ar") ? "محطات على الطريق" : "stops on your route"}</small></div>
        </div>
        <div className="neighborhood-map" role="list" aria-label={t("hub.stations")}>
          <svg className="neighborhood-route" viewBox="0 0 1200 1490" preserveAspectRatio="none" aria-hidden="true"><path d="M130 135 C 315 90 410 330 590 300 S 905 80 1040 190 C 1175 300 1020 475 860 520 S 600 660 450 610 C 240 540 120 760 245 875 S 590 930 670 1060 C 760 1205 1040 1120 1065 1285" /></svg>
          <span className="map-prop map-prop--plaza" aria-hidden="true">◌</span><span className="map-prop map-prop--store" aria-hidden="true">⌂</span><span className="map-prop map-prop--trees" aria-hidden="true">✦</span><span className="map-prop map-prop--receipt" aria-hidden="true">▤</span>
          {GAME_REGISTRY.map((game) => <StationCard key={game.id} game={game} onSelect={onSelect} />)}
        </div>
      </section>
    </main>
  );
}

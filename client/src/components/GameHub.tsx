/** Design reminder: This hub is a tactile business-neighborhood map with coral decision points and playful asymmetric motion. */
import { motion } from "framer-motion";
import { BadgePercent, CircleDollarSign, Coins, MapPinned, PiggyBank, ReceiptText, Route, Search, Shapes, Store, Target, WalletCards } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GAME_REGISTRY, type GameDefinition, type GameId } from "@/lib/game-registry";
import { useGameProgress } from "@/store/game-progress";
import "./batch08-map.css";

type Props = { onSelect: (id: GameId) => void };

const ICONS = { coins: Coins, shapes: Shapes, piggy: PiggyBank, wallet: WalletCards, target: Target, receipt: ReceiptText, search: Search, badge: BadgePercent, store: Store, route: Route };
const LANDMARKS = [
  { en: "Coin Park", ar: "حديقة العملات", cue: "park", action: "Catch smart coins; keep waste receipts away.", actionAr: "التقط العملات الذكية وأبعد إيصالات الهدر." },
  { en: "Choice Corner", ar: "زاوية الاختيار", cue: "corner", action: "Sort a real-life choice before the shop responds.", actionAr: "صنّف الاختيار الواقعي قبل أن يتفاعل الحي." },
  { en: "Mint Market", ar: "سوق النعناع", cue: "market", action: "Build the exact amount to open the market gate.", actionAr: "كوّن المبلغ الدقيق لفتح بوابة السوق." },
  { en: "Budget Plaza", ar: "ساحة الميزانية", cue: "plaza", action: "Give every dollar a job before the week begins.", actionAr: "امنح كل دولار مهمة قبل بداية الأسبوع." },
  { en: "Goal Track", ar: "مسار الهدف", cue: "track", action: "Choose today’s move and watch your goal get closer.", actionAr: "اختر حركة اليوم وشاهد هدفك يقترب." },
  { en: "Change Counter", ar: "كاونتر الباقي", cue: "counter", action: "Return the exact change before the checkout clock runs out.", actionAr: "أعد الباقي الدقيق قبل انتهاء وقت الدفع." },
  { en: "Value Lookout", ar: "مرصد القيمة", cue: "lookout", action: "Compare the labels to reveal the better value.", actionAr: "قارن الملصقات لاكتشاف القيمة الأفضل." },
  { en: "Sale Street", ar: "شارع التخفيضات", cue: "street", action: "Follow each discount step to find the real final price.", actionAr: "اتبع كل خطوة خصم للوصول إلى السعر النهائي الحقيقي." },
  { en: "Shop Square", ar: "ساحة المتاجر", cue: "square", action: "Balance bills, income, and late payments to keep doors open.", actionAr: "وازن الفواتير والدخل والدفعات المتأخرة لإبقاء المتجر مفتوحاً." },
  { en: "Decision Garden", ar: "حديقة القرارات", cue: "garden", action: "Choose a route, prepare for chance, and grow your next move.", actionAr: "اختر مسارك واستعد للمفاجآت ونمِّ خطوتك التالية." },
  { en: "Sunbeam Market", ar: "سوق الشمس", cue: "bazaar", action: "Mix a plan, set a fair price, and turn a warm day into profit.", actionAr: "اخلط خطة، وضع سعراً عادلاً، وحوّل اليوم الدافئ إلى ربح." },
  { en: "Commerce Lane", ar: "ممر التجارة", cue: "commerce", action: "Choose stock and a supplier before the neighborhood rush.", actionAr: "اختر المخزون والمورّد قبل زحام الحي." },
  { en: "Fashion Foundry", ar: "مشغل الأزياء", cue: "fashion", action: "Match a design to its crowd, then protect your unit profit.", actionAr: "طابق التصميم مع جمهوره، ثم احمِ ربح القطعة." },
  { en: "Community Care", ar: "رعاية المجتمع", cue: "community", action: "Build trust through responsible care and useful advice.", actionAr: "ابنِ الثقة بالرعاية المسؤولة والنصيحة المفيدة." },
  { en: "Downtown Café", ar: "مقهى الوسط", cue: "cafe", action: "Keep the counter moving when the lunch rush arrives.", actionAr: "حافظ على حركة الكاونتر عند وصول زحام الغداء." },
  { en: "Creative Corner", ar: "زاوية الإبداع", cue: "creative", action: "Match a helpful message to people who will value the offer.", actionAr: "طابق رسالة مفيدة مع أشخاص سيقدرون العرض." },
  { en: "Customer Market", ar: "سوق الزبون", cue: "customer", action: "Listen carefully, inspect the fit, and recommend what truly helps.", actionAr: "استمع جيداً، وافحص الملاءمة، واقترح ما يساعد فعلاً." },
  { en: "Trust Terrace", ar: "مصطبة الثقة", cue: "sales", action: "Listen before you recommend, then make the helpful match.", actionAr: "استمع قبل أن تقترح، ثم قدّم الاختيار المفيد." },
  { en: "Identity Studio", ar: "استوديو الهوية", cue: "brand", action: "Shape a promise your neighborhood can recognise and trust.", actionAr: "اصنع وعداً يتعرف إليه الحي ويثق به." },
  { en: "Launch Plaza", ar: "ساحة الإطلاق", cue: "mix", action: "Balance the four Ps and give your launch a fair start.", actionAr: "وازن عناصر 4Ps وامنح إطلاقك بداية عادلة." },
  { en: "Explorer Island", ar: "جزيرة المستكشف", cue: "island", action: "Research changing fictional places, then spread your explorer tokens thoughtfully.", actionAr: "ابحث في مواقع خيالية متغيرة، ثم وزّع رموز المستكشف بتفكير." },
  { en: "Signal Station", ar: "محطة الإشارات", cue: "radar", action: "Scan the risk, judge its impact, and prepare a fair response.", actionAr: "افحص الخطر، وقدّر أثره، وجهّز استجابة مناسبة." },
  { en: "Mix Market", ar: "سوق المزيج", cue: "portfolio", action: "Build a fictional district mix and discover how one event can travel.", actionAr: "ابنِ مزيج مناطق خيالية واكتشف كيف قد ينتقل أثر حدث واحد." },
  { en: "Summit Trail", ar: "مسار القمة", cue: "mountain", action: "Compare fictional mountain paths where time and steady steps can matter.", actionAr: "قارن مسارات جبل خيالية حيث قد يؤثر الوقت والخطوات المنتظمة." },
  { en: "Safe Signal Lab", ar: "مختبر الإشارة الآمنة", cue: "detective", action: "Inspect fictional messages, pause, and choose a protective next step.", actionAr: "افحص رسائل خيالية، وتوقف، واختر خطوة حماية تالية." },
  { en: "Clockwork Corner", ar: "زاوية الساعة", cue: "time", action: "Prioritize a limited day, protect what matters, and review the trade-offs.", actionAr: "رتّب يوماً محدوداً، واحمِ ما يهم، وراجع المفاضلات." },
  { en: "Teamwork Yard", ar: "ساحة الفريق", cue: "team", action: "Match strengths to roles, then adapt together when the plan changes.", actionAr: "طابق نقاط القوة مع الأدوار، ثم تكيّفوا معاً عند تغيّر الخطة." },
  { en: "Supply Depot", ar: "مستودع الإمداد", cue: "supply", action: "Balance demand, delivery, capacity, and disruption before customers arrive.", actionAr: "وازن الطلب والتسليم والسعة والتعطل قبل وصول العملاء." },
  { en: "Stockroom Square", ar: "ساحة المخزون", cue: "inventory", action: "Read demand, stock the shelf, and learn from both shortages and extras.", actionAr: "اقرأ الطلب، وجهّز الرف، وتعلم من النقص والزيادة معاً." },
  { en: "Crisis Control", ar: "مركز إدارة الأزمة", cue: "crisis", action: "Inspect the evidence, locate the cause, and test a steady recovery plan.", actionAr: "افحص الأدلة، وحدد السبب، واختبر خطة تعافٍ ثابتة." },
  { en: "Idea Workshop", ar: "ورشة الأفكار", cue: "idea", action: "Match a real customer problem to a useful idea, then improve the first version.", actionAr: "طابق مشكلة عميل واقعية مع فكرة مفيدة، ثم حسّن النسخة الأولى." },
  { en: "Product Pavilion", ar: "جناح المنتجات", cue: "product", action: "Balance features, quality, and access before sending a product to the lab test.", actionAr: "وازن المزايا والجودة وسهولة الوصول قبل إرسال المنتج لاختبار المختبر." },
  { en: "Prototype Garage", ar: "مرآب النموذج", cue: "prototype", action: "Build with limited parts, test the prototype, and fix what matters most.", actionAr: "ابنِ بقطع محدودة، واختبر النموذج، وأصلح ما يهم أكثر." },
  { en: "Listening Lounge", ar: "صالة الاستماع", cue: "feedback", action: "Sort fictional customer signals, spot a pattern, and choose a useful update.", actionAr: "صنّف إشارات العملاء الخيالية، واكتشف نمطاً، واختر تحديثاً مفيداً." },
  { en: "Innovation Summit", ar: "قمة الابتكار", cue: "challenge", action: "Research, prototype, test, and pitch a thoughtful solution under real constraints.", actionAr: "ابحث، وصمّم نموذجاً، واختبر، وقدّم حلاً مدروساً ضمن قيود حقيقية." },
  { en: "Harmony Hall", ar: "قاعة التفاهم", cue: "negotiation", action: "Balance the terms, hear the other side, and choose a fair deal or a wise walk-away.", actionAr: "وازن الشروط، واستمع للطرف الآخر، واختر اتفاقاً عادلاً أو انسحاباً حكيماً." },
  { en: "Captain Court", ar: "ساحة القائد", cue: "captain", action: "Match team strengths to meaningful work, then rebalance the plan when morale changes.", actionAr: "طابق نقاط قوة الفريق مع العمل المفيد، ثم أعد توازن الخطة عند تغير المعنويات." },
  { en: "Partner Plaza", ar: "ساحة الشراكة", cue: "deal", action: "Inspect every fictional term, compare trade-offs, and accept only a responsible partnership.", actionAr: "افحص كل شرط خيالي، وقارن المفاضلات، واقبل شراكة مسؤولة فقط." },
  { en: "Clear Message Studio", ar: "استوديو الرسالة الواضحة", cue: "communication", action: "Shape a message for its audience, listen for confusion, and improve the next version.", actionAr: "صغ رسالة لجمهورها، واستمع لمواضع الالتباس، وحسّن النسخة التالية." },
  { en: "Leadership Lookout", ar: "مرصد القيادة", cue: "leadership", action: "Read the situation, guide a fictional team with care, and adapt when the work changes.", actionAr: "اقرأ الموقف، وقد فريقاً خيالياً بعناية، وتكيّف عند تغير العمل." },
];
const STATION_TONES = ["coral", "navy", "navy", "coral", "mint", "coral", "navy", "coral", "navy", "mint", "coral", "navy", "coral", "mint", "navy", "coral", "mint", "coral", "navy", "mint", "mint", "navy", "coral", "navy", "coral", "coral", "mint", "navy", "mint", "coral", "coral", "mint", "navy", "coral", "mint", "coral", "mint", "navy", "coral", "mint"];
const ROUTE_PATH = "M175 145 C330 150 365 345 535 365 S815 505 975 595 L975 900 C820 930 720 1095 555 1115 S340 1215 190 1310 L190 1590 C340 1610 385 1770 555 1800 S825 1905 975 1990 L975 2260 C825 2300 720 2420 555 2490 S345 2640 190 2700 L190 2960 C330 2980 400 3115 555 3170 S825 3300 975 3390 L975 3660 C825 3700 720 3820 555 3890 S830 4030 975 4110 S725 4235 555 4300 S350 4420 190 4485 L190 4740 C340 4765 390 4890 555 4960 S830 5090 975 5175 L975 5450 C825 5475 720 5590 555 5640 S350 5730 190 5770 L190 6040 C340 6060 400 6165 555 6210 S825 6340 975 6380 L975 6650 C825 6680 720 6780 555 6840 S340 6950 190 7020 L190 7285 C335 7310 395 7425 555 7485 S825 7610 975 7680 L975 7950 C825 7980 720 8090 555 8150 S340 8260 190 8325 L190 8590 C340 8610 400 8720 555 8780";
const ROUTE_PINS = [[175,145],[535,365],[975,595],[975,900],[555,1115],[190,1310],[190,1590],[555,1800],[975,1990],[975,2260],[555,2490],[190,2700],[190,2960],[555,3170],[975,3390],[975,3660],[555,3890],[975,4110],[555,4300],[190,4485],[190,4740],[555,4960],[975,5175],[975,5450],[555,5640],[190,5770],[190,6040],[555,6210],[975,6380],[975,6650],[555,6840],[190,7020],[190,7285],[555,7485],[975,7680],[975,7950],[555,8150],[190,8325],[190,8590],[555,8780]];

function StationCard({ game, onSelect }: { game: GameDefinition; onSelect: (id: GameId) => void }) {
  const { t, i18n } = useTranslation();
  const progress = useGameProgress((state) => state.games[game.id]);
  const Icon = ICONS[game.icon];
  const stars = progress?.stars ?? 0;
  const index = Number(game.number) - 1;
  const isArabic = i18n.language.startsWith("ar");
  const landmark = LANDMARKS[index];
  const moveCopy = isArabic ? landmark.actionAr : landmark.action;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Number(game.number) * 0.028 }}
      className={`route-stop route-stop--${game.number} group relative`}
      style={{ "--station": game.accent } as React.CSSProperties}
    >
      <span className="station-stop__anchor" aria-hidden="true" />
      <div className={`station-stop station-stop--${STATION_TONES[index]} station-stop--${landmark.cue} relative h-full`}>
        <span className="station-stop__sidewalk" aria-hidden="true" />
        <span className="station-stop__coin" aria-hidden="true">$</span>
        <span className="station-stop__awning" aria-hidden="true" />
        <span className="station-stop__facade" aria-hidden="true"><i /><i /><i /></span>
        <span className="station-stop__prop" aria-hidden="true" />
        {game.image ? <img src={game.image} alt="" className="station-stop__image" /> : <div className="station-stop__pattern" aria-hidden="true"><span /><span /><span /></div>}
        <div className="station-stop__shade" />
        <div className="relative z-10 flex min-h-[255px] flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-4">
            <span className="station-number">{game.number}</span>
            <div className="station-stop__landmark"><Icon size={21} strokeWidth={2.4} /></div>
          </div>
          <div>
            <div className="station-stop__signboard">
              <p className="station-stop__sign">{landmark[isArabic ? "ar" : "en"]}</p>
              <div className="mb-2 flex items-center gap-1 text-sm" aria-label={`${stars} ${t("common.stars")} `}>
                {[1, 2, 3].map((star) => <span key={star} className={star <= stars ? "text-[#ffc84d]" : "text-white/50"}>★</span>)}
              </div>
              <h3 className="font-display text-2xl leading-none text-white">{t(game.titleKey)}</h3>
              <p className="mt-2 text-sm leading-5 text-white/88">{t(game.shortKey)}</p>
              <button type="button" onClick={() => onSelect(game.id)} className="station-play mt-4">
                {moveCopy} <span className="station-stop__next">{progress?.completed ? "↻" : "→"}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
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
            <span className="brand-badge"><img src="/manus-storage/profitspatrol-compass-coin-logo_eaaf0464.png" alt="" className="h-11 w-11 object-contain" /></span>
            <div><p className="brand-wordmark"><span>Profit</span><b>Patrol</b></p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/70">KidCap HQ · Explorer Team</p></div>
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
              <span className="hero-chip"><MapPinned size={17} /> {t("hub.stations", { count: GAME_REGISTRY.length })}</span>
            </div>
          </div>
          <aside className="profile-pocket" aria-label={t("hub.profile")}>
            <div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#54708d]">{t("hub.profile")}</p><span className="status-dot" /></div>
            <p className="mt-3 font-display text-3xl text-[#102b4b]">{completeCount}/{GAME_REGISTRY.length} <span className="font-sans text-sm font-bold text-[#54708d]">{t("common.completed")}</span></p>
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
          <div className="route-status"><MapPinned size={18}/><span>{completeCount}/{GAME_REGISTRY.length}</span><small>{i18n.language.startsWith("ar") ? "محطات على الطريق" : "stops on your route"}</small></div>
        </div>
        <div className="neighborhood-map" role="list" aria-label={t("hub.stations", { count: GAME_REGISTRY.length })}>
          <svg className="neighborhood-route" viewBox="0 0 1200 9200" preserveAspectRatio="none" aria-hidden="true"><path className="neighborhood-route__road" d={ROUTE_PATH} /><path className="neighborhood-route__dash" d={ROUTE_PATH} /><g className="neighborhood-route__pins">{ROUTE_PINS.map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="13" />)}</g></svg>
          <span className="map-prop map-prop--plaza" aria-hidden="true">◌</span><span className="map-prop map-prop--store" aria-hidden="true">⌂</span><span className="map-prop map-prop--trees" aria-hidden="true">✦</span><span className="map-prop map-prop--receipt" aria-hidden="true">▤</span><span className="map-prop map-prop--bench" aria-hidden="true">⌇</span><span className="map-prop map-prop--sign" aria-hidden="true">$</span><span className="map-prop map-prop--lemon" aria-hidden="true">◒</span><span className="map-prop map-prop--crate" aria-hidden="true">▣</span><span className="map-prop map-prop--hanger" aria-hidden="true">⌁</span><span className="map-prop map-prop--paw" aria-hidden="true">✽</span><span className="map-prop map-prop--cup" aria-hidden="true">♨</span><span className="map-prop map-prop--handshake" aria-hidden="true">⌁</span><span className="map-prop map-prop--palette" aria-hidden="true">✦</span><span className="map-prop map-prop--launch" aria-hidden="true">↗</span><span className="map-prop map-prop--wave" aria-hidden="true">≋</span><span className="map-prop map-prop--radar" aria-hidden="true">◉</span><span className="map-prop map-prop--bars" aria-hidden="true">▥</span><span className="map-prop map-prop--peak" aria-hidden="true">△</span><span className="map-prop map-prop--shield" aria-hidden="true">⌾</span><span className="map-prop map-prop--clock" aria-hidden="true">◷</span><span className="map-prop map-prop--team" aria-hidden="true">♧</span><span className="map-prop map-prop--truck" aria-hidden="true">▣</span><span className="map-prop map-prop--stock" aria-hidden="true">▥</span><span className="map-prop map-prop--alert" aria-hidden="true">!</span><span className="map-prop map-prop--bulb" aria-hidden="true">✦</span><span className="map-prop map-prop--box" aria-hidden="true">▣</span><span className="map-prop map-prop--wrench" aria-hidden="true">⌁</span><span className="map-prop map-prop--voice" aria-hidden="true">◌</span><span className="map-prop map-prop--rocket" aria-hidden="true">↗</span><span className="map-prop map-prop--handshake2" aria-hidden="true">↔</span><span className="map-prop map-prop--captain" aria-hidden="true">♧</span><span className="map-prop map-prop--contract" aria-hidden="true">▤</span><span className="map-prop map-prop--message" aria-hidden="true">◌</span><span className="map-prop map-prop--compass" aria-hidden="true">✦</span>
          {GAME_REGISTRY.map((game) => <StationCard key={game.id} game={game} onSelect={onSelect} />)}
        </div>
      </section>
    </main>
  );
}

/** Design reminder: The page expresses a connected commercial neighborhood rather than a generic centered dashboard. */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GameHub from "@/components/GameHub";
import GameShell from "@/components/GameShell";
import type { GameId } from "@/lib/game-registry";

export default function Home() {
  const { i18n } = useTranslation();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  useEffect(() => {
    const isArabic = i18n.language.startsWith("ar");
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [i18n.language]);
  return activeGame ? <GameShell gameId={activeGame} onExit={() => setActiveGame(null)} /> : <GameHub onSelect={setActiveGame} />;
}

import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGameProgress } from "@/store/game-progress";

export default function SoundToggle() {
  const { t } = useTranslation();
  const soundEnabled = useGameProgress((state) => state.soundEnabled);
  const toggleSound = useGameProgress((state) => state.toggleSound);
  const label = soundEnabled ? t("progressCenter.soundOn") : t("progressCenter.soundOff");

  return <button type="button" onClick={toggleSound} className="sound-toggle" aria-pressed={soundEnabled} aria-label={label} title={label}>
    {soundEnabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
    <span className="sound-toggle__label">{label}</span>
  </button>;
}

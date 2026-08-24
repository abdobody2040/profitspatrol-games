export type SoundCue = "tap" | "success" | "retry";
type LegacyAudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

export function canPlaySound(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return false;
  const audioWindow = window as LegacyAudioWindow;
  return Boolean(audioWindow.AudioContext ?? audioWindow.webkitAudioContext);
}

export function playSound(cue: SoundCue, enabled: boolean) {
  if (!canPlaySound(enabled)) return;
  const AudioContextClass = (window as LegacyAudioWindow).AudioContext ?? (window as LegacyAudioWindow).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const tones: Record<SoundCue, number[]> = { tap: [440], success: [523.25, 659.25, 783.99], retry: [220, 196] };
    const now = context.currentTime;
    tones[cue].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.095;
      oscillator.type = cue === "retry" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(cue === "tap" ? 0.035 : 0.055, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.17);
    });
    window.setTimeout(() => void context.close(), 520);
  } catch {
    // Audio is optional; browsers that block an audio context retain the normal visual feedback.
  }
}

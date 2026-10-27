import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, Lock, Unlock, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/audio';
import { sendTelegramNotification } from '../services/telegram';

interface Props {
  onUnlock: () => void;
}

export const MysteryBox: React.FC<Props> = ({ onUnlock }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const handleBoxClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio chime
    romanticAudio.play();
    romanticAudio.playSparkle();

    // Confetti burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fda4af', '#fde047', '#fb7185', '#ffffff'],
    });

    // Notify Yash on Telegram
    sendTelegramNotification({
      eventType: 'Suspense Box Unlocked! 🎁',
      message: 'Gudiya ne Birthday Surprise Box open kar liya hai! Full emotional journey start ho chuki hai ❤️',
      details: 'Birthday surprise initiated by Gudiya on her special day.',
    });

    setTimeout(() => {
      onUnlock();
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-stone-950">
      {/* Ambient romantic background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating particles hint */}
      <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>A Secret Birthday Surprise from Yash</span>
        </div>

        {/* Suspense Mystery Box Graphic */}
        <div className="my-8 relative cursor-pointer group" onClick={handleBoxClick}>
          <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
            {/* Outer pulsating aura */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-600/30 to-amber-500/20 blur-xl transition-all duration-700 ${
                isOpening ? 'scale-150 opacity-100' : 'group-hover:scale-110 opacity-70'
              }`}
            />

            {/* Gift Box Container */}
            <div
              className={`w-40 h-40 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-rose-500/40 p-5 flex flex-col items-center justify-center shadow-2xl relative transition-transform duration-500 ${
                isOpening ? 'scale-110 rotate-3 border-rose-400' : 'group-hover:-translate-y-2'
              }`}
            >
              {/* Ribbon Graphic */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-rose-500 to-rose-700 opacity-90 shadow-sm" />
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-rose-500 to-rose-700 opacity-90 shadow-sm" />

              {/* Heart Lock in Center */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-stone-950 border border-rose-400/60 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-110 transition-transform">
                {isOpening ? (
                  <Unlock className="w-7 h-7 text-amber-400 animate-bounce" />
                ) : (
                  <Heart className="w-7 h-7 text-rose-500 fill-rose-500 animate-pulse" />
                )}
              </div>

              {/* Little lock badge */}
              <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-rose-600 text-[10px] font-semibold text-white tracking-wider uppercase shadow-md">
                {isOpening ? 'Opening...' : 'Locked with Yash\'s Heart'}
              </div>
            </div>
          </div>
        </div>

        {/* Suspenseful Heading */}
        <h1 className="text-3xl sm:text-4xl font-serif-romance font-bold text-stone-100 tracking-tight mb-3">
          Suno Gudiya... <br />
          <span className="text-rose-400 font-handwriting text-4xl sm:text-5xl">
            Happy Birthday Meri Jaan
          </span>
        </h1>

        <p className="text-sm text-stone-400 leading-relaxed max-w-md mx-auto mb-8 font-light">
          Tumhe lag raha hoga yeh koi normal birthday wish hai? <br />
          Is box ke andar hamara poora kal, shadi tak ka plan, aur budhe hone tak ka ek अटूट vaada chupa hai.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleBoxClick}
          disabled={isOpening}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm tracking-wide shadow-xl shadow-rose-950/60 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto cursor-pointer"
        >
          {isOpening ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Unlocking Your Forever Surprise...</span>
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              <span>Open My Birthday Surprise</span>
              <ArrowRight className="w-4 h-4 opacity-80" />
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-500 mt-4">
          ✨ Turn your sound on for the romantic melody
        </p>
      </div>
    </div>
  );
};

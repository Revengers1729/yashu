import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Cake, Flame, Send, CheckCircle2 } from 'lucide-react';
import { romanticAudio } from '../utils/audio';
import { sendTelegramNotification } from '../services/telegram';

export const BirthdayCakeSection: React.FC = () => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishText, setWishText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [wishSent, setWishSent] = useState(false);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);

    romanticAudio.playSparkle();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fb7185', '#fde047', '#38bdf8', '#a855f7'],
    });

    // Secret background notify to Yash
    sendTelegramNotification({
      eventType: 'Candles Blown Out! 🎂',
      message: 'Gudiya ne birthday cake ki candles blow kar di hain aur wish soch rahi hai ❤️',
      details: 'Birthday Cake interactive event triggered.',
    });
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isSending) return;

    setIsSending(true);
    // Secret background notify to Yash
    await sendTelegramNotification({
      eventType: 'Secret Birthday Wish 💌',
      message: wishText.trim(),
      details: 'Gudiya typed her heart wish on her birthday cake section.',
    });
    setIsSending(false);
    setWishSent(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fde047', '#ffffff'],
    });
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-medium mb-3">
          <Cake className="w-3.5 h-3.5 text-rose-400" />
          <span>The Birthday Ceremony · For Gudiya</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Happy Birthday, <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Meri Gudiya</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
          Aaj ka din mere liye sabse khaas hai kyunki aaj meri poori duniya is duniya me aayi thi.
          Chalo, sabse pehle tumhari birthday cake cut karte hain!
        </p>
      </div>

      {/* Interactive Birthday Cake Container */}
      <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center">
          {/* Cake Illustration / Interactive candles */}
          <div
            onClick={handleBlowCandles}
            className="cursor-pointer group relative my-4 flex flex-col items-center select-none"
            title="Tap to blow the candles!"
          >
            {/* Flames / Candles Row */}
            <div className="flex justify-center items-end gap-6 sm:gap-8 mb-1 h-12 relative z-10">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {!candlesBlown ? (
                    <div className="relative">
                      <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 animate-pulse shadow-lg shadow-amber-500/60 transition-transform group-hover:scale-125" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-white rounded-full opacity-80" />
                    </div>
                  ) : (
                    <div className="h-6 flex items-center justify-center">
                      <span className="text-[10px] text-stone-400 font-mono">~ 💨</span>
                    </div>
                  )}
                  <div className="w-2.5 h-8 bg-gradient-to-b from-rose-400 to-pink-500 rounded-t-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            <div className="relative">
              {/* Top Layer */}
              <div className="w-40 sm:w-52 h-14 bg-gradient-to-r from-rose-200 via-rose-100 to-rose-200 rounded-2xl border border-rose-300 shadow-md relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 inset-x-0 h-3 bg-rose-400/30 rounded-full" />
                <span className="text-xs font-serif-romance font-bold text-rose-900 tracking-wider">
                  YASH ❤️ GUDIYA
                </span>
                <div className="absolute top-1 inset-x-2 flex justify-between">
                  <div className="w-2.5 h-2.5 bg-rose-600 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-rose-600 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-rose-600 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-rose-600 rounded-full" />
                </div>
              </div>

              {/* Bottom Layer */}
              <div className="w-56 sm:w-72 h-20 -mt-2 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 rounded-3xl border border-stone-600 shadow-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-x-0 top-0 h-4 bg-rose-400/20" />
                <span className="text-stone-300 text-xs tracking-widest font-medium uppercase">
                  FOREVER & ALWAYS · 2026
                </span>
              </div>

              {/* Cake Stand */}
              <div className="w-64 sm:w-80 h-3 mx-auto bg-stone-600 rounded-full shadow-lg" />
              <div className="w-24 h-4 mx-auto bg-stone-700 rounded-b-lg" />
            </div>

            {/* Action Callout */}
            <div className="mt-5">
              {!candlesBlown ? (
                <button
                  onClick={handleBlowCandles}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer active:scale-95 transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                  Tap Here to Blow Candles & Make a Wish!
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Wish is in the air! Ab apni secret wish likho 👇
                </div>
              )}
            </div>
          </div>

          {/* Secret Wish Box Form */}
          <div className="w-full max-w-lg mt-6 pt-6 border-t border-stone-800">
            {wishSent ? (
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
                </div>
                <h4 className="text-base font-serif-romance font-semibold text-rose-200">
                  Tumhari Wish Yash Ke Dil Me Kaid Ho Gayi!
                </h4>
                <p className="text-xs text-stone-300 italic">
                  "{wishText}"
                </p>
                <p className="text-[11px] text-stone-400">
                  Yash tumhari is wish ko poori shiddat se poori karne ka vaada karta hai! ❤️
                </p>
                <button
                  onClick={() => setWishSent(false)}
                  className="text-xs text-rose-400 underline hover:text-rose-300 mt-2 inline-block cursor-pointer"
                >
                  Edit or add another wish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWish} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Gudiya ki Secret Birthday Wish:
                  </label>
                  <span className="text-[10px] text-stone-500">Sealed in Yash's heart</span>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Yash se kya chahti ho? Ya aaj tumhare dil me kya hai... (e.g. 'Hamesha mere sath rehna, kabhi mujhse door mat jana')"
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending || !wishText.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    {isSending ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Wish In Yash's Heart...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Lock Wish In Yash's Heart</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Birthday Coupon Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-center">
          <span className="text-xl">🫂</span>
          <h4 className="text-xs font-semibold text-stone-200 mt-2">Unlimited Tight Hugs</h4>
          <p className="text-[11px] text-stone-500 mt-1">Valid for lifetime, anytime Gudiya feels low or happy.</p>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-center">
          <span className="text-xl">👑</span>
          <h4 className="text-xs font-semibold text-stone-200 mt-2">Gudiya Is Always Right</h4>
          <p className="text-[11px] text-stone-500 mt-1">Aaj aur hamesha, Yash will listen to every small nakhra.</p>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-center">
          <span className="text-xl">💍</span>
          <h4 className="text-xs font-semibold text-stone-200 mt-2">Budhe Hone Tak Ka Promise</h4>
          <p className="text-[11px] text-stone-500 mt-1">Yeh normal chat nahi, 80 saal tak chalne wala safar hai.</p>
        </div>
      </div>
    </section>
  );
};

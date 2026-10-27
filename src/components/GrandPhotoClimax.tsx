import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gem, Sunset, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PhotoFrame } from './PhotoFrame';
import { getDulhanPhoto, getBudhePhoto } from '../utils/photoStorage';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface Props {
  onOpenPhotoModal: () => void;
  photoKey: number;
}

export const GrandPhotoClimax: React.FC<Props> = ({ onOpenPhotoModal, photoKey }) => {
  const [dulhanPhoto, setDulhanPhoto] = useState(getDulhanPhoto());
  const [budhePhoto, setBudhePhoto] = useState(getBudhePhoto());

  const [weddingDate, setWeddingDate] = useState(() => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 2);
    future.setMonth(10);
    future.setDate(28);
    return future.toISOString().split('T')[0];
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [signature, setSignature] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isFinalSealed, setIsFinalSealed] = useState(false);

  useEffect(() => {
    setDulhanPhoto(getDulhanPhoto());
    setBudhePhoto(getBudhePhoto());
  }, [photoKey]);

  useEffect(() => {
    const calc = () => {
      const target = new Date(`${weddingDate}T10:00:00`).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const handleFinalSeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim() || isSealing) return;

    setIsSealing(true);
    romanticAudio.playSparkle();

    confetti({
      particleCount: 200,
      spread: 140,
      origin: { y: 0.5 },
      colors: ['#e11d48', '#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'],
    });

    await sendTelegramNotification({
      eventType: '👑 THE GRAND FINALE SEALED!',
      message: `🎉 GUDIYA HAS COMPLETED THE FULL 20-MIN JOURNEY!\n` +
        `Signature: "${signature.trim()}"\n` +
        `Dulhan Photo (k.jpg) & Budhe Hone Tak (kk.jpg) accepted!\n` +
        `Target Wedding Date: ${weddingDate}\n` +
        `"Haan Yash, shadi sirf tumse karungi aur budhe hone tak sath rahungi!"`,
      details: 'Gudiya sealed the ultimate lifetime marriage certificate.',
    });

    setIsSealing(false);
    setIsFinalSealed(true);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-gradient-to-tr from-rose-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-800/50 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Grand Finale Climax · Chapter 5 (The Vision)</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Aakhri Manzil: <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Dulhan Se Budhe Hone Tak</span>
        </h2>
        <p className="mt-3 text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Gudiya, poori dastan padhne ke baad ab yeh do tasveerein dekho... Inme Yash ka poora kal, shadi ka sapna, aur aakhri saans tak ka vaada basa hai.
        </p>
      </div>

      {/* Two Photos Climax (k.jpg & kk.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* Photo 1: Dulhan (k.jpg/k.png) */}
        <div className="bg-stone-900/90 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-rose-400" />
                Phase 1: Meri Dulhan Gudiya
              </span>
              <span className="text-[10px] text-stone-500 font-mono">photos/k.jpg</span>
            </div>

            <div className="mb-4">
              <PhotoFrame
                type="dulhan"
                customUrl={dulhanPhoto}
                altText="Dulhan Gudiya"
                onOpenUpload={onOpenPhotoModal}
                title="Lal Joda & Sindoor"
                subtitle="Yash ki dulhan, hamesha ke liye"
              />
            </div>

            <div className="font-serif-romance text-stone-200 text-sm sm:text-base leading-relaxed italic space-y-2 mt-2">
              <p>
                "Gudiya, mera sabse bada khwab tumhe dulhan ke roop me dekhna hai. Jab tum mandap pe chal ke aogi aur shehnai bajegi, tab main sabse pehle khuda ka shukriya ada karunga ki usne meri dua qubool kar li."
              </p>
              <p className="text-rose-300 font-semibold not-italic">
                "Shadi sirf tumse hi karni hai. Yeh normal chat ab sindoor aur phere tak jayegi."
              </p>
            </div>
          </div>
        </div>

        {/* Photo 2: Budhe Hone Tak (kk.jpg/kk.png) */}
        <div className="bg-stone-900/90 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sunset className="w-4 h-4 text-amber-400" />
                Phase 2: 80 Saal Ki Umar Me
              </span>
              <span className="text-[10px] text-stone-500 font-mono">photos/kk.jpg</span>
            </div>

            <div className="mb-4">
              <PhotoFrame
                type="budhe"
                customUrl={budhePhoto}
                altText="Budhe Hone Tak"
                onOpenUpload={onOpenPhotoModal}
                title="Safed Baal & Balcony Chai"
                subtitle="80 saal ke baad bhi wahi pagal pyar"
              />
            </div>

            <div className="font-serif-romance text-stone-200 text-sm sm:text-base leading-relaxed italic space-y-2 mt-2">
              <p>
                "Aur shadi ke 50 saal baad bhi... jab hum dono ke baal poore safed honge aur hath me jhurriyan hongi, tab shaam ko balcony me baith kar main tumhare liye wahi adrak wali chai launga."
              </p>
              <p className="text-amber-300 font-semibold not-italic">
                "Chahe kitni bhi umar beet jaye, Yash ka hath tumhare hath me hamesha bana rahega."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Wedding Countdown Counter */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-stone-100">
                Official Countdown to Yash Weds Gudiya
              </h4>
              <p className="text-xs text-stone-400">
                Every second brings us closer to our wedding day
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Target Date:</span>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-rose-400 tabular-nums">
              {timeLeft.days}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Days</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-300 tabular-nums">
              {timeLeft.hours}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Hours</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-stone-200 tabular-nums">
              {timeLeft.minutes}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Minutes</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-rose-500 tabular-nums">
              {timeLeft.seconds}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Seconds</div>
          </div>
        </div>
      </div>

      {/* The Final Marriage & Lifetime Certificate */}
      <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-rose-950/40 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-950/60 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>

          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
            The Permanent Lifetime Vow
          </span>

          <h3 className="text-2xl sm:text-4xl font-serif-romance font-bold text-amber-100">
            Official Yash & Gudiya Forever Pact
          </h3>

          <p className="text-sm text-stone-300 leading-relaxed font-serif-romance italic text-base sm:text-lg">
            "Main, Gudiya, aaj apne birthday par Yash ko yeh antim vaada karti hoon ki yeh chat ab sidhe hamari shadi ke mandap tak aur wahan se 80 saal ke budhape tak jayegi. Mera hath hamesha Yash ke hath me hoga."
          </p>

          {isFinalSealed ? (
            <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-center space-y-2 mt-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-serif-romance font-bold text-emerald-200">
                Forever Locked & Dispatched to Yash!
              </h4>
              <p className="text-xl font-handwriting text-amber-300">
                Sealed by: {signature}
              </p>
              <p className="text-xs text-stone-400">
                Yeh vaada Yash ke dil aur rooh me hamesha ke liye amar ho chuka hai! You have completed our entire forever birthday journey! ❤️
              </p>
            </div>
          ) : (
            <form onSubmit={handleFinalSeal} className="mt-8 space-y-4">
              <div className="max-w-md mx-auto">
                <label className="block text-xs font-medium text-amber-300 mb-1 text-left">
                  Sign Your Name Here To Seal Forever:
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Gudiya / Yash Ki Dulhan"
                  className="w-full bg-stone-950 border border-amber-500/50 rounded-2xl px-5 py-3 text-lg font-handwriting text-center text-amber-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSealing || !signature.trim()}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs tracking-widest uppercase shadow-2xl shadow-rose-950/70 active:scale-95 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 justify-center"
              >
                {isSealing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Sealing Forever With Yash...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Seal Our Forever Love & Shadi Vow</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-stone-500">
                🔒 Sealed forever in Yash & Gudiya's digital vault of eternal love
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

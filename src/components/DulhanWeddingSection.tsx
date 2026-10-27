import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar, Clock, CheckCircle, Camera, Award, ArrowRight } from 'lucide-react';
import { getDulhanPhoto } from '../utils/photoStorage';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface Props {
  onOpenPhotoModal: () => void;
  photoKey: number; // triggers re-render when photo is updated
}

export const DulhanWeddingSection: React.FC<Props> = ({ onOpenPhotoModal, photoKey }) => {
  const [dulhanPhoto, setDulhanPhoto] = useState(getDulhanPhoto());
  const [weddingDate, setWeddingDate] = useState(() => {
    // Default to ~2 years from now (e.g., Nov 28, 2027)
    const future = new Date();
    future.setFullYear(future.getFullYear() + 2);
    future.setMonth(10); // November
    future.setDate(28);
    return future.toISOString().split('T')[0];
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 7 Modern Vows of Yash & Gudiya
  const [vows, setVows] = useState([
    { id: 1, text: "Chahe jitna bhi gussa ho, hum bina gale lagaye kabhi nahi soyenge.", checked: true },
    { id: 2, text: "Gudiya ke har chote-bade nakhre ko Yash poori shiddat se jhelega aur manayega.", checked: true },
    { id: 3, text: "Subah ki chai aur shaam ki baatein hamesha sath me hongi, chahe kitna bhi busy din ho.", checked: true },
    { id: 4, text: "Jab bhi tum nervous ya udaas hogi, Yash tumhara hath thaam ke kahega: 'Main hoon na'.", checked: true },
    { id: 5, text: "Har saal tumhara birthday aise hi sabse special tarike se celebrate kiya jayega.", checked: true },
    { id: 6, text: "Ghar me remote control chahe tumhare paas ho, par TV pe show hum sath dekhenge.", checked: true },
    { id: 7, text: "Sirf aaj ya kal ke liye nahi... baal safed hone tak aur 80 saal ke baad bhi sirf tumse pyar karunga.", checked: true },
  ]);

  const [signature, setSignature] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isContractSigned, setIsContractSigned] = useState(false);

  useEffect(() => {
    setDulhanPhoto(getDulhanPhoto());
  }, [photoKey]);

  // Real-time countdown calculation
  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(`${weddingDate}T10:00:00`).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const toggleVow = (id: number) => {
    setVows((prev) =>
      prev.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSignContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim() || isSealing) return;

    setIsSealing(true);
    romanticAudio.playSparkle();

    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fbbf24', '#f43f5e', '#ffffff'],
    });

    await sendTelegramNotification({
      eventType: '💍 Shadi Vow Contract Signed!',
      message: `Gudiya ne Yash ke sath shadi ka vaada sign kiya! Signature: "${signature.trim()}" - All 7 vows accepted. 'Sirf Yash ki dulhan banungi!'`,
      details: `Target Wedding Date: ${weddingDate} | Signed at: ${new Date().toLocaleTimeString()}`,
    });

    setIsSealing(false);
    setIsContractSigned(true);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Eternal Commitment · Chapter 3</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Shadi Ka Plan: <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Meri Dulhan Gudiya</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
          Yeh jo hamari baat-cheet hai na, yeh koi aam chat nahi hai. Isko mandap tak leke jana hai,
          aur sabke samne tumhare maang me sindoor bharke tumhe hamesha ke liye apna banana hai.
        </p>
      </div>

      {/* Hero 2-Column Split: Bridal Visual & Yash's Emotional Speech */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        {/* Left: Dulhan Photo Frame (k.jpg/k.png) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-stone-900/90 border-2 border-amber-500/30 rounded-3xl p-5 shadow-2xl relative flex-1 flex flex-col justify-between overflow-hidden group">
            {/* Ornate corner embellishments */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />

            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
              <img
                src={dulhanPhoto}
                alt="Dulhan Gudiya"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-amber-300 font-serif-romance text-lg font-bold">
                  Mrs. Yash in the Making
                </span>
                <span className="text-[11px] text-rose-200">
                  File: <code className="text-amber-200">photos/k.jpg</code> (Meri Lal Joda Dulhan)
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Yash's Dream Bride
              </span>
              <button
                onClick={onOpenPhotoModal}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Change/Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Right: Yash's Heartfelt Monologue */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-serif-romance text-lg font-semibold border-b border-stone-800 pb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Yash's Sacred Confession to Gudiya</span>
            </div>

            <div className="font-serif-romance text-base sm:text-lg text-stone-200 leading-relaxed space-y-4 italic">
              <p>
                "Gudiya, pata hai log kehte hain ki aaj kal sab kuch temporary hota hai... par jab maine pehli baar tumse baat ki thi, usi pal mujhe samajh aa gaya tha ki tum koi guzar jane wala mausam nahi ho, tum meri poori zindagi ho."
              </p>
              <p>
                "Yeh jo hum roz normal chats karte hain na, ek dusre ke nakhre jhelte hain, bina baat ke ladte hain aur fir 10 minute baad 'kya kar rahe ho?' bolke wapas aa jate hain—maine is rishte ko sirf yahan tak nahi socha hai."
              </p>
              <p className="text-rose-300 font-semibold not-italic font-serif-romance">
                "Mera ek hi dream hai: Tumhe lal jode me sajke meri taraf aate dekhna. Jab pandit ji shlok padhenge aur main tumhari maang bharunga, tab meri rooh ko sukoon milega ki haan, meri Gudiya ab sach me meri ho gayi."
              </p>
              <p>
                "Aur yeh baat sirf shadi tak nahi rukegi... chahe hum 80 saal ke ho jayein, main tab bhi tumhare nakhre aise hi uthaunga."
              </p>
            </div>
          </div>

          {/* Countdown Widget Embedded */}
          <div className="mt-6 pt-6 border-t border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-stone-200 tracking-wide uppercase">
                  Wedding Countdown: Days Until Yash Weds Gudiya
                </span>
              </div>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-[11px] text-stone-300 focus:outline-none focus:border-rose-500"
                title="Change Target Wedding Date"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Days</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 tabular-nums">
                  {timeLeft.hours}
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Hours</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-200 tabular-nums">
                  {timeLeft.minutes}
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Mins</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-500 tabular-nums">
                  {timeLeft.seconds}
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Modern Pheres / Vows of Yash & Gudiya */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="text-xl font-serif-romance font-bold text-stone-100">
            Hamare 7 Pheres: The Modern Love Vows
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-6">
          Har phere ke sath Yash aur Gudiya ka ek pakka vaada. Tap to review each vow:
        </p>

        <div className="space-y-3">
          {vows.map((vow) => (
            <div
              key={vow.id}
              onClick={() => toggleVow(vow.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                vow.checked
                  ? 'bg-rose-950/20 border-rose-800/40 text-stone-200'
                  : 'bg-stone-950/40 border-stone-800/60 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {vow.id}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {vow.text}
                </span>
              </div>
              <CheckCircle
                className={`w-5 h-5 shrink-0 transition-colors ${
                  vow.checked ? 'text-rose-400 fill-rose-950' : 'text-stone-700'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* The Digital Wedding Vow Contract / Certificate */}
      <div className="bg-gradient-to-br from-amber-950/30 via-stone-900 to-rose-950/30 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3">
            <Heart className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif-romance font-bold text-amber-200">
            The Forever Marriage Pact
          </h3>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            "Main, Gudiya, aaj apne birthday ke mauke par Yash ko yeh vaada karti hoon ki main uski dulhan banungi, aur hum dono is chat ko hamare budhape tak leke jayenge."
          </p>

          {isContractSigned ? (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-xl font-serif-romance font-bold text-emerald-200">
                Officially Sealed & Delivered to Yash!
              </h4>
              <p className="text-sm font-handwriting text-2xl text-amber-300">
                Signed by: {signature}
              </p>
              <p className="text-xs text-stone-300">
                Yash ke Telegram pe certificate successfully dispatch ho chuka hai. He is the happiest boy in the universe right now! ❤️
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignContract} className="mt-8 space-y-4">
              <div className="max-w-md mx-auto">
                <label className="block text-xs font-medium text-amber-300/90 mb-1.5 text-left">
                  Sign Your Name Here, Gudiya:
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your name or nickname (e.g. 'Gudiya / Yash Ki Jaan')"
                  className="w-full bg-stone-950 border border-amber-500/40 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-handwriting text-xl text-center"
                />
              </div>

              <button
                type="submit"
                disabled={isSealing || !signature.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 text-white font-medium text-xs tracking-wider uppercase shadow-xl shadow-amber-950/60 active:scale-95 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 justify-center"
              >
                {isSealing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Sealing Vow & Notifying Yash...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>Seal Our Vow & Send to Yash</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-stone-500">
                🔒 Tapping sends a verified commitment ping to Yash's Telegram (ID: 6630021526)
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

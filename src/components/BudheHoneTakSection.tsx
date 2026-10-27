import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Coffee, Glasses, Sunset, Camera, Send, Smile } from 'lucide-react';
import { getBudhePhoto } from '../utils/photoStorage';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface Props {
  onOpenPhotoModal: () => void;
  photoKey: number;
}

export const BudheHoneTakSection: React.FC<Props> = ({ onOpenPhotoModal, photoKey }) => {
  const [budhePhoto, setBudhePhoto] = useState(getBudhePhoto());
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setBudhePhoto(getBudhePhoto());
  }, [photoKey]);

  const handleQuizSubmit = async (answer: string) => {
    setSelectedQuizAnswer(answer);
    setIsSending(true);

    romanticAudio.playSparkle();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f59e0b', '#f43f5e'],
    });

    await sendTelegramNotification({
      eventType: '👴👵 Budhe Hone Tak Vision',
      message: `Gudiya ne 80 saal wali choice select ki: "${answer}" ${customNote ? `| Extra Note: "${customNote}"` : ''}`,
      details: 'Gudiya responded to the Old Age Together questionnaire.',
    });

    setIsSending(false);
    setQuizSubmitted(true);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Background ambient sunset glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/50 text-amber-300 text-xs font-medium mb-3">
          <Sunset className="w-3.5 h-3.5 text-amber-400" />
          <span>The Lifetime Promise · Chapter 4</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Budhe Hone Tak: <span className="text-amber-400 font-handwriting text-4xl sm:text-6xl">80 Saal Aur Uske Aage</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
          Log kehte hain umar ke sath pyar kam ho jata hai... par Yash ka pyar tumhare baal safed hone aur chehre pe wrinkles aane ke baad aur bhi gehra hoga.
        </p>
      </div>

      {/* Hero 2-Column Split: Old Age Visual & Yash's Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        {/* Left: Budhe Hone Tak Photo Frame (kk.jpg/kk.png) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-stone-900/90 border-2 border-amber-500/30 rounded-3xl p-5 shadow-2xl relative flex-1 flex flex-col justify-between overflow-hidden group">
            {/* Corner styling */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
              <img
                src={budhePhoto}
                alt="Budhe Hone Tak"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-amber-300 font-serif-romance text-lg font-bold">
                  Yash & Gudiya at 80
                </span>
                <span className="text-[11px] text-amber-200">
                  File: <code className="text-amber-300">photos/kk.jpg</code> (Safed Baal, Chai Aur Wohi Pyar)
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                Wrinkles & Endless Chai
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

        {/* Right: The 80-Year-Old Letter */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-serif-romance text-lg font-semibold border-b border-stone-800 pb-3">
              <Sunset className="w-5 h-5 text-amber-400" />
              <span>Imagine Us In The Year 2075...</span>
            </div>

            <div className="font-serif-romance text-base sm:text-lg text-stone-200 leading-relaxed space-y-4 italic">
              <p>
                "Gudiya, zara aakhon ko band karke socho: Hum dono 75-80 saal ke ho chuke hain. Hamare sar ke baal poore chaandi jaise safed ho chuke hain, chalne me shayad thodi dheemi chal hogi, par jab shaam ka sooraj dhal raha hoga..."
              </p>
              <p>
                "Hum dono hamare ghar ki balcony me baith kar garam chai ki chuski le rahe honge. Main tumhare jhurriyon wale hath ko apne hath me leke sehlunga aur kahunga: 'Kyu Gudiya, yaad hai wo 2026 wala birthday jab maine kaha tha ki yeh normal chat nahi hai, hum budhe hone tak sath rahenge?'"
              </p>
              <p className="text-amber-300 font-semibold not-italic font-serif-romance">
                "Chahe daant gir jayein, chahe chashme ka number badh jaye... Yash ke liye tum tab bhi wahi choti si masoom Gudiya rahogi jisko dekh ke uska dil har roz dhadakta hai."
              </p>
              <p>
                "Isliye main kehta hoon—abhi jo baat chal rahi hai, yeh kisi mod pe rukne wali nahi hai. Iski manzil aakhri saans tak sath rehne ki hai."
              </p>
            </div>
          </div>

          {/* Quick Old Age Bucket List */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Glasses className="w-3.5 h-3.5" />
              Our 80-Year-Old Bucket List:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
                <span>☕</span>
                <span>Balcony me roj shaam 5 baje adrak chai</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
                <span>👓</span>
                <span>Sar pe laga chashma poore ghar me dhoondhna</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
                <span>📖</span>
                <span>Hamare 2026 ke WhatsApp chats dekh ke hasna</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
                <span>👵🧓</span>
                <span>Grandkids ko batana kaise Yash ne Gudiya ko pataya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Old Age Quiz / Question */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Smile className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-serif-romance font-bold text-stone-100">
            Jab Hum 80 Saal Ke Honge, Toh Sach Batana:
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-6">
          Gudiya, choose your honest answer (it sends an alert to Yash right now on Telegram):
        </p>

        {quizSubmitted ? (
          <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-center space-y-2">
            <span className="text-3xl">☕❤️👵🧓</span>
            <h4 className="text-lg font-serif-romance font-bold text-amber-200">
              Yash Ne Tumhari Choice Note Kar Li!
            </h4>
            <p className="text-sm text-stone-300 italic">
              Selected: "{selectedQuizAnswer}"
            </p>
            <p className="text-xs text-stone-400">
              Yash ke Telegram pe update pahuch gaya hai. He says: 'Deal done meri jaan, 80 saal tak aise hi rahenge!'
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                "1. Subah pehle chai Yash hi banayega, Gudiya aaram se uthegi!",
                "2. Hum dono ladenge ki kiski memory zyada kharab ho gayi hai!",
                "3. Balcony me baith ke bina bole bas ek dusre ka hath pakad ke baithenge.",
              ].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizSubmit(option)}
                  disabled={isSending}
                  className="p-4 rounded-2xl bg-stone-950 hover:bg-amber-950/30 border border-stone-800 hover:border-amber-700/60 text-left text-xs font-medium text-stone-200 transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 leading-relaxed"
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Koi or cute baat jo tum chahti ho hum budhape me karein? (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. 'Hum dono har Sunday ko ice cream khane jayenge chahe sardi ho'"
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleQuizSubmit(customNote || 'Budhe hone tak sirf sath rehna hai!')}
                  disabled={isSending || !customNote.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

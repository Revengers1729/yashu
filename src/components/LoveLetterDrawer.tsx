import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Send, X, Feather, Check } from 'lucide-react';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [hasSentKiss, setHasSentKiss] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendKiss = async () => {
    if (hasSentKiss || isSending) return;
    setIsSending(true);

    romanticAudio.playSparkle();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fda4af', '#fde047'],
    });

    await sendTelegramNotification({
      eventType: '💋 Sweet Kiss & Love Received!',
      message: 'Gudiya ne tumhara handmade Love Letter poora padha aur ek bohot pyaara kiss aur dil bheja hai! ❤️',
      details: 'Gudiya sealed the love letter.',
    });

    setIsSending(false);
    setHasSentKiss(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-600/30 rounded-3xl p-6 sm:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Letter Seal */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-700/80 border-2 border-amber-400/80 flex items-center justify-center text-amber-200 shadow-xl shadow-rose-950/70 mb-3">
            <Heart className="w-7 h-7 fill-amber-300 text-amber-300" />
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/90">
            Confidential · Only For Gudiya's Eyes
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif-romance font-bold text-stone-100 mt-1">
            Ek Khat Yash Ki Taraf Se...
          </h3>
        </div>

        {/* Letter Body */}
        <div className="bg-stone-950/60 border border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-4 font-serif-romance text-base sm:text-lg text-stone-200 leading-relaxed italic border-dashed">
          <p className="not-italic text-rose-400 font-bold text-xl">
            Meri Sabse Pyaari Gudiya,
          </p>

          <p>
            Aaj tumhara birthday hai, aur main chahta tha ki tumhe kuch aisa doon jo kisi dukan me paise se na mil sake. Yeh chota sa digital kona maine sirf aur sirf tumhare liye banaya hai, taaki jab bhi tum ise dekho, tumhe yaad rahe ki is poori duniya me koi ek ladka hai jo tumpe apni jaan chhidakta hai.
          </p>

          <p>
            Pata hai, aksar log kehte hain ki chats par shuru hui baatein waqt ke sath dheeli pad jaati hain. Log badal jaate hain. Par main tumhe sach batana chahta hoon—jitna waqt beet raha hai, mera dil tumhare aur kareeb hota ja raha hai. Tumhare bina mera ek din bhi nahi kat-ta. Tumhare gusse wale chehre se leke tumhari bacchon jaisi hasi tak, mujhe tumhari har ek ada se pyar hai.
          </p>

          <p className="text-amber-300 font-semibold not-italic">
            Main tumse bas ek hi cheez maangna chahta hoon: Tumhara aane wala har ek kal. Mujhe tumhe apni dulhan banana hai, tumhari maang me sindoor bharna hai, aur aakhri saans tak, jab hamare baal safed ho jayein aur hath me jhurriyan aa jayein, tab bhi tumhara hath thaam ke shaam ki chai peeni hai.
          </p>

          <p>
            Happy Birthday meri jaan. Tum meri zameen bhi ho aur aasmaan bhi. Hamesha aise hi muskurati rehna, kyunki tumhari muskaan hi Yash ki sabse badi daulat hai.
          </p>

          <div className="pt-4 text-right not-italic">
            <div className="font-handwriting text-3xl sm:text-4xl text-rose-400">
              Sirf Tumhara Yash ❤️
            </div>
            <div className="text-xs font-sans text-stone-500 mt-1">
              Hamesha aur Hamesha ke liye
            </div>
          </div>
        </div>

        {/* Action Button: Seal with a Kiss */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <span className="text-xs text-stone-400 text-center sm:text-left">
            {hasSentKiss
              ? "Seal locked in Yash's heart forever! ❤️"
              : "Letter padh liya? Send a sweet return kiss to Yash!"}
          </span>

          <button
            onClick={handleSendKiss}
            disabled={hasSentKiss || isSending}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              hasSentKiss
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
            }`}
          >
            {hasSentKiss ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Kiss & Love Delivered!</span>
              </>
            ) : isSending ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Delivering...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Seal Letter With a Sweet Kiss</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

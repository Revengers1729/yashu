import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gem, Home, Plane, Star, Send, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Milestone } from '../types';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'Pehli Baat & Pehli Dhadkan',
    dateOrEra: 'The Beginning',
    category: 'past',
    description: 'Jab hum dono ki pehli baar baat hui thi... kisine nahi socha tha ki ek stranger itni jaldi poori zindagi ban jayega.',
    emotionalQuote: '"Tumse baat karne se pehle sab normal tha, tumse milne ke baad sab khoobsurat ho gaya."',
    isUnlocked: true,
    iconType: 'star',
  },
  {
    id: 'm2',
    title: 'Jab Pyar Ka Ehsaas Hua',
    dateOrEra: 'The Confession',
    category: 'past',
    description: 'Wo pal jab Yash ko samajh aaya ki chahe poori duniya ek taraf ho, uski har khushi sirf Gudiya ki ek muskaan me hai.',
    emotionalQuote: '"Duniya me hazaron log hain, par mera dil sirf tumhare aage haar gaya."',
    isUnlocked: true,
    iconType: 'heart',
  },
  {
    id: 'm3',
    title: 'Roz Ke Nakhre & Manana',
    dateOrEra: 'Every Single Day',
    category: 'past',
    description: 'Hamari cute ladaiyan, gussa hona, fir chupke se phone check karna ki message aaya ya nahi.',
    emotionalQuote: '"Gussa toh bas bahana hai, sach toh yeh hai ki tumhare manane ka tarika sabse pyara hai."',
    isUnlocked: true,
    iconType: 'heart',
  },
  {
    id: 'm4',
    title: 'Gudiya Ka Birthday Surprise',
    dateOrEra: 'Today · Right Now',
    category: 'present',
    description: 'Aaj ka yeh khaas din jahan Yash ne yeh poori secret duniya sirf tumhare liye banayi hai.',
    emotionalQuote: '"Happy Birthday meri jaan... yeh birthday hamare naye safar ki shuruat hai."',
    isUnlocked: true,
    iconType: 'cake',
  },
  {
    id: 'm5',
    title: 'The Ring & Ghutne Pe Proposal',
    dateOrEra: 'Coming Soon',
    category: 'future',
    description: 'Ek shaam hogi jab Yash tumhare samne ghutne pe baith ke hath me angoothi leke poochega: Will you be mine forever?',
    emotionalQuote: '"Tumhare hath me pehnayi hui ring sirf ek gehna nahi, meri poori zindagi ka vaada hogi."',
    isUnlocked: true,
    iconType: 'ring',
  },
  {
    id: 'm6',
    title: 'Dulhan Gudiya & Shadi Ka Mandap',
    dateOrEra: 'Our Wedding Day',
    category: 'future',
    description: 'Lal jode me tum, shehnai ki aawaz, saat phere, aur Yash ke hath se bhari hui tumhari maang.',
    emotionalQuote: '"Us din ke baad se, har roz subah pehli nazar tumhare chehre pe hogi."',
    isUnlocked: true,
    iconType: 'ring',
  },
  {
    id: 'm7',
    title: 'Hamara Apna Chota Sa Aashiyana',
    dateOrEra: 'Our Dream Home',
    category: 'future',
    description: 'Ek pyara sa ghar jahan ek balcony hogi, dher saare plants honge, aur shaam ki chai hum dono sath peeyenge.',
    emotionalQuote: '"Ghar chahe chota ho ya bada, sukoon sirf tumhare aagosh me hota hai."',
    isUnlocked: true,
    iconType: 'home',
  },
  {
    id: 'm8',
    title: 'Budhe Hone Tak: 80 Saal Aur Aage',
    dateOrEra: 'Forever & Eternal',
    category: 'forever',
    description: 'Safed baal, jhurriyan, hilte daant, par wahi 20-22 saal wala pagal pyar jo kabhi kam nahi hoga.',
    emotionalQuote: '"Aakhri saans tak tumhara hath thaame rakhunga meri Gudiya."',
    isUnlocked: true,
    iconType: 'infinity',
  },
];

export const MilestoneTracker: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(INITIAL_MILESTONES[3]);
  const [userNote, setUserNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [noteSentForId, setNoteSentForId] = useState<string | null>(null);

  const handleSendMemory = async () => {
    if (!selectedMilestone || !userNote.trim() || isSending) return;

    setIsSending(true);
    romanticAudio.playSparkle();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fbbf24', '#f43f5e'],
    });

    await sendTelegramNotification({
      eventType: `🌟 Milestone Memory: ${selectedMilestone.title}`,
      message: `Gudiya added a note to "${selectedMilestone.title}": "${userNote.trim()}"`,
      details: `Milestone era: ${selectedMilestone.dateOrEra}`,
    });

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === selectedMilestone.id ? { ...m, userMemory: userNote.trim() } : m
      )
    );

    setNoteSentForId(selectedMilestone.id);
    setIsSending(false);
    setUserNote('');
  };

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / milestones.length) * 100);

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Emotional Milestone Tracking · Hamari Prem Kahani</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Hamara Safar: <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Pehle Chat Se Budhe Hone Tak</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
          Pehle din se leke hamari shadi aur 80 saal ke budhape tak ka har ek milestone yahan darj hai.
        </p>

        {/* Progress summary bar */}
        <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-stone-300 font-medium">Lifetime Love Journey</span>
            <span className="text-rose-400 font-mono font-bold">100% Destined Together</span>
          </div>
          <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 rounded-full transition-all duration-1000"
              style={{ width: `100%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2">
            <span>First Chat</span>
            <span className="text-rose-300">Shadi (Dulhan Gudiya)</span>
            <span>80 Saal (Wrinkles & Chai)</span>
          </div>
        </div>
      </div>

      {/* 2-Column interactive layout: Milestone Timeline + Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline Items */}
        <div className="lg:col-span-6 space-y-3">
          {milestones.map((m, idx) => {
            const isSelected = selectedMilestone?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMilestone(m);
                  setNoteSentForId(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-950/30 -translate-x-1'
                    : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-200">
                        {m.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 font-light">
                      {m.dateOrEra}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {m.category === 'future' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                      Shadi Plan
                    </span>
                  )}
                  {m.category === 'forever' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40">
                      80 Saal
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-rose-400 translate-x-1' : 'text-stone-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Milestone Inspector */}
        <div className="lg:col-span-6 sticky top-20">
          {selectedMilestone ? (
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-mono text-rose-400 uppercase tracking-widest">
                    Milestone Inspection · {selectedMilestone.dateOrEra}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif-romance font-bold text-stone-100 mt-1">
                    {selectedMilestone.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedMilestone.description}
                </p>

                {/* Romantic Yash Quote */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-rose-500/30 text-rose-200 font-serif-romance text-base sm:text-lg italic leading-relaxed">
                  {selectedMilestone.emotionalQuote}
                  <div className="text-[11px] font-sans not-italic text-stone-400 text-right mt-2">
                    — Yash
                  </div>
                </div>

                {/* User Memory Added */}
                {selectedMilestone.userMemory && (
                  <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs">
                    <span className="text-rose-300 font-medium">Gudiya's Added Memory:</span>
                    <p className="text-stone-200 italic mt-0.5">"{selectedMilestone.userMemory}"</p>
                  </div>
                )}

                {/* Add a private memory note to this milestone */}
                <div className="pt-3 border-t border-stone-800">
                  {noteSentForId === selectedMilestone.id ? (
                    <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Yeh memory hamari prem kahani me hamesha ke liye darj ho gayi! ❤️
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-stone-400">
                        Is milestone ke baare me kuch likhna chahti ho?:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userNote}
                          onChange={(e) => setUserNote(e.target.value)}
                          placeholder="e.g. 'Wo din mujhe aaj bhi yaad hai jab tumne...'"
                          className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          onClick={handleSendMemory}
                          disabled={isSending || !userNote.trim()}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-stone-900/50 border border-stone-800 text-center text-xs text-stone-500">
              Select any milestone from the left to read Yash's private words!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

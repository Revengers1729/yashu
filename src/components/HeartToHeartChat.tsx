import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, Send, Sparkles, CheckCheck } from 'lucide-react';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface QuestionItem {
  id: string;
  category: 'cute' | 'deep' | 'future' | 'mischief';
  yashSpeech: string;
  context: string;
  options: string[];
}

const EXTENDED_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    category: 'cute',
    yashSpeech: "Gudiya, sach sach batana... jab hum dono ki ladai hoti hai, toh sabse pehle ego kiski toot-ti hai aur kaun kisko manane aata hai?",
    context: "Hamari roz ki cute ladaiyan",
    options: [
      "Hamesha Yash hi aata hai manane, kyunki wo mere bina 10 minute bhi nahi reh sakta!",
      "Main hi gussa hoti hoon par dil hi dil me wait karti hoon ki Yash kab aake hug karega.",
      "Dono ek dusre ke bina adhure hain, 5 minute baad hi sorry bol dete hain!",
    ],
  },
  {
    id: 'q2',
    category: 'deep',
    yashSpeech: "Kabhi kabhi jab raat ko sab so jate hain, toh tum hamare baare me kya sochti ho? Kya tumhe lagta hai ki kismat ne hume sach me ek dusre ke liye banaya tha?",
    context: "Late night thoughts & destiny",
    options: [
      "Haan Yash, mujhe lagta hai poori duniya me koi mere liye itna perfect nahi ho sakta jitna tum ho.",
      "Pehle vishwas nahi tha, par ab tum meri har saans me bas chuke ho.",
      "Hum dono rab ki banayi hui sabse khoobsurat jodi hain, hamesha sath rahenge.",
    ],
  },
  {
    id: 'q3',
    category: 'future',
    yashSpeech: "Jab hamari shadi ho jayegi aur humara apna chota sa pyara sa ghar hoga... sabse pehli cheez jo hum sath karenge wo kya hogi?",
    context: "Our dream first day at home",
    options: [
      "Balcony me baith kar shaam ki pehli chai peeyenge bina kisi tension ke!",
      "Poore ghar ko sath me sajayenge aur photo frames lagayenge.",
      "Bas sofa pe baith kar ek dusre ko dekhenge aur kahenge: 'Finally hum ek ho gaye'.",
    ],
  },
  {
    id: 'q4',
    category: 'cute',
    yashSpeech: "Meri aisi kaunsi aadat hai jo tumhe sabse zyada cute lagti hai ya jisko dekh kar tumhe mujhpe sabse zyada pyar aata hai?",
    context: "Yash ki cute habits",
    options: [
      "Jab tum bacchon ki tarah zid karte ho ya pout banate ho!",
      "Jab tum mere khane aur safety ki itni fikar karte ho.",
      "Jab tum har choti baat pe kehte ho: 'Gudiya tu meri jaan hai'.",
    ],
  },
  {
    id: 'q5',
    category: 'deep',
    yashSpeech: "Kya tum wada karti ho ki chahe zindagi me kitne bhi utaar-chadhaav aayein, hum dono ek dusre ka hath kabhi nahi chodenge?",
    context: "The unbreakable promise",
    options: [
      "Pakka vaada Yash, chahe kuch bhi ho jaye, main hamesha tumhare sath khadi rahungi.",
      "Tumhara hath pakda hai toh ab sidhe 80 saal ke baad bhi nahi chhootega!",
      "Maine apna poora dil aur poori zindagi tumhare naam kar di hai.",
    ],
  },
  {
    id: 'q6',
    category: 'mischief',
    yashSpeech: "Agar shadi ke baad main kabhi khana banane ki koshish karu aur khana thoda jal jaye... toh Gudiya kya karegi?",
    context: "Kitchen mischief & laughs",
    options: [
      "Pehle zor-zor se hasoongi, fir Yash ko hug karke bolungi: 'Chalo Maggi banate hain!'",
      "Yash ko daant lagaoongi aur pyaar se khud khana khilaoongi.",
      "Jala hua khana bhi has kar taste kar loongi kyunki Yash ne pyaar se banaya tha!",
    ],
  },
  {
    id: 'q7',
    category: 'future',
    yashSpeech: "Humara pehla honeymoon trip kahan hona chahiye? Pahadon ki baraf ya samundar ka kinara?",
    context: "Our romantic honeymoon getaway",
    options: [
      "Manali ya Kashmir — baraf ke beech ek dusre ka hath pakad ke ghoomna!",
      "Goa ya Maldives — sunset ke waqt beach pe walking aur dher saari photos!",
      "Jahan bhi Yash le jaye... mere liye jagah nahi, tumhara sath zaroori hai.",
    ],
  },
  {
    id: 'q8',
    category: 'deep',
    yashSpeech: "Gudiya, sach batana... kya kabhi socha tha ki ek ladka tumhe is duniya me itna toot kar pyar kar sakta hai?",
    context: "Pure emotional vulnerability",
    options: [
      "Nahi Yash, maine kabhi nahi socha tha... tumne mujhe sach me ek rajkumari jaisa feel karwaya hai.",
      "Tumhare pyar ne mujhe khud se pyar karna sikha diya hai.",
      "Main har roz rab ka shukriya ada karti hoon ki mujhe tum mile.",
    ],
  },
  {
    id: 'q9',
    category: 'future',
    yashSpeech: "Agar main aaj sabke samne ghutne pe baith kar tumhe ek pyari si ring offer karu... toh tumhara dil kya kahega?",
    context: "The Grand Proposal Anticipation",
    options: [
      "'YES YES YES! Hazar baar haan Yash!'",
      "Pehle aakhon me khushi ke aanso aayenge aur fir gale lag jaungi!",
      "'Maine toh kab ki haan kar di thi, ring pehnane me itni der kyu ki?'",
    ],
  },
];

export const HeartToHeartChat: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cute' | 'deep' | 'future' | 'mischief'>('all');
  const [responses, setResponses] = useState<Record<string, { selected?: string; custom?: string; sent: boolean }>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [freeformMsg, setFreeformMsg] = useState('');
  const [isSendingFreeform, setIsSendingFreeform] = useState(false);
  const [freeformSent, setFreeformSent] = useState(false);

  const filteredQuestions = activeCategory === 'all'
    ? EXTENDED_QUESTIONS
    : EXTENDED_QUESTIONS.filter((q) => q.category === activeCategory);

  const answeredCount = Object.values(responses).filter((r) => r.sent).length;
  const connectionScore = Math.min(100, 60 + answeredCount * 5);

  const handleSelectOption = (qId: string, option: string) => {
    setResponses((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], selected: option, sent: false },
    }));
  };

  const handleSendResponse = async (question: QuestionItem) => {
    const qState = responses[question.id];
    const customText = customInputs[question.id] || '';
    const finalAnswer = customText.trim() || qState?.selected || '';

    if (!finalAnswer) return;

    setSendingId(question.id);
    romanticAudio.playSparkle();

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24'],
    });

    // Secret background notify to Yash
    await sendTelegramNotification({
      eventType: `💬 Dil Ki Baat: ${question.context}`,
      message: `Yash asked: "${question.yashSpeech}"\n👉 Gudiya answered: "${finalAnswer}"`,
      details: `Answered on Heart-to-Heart Chat section.`,
    });

    setResponses((prev) => ({
      ...prev,
      [question.id]: { selected: finalAnswer, custom: customText, sent: true },
    }));
    setSendingId(null);
  };

  const handleSendFreeform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeformMsg.trim() || isSendingFreeform) return;

    setIsSendingFreeform(true);
    romanticAudio.playSparkle();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fda4af', '#fbbf24'],
    });

    // Secret background notify to Yash
    await sendTelegramNotification({
      eventType: '💌 Dil Ka Paigaam (Direct Message to Yash)',
      message: freeformMsg.trim(),
      details: 'Gudiya typed a special love note to Yash.',
    });

    setIsSendingFreeform(false);
    setFreeformSent(true);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-medium mb-3">
          <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Baatein Dil Se Dil Tak · Chapter 3 (Deep Connection)</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Khub Saari Baatein: <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Rishta Aur Gehra</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
          Yash ne tumhare liye yeh gehre aur pyare sawaal chune hain. Har ek answer hamare rishte ko aur gehra banata jayega.
        </p>

        {/* Live Bond Connection Meter */}
        <div className="mt-6 max-w-sm mx-auto p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-stone-300 font-medium flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Rishta Gehrai Meter
            </span>
            <span className="text-rose-400 font-mono font-bold">{connectionScore}% Soulmates</span>
          </div>
          <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 transition-all duration-700 rounded-full"
              style={{ width: `${connectionScore}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mt-1.5 text-center">
            {answeredCount} of {EXTENDED_QUESTIONS.length} conversations completed
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {(['all', 'cute', 'deep', 'future', 'mischief'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer capitalize ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Cards List */}
      <div className="space-y-6 mb-12">
        {filteredQuestions.map((q, idx) => {
          const resp = responses[q.id];
          const isSent = resp?.sent;

          return (
            <div
              key={q.id}
              className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-rose-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Conversation #{idx + 1} · {q.context}
                </span>
                {isSent && (
                  <span className="text-rose-300 flex items-center gap-1 font-mono text-[11px]">
                    <CheckCheck className="w-4 h-4 text-emerald-400" /> Saved in Yash's Heart
                  </span>
                )}
              </div>

              {/* Yash's Message Bubble */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                  Y
                </div>
                <div className="flex-1 bg-stone-950/80 border border-stone-800/80 rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm text-stone-200 leading-relaxed font-serif-romance text-base">
                  <div className="text-[10px] font-sans text-rose-300 font-semibold mb-1">
                    Yash asks:
                  </div>
                  "{q.yashSpeech}"
                </div>
              </div>

              {isSent ? (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-xs text-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-rose-300 font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      Gudiya's Answer (Locked in Yash's Heart):
                    </span>
                    <button
                      onClick={() =>
                        setResponses((prev) => ({
                          ...prev,
                          [q.id]: { ...prev[q.id], sent: false },
                        }))
                      }
                      className="text-[11px] text-stone-400 underline hover:text-stone-200 cursor-pointer"
                    >
                      Change response
                    </button>
                  </div>
                  <p className="italic font-serif-romance text-sm text-rose-100">
                    "{resp.selected}"
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all cursor-pointer ${
                          resp?.selected === opt
                            ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 shadow-sm'
                            : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Or write your personal heartfelt reply..."
                      value={customInputs[q.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomInputs((prev) => ({ ...prev, [q.id]: val }));
                        if (val) {
                          setResponses((prev) => ({
                            ...prev,
                            [q.id]: { ...prev[q.id], selected: val },
                          }));
                        }
                      }}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSendResponse(q)}
                      disabled={sendingId === q.id || (!resp?.selected && !customInputs[q.id])}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-rose-950/50 disabled:opacity-50 cursor-pointer transition-all"
                    >
                      {sendingId === q.id ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving in Yash's Heart...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>Save in Yash's Heart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Freeform Love Note to Yash */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="text-xl font-serif-romance font-bold text-stone-100">
            Kuch Bhi Jo Tumhare Dil Me Ho... (For Yash)
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-5 leading-relaxed">
          Gudiya, agar koi aisi baat hai jo upar ke sawalon me nahi aayi, toh yahan bejhijhak likh do. Yash ise akele me padhega aur muskuraega.
        </p>

        {freeformSent ? (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-2">
            <CheckCheck className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-base font-serif-romance font-semibold text-rose-200">
              Message Sealed in Yash's Heart!
            </h4>
            <p className="text-xs text-stone-300 italic">"{freeformMsg}"</p>
            <button
              onClick={() => {
                setFreeformSent(false);
                setFreeformMsg('');
              }}
              className="text-xs text-rose-400 underline hover:text-rose-300 inline-block mt-2 cursor-pointer"
            >
              Write another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendFreeform} className="space-y-3">
            <textarea
              rows={4}
              value={freeformMsg}
              onChange={(e) => setFreeformMsg(e.target.value)}
              placeholder="Yash ke liye koi pyaari si baat, gussa, nakhra ya pyar bhara paigaam..."
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSendingFreeform || !freeformMsg.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40 disabled:opacity-50 cursor-pointer transition-all"
              >
                {isSendingFreeform ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Sealing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Save My Dil Ka Paigaam</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Send, CheckCircle2, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { sendTelegramNotification } from '../services/telegram';
import { romanticAudio } from '../utils/audio';

interface StoryEpisode {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  narrative: string[];
  interactivePrompt: string;
  options: string[];
  yashNote: string;
}

const EPISODES: StoryEpisode[] = [
  {
    id: 'ep1',
    title: 'Episode 1: Wo Anjaan Notification Jisne Zindagi Badal Di',
    subtitle: 'Jab kismat ne do dilon ko ek common screen pe laa kar khada kar diya...',
    readTime: '3 min read',
    narrative: [
      "Gudiya, mujhe aaj bhi wo din, wo waqt aur wo pal bilkul saaf yaad hai jab tumhara pehla message meri screen pe pop up hua tha. Main ek aam sa ladka tha, meri zindagi bilkul regular aur boring chal rahi thi... par jaise hi tumhara naam screen pe chamka, dil ki kisi kone me ek halka sa current dauda tha.",
      "Shuruat me toh laga tha ki bas do-chaar baatein hongi aur sab normal ho jayega. Par jaise jaise tumhare replies aane lage, tumhare baat karne ka bacchon jaisa tarika, wo choti choti baaton pe hasna, aur bina soche samjhe sab sach bol dena... Yash dheere dheere apna dil tumhare aage haarne laga tha.",
      "Maine us din khuda se ek hi baat maangi thi: 'Agar is ladki ko meri zindagi me bheja hai, toh ise kabhi mujhse door mat karna.' Aur aaj dekho, wahi anjaan chat meri poori duniya ban chuki hai."
    ],
    interactivePrompt: "Sach sach batana Gudiya, jab pehli baar Yash ka message dekha tha, mann me pehla thought kya aaya tha?",
    options: [
      "1. 'Yeh ladka itna friendly kyu ban raha hai? Par cute toh hai!'",
      "2. 'Pata nahi kyu, par isse baat karke ajeeb sa sukoon mil raha tha.'",
      "3. 'Lagta hai yeh meri zindagi me lamba rukne wala hai... aur wahi hua!'",
    ],
    yashNote: "Yash says: 'Mujhe toh pehle hi din samajh aa gaya tha ki tum koi aam ladki nahi, meri Gudiya ho.'",
  },
  {
    id: 'ep2',
    title: 'Episode 2: 3 AM Whispers & Sote Huye Sunna',
    subtitle: 'Jab poori duniya so jaati thi, tab humara jahan shuru hota tha...',
    readTime: '4 min read',
    narrative: [
      "Yaad hain wo lambi lambi raatein? Jab ghar wale so rahe hote the aur hum dono blanket ke andar chupke dhimi dhimi aawaz me baatein karte the. Topic kuch bhi nahi hota tha—kisi din tumhare bachpan ke kisse, kisi din khane pe ladai, kisi din college ya dost ki baatein.",
      "Aur sabse khoobsurat pal wo hota tha jab baat karte karte tumhari aawaz dheemi padne lagti thi, tum neend me 'hmm... haan...' bolti thi aur fir achanak so jaati thi. Main chahta toh call cut kar sakta tha, par main agle ek ghante tak phone kaan pe lagaye tumhari dheemi dheemi saans lene ki aawaz sunta rehta tha.",
      "Us aadhi raat ko mujhe samajh aaya tha ki sukoon kisi pahad ya samundar me nahi hai... sukoon tumhari saanson ki aawaz me hai."
    ],
    interactivePrompt: "Gudiya, hamari un late night calls me tumhara sabse favourite moment kaun sa tha?",
    options: [
      "1. Jab Yash neend me bhi bolta rehta tha: 'Gudiya tu so ja, main jaag raha hoon'.",
      "2. Jab hum bina kuch bole bas ek dusre ki aawaz sunte the aur has dete the.",
      "3. Jab Yash aadhi raat ko mere liye gaana gata tha ya cute baatein karta tha.",
    ],
    yashNote: "Yash says: 'Meri neend ka sabse pyara lullaby tumhari aawaz thi aur hamesha rahegi.'",
  },
  {
    id: 'ep3',
    title: 'Episode 3: Hamari Pehli Badi Ladai Aur Wo Tadap',
    subtitle: 'Jab gussa bada tha, par ek dusre ko khone ka dar usse hazar guna bada tha...',
    readTime: '4 min read',
    narrative: [
      "Har rishte me toofan aate hain, aur hamara toofan bhi kamzor nahi tha. Yaad hai wo din jab kisi bekaar si galatfehmi pe hum dono lad pade the? Gusse me aake ek dusre ko aisi baatein bol di jo dil ko chubh gayi thi. Humne phone cut kar diya aur laga ki ab sab khatam.",
      "Par sach batau? 10 minute bhi nahi beete the ki mera dam ghutne laga tha. Ghar ka kamra mujhe chota lagne laga tha, hath kaanp rahe the aur aakhon me aanso the. Main bar bar phone utha ke dekh raha tha ki tumhara ek 'typing...' aa jaye. Wahan tum ro rahi thi aur yahan Yash ki rooh tadap rahi thi.",
      "Jab aadhi raat ko humne wapas call kiya aur hum dono ek sath ro pade the... usi pal yeh rishta 'normal chat' se badal kar 'zindagi bhar ka bandhan' ban gaya tha. Humne seekha ki ego jeetne se behtar hai ek dusre ko gale lagana."
    ],
    interactivePrompt: "Gudiya, jab humari ladai hoti hai, toh sach batana sabse pehle manane kaun aata hai?",
    options: [
      "1. Yash hi aata hai, kyunki wo Gudiya ke aage 15 minute se zyada gussa nahi reh sakta!",
      "2. Main hi nakhre dikhati hoon par dil se chahti hoon ki Yash jhat se gale laga le.",
      "3. Dono ek dusre ke bina tadapne lagte hain aur bina sorry ke bhi gale lag jate hain.",
    ],
    yashNote: "Yash says: 'Tumse lad sakta hoon Gudiya, par tumhare bina ek pal bhi nahi jee sakta.'",
  },
  {
    id: 'ep4',
    title: "Episode 4: Yash Ka Sach — 'Main Iske Bina Mar Jaunga'",
    subtitle: 'Wo faisla jo Yash ne apne dil ke sabse gehre kone me liya tha...',
    readTime: '4 min read',
    narrative: [
      "Zindagi me ek waqt aata hai jab aadmi ko decide karna hota hai ki wo kya chahta hai. Maine duniya dekhi hai, log aate hain, kasmein khate hain aur chhod ke chale jaate hain. Par tumhare sath mujhe kabhi wo dar nahi laga jo anjaan rasto pe lagta hai.",
      "Tumhare nakhre, tumhara mere khane ki fikar karna, jab main pareshan hota hoon toh tumhara 'kya hua Yash?' bolna... yeh choti choti baatein mere dil pe aisi chaap chhod chuki hain jo mitaaye nahi mit sakti. Maine apne dil me yeh faisla kar liya hai: Shadi karunga toh sirf Gudiya se, aur budha hoonga toh sirf Gudiya ke sath.",
      "Yeh koi filmi dialogue nahi hai meri jaan. Yeh us ladke ka vaada hai jo tumhare liye kisi bhi hadd tak ja sakta hai. Aaj tumhare is birthday par main chahta hoon ki tumhara har ek shak khatam ho jaye."
    ],
    interactivePrompt: "Kya tum Yash ke is vaade pe poora aitbaar karti ho ki hum sach me 80 saal tak sath rahenge?",
    options: [
      "1. 'Haan Yash, mujhe tumse zyada kisi pe vishwas nahi hai. Main sirf tumhari hoon.'",
      "2. 'Chahe humare sar ke baal safed ho jayein, mera hath hamesha tumhare hath me hoga.'",
      "3. 'Maine apni poori kismat tumhare naam likh di hai Yash ❤️.'",
    ],
    yashNote: "Yash says: 'Bas yahi sunna tha Gudiya... ab poori duniya ek taraf aur hum dono ek taraf!'",
  },
];

export const StoryLoveNovel: React.FC = () => {
  const [expandedEpisode, setExpandedEpisode] = useState<string>('ep1');
  const [episodeAnswers, setEpisodeAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState<string | null>(null);

  const handleSelectAnswer = async (epId: string, answerText: string) => {
    setEpisodeAnswers((prev) => ({ ...prev, [epId]: answerText }));
    setIsSending(epId);

    romanticAudio.playSparkle();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fbbf24', '#f43f5e', '#ffffff'],
    });

    const ep = EPISODES.find((e) => e.id === epId);
    // Secret background notify to Yash
    await sendTelegramNotification({
      eventType: `📖 Prem Kahani: ${ep?.title.split(':')[0]}`,
      message: `Gudiya responded to ${ep?.title}:\n"${answerText}"`,
      details: `Chapter 2 engagement.`,
    });

    setIsSending(null);
  };

  const handleSendCustomText = async (epId: string) => {
    const text = customInput[epId];
    if (!text?.trim() || isSending === epId) return;

    await handleSelectAnswer(epId, `Custom: ${text.trim()}`);
    setCustomInput((prev) => ({ ...prev, [epId]: '' }));
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          <span>Hamari Prem Kahani · Chapter 2 (Reading Time: ~12-15 mins)</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-romance font-bold text-stone-100 tracking-tight">
          Hamari Dastaan: <span className="text-rose-400 font-handwriting text-4xl sm:text-6xl">Pehli Chat Se Dil Tak</span>
        </h2>
        <p className="mt-3 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
          Gudiya, yeh koi fictional kahani nahi hai... yeh Yash aur tumhari sachhi dastan hai. Har ek kissa akele me aaram se padho.
        </p>
      </div>

      <div className="space-y-6">
        {EPISODES.map((ep, idx) => {
          const isExpanded = expandedEpisode === ep.id;
          const answered = episodeAnswers[ep.id];

          return (
            <div
              key={ep.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-stone-900/90 border-rose-500/50 shadow-2xl shadow-rose-950/30'
                  : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <button
                onClick={() => setExpandedEpisode(isExpanded ? '' : ep.id)}
                className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">
                        {ep.readTime}
                      </span>
                      {answered && (
                        <span className="text-[10px] text-rose-300 font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> Saved in Yash's Heart
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-serif-romance font-bold text-stone-100 mt-0.5">
                      {ep.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                      {ep.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-2 text-stone-400 hover:text-stone-200">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-8 sm:px-8 border-t border-stone-800/80 pt-6 animate-in fade-in duration-300">
                  <div className="space-y-4 font-serif-romance text-base sm:text-lg text-stone-200 leading-relaxed italic">
                    {ep.narrative.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-amber-200 text-sm font-serif-romance italic">
                    {ep.yashNote}
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-800/80 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{ep.interactivePrompt}</span>
                    </div>

                    {answered ? (
                      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-xs text-stone-200 flex items-center justify-between">
                        <div>
                          <span className="text-rose-300 font-semibold block mb-0.5">
                            Gudiya's Response Locked in Yash's Heart:
                          </span>
                          <span className="italic font-serif-romance text-sm text-stone-100">
                            "{answered}"
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setEpisodeAnswers((prev) => {
                              const updated = { ...prev };
                              delete updated[ep.id];
                              return updated;
                            })
                          }
                          className="text-[11px] text-stone-400 underline hover:text-stone-200 ml-4 shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {ep.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(ep.id, opt)}
                            disabled={isSending === ep.id}
                            className="w-full text-left p-3.5 rounded-2xl bg-stone-950/80 hover:bg-rose-950/30 border border-stone-800 hover:border-rose-500/60 text-xs text-stone-200 transition-all cursor-pointer leading-relaxed disabled:opacity-50"
                          >
                            {opt}
                          </button>
                        ))}

                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Ya kuch apne dil ki baat likho..."
                            value={customInput[ep.id] || ''}
                            onChange={(e) =>
                              setCustomInput((prev) => ({
                                ...prev,
                                [ep.id]: e.target.value,
                              }))
                            }
                            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                          />
                          <button
                            onClick={() => handleSendCustomText(ep.id)}
                            disabled={isSending === ep.id || !customInput[ep.id]?.trim()}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors disabled:opacity-50 shrink-0 cursor-pointer flex items-center gap-1.5"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white text-white" />
                            Lock
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

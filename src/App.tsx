import React, { useState, useEffect } from 'react';
import {
  Heart,
  Cake,
  BookOpen,
  MessageCircle,
  Sparkles,
  Send,
  Feather,
  Gem,
  Award,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { MysteryBox } from './components/MysteryBox';
import { BirthdayCakeSection } from './components/BirthdayCakeSection';
import { StoryLoveNovel } from './components/StoryLoveNovel';
import { HeartToHeartChat } from './components/HeartToHeartChat';
import { MilestoneTracker } from './components/MilestoneTracker';
import { GrandPhotoClimax } from './components/GrandPhotoClimax';
import { RomanticAudioPlayer } from './components/RomanticAudioPlayer';
import { TelegramStatusModal } from './components/TelegramStatusModal';
import { PhotoUploaderModal } from './components/PhotoUploaderModal';
import { LoveLetterDrawer } from './components/LoveLetterDrawer';

type ChapterTab = 'birthday' | 'story' | 'chat' | 'milestones' | 'climax';

const CHAPTERS: { id: ChapterTab; title: string; subtitle: string; estTime: string }[] = [
  { id: 'birthday', title: '1. Birthday & Cake', subtitle: 'The Midnight Surprise', estTime: '3 min' },
  { id: 'story', title: '2. Hamari Prem Kahani', subtitle: '4 Romantic Episodes', estTime: '5 min' },
  { id: 'chat', title: '3. Khub Saari Baatein', subtitle: '10 Deep Conversations', estTime: '5 min' },
  { id: 'milestones', title: '4. Emotional Milestones', subtitle: 'Pehle Chat Se Kal Tak', estTime: '3 min' },
  { id: 'climax', title: '5. The Grand Finale', subtitle: 'Dulhan (k.jpg) & Budhe Tak (kk.jpg)', estTime: '4 min' },
];

export default function App() {
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<ChapterTab>('birthday');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [photoKey, setPhotoKey] = useState(0);

  useEffect(() => {
    const unlocked = sessionStorage.getItem('yash_gudiya_unlocked');
    if (unlocked === 'true') {
      setHasUnlocked(true);
    }
  }, []);

  const handleUnlockBox = () => {
    sessionStorage.setItem('yash_gudiya_unlocked', 'true');
    setHasUnlocked(true);
  };

  const handlePhotosUpdated = () => {
    setPhotoKey((prev) => prev + 1);
  };

  const currentChapterIndex = CHAPTERS.findIndex((c) => c.id === activeTab);

  const goToNextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      const nextTab = CHAPTERS[currentChapterIndex + 1].id;
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevTab = CHAPTERS[currentChapterIndex - 1].id;
      setActiveTab(prevTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!hasUnlocked) {
    return (
      <main className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-rose-500 selection:text-white">
        <MysteryBox onUnlock={handleUnlockBox} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative pb-24 md:pb-14">
      {/* Top Bar Contract (Zone 1: Brand wordmark, Zone 2: 4-5 nav links, Zone 3: Primary action) */}
      <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        <a
          href="#birthday"
          onClick={() => setActiveTab('birthday')}
          className="text-lg sm:text-xl font-serif-romance font-bold tracking-tight text-stone-100 whitespace-nowrap shrink-0 hover:text-rose-400 transition-colors"
        >
          Yash & Gudiya
        </a>

        {/* 5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-300">
          <button
            onClick={() => setActiveTab('birthday')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'birthday' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Birthday
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'story' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Prem Kahani
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'chat' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Khub Baatein
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'milestones' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setActiveTab('climax')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'climax' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Grand Climax (Photos)
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsLetterModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all shadow-md shadow-rose-950/40 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Read Yash's handwritten love letter"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Yash's Letter</span>
          </button>
        </div>
      </header>

      {/* Chapter Progress & 20-Minute Immersion Strip */}
      <div className="bg-stone-950 border-b border-stone-800/70 py-2.5 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="text-rose-400 font-semibold">
              Chapter {currentChapterIndex + 1} of {CHAPTERS.length}:
            </span>
            <span className="text-stone-200 font-medium">
              {CHAPTERS[currentChapterIndex].title}
            </span>
            <span className="text-stone-500">· Total Experience: ~20 mins</span>
          </div>

          <div className="flex items-center gap-1.5">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveTab(ch.id)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === ch.id
                    ? 'w-8 bg-rose-500'
                    : idx < currentChapterIndex
                    ? 'w-4 bg-rose-800'
                    : 'w-4 bg-stone-800 hover:bg-stone-700'
                }`}
                title={ch.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="animate-in fade-in duration-300">
          {activeTab === 'birthday' && <BirthdayCakeSection />}
          {activeTab === 'story' && <StoryLoveNovel />}
          {activeTab === 'chat' && <HeartToHeartChat />}
          {activeTab === 'milestones' && <MilestoneTracker />}
          {activeTab === 'climax' && (
            <GrandPhotoClimax
              onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
              photoKey={photoKey}
            />
          )}
        </div>

        {/* Chapter Journey Step Navigation Buttons */}
        <div className="max-w-4xl mx-auto px-4 py-8 mt-6 border-t border-stone-800/80 flex items-center justify-between gap-4">
          {currentChapterIndex > 0 ? (
            <button
              onClick={goToPrevChapter}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>
          ) : (
            <div />
          )}

          {currentChapterIndex < CHAPTERS.length - 1 ? (
            <button
              onClick={goToNextChapter}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer transition-all"
            >
              <span>Continue to Next Chapter ({CHAPTERS[currentChapterIndex + 1].title.split('.')[1]})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-rose-300 font-serif-romance italic">
              "Yeh hamara aakhri chapter nahi, hamari aane wali zindagi ki shuruat hai."
            </div>
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 grid grid-cols-5 items-center h-16 px-1">
        <button
          onClick={() => setActiveTab('birthday')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            activeTab === 'birthday' ? 'text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Cake className="w-5 h-5" />
          <span className="text-[10px] mt-1 whitespace-nowrap">Birthday</span>
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            activeTab === 'story' ? 'text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1 whitespace-nowrap">Story</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            activeTab === 'chat' ? 'text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 whitespace-nowrap">Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            activeTab === 'milestones' ? 'text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-1 whitespace-nowrap">Journey</span>
        </button>
        <button
          onClick={() => setActiveTab('climax')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            activeTab === 'climax' ? 'text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] mt-1 whitespace-nowrap">Climax</span>
        </button>
      </nav>

      <RomanticAudioPlayer />

      <TelegramStatusModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      <PhotoUploaderModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotosUpdated={handlePhotosUpdated}
      />

      <LoveLetterDrawer
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-6 px-4 text-center text-xs text-stone-500">
        <p className="font-serif-romance text-stone-400 text-sm">
          "Yeh rishta ab aakhri saans tak chalega — Yash ❤️ Gudiya"
        </p>
        <p className="text-[11px] text-stone-600 mt-1 flex items-center justify-center gap-2">
          <span>A 20-minute immersive love journey · Made with pure love by Yash</span>
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="text-[10px] text-stone-700 hover:text-stone-500 transition-colors cursor-pointer"
            title="Yash Bot Setup"
          >
            ⚙️
          </button>
        </p>
      </footer>
    </div>
  );
}

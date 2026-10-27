import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

export const RomanticAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const togglePlay = () => {
    const active = romanticAudio.toggle();
    setIsPlaying(active);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    romanticAudio.setVolume(val);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      {showVolume && isPlaying && (
        <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xl animate-in fade-in">
          <span className="text-[11px] text-stone-400 font-medium">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      )}

      <button
        onClick={togglePlay}
        onMouseEnter={() => setShowVolume(true)}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-300 shadow-xl ${
          isPlaying
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-rose-950/40'
            : 'bg-stone-900/90 border-stone-800 text-stone-400 hover:text-stone-200'
        }`}
        title={isPlaying ? 'Pause romantic melody' : 'Play romantic background melody'}
      >
        {isPlaying ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Music className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="text-xs font-medium tracking-wide">Romantic Melody</span>
            <Volume2 className="w-3.5 h-3.5 ml-0.5 text-rose-300" />
          </>
        ) : (
          <>
            <Music className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide">Play Love Music</span>
            <VolumeX className="w-3.5 h-3.5 ml-0.5 opacity-60" />
          </>
        )}
      </button>
    </div>
  );
};

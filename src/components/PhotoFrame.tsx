import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  type: 'dulhan' | 'budhe';
  customUrl: string;
  altText: string;
  onOpenUpload: () => void;
  title: string;
  subtitle: string;
}

export const PhotoFrame: React.FC<Props> = ({
  type,
  customUrl,
  altText,
  onOpenUpload,
  title,
  subtitle,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(customUrl);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    setCurrentSrc(customUrl);
    setAttempt(0);
  }, [customUrl]);

  const handleError = () => {
    if (attempt === 0) {
      setCurrentSrc(type === 'dulhan' ? '/photos/k.png' : '/photos/kk.png');
      setAttempt(1);
    } else if (attempt === 1) {
      setCurrentSrc(type === 'dulhan' ? '/photos/k.svg' : '/photos/kk.svg');
      setAttempt(2);
    }
  };

  return (
    <div className="relative group w-full h-full flex flex-col justify-between">
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
        <img
          src={currentSrc}
          alt={altText}
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
          <span className="text-amber-300 font-serif-romance text-xl font-bold tracking-wide drop-shadow-md">
            {title}
          </span>
          <span className="text-xs text-stone-300 mt-0.5 font-light">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-stone-400 font-mono text-[11px]">
          {type === 'dulhan' ? 'File: photos/k.jpg or k.png' : 'File: photos/kk.jpg or kk.png'}
        </span>
        <button
          onClick={onOpenUpload}
          className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/40 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload / Change Photo</span>
        </button>
      </div>
    </div>
  );
};

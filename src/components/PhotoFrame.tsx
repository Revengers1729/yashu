import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

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
  const [hasError, setHasError] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    setCurrentSrc(customUrl);
    setHasError(false);
    setAttempt(0);
  }, [customUrl]);

  const handleError = () => {
    if (attempt === 0) {
      // First fallback try: check .png
      setCurrentSrc(type === 'dulhan' ? '/photos/k.png' : '/photos/kk.png');
      setAttempt(1);
    } else if (attempt === 1) {
      // Second fallback try: check .jpg
      setCurrentSrc(type === 'dulhan' ? '/photos/k.jpg' : '/photos/kk.jpg');
      setAttempt(2);
    } else {
      // If file is 0-byte or not present, render inline romantic SVG artwork
      setHasError(true);
    }
  };

  return (
    <div className="relative group w-full h-full flex flex-col justify-between select-none">
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
        {!hasError ? (
          <img
            src={currentSrc}
            alt={altText}
            onError={handleError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* High-aesthetic embedded SVG artwork when no custom photo is placed yet */
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {type === 'dulhan' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 533" className="w-full h-full">
                <defs>
                  <linearGradient id="dulhanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4c0519"/>
                    <stop offset="50%" stop-color="#881337"/>
                    <stop offset="100%" stop-color="#1c1917"/>
                  </linearGradient>
                  <radialGradient id="dulhanGlow" cx="50%" cy="35%" r="45%">
                    <stop offset="0%" stop-color="#fde047" stop-opacity="0.3"/>
                    <stop offset="60%" stop-color="#e11d48" stop-opacity="0.1"/>
                    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="400" height="533" fill="url(#dulhanGrad)"/>
                <circle cx="200" cy="180" r="140" fill="url(#dulhanGlow)"/>
                <path d="M 60 480 L 60 210 C 60 90, 340 90, 340 210 L 340 480" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
                <g transform="translate(200, 220)">
                  <path d="M -80 190 Q -50 60 -5 -20 Q 15 -25 40 -5 Q 70 50 85 190 Z" fill="#9f1239" opacity="0.9"/>
                  <path d="M -65 190 Q -40 70 0 -10 Q 15 -15 30 5 Q 55 60 70 190 Z" fill="#be123c" opacity="0.9"/>
                  <path d="M -45 70 Q 0 50 45 70" fill="none" stroke="#fde047" stroke-width="2" opacity="0.8"/>
                  <path d="M -55 100 Q 0 80 55 100" fill="none" stroke="#fde047" stroke-width="2" opacity="0.8"/>
                  <path d="M -65 135 Q 0 110 65 135" fill="none" stroke="#fde047" stroke-width="2" opacity="0.8"/>
                  <circle cx="5" cy="-55" r="28" fill="#fbcfe8" opacity="0.95"/>
                  <ellipse cx="12" cy="-70" rx="18" ry="21" fill="#292524"/>
                  <path d="M 5 -82 L 5 -62" stroke="#fde047" stroke-width="2"/>
                  <circle cx="5" cy="-60" r="3" fill="#fbbf24"/>
                  <path d="M -12 -82 C 10 -95, 38 -75, 42 -45 C 48 -15, 55 50, 60 110" fill="none" stroke="#fbbf24" stroke-width="2.5" opacity="0.9"/>
                </g>
                <text x="200" y="440" font-family="'Cormorant Garamond', serif" font-size="20" font-weight="700" fill="#fef08a" text-anchor="middle" letter-spacing="2">MERI DULHAN GUDIYA</text>
                <text x="200" y="465" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#fecdd3" text-anchor="middle" letter-spacing="1">YASH KI HUMSAFAR · HAMESHA KE LIYE</text>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 533" className="w-full h-full">
                <defs>
                  <linearGradient id="budheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e1b4b"/>
                    <stop offset="40%" stop-color="#451a03"/>
                    <stop offset="70%" stop-color="#78350f"/>
                    <stop offset="100%" stop-color="#0c0a09"/>
                  </linearGradient>
                  <radialGradient id="budheSun" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stop-color="#fdba74" stop-opacity="0.35"/>
                    <stop offset="60%" stop-color="#ea580c" stop-opacity="0.15"/>
                    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="400" height="533" fill="url(#budheGrad)"/>
                <circle cx="200" cy="200" r="150" fill="url(#budheSun)"/>
                <path d="M 60 450 L 60 180 C 60 80, 340 80, 340 180 L 340 450" fill="none" stroke="#fcd34d" stroke-width="2" opacity="0.4"/>
                <line x1="60" y1="330" x2="340" y2="330" stroke="#78350f" stroke-width="3" opacity="0.6"/>
                <g transform="translate(200, 260)">
                  <ellipse cx="-40" cy="-35" rx="19" ry="21" fill="#e2e8f0"/>
                  <ellipse cx="-40" cy="-32" rx="17" ry="19" fill="#475569"/>
                  <path d="M -65 70 L -15 70 L -20 10 L -60 10 Z" fill="#334155"/>
                  <ellipse cx="30" cy="-28" rx="18" ry="20" fill="#f1f5f9"/>
                  <ellipse cx="30" cy="-25" rx="16" ry="18" fill="#64748b"/>
                  <path d="M 0 70 L 65 70 L 58 10 L 5 10 Z" fill="#9f1239"/>
                  <circle cx="0" cy="45" r="12" fill="#fed7aa"/>
                  <rect x="-80" y="58" width="11" height="13" rx="2" fill="#f59e0b"/>
                  <rect x="70" y="58" width="11" height="13" rx="2" fill="#f59e0b"/>
                </g>
                <text x="200" y="420" font-family="'Cormorant Garamond', serif" font-size="20" font-weight="700" fill="#fed7aa" text-anchor="middle" letter-spacing="1">BUDHE HONE TAK · 80 SAAL</text>
                <text x="200" y="445" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#fde68a" text-anchor="middle" letter-spacing="1">BALCONY KI CHAI AUR PURANA PYAR</text>
              </svg>
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 pointer-events-none">
          <span className="text-amber-300 font-serif-romance text-xl font-bold tracking-wide drop-shadow-md">
            {title}
          </span>
          <span className="text-xs text-stone-300 mt-0.5 font-light">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
          {type === 'dulhan' ? 'photos/k.png' : 'photos/kk.png'}
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

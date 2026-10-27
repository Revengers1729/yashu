import React, { useState } from 'react';
import { Camera, Image, Upload, RefreshCw, X, Check, FolderOpen } from 'lucide-react';
import { getDulhanPhoto, getBudhePhoto, setCustomPhoto, resetCustomPhoto } from '../utils/photoStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated: () => void;
}

export const PhotoUploaderModal: React.FC<Props> = ({ isOpen, onClose, onPhotosUpdated }) => {
  const [dulhanPreview, setDulhanPreview] = useState<string>(getDulhanPhoto());
  const [budhePreview, setBudhePreview] = useState<string>(getBudhePhoto());
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (type: 'dulhan' | 'budhe', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomPhoto(type, dataUrl);
        if (type === 'dulhan') setDulhanPreview(dataUrl);
        if (type === 'budhe') setBudhePreview(dataUrl);
        setFeedback(`Photo for ${type === 'dulhan' ? 'Dulhan (k.jpg)' : 'Budhe Hone Tak (kk.jpg)'} updated!`);
        onPhotosUpdated();
        setTimeout(() => setFeedback(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = (type: 'dulhan' | 'budhe') => {
    resetCustomPhoto(type);
    if (type === 'dulhan') setDulhanPreview(getDulhanPhoto());
    if (type === 'budhe') setBudhePreview(getBudhePhoto());
    setFeedback(`Reset to default artistic graphic!`);
    onPhotosUpdated();
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif-romance font-semibold text-stone-100">
              Yash & Gudiya Photo Gallery
            </h3>
            <p className="text-xs text-stone-400">
              Upload your photos here, or put <code className="text-rose-300">k.png</code> & <code className="text-rose-300">kk.png</code> in <code className="text-rose-300">/public/photos/</code>
            </p>
          </div>
        </div>

        {feedback && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-xs text-rose-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Slot 1: Dulhan Photo (k.jpg/png) */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-rose-300 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-rose-400" />
                  1. Dulhan Photo (<code className="text-xs text-amber-300">k.jpg</code>)
                </span>
                <button
                  onClick={() => handleReset('dulhan')}
                  className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
                >
                  Reset
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mb-3">
                Yeh photo shadi wale chapter me dikhegi jahan Yash Gudiya ko dulhan ke roop me imagine karta hai.
              </p>

              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-stone-800 bg-stone-900 mb-3 group">
                <img
                  src={dulhanPreview}
                  alt="Dulhan Gudiya"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
              </div>
            </div>

            <div>
              <label className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700">
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                Upload Dulhan Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload('dulhan', f);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Slot 2: Budhe Hone Tak Photo (kk.jpg/png) */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-300 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-amber-400" />
                  2. Budhe Hone Tak (<code className="text-xs text-amber-300">kk.jpg</code>)
                </span>
                <button
                  onClick={() => handleReset('budhe')}
                  className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
                >
                  Reset
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mb-3">
                Yeh photo 80 saal tak sath rehne wale chapter me aayegi (safed baal, chai aur eternal love).
              </p>

              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-stone-800 bg-stone-900 mb-3 group">
                <img
                  src={budhePreview}
                  alt="Budhe Hone Tak"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
              </div>
            </div>

            <div>
              <label className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                Upload Budhe Hone Tak Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload('budhe', f);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Folder instructions */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-400 space-y-1">
            <p className="font-medium text-stone-300">Manual Folder Method:</p>
            <p>
              Agar tum files directly paste karna chahte ho, toh project ke <code className="text-rose-300">/public/photos/</code> folder me <code className="text-amber-300">k.jpg</code> (dulhan) aur <code className="text-amber-300">kk.jpg</code> (budhe hone tak) daal sakte ho!
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

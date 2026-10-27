// Photo management for Dulhan (k.jpg/k.png) and Budhe Hone Tak (kk.jpg/kk.png)

const DULHAN_LOCAL_KEY = 'yash_gudiya_custom_photo_k';
const BUDHE_LOCAL_KEY = 'yash_gudiya_custom_photo_kk';

export function getDulhanPhoto(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(DULHAN_LOCAL_KEY);
    if (custom) return custom;
  }
  return '/photos/k.png';
}

export function getBudhePhoto(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(BUDHE_LOCAL_KEY);
    if (custom) return custom;
  }
  return '/photos/kk.png';
}

export function setCustomPhoto(type: 'dulhan' | 'budhe', dataUrl: string) {
  if (typeof window !== 'undefined') {
    const key = type === 'dulhan' ? DULHAN_LOCAL_KEY : BUDHE_LOCAL_KEY;
    localStorage.setItem(key, dataUrl);
  }
}

export function resetCustomPhoto(type: 'dulhan' | 'budhe') {
  if (typeof window !== 'undefined') {
    const key = type === 'dulhan' ? DULHAN_LOCAL_KEY : BUDHE_LOCAL_KEY;
    localStorage.removeItem(key);
  }
}

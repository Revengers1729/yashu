import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, X, KeyRound, Clock, Heart, RefreshCw, MessageSquare } from 'lucide-react';
import { fetchTelegramConfig, updateTelegramConfig, sendTelegramNotification, getLocalTelegramActivities } from '../services/telegram';
import { TelegramActivity, TelegramConfigState } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramStatusModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<TelegramConfigState>({
    chat_id: '6630021526',
    hasToken: false,
    isDemo: true,
    bot_token_preview: 'xxxxx',
  });
  const [tokenInput, setTokenInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [activities, setActivities] = useState<TelegramActivity[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      setActivities(getLocalTelegramActivities());
    }
  }, [isOpen]);

  const loadConfig = async () => {
    const data = await fetchTelegramConfig();
    setConfig(data);
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setIsUpdating(true);
    setStatusMessage('');
    setErrorMessage('');

    const res = await updateTelegramConfig(tokenInput.trim(), config.chat_id);
    setIsUpdating(false);
    if (res.success) {
      setStatusMessage('Bot token saved! Ab niche "Send Test Ping" click karke check karo.');
      setTokenInput('');
      await loadConfig();
    } else {
      setErrorMessage(res.message || 'Error updating token');
    }
  };

  const handleSendTestPing = async () => {
    setTestSending(true);
    setStatusMessage('');
    setErrorMessage('');

    const res = await sendTelegramNotification({
      eventType: 'Test Ping',
      message: 'Yash bhai! Test ping successfully deliver ho gaya! Gudiya ki har baat yahan aayegi ❤️',
      details: 'Telegram delivery verification',
    });

    setTestSending(false);
    setActivities(getLocalTelegramActivities());

    if (res.sent) {
      setStatusMessage('🎉 SUCCESS! Yash ke Telegram pe test message deliver ho gaya!');
    } else if (res.simulated) {
      setErrorMessage(
        '⚠️ Token abhi bhi "xxxxx" (Demo) hai! Upar apna real Bot token paste karo tabhi Yash ke Telegram pe real message aayega.'
      );
    } else {
      let err = res.error || 'Delivery failed';
      if ((res as any).error_code === 403 || (res as any).note?.includes('/start')) {
        err = '⚠️ ERROR 403: Yash ne apne bot me /start nahi dabaya hai! Telegram me apna bot kholo aur START button dabao, fir test karo!';
      } else if ((res as any).error_code === 404) {
        err = '⚠️ ERROR 404: Bot token galat hai! @BotFather se copy karke sahi token daalo.';
      }
      setErrorMessage(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif-romance font-semibold text-stone-100">
              Yash's Telegram Bot Setup
            </h3>
            <p className="text-xs text-stone-400">
              Target Telegram Chat ID: <span className="font-mono text-rose-300 font-bold">6630021526</span>
            </p>
          </div>
        </div>

        {/* Diagnostic Status Box */}
        <div className={`p-4 rounded-2xl border mb-6 ${
          config.isDemo
            ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Bot Status</span>
            {config.isDemo ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/60 text-amber-300 border border-amber-700">
                <AlertCircle className="w-3.5 h-3.5" /> Token: "xxxxx" (Demo)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Token Configured
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed">
            {config.isDemo ? (
              <span className="text-amber-300 font-medium">
                Bhai Yash ko msg isliye nahi aa raha kyunki token abhi demo "xxxxx" set hai! Jab tak aap real Telegram Bot Token nahi daaloge, Telegram kisi bot se message nahi bhej sakta.
              </span>
            ) : (
              <span>
                Token preview: <code className="font-mono text-stone-200">{config.bot_token_preview}</code>.
              </span>
            )}
          </p>

          <div className="mt-3.5 pt-3 border-t border-stone-800/60 flex items-center gap-3">
            <button
              onClick={handleSendTestPing}
              disabled={testSending}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {testSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Test Ping to Yash (6630021526)
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs text-emerald-400 mt-2 font-medium bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800">
              {statusMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-xs text-rose-300 mt-2 font-medium bg-rose-950/60 p-2.5 rounded-lg border border-rose-800 leading-relaxed">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 mb-6 text-xs text-stone-300 space-y-2">
          <p className="font-semibold text-rose-300 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Bhai 1 Minute Me Bot Token Kaise Banayein (100% Free):
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-stone-400">
            <li>Telegram app open karo aur search karo: <code className="text-amber-300 font-mono">@BotFather</code></li>
            <li>BotFather ko message bhejo: <code className="text-amber-300 font-mono">/newbot</code></li>
            <li>Apne bot ka naam rakho (e.g., <code className="text-stone-300 font-mono">Yash Cupid Bot</code>) aur username (e.g., <code className="text-stone-300 font-mono">yash_gudiya_bot</code>)</li>
            <li>BotFather aapko ek <b>HTTP API Token</b> dega (e.g., <code className="text-stone-300 font-mono">712345678:AAFlq...</code>). Use copy karo aur niche paste karo!</li>
            <li className="text-rose-300 font-medium">
              ⭐ <b>SABSE IMPORTANT:</b> Apne naye bot ko Telegram me open karke <b>START (/start)</b> zaroor dabao! (Bina start dabaye Telegram bot ko user ko message bhejne ki permission nahi deta).
            </li>
          </ol>
        </div>

        {/* Update Token Form */}
        <form onSubmit={handleSaveToken} className="mb-6 space-y-3">
          <label className="block text-xs font-medium text-stone-300 flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-rose-400" />
            Paste Real Bot Token Here:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. 712345678:AAFlqXYZ_example_token"
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 font-mono"
            />
            <button
              type="submit"
              disabled={isUpdating || !tokenInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isUpdating ? 'Saving...' : 'Save Token'}
            </button>
          </div>
        </form>

        {/* Live Activity Stream */}
        <div className="border-t border-stone-800/80 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Recent Actions Logged
            </h4>
            <span className="text-[11px] text-stone-500">{activities.length} events</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="p-3 rounded-xl bg-stone-950/40 text-center text-xs text-stone-500">
                No events recorded yet.
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-rose-300 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {act.eventType}
                    </span>
                    <span className="text-[10px] text-stone-500">{act.timestamp}</span>
                  </div>
                  <p className="text-stone-300 italic">"{act.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

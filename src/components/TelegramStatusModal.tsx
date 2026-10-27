import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, X, Shield, RefreshCw, KeyRound, Clock, Heart } from 'lucide-react';
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

    const res = await updateTelegramConfig(tokenInput.trim(), config.chat_id);
    setIsUpdating(false);
    if (res.success) {
      setStatusMessage('Bot token updated! Yash will receive live alerts.');
      setTokenInput('');
      loadConfig();
    } else {
      setStatusMessage(res.message || 'Error updating token');
    }
  };

  const handleSendTestPing = async () => {
    setTestSending(true);
    const res = await sendTelegramNotification({
      eventType: 'Test Ping',
      message: 'Yash! Telegram live connection verified. Gudiya ki har baat yahan aayegi ❤️',
      details: 'Test notification from Yash & Gudiya Birthday App',
    });
    setTestSending(false);
    setActivities(getLocalTelegramActivities());
    if (res.sent) {
      setStatusMessage('Test message sent to Telegram successfully!');
    } else if (res.simulated) {
      setStatusMessage('Demo Mode: Notification recorded! Add real bot token for direct delivery.');
    } else {
      setStatusMessage('Test failed. Please check your bot token.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif-romance font-semibold text-stone-100">
              Yash's Telegram Hotwire
            </h3>
            <p className="text-xs text-stone-400">
              Direct live connection to Yash's Telegram ID: <span className="font-mono text-rose-300">6630021526</span>
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-400">Bot Status</span>
            {config.isDemo ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50">
                <AlertCircle className="w-3.5 h-3.5" /> Demo Token (xxxxx)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Connected
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            {config.isDemo
              ? "App is currently running with demo token 'xxxxx'. Every action by Gudiya is tracked and logged. To get instant real-time Telegram pings on your phone, paste your Bot Token below!"
              : `Active Token: ${config.bot_token_preview}. Gudiya's birthday wishes and vows will ring on Yash's phone!`}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleSendTestPing}
              disabled={testSending}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {testSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-sky-400" />}
              Send Test Ping
            </button>
          </div>
        </div>

        {/* Update Token Form */}
        <form onSubmit={handleSaveToken} className="mb-6 space-y-3">
          <label className="block text-xs font-medium text-stone-300 flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-rose-400" />
            Update Bot Token (or edit <code className="text-[11px] text-amber-300">/telegram_config/bot_token.json</code>)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste Telegram Bot Token (e.g. 712345678:ABC...)"
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 font-mono"
            />
            <button
              type="submit"
              disabled={isUpdating || !tokenInput.trim()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
            >
              {isUpdating ? 'Saving...' : 'Save Token'}
            </button>
          </div>
          {statusMessage && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{statusMessage}</p>
          )}
          <p className="text-[11px] text-stone-500 leading-normal">
            💡 How to get a token in 30 seconds: Open Telegram, search <span className="text-stone-300 font-mono">@BotFather</span>, type <span className="text-stone-300 font-mono">/newbot</span>, give it a name like "YashGudiyaLoveBot", copy the HTTP API token, and paste it here!
          </p>
        </form>

        {/* Activity Logs Feed */}
        <div className="border-t border-stone-800/80 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Live Activity Stream (What Gudiya Did)
            </h4>
            <span className="text-[11px] text-stone-500">{activities.length} events logged</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="p-4 rounded-xl bg-stone-950/40 text-center text-xs text-stone-500">
                No activities yet. When Gudiya blows the candles or answers prompts, they will show up here!
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-rose-300 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {act.eventType}
                    </span>
                    <span className="text-[10px] text-stone-500">{act.timestamp}</span>
                  </div>
                  <p className="text-stone-300 italic">"{act.message}"</p>
                  {act.details && (
                    <p className="text-[11px] text-stone-500 mt-1 font-mono">{act.details}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

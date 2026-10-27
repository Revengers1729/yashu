import { TelegramActivity, TelegramConfigState } from '../types';

export async function fetchTelegramConfig(): Promise<TelegramConfigState> {
  try {
    const res = await fetch('/api/telegram-config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch telegram config:', err);
  }
  return {
    chat_id: '6630021526',
    hasToken: false,
    isDemo: true,
    bot_token_preview: 'xxxxx (Demo Token)',
  };
}

export async function updateTelegramConfig(botToken: string, chatId: string = '6630021526'): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/telegram-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bot_token: botToken, chat_id: chatId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
  return { success: false, message: 'Failed to update token' };
}

export async function sendTelegramNotification(payload: {
  eventType: string;
  message: string;
  details?: string;
}): Promise<{ success: boolean; sent?: boolean; simulated?: boolean; message?: string; log?: TelegramActivity }> {
  try {
    const res = await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    // Cache locally in localStorage for Gudiya to view
    if (data.log) {
      saveActivityLocal(data.log);
    }
    return data;
  } catch (err: any) {
    console.error('Error notifying Telegram:', err);
    const fallbackLog: TelegramActivity = {
      id: Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      eventType: payload.eventType,
      message: payload.message,
      status: 'simulated',
      details: payload.details,
    };
    saveActivityLocal(fallbackLog);
    return { success: true, simulated: true, log: fallbackLog };
  }
}

function saveActivityLocal(log: TelegramActivity) {
  try {
    const existingStr = localStorage.getItem('yash_gudiya_telegram_logs');
    const logs: TelegramActivity[] = existingStr ? JSON.parse(existingStr) : [];
    logs.unshift(log);
    localStorage.setItem('yash_gudiya_telegram_logs', JSON.stringify(logs.slice(0, 30)));
  } catch (e) {
    // Ignore storage errors
  }
}

export function getLocalTelegramActivities(): TelegramActivity[] {
  try {
    const str = localStorage.getItem('yash_gudiya_telegram_logs');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
}

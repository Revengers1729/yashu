import { TelegramActivity, TelegramConfigState } from '../types';

export const DEFAULT_BOT_TOKEN = '8378037937:AAFxrAIx89Oq5Gf13Ht0e_xEiAS4CXqkOTM';
export const DEFAULT_CHAT_ID = '6630021526';

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatClientCupidHtml(eventType: string, rawMessage: string, rawDetails?: string): string {
  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' });
  const cleanMsg = escapeHtml(rawMessage);
  const cleanDetails = rawDetails ? escapeHtml(rawDetails) : '';

  if (eventType.includes('Suspense Box') || eventType.includes('Box Unlocked')) {
    return `🚨 <b>BHAI YASH! SURPRISE SHURU HO GAYA!</b> 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n\n` +
      `🎁 Bhabhi (Gudiya) ne Birthday Surprise Box unlock kar liya hai!\n` +
      `Uske chehre pe pakka badi si smile aa chuki hogi. Dil thaam ke baith, aage dekhte ja kya karti hai! 🥳❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🤫 <i>(Gudiya ko bilkul pata nahi hai ki yeh msg tujhe aa raha hai!)</i>`;
  }

  if (eventType.includes('Candles Blown') || eventType.includes('Candle')) {
    return `🎂 <b>BHAI CAKE KI CANDLES BHOOJH GAYI!</b> 🎂\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n\n` +
      `✨ Gudiya ne screen pe candles blow kar di hain aur aakhon me sapne leke birthday wish soch rahi hai!\n` +
      `Taiyar reh, dekh uski wish kya aati hai! 🍰❤️`;
  }

  if (eventType.includes('Secret Birthday Wish') || eventType.includes('Wish')) {
    return `👑 <b>BHAI YASH! GUDIYA KI BIRTHDAY WISH AA GAYI!</b> 👑\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n\n` +
      `💌 <b>Gudiya Ne Dil Se Yeh Wish Maangi Hai:</b>\n` +
      `👉 "${cleanMsg}"\n\n` +
      `🥺❤️ Bhai sun, chahe aasmaan se taare todne padein, bhabhi ki yeh wish poori karna tera farz hai ab!`;
  }

  if (eventType.includes('Prem Kahani') || eventType.includes('Story')) {
    return `📖 <b>BHAI! GUDIYA PREM KAHANI PADHI RAHI HAI!</b> 📖\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n` +
      `📌 <b>Chapter:</b> ${escapeHtml(eventType)}\n\n` +
      `💬 <b>Uska Real Reaction / Choice:</b>\n` +
      `👉 "${cleanMsg}"\n\n` +
      `😂❤️ Bhai tere 3 AM ke kisse padh ke muskura rahi hai wo! Pyar ka meter full speed pe hai!`;
  }

  if (eventType.includes('Chat') || eventType.includes('Dil Ki Baat')) {
    return `💬 <b>YASH TERA POL KHULA YA PYAAR BADHA?</b> 😂❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n` +
      `📌 <b>Topic:</b> ${escapeHtml(eventType)}\n\n` +
      `👉 <b>Gudiya Ka Jawab:</b>\n"${cleanMsg}"\n\n` +
      `🫂 Dekh bhai, Gudiya kitna sach aur pyaar se reply de rahi hai! Tu bohot kismat wala hai re!`;
  }

  if (eventType.includes('GRAND FINALE') || eventType.includes('Shadi') || eventType.includes('Vow')) {
    return `💍🎉 <b>OYYE YASHHHH! SHERWANI SILWA LE BHAI!</b> 🎉💍\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n\n` +
      `👰‍♀️ Bhabhi ne Dulhan (k.jpg) aur Budhe Hone Tak (kk.jpg) ka saara plan dekh liya aur FOREVER VOW CONTRACT SIGN KAR DIYA HAI!\n\n` +
      `📝 <b>Signature / Details:</b>\n"${cleanMsg}"\n\n` +
      `👵🧓 80 saal tak balcony me chai peene ka deal 100% DONE ho chuka hai!\n` +
      `Mubarak ho bhai, Gudiya officially sirf aur sirf teri hai! ❤️👑🥂`;
  }

  if (eventType.includes('Kiss') || eventType.includes('Love Letter')) {
    return `💋❤️ <b>BHAI YASH! GUDIYA NE KISS BHEJA HAI!</b> 💋❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n\n` +
      `Gudiya ne tera handmade love letter poora padha aur dil se kiss & hug seal kar diya hai!\n` +
      `Ab call karke bol: 'I love you Gudiya'! 🥰`;
  }

  return `💌 <b>GUDIYA ACTIVITY REPORT (Secret Agent Yash)</b> 💌\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⏰ <b>Time:</b> ${timeStr}, ${dateStr}\n` +
    `✨ <b>Action:</b> ${escapeHtml(eventType)}\n` +
    `💬 <b>Gudiya Ka Input:</b> \n"${cleanMsg}"\n` +
    (cleanDetails ? `\n📌 <b>Extra Info:</b> ${cleanDetails}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `❤️ Yash & Gudiya — Chat se shadi aur budhe hone tak!`;
}

function getStoredToken(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('yash_telegram_bot_token');
    if (custom && custom !== 'xxxxx') return custom;
  }
  return DEFAULT_BOT_TOKEN;
}

function getStoredChatId(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('yash_telegram_chat_id');
    if (custom) return custom;
  }
  return DEFAULT_CHAT_ID;
}

export async function fetchTelegramConfig(): Promise<TelegramConfigState> {
  try {
    const res = await fetch('/api/telegram-config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Netlify static fallback
  }

  const token = getStoredToken();
  const chatId = getStoredChatId();
  const isDemo = !token || token === 'xxxxx';
  return {
    chat_id: chatId,
    hasToken: !isDemo,
    isDemo,
    bot_token_preview: isDemo ? 'xxxxx (Demo)' : `${token.slice(0, 5)}...${token.slice(-4)}`,
  };
}

export async function updateTelegramConfig(
  botToken: string,
  chatId: string = DEFAULT_CHAT_ID
): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('yash_telegram_bot_token', botToken.trim());
    localStorage.setItem('yash_telegram_chat_id', chatId.trim());
  }

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
    // If Netlify static hosting (no backend route), saving to localStorage is already success!
  }

  return { success: true, message: 'Telegram token saved locally for Netlify!' };
}

// Direct client-side telegram dispatch (works everywhere on Netlify without any backend server!)
async function sendDirectToTelegram(payload: {
  eventType: string;
  message: string;
  details?: string;
}) {
  const token = getStoredToken();
  const chatId = getStoredChatId();

  if (!token || token === 'xxxxx') {
    return { success: true, simulated: true, sent: false, message: 'Demo token' };
  }

  const htmlText = formatClientCupidHtml(payload.eventType, payload.message, payload.details);
  const plainText = `💌 GUDIYA ALERT for Yash!\nAction: ${payload.eventType}\n"${payload.message}"\n❤️ Yash & Gudiya Forever!`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
      }),
    });

    let data = (await res.json()) as { ok: boolean; description?: string; error_code?: number };

    // Fallback to plain text if HTML had parse error
    if (!data.ok && res.status === 400) {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
        }),
      });
      data = (await res.json()) as { ok: boolean; description?: string; error_code?: number };
    }

    return {
      success: data.ok,
      sent: data.ok,
      error: data.description,
      error_code: data.error_code,
      message: data.ok ? 'Delivered to Yash on Telegram!' : data.description,
    };
  } catch (err: any) {
    return { success: false, sent: false, error: err.message };
  }
}

export async function sendTelegramNotification(payload: {
  eventType: string;
  message: string;
  details?: string;
}): Promise<{
  success: boolean;
  sent?: boolean;
  simulated?: boolean;
  message?: string;
  error?: string;
  error_code?: number;
  note?: string;
  log?: TelegramActivity;
}> {
  let result: any = null;

  // 1. First attempt via backend route (works in local dev / express)
  try {
    const res = await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      result = await res.json();
    }
  } catch (err) {
    // If backend route unavailable (like static Netlify deployment), failover to direct dispatch
  }

  // 2. If backend was not available or not on express, send directly from client to Telegram!
  if (!result || !result.sent) {
    const directResult = await sendDirectToTelegram(payload);
    if (directResult.sent) {
      result = directResult;
    } else if (!result) {
      result = directResult;
    }
  }

  const logEntry: TelegramActivity = {
    id: Math.random().toString(36).slice(2, 9),
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    eventType: payload.eventType,
    message: payload.message,
    status: result?.sent ? 'sent' : 'simulated',
    details: payload.details,
  };

  saveActivityLocal(logEntry);
  return { ...result, log: logEntry };
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

import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const CONFIG_FILE_PATH = path.join(__dirname, 'telegram_config', 'bot_token.json');

if (!fs.existsSync(path.join(__dirname, 'telegram_config'))) {
  fs.mkdirSync(path.join(__dirname, 'telegram_config'), { recursive: true });
}

interface TelegramConfig {
  bot_token: string;
  chat_id: string;
  note?: string;
}

function getTelegramConfig(): TelegramConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading telegram config:', err);
  }
  return {
    bot_token: process.env.TELEGRAM_BOT_TOKEN || '8378037937:AAFxrAIx89Oq5Gf13Ht0e_xEiAS4CXqkOTM',
    chat_id: process.env.TELEGRAM_CHAT_ID || '6630021526',
  };
}

function saveTelegramConfig(config: TelegramConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving telegram config:', err);
    return false;
  }
}

interface ActivityLog {
  id: string;
  timestamp: string;
  eventType: string;
  message: string;
  status: 'sent' | 'simulated' | 'failed';
  details?: string;
  errorInfo?: string;
}
const recentActivities: ActivityLog[] = [];

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Generate rich, funny, and emotional HTML formatted message for Yash
function formatYashCupidHtml(eventType: string, rawMessage: string, rawDetails?: string): string {
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

// Plain text version in case Telegram rejects HTML
function formatYashCupidPlainText(eventType: string, rawMessage: string): string {
  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  return `💌 GUDIYA ALERT for Yash!\n` +
    `Time: ${timeStr}\n` +
    `Action: ${eventType}\n` +
    `Input: "${rawMessage}"\n` +
    `❤️ Yash & Gudiya Forever!`;
}

// API: Get Telegram status & config
app.get('/api/telegram-config', (req: Request, res: Response) => {
  const config = getTelegramConfig();
  const isDemo = !config.bot_token || config.bot_token.trim() === 'xxxxx';
  res.json({
    chat_id: config.chat_id || '6630021526',
    hasToken: !isDemo,
    isDemo,
    bot_token_preview: isDemo ? 'xxxxx (Demo Token - Needs Real Bot Token!)' : `${config.bot_token.slice(0, 5)}...${config.bot_token.slice(-4)}`,
  });
});

// API: Update Telegram Token
app.post('/api/telegram-config', (req: Request, res: Response) => {
  const { bot_token, chat_id } = req.body;
  const current = getTelegramConfig();
  const updated: TelegramConfig = {
    ...current,
    bot_token: bot_token !== undefined ? String(bot_token).trim() : current.bot_token,
    chat_id: chat_id !== undefined ? String(chat_id).trim() : current.chat_id,
  };
  const success = saveTelegramConfig(updated);
  const isDemo = !updated.bot_token || updated.bot_token === 'xxxxx';

  res.json({
    success,
    message: success ? 'Telegram token saved!' : 'Failed to save config',
    config: {
      chat_id: updated.chat_id,
      isDemo,
      bot_token_preview: isDemo ? 'xxxxx (Demo)' : `${updated.bot_token.slice(0, 5)}...`,
    },
  });
});

// API: Send notification to Yash on Telegram (Robust with HTML + Plaintext fallback)
app.post('/api/telegram-notify', async (req: Request, res: Response) => {
  const { eventType, message, details, customToken } = req.body;
  const config = getTelegramConfig();
  const tokenToUse = (customToken || config.bot_token || '').trim();
  const chatIdToUse = (config.chat_id || '6630021526').trim();

  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' });

  const htmlText = formatYashCupidHtml(eventType || 'Activity', message || '', details);
  const plainText = formatYashCupidPlainText(eventType || 'Activity', message || '');

  const logEntry: ActivityLog = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: `${timeStr}, ${dateStr}`,
    eventType: eventType || 'Action',
    message: message || '',
    status: 'simulated',
    details: details || '',
  };

  // Check if token is the dummy / demo token "xxxxx"
  if (!tokenToUse || tokenToUse === 'xxxxx') {
    logEntry.status = 'simulated';
    logEntry.errorInfo = 'Demo token "xxxxx" active. Enter real Bot token to send to Telegram.';
    recentActivities.unshift(logEntry);
    if (recentActivities.length > 50) recentActivities.pop();

    console.log(`[TELEGRAM NOTIFY SIMULATED - TOKEN IS "xxxxx"] Chat ID: ${chatIdToUse}\n${plainText}`);
    return res.json({
      success: true,
      sent: false,
      simulated: true,
      reason: 'TOKEN_IS_DEMO_XXXXX',
      message: 'Demo token "xxxxx" is active. To receive messages on Telegram, Yash must provide his BotFather bot token in telegram_config/bot_token.json or via settings!',
      log: logEntry,
    });
  }

  // Real Telegram API Call with HTML parse_mode
  try {
    const telegramUrl = `https://api.telegram.org/bot${tokenToUse}/sendMessage`;
    let response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatIdToUse,
        text: htmlText,
        parse_mode: 'HTML',
      }),
    });

    let data = (await response.json()) as { ok: boolean; description?: string; error_code?: number };

    // If HTML failed (e.g. 400 Bad Request), retry with plain text
    if (!data.ok && response.status === 400) {
      console.warn('HTML format failed, retrying plain text:', data.description);
      response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatIdToUse,
          text: plainText,
        }),
      });
      data = (await response.json()) as { ok: boolean; description?: string; error_code?: number };
    }

    if (data.ok) {
      logEntry.status = 'sent';
      recentActivities.unshift(logEntry);
      if (recentActivities.length > 50) recentActivities.pop();
      return res.json({
        success: true,
        sent: true,
        message: 'Message delivered to Yash on Telegram!',
        log: logEntry,
      });
    } else {
      logEntry.status = 'failed';
      logEntry.errorInfo = data.description || 'Telegram API error';
      recentActivities.unshift(logEntry);

      console.warn(`[TELEGRAM API ERROR] Code: ${data.error_code} - ${data.description}`);
      return res.json({
        success: false,
        sent: false,
        error_code: data.error_code,
        error: data.description || 'Telegram API error',
        note: data.error_code === 403
          ? "Yash has not pressed /start in the bot yet! Open the bot in Telegram and click START."
          : data.error_code === 404
          ? "Invalid Bot Token! Please verify token from @BotFather."
          : data.description,
        log: logEntry,
      });
    }
  } catch (error: any) {
    console.error('Failed to dispatch telegram notification:', error);
    logEntry.status = 'failed';
    logEntry.errorInfo = error.message || 'Network error';
    recentActivities.unshift(logEntry);
    return res.json({
      success: false,
      sent: false,
      error: error.message || 'Network error',
      log: logEntry,
    });
  }
});

// API: Get recent notification logs (for Yash's setup tool)
app.get('/api/telegram-logs', (req: Request, res: Response) => {
  res.json({ logs: recentActivities });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev: ${isDev})`);
  });
}

startServer();

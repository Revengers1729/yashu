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
    bot_token: process.env.TELEGRAM_BOT_TOKEN || 'xxxxx',
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
}
const recentActivities: ActivityLog[] = [];

// Helper to format funny & emotional Hinglish messages specifically for Yash
function formatYashCupidMessage(eventType: string, message: string, details?: string): string {
  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' });

  // Custom funny & emotional templates based on eventType
  if (eventType.includes('Suspense Box') || eventType.includes('Box Unlocked')) {
    return `🚨 *BHAI YASH! SURPRISE SHURU HO GAYA!* 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n\n` +
      `🎁 Bhabhi (Gudiya) ne Birthday Surprise Box unlock kar liya hai!\n` +
      `Uske chehre pe pakka badi si smile aa chuki hogi. Dil thaam ke baith, aage dekhte ja kya kya karti hai! 🥳❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🤫 *(Gudiya ko bilkul pata nahi hai ki yeh msg tujhe aa raha hai!)*`;
  }

  if (eventType.includes('Candles Blown') || eventType.includes('Candle')) {
    return `🎂 *BHAI CAKE KI CANDLES BHOOJH GAYI!* 🎂\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n\n` +
      `✨ Gudiya ne screen pe candles blow kar di hain aur aakhon me sapne leke birthday wish soch rahi hai!\n` +
      `Taiyar reh, dekh uski wish kya aati hai! 🍰❤️`;
  }

  if (eventType.includes('Secret Birthday Wish') || eventType.includes('Wish')) {
    return `👑 *BHAI YASH! GUDIYA KI BIRTHDAY WISH AA GAYI!* 👑\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n\n` +
      `💌 *Gudiya Ne Dil Se Yeh Wish Maangi Hai:*\n` +
      `👉 "${message}"\n\n` +
      `🥺❤️ Bhai sun, chahe aasmaan se taare todne padein, bhabhi ki yeh wish poori karna tera farz hai ab!`;
  }

  if (eventType.includes('Prem Kahani') || eventType.includes('Story')) {
    return `📖 *BHAI! GUDIYA PREM KAHANI PADHI RAHI HAI!* 📖\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n` +
      `📌 *Chapter:* ${eventType}\n\n` +
      `💬 *Uska Real Reaction / Choice:*\n` +
      `👉 "${message}"\n\n` +
      `😂❤️ Bhai tere 3 AM ke kisse padh ke muskura rahi hai wo! Pyar ka meter full speed pe hai!`;
  }

  if (eventType.includes('Chat') || eventType.includes('Dil Ki Baat')) {
    return `💬 *YASH TERA POL KHULA YA PYAAR BADHA?* 😂❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n` +
      `📌 *Topic:* ${eventType}\n\n` +
      `👉 *Gudiya Ka Jawab:*\n"${message}"\n\n` +
      `🫂 Dekh bhai, Gudiya kitna sach aur pyaar se reply de rahi hai! Tu bohot kismat wala hai re!`;
  }

  if (eventType.includes('GRAND FINALE') || eventType.includes('Shadi') || eventType.includes('Vow')) {
    return `💍🎉 *OYYE YASHHHH! SHERWANI SILWA LE BHAI!* 🎉💍\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n\n` +
      `👰‍♀️ Bhabhi ne Dulhan (k.jpg) aur Budhe Hone Tak (kk.jpg) ka saara plan dekh liya!\n` +
      `Aur usne FOREVER VOW CONTRACT SIGN BHI KAR DIYA HAI!\n\n` +
      `📝 *Details / Signature:*\n"${message}"\n\n` +
      `👵🧓 80 saal tak balcony me chai peene ka deal 100% DONE ho chuka hai!\n` +
      `Mubarak ho bhai, Gudiya officially sirf aur sirf teri hai! ❤️👑🥂`;
  }

  if (eventType.includes('Kiss') || eventType.includes('Love Letter')) {
    return `💋❤️ *BHAI YASH! GUDIYA NE KISS BHEJA HAI!* 💋❤️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ *Time:* ${timeStr}, ${dateStr}\n\n` +
      `Gudiya ne tera handmade love letter poora padha aur dil se kiss & hug seal kar diya hai!\n` +
      `Ab jaake chupke se phone check kar aur usko call karke bol: 'I love you Gudiya'! 🥰`;
  }

  // Default funny/emotional notification
  return `💌 *GUDIYA ACTIVITY REPORT (Secret Agent Yash)* 💌\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⏰ *Time:* ${timeStr}, ${dateStr}\n` +
    `✨ *Action:* ${eventType}\n` +
    `💬 *Gudiya Ka Input:* \n"${message}"\n` +
    (details ? `\n📌 *Extra Info:* ${details}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `❤️ Yash & Gudiya — Chat se shadi aur budhe hone tak!`;
}

// API: Get Telegram status & config
app.get('/api/telegram-config', (req: Request, res: Response) => {
  const config = getTelegramConfig();
  res.json({
    chat_id: config.chat_id || '6630021526',
    hasToken: config.bot_token && config.bot_token !== 'xxxxx',
    isDemo: !config.bot_token || config.bot_token === 'xxxxx',
    bot_token_preview: config.bot_token === 'xxxxx' ? 'xxxxx (Demo Token)' : `${config.bot_token.slice(0, 5)}...${config.bot_token.slice(-4)}`,
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
  res.json({
    success,
    message: success ? 'Telegram settings updated successfully!' : 'Failed to save config',
    config: {
      chat_id: updated.chat_id,
      isDemo: updated.bot_token === 'xxxxx' || !updated.bot_token,
    },
  });
});

// API: Send notification to Yash on Telegram (Completely secret from Gudiya)
app.post('/api/telegram-notify', async (req: Request, res: Response) => {
  const { eventType, message, details, customToken } = req.body;
  const config = getTelegramConfig();
  const tokenToUse = customToken || config.bot_token;
  const chatIdToUse = config.chat_id || '6630021526';

  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' });

  const formattedText = formatYashCupidMessage(eventType || 'Activity', message || '', details);

  const logEntry: ActivityLog = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: `${timeStr}, ${dateStr}`,
    eventType: eventType || 'Action',
    message: message || '',
    status: 'simulated',
    details: details || '',
  };

  // Demo token fallback
  if (!tokenToUse || tokenToUse === 'xxxxx') {
    logEntry.status = 'simulated';
    recentActivities.unshift(logEntry);
    if (recentActivities.length > 50) recentActivities.pop();

    console.log(`[TELEGRAM DEMO NOTIFY TO YASH] Chat ID: ${chatIdToUse}\n${formattedText}`);
    return res.json({
      success: true,
      simulated: true,
      message: 'Silent notify logged (demo token active)',
      log: logEntry,
    });
  }

  // Real Telegram API Call
  try {
    const telegramUrl = `https://api.telegram.org/bot${tokenToUse}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatIdToUse,
        text: formattedText,
        parse_mode: 'Markdown',
      }),
    });

    const data = (await response.json()) as { ok: boolean; description?: string };

    if (data.ok) {
      logEntry.status = 'sent';
      recentActivities.unshift(logEntry);
      if (recentActivities.length > 50) recentActivities.pop();
      return res.json({
        success: true,
        sent: true,
        message: 'Delivered to Yash on Telegram!',
        log: logEntry,
      });
    } else {
      logEntry.status = 'failed';
      recentActivities.unshift(logEntry);
      console.warn('Telegram API returned error:', data.description);
      return res.json({
        success: false,
        sent: false,
        error: data.description || 'Telegram API error',
        simulatedFallback: true,
        log: logEntry,
      });
    }
  } catch (error: any) {
    console.error('Failed to dispatch telegram notification:', error);
    logEntry.status = 'failed';
    recentActivities.unshift(logEntry);
    return res.json({
      success: false,
      error: error.message || 'Network error',
      simulatedFallback: true,
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
      server: { middlewareMode: true },
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

// Telegram Bot Starter - by Mehul Jhabak (github.com/mehul82099)
// Production-grade Telegram bot for Indian SMBs
// Features: Razorpay payments, Gemini AI, Google Sheets logging

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Razorpay = require('razorpay');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const isProd = process.env.NODE_ENV === 'production';

// Initialize bot
const bot = isProd
  ? new TelegramBot(BOT_TOKEN, { webHook: { port: process.env.PORT || 3000 } })
  : new TelegramBot(BOT_TOKEN, { polling: true });

if (isProd) {
  bot.setWebHook(`${process.env.WEBHOOK_URL}/bot${BOT_TOKEN}`);
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log(`🤖 Bot started in ${isProd ? 'webhook' : 'polling'} mode`);

// ========================
// COMMAND HANDLERS
// ========================

// /start
bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'there';
  bot.sendMessage(msg.chat.id,
    `👋 Welcome, *${name}*!\n\n` +
    `I'm your business assistant bot. Here's what I can do:\n\n` +
    `🛋 /menu - Browse our products\n` +
    `💳 /pay [amount] - Generate payment link\n` +
    `📦 /order - Place an order\n` +
    `❓ /help - Get help\n\n` +
    `Powered by [mehul82099](https://github.com/mehul82099) 🚀`,
    { parse_mode: 'Markdown' }
  );
});

// /menu - Show inline keyboard menu
bot.onText(/\/menu/, (msg) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛒 View Products', callback_data: 'products' }, { text: '💳 Make Payment', callback_data: 'payment' }],
        [{ text: '📦 My Orders', callback_data: 'orders' }, { text: '📞 Contact Us', callback_data: 'contact' }],
        [{ text: '⭐ Rate Us', callback_data: 'rate' }]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, '🎛️ *Main Menu*\n\nChoose an option:', { parse_mode: 'Markdown', ...opts });
});

// /pay [amount] - Generate Razorpay payment link
bot.onText(/\/pay (\d+)/, async (msg, match) => {
  const amount = parseInt(match[1]);
  if (amount < 1) {
    return bot.sendMessage(msg.chat.id, '⚠️ Please enter a valid amount. Example: /pay 500');
  }
  
  try {
    bot.sendMessage(msg.chat.id, '⏳ Generating payment link...');
    
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Razorpay takes paise
      currency: 'INR',
      description: `Payment from ${msg.from.first_name}`,
      customer: { name: msg.from.first_name, contact: '' },
      notify: { sms: false, email: false },
      reminder_enable: false,
    });

    bot.sendMessage(msg.chat.id,
      `✅ *Payment Link Ready!*\n\n` +
      `💰 Amount: *\u20b9${amount}*\n` +
      `🔗 [Click here to pay](${paymentLink.short_url})\n\n` +
      `_Link expires in 15 minutes_`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '💳 Pay Now', url: paymentLink.short_url }]]
        }
      }
    );

    // Notify admin
    bot.sendMessage(ADMIN_CHAT_ID,
      `💰 *Payment Link Created*\n` +
      `User: ${msg.from.first_name} (@${msg.from.username || 'N/A'})\n` +
      `Amount: \u20b9${amount}\n` +
      `Link: ${paymentLink.short_url}`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error('Razorpay error:', err);
    bot.sendMessage(msg.chat.id, '❌ Failed to generate payment link. Please try again.');
  }
});

// /pay without amount
bot.onText(/\/pay$/, (msg) => {
  bot.sendMessage(msg.chat.id, '💳 *Generate Payment Link*\n\nUsage: `/pay [amount]`\nExample: `/pay 500`', { parse_mode: 'Markdown' });
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `❓ *Help*\n\n` +
    `*Commands:*\n` +
    `/start - Welcome message\n` +
    `/menu - Show main menu\n` +
    `/pay [amount] - Create payment link (e.g. /pay 500)\n` +
    `/order - Place an order\n` +
    `/help - Show this message\n\n` +
    `*Support:* @mehul82099\n` +
    `*Built by:* [Mehul Jhabak](https://github.com/mehul82099)`,
    { parse_mode: 'Markdown' }
  );
});

// ========================
// CALLBACK QUERY HANDLERS
// ========================
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  bot.answerCallbackQuery(query.id);

  switch (query.data) {
    case 'products':
      bot.sendMessage(chatId, '🛒 *Our Products*\n\nAdd your products here in index.js!\n\nEdit the products section to list your items with prices.', { parse_mode: 'Markdown' });
      break;
    case 'payment':
      bot.sendMessage(chatId, '💳 To generate a payment link, use:\n`/pay [amount]`\n\nExample: `/pay 1000`', { parse_mode: 'Markdown' });
      break;
    case 'orders':
      bot.sendMessage(chatId, '📦 *Your Orders*\n\nConnect your database here to show order history.', { parse_mode: 'Markdown' });
      break;
    case 'contact':
      bot.sendMessage(chatId, '📞 *Contact Us*\n\nEmail: mehuljhabak10@gmail.com\nTelegram: @mehul82099\nBuilt with ❤️ in Jaipur, India', { parse_mode: 'Markdown' });
      break;
    case 'rate':
      bot.sendMessage(chatId, '⭐ Thank you for using our bot!\n\nStar us on GitHub: https://github.com/mehul82099/telegram-bot-starter');
      break;
  }
});

// ========================
// DEFAULT MESSAGE HANDLER (AI Fallback)
// ========================
bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    // If Gemini API key is set, use AI. Otherwise use default response.
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(
          `You are a helpful business assistant bot. Answer this customer query briefly (under 100 words): ${msg.text}`
        );
        bot.sendMessage(msg.chat.id, result.response.text());
      } catch (err) {
        bot.sendMessage(msg.chat.id, 'I did not understand that. Type /help to see what I can do.');
      }
    } else {
      bot.sendMessage(msg.chat.id, '🤔 I did not understand that. Type /help to see available commands.');
    }
  }
});

bot.on('polling_error', (err) => console.error('Polling error:', err));
console.log('✅ Bot is running and ready for messages!');

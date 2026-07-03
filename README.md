<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2CA5E0,100:0077B5&height=200&section=header&text=Telegram%20Bot%20Starter&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Production-Grade%20Telegram%20Bot%20for%20Indian%20SMBs&descAlignY=56&descSize=16&descColor=d0eeff" width="100%"/>

[![Stars](https://img.shields.io/github/stars/mehul82099/telegram-bot-starter?style=for-the-badge&color=f7c948&labelColor=0d1117)](https://github.com/mehul82099/telegram-bot-starter/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&labelColor=0d1117)]()
[![License](https://img.shields.io/badge/License-MIT-46E3B7?style=for-the-badge&labelColor=0d1117)](LICENSE)

**The only Telegram bot template you'll ever need for your Indian business.**

</div>

---

## ⚡ Features

```
✅ Command handler architecture (/start, /menu, /order, /pay, /help)
✅ Inline keyboard menus with callback handlers
✅ Razorpay payment link generation via bot
✅ Google Sheets logging (orders, leads, messages)
✅ Gemini AI auto-reply for unknown messages
✅ Broadcast messages to all users
✅ Admin panel commands (stats, export, broadcast)
✅ Rate limiting & spam protection
✅ Webhook mode (production) + polling mode (dev)
✅ One-click deploy to Render.com (free tier)
```

---

## 📁 Project Structure

```
telegram-bot-starter/
├── index.js              # Entry point
├── src/
│   ├── bot.js             # Bot initialization & middleware
│   ├── commands/
│   │   ├── start.js       # /start command
│   │   ├── menu.js        # /menu with inline keyboard
│   │   ├── order.js       # /order command
│   │   ├── pay.js         # /pay - Razorpay link gen
│   │   └── admin.js       # Admin-only commands
│   ├── handlers/
│   │   ├── callbacks.js   # Inline button callbacks
│   │   └── messages.js    # Default message handler (AI)
│   ├── services/
│   │   ├── razorpay.js    # Payment link service
│   │   ├── sheets.js      # Google Sheets service
│   │   └── gemini.js      # Gemini AI service
│   └── utils/
│       ├── logger.js      # Logging utility
│       └── helpers.js     # Phone/INR formatting utils
├── .env.example          # Environment variables template
├── package.json
└── render.yaml           # One-click Render deploy config
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/mehul82099/telegram-bot-starter
cd telegram-bot-starter

# 2. Install
npm install

# 3. Setup environment
cp .env.example .env
nano .env   # Add your keys

# 4. Run in dev mode (polling)
npm run dev

# 5. Deploy to production (webhook)
npm start
```

---

## 🔧 Environment Variables

```env
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ADMIN_CHAT_ID=your_telegram_chat_id

# Razorpay (for /pay command)
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=your_secret

# Gemini AI (for smart auto-replies)
GEMINI_API_KEY=your_gemini_api_key

# Google Sheets (for logging)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your@service.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_sheet_id

# Production webhook
WEBHOOK_URL=https://your-app.onrender.com
PORT=3000
```

---

## 💳 Razorpay Payment Flow

```
User types /pay 500
  → Bot creates Razorpay payment link for ₹500
  → Sends link with inline button
  → On payment.captured webhook
  → Bot sends confirmation to user
  → Logs to Google Sheets
  → Notifies admin
```

---

## 🇮🇳 Indian Business Ready

```
✅ IST timezone in all logs and messages
✅ ₹ (INR) currency formatting
✅ Indian mobile number validation
✅ Hindi text support (Unicode)
✅ Razorpay UPI & card payment links
✅ GST amount calculation helper
```

---

## 📦 Deploy to Render (Free)

1. Fork this repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your fork
4. Add environment variables
5. Deploy — live in 2 minutes

---

## 💬 Support

- 🐛 [Issues](https://github.com/mehul82099/telegram-bot-starter/issues)
- 📢 Telegram: [@mehul82099](https://t.me/mehul82099)
- 🔗 Related: [n8n-smb-toolkit](https://github.com/mehul82099/n8n-smb-toolkit) | [ai-agents-india](https://github.com/mehul82099/ai-agents-india)

---

<div align="center">

**⭐ Star this if it saves you hours of setup time!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0077B5,100:2CA5E0&height=120&section=footer" width="100%"/>

</div>

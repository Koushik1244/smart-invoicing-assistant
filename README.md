# Smart Invoicing Assistant
> AI-powered invoice and payment automation for Indian small businesses

---

## Problem

Small businesses (kirana stores, freelancers, traders) lose money chasing payments manually across fragmented apps — no smart notifications, no context-aware reminders, no visibility into who pays late.

## Solution

A context-aware system that automates invoicing, decides when to send/delay/suppress/escalate reminders using AI, sends real emails via Nodemailer, and eliminates all manual follow-up work.

---

## Features

- GST-compliant invoice generation with PDF download
- UPI QR code per invoice
- Smart reminder engine (5 context-aware rules: SUPPRESS / DELAY / SEND / ESCALATE)
- Gemini AI message generation in 5 languages (Hinglish, English, Hindi, Marathi, Tamil)
- **Real email sending** via Nodemailer + Gmail SMTP (invoice creation + reminders)
- **Notification inbox** with priority levels, bell dropdown, 30s polling
- **Busy Mode** — pause all reminders with one toggle (synced to backend)
- **AI Insights** — Gemini-generated business insights with icon + title
- **Customer Health Score** — 0–100 score per customer (payment rate, overdue, ignored)
- **Priority Score Engine** — numeric 0–110 score per invoice based on overdue days, amount, ignored count
- Voice invoice creation (Web Speech API + Gemini parser)
- Advanced analytics: top customers, products, payment patterns
- Activity tracking: respects owner's active/idle state before sending reminders

---

## Tech Stack

| Layer     | Stack |
|-----------|-------|
| Frontend  | React 18 + Vite + TailwindCSS + Recharts |
| Backend   | Node.js + Express |
| Database  | MongoDB Atlas (Mongoose) |
| AI        | Google Gemini 1.5 Flash |
| Email     | Nodemailer + Gmail SMTP |

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Gmail account with [App Password](https://myaccount.google.com/apppasswords)

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

Create `server/.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartinvoice
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

# Email (optional — skip to disable email sending)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
UPI_ID=your_upi_id@bank
```

### 3. Seed demo data

```bash
cd server
node seed.js
```

### 4. Start both servers

```bash
# Terminal 1 — backend
cd server
node server.js

# Terminal 2 — frontend
cd client
npm run dev
```

App runs at: **http://localhost:5173**

---

## Demo Credentials

```
Email:    demo@kirana.com
Password: demo1234
```

---

## Demo Simulation (Terminal)

See the AI reminder engine make live decisions across all seed invoices:

```bash
cd server
node demoSimulation.js
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register`             | Register user |
| POST   | `/api/auth/login`                | Login |
| PATCH  | `/api/auth/activity`             | Update user activity timestamp |
| PATCH  | `/api/auth/busy-mode`            | Sync busy mode to backend |
| GET    | `/api/customers`                 | List customers |
| GET    | `/api/customers/:id/health`      | Customer health score (0–100) |
| GET    | `/api/invoices`                  | List invoices |
| POST   | `/api/invoices`                  | Create invoice (triggers email + notification) |
| PATCH  | `/api/invoices/:id/status`       | Update invoice status (payment triggers notification) |
| POST   | `/api/reminders/smart`           | Run smart reminders (activity-aware, emails, notifications) |
| POST   | `/api/reminders/evaluate-all`    | Basic reminder evaluation |
| GET    | `/api/analytics/top-customers`   | Top 5 customers by revenue |
| GET    | `/api/analytics/payment-patterns`| On-time vs late payers |
| GET    | `/api/analytics/products`        | Top 5 most sold products |
| GET    | `/api/insights`                  | AI-generated business insights [{icon, title, insight}] |
| POST   | `/api/voice/parse`               | Parse voice command to invoice fields |
| GET    | `/api/notifications`             | All notifications (newest first) |
| GET    | `/api/notifications/unread-count`| Unread count for bell badge |
| PATCH  | `/api/notifications/:id/read`    | Mark single notification read |
| PATCH  | `/api/notifications/read-all`    | Mark all notifications read |

---

## Priority Score Engine

Each invoice gets a numeric score (0–110):

| Factor         | Points |
|----------------|--------|
| 0 days overdue | 0 |
| 1–3 days       | +10 |
| 4–7 days       | +25 |
| 8–14 days      | +40 |
| 15+ days       | +60 |
| Amount < ₹1k   | 0 |
| ₹1k–5k         | +10 |
| ₹5k–10k        | +20 |
| > ₹10k         | +30 |
| ignored 0×     | 0 |
| ignored 1–2×   | +10 |
| ignored 3+×    | +20 |

**0–20 = low · 21–50 = medium · 51+ = high**

---

## Project Structure

```
Automation/
├── client/                 # React frontend
│   └── src/
│       ├── pages/          # Dashboard, Invoices, Customers, Reminders, Analytics, Notifications, Settings
│       ├── components/     # Layout, Sidebar (with bell dropdown)
│       ├── context/        # AuthContext (JWT + activity tracking)
│       └── services/       # API calls (axios)
└── server/                 # Node.js backend
    ├── models/             # User, Customer, Invoice, Notification
    ├── controllers/        # Auth, Invoice, Analytics, Insights, Voice, Notification
    ├── services/           # reminderService, automationEngine, geminiService, emailService
    ├── routes/             # Express routers
    ├── seed.js             # Demo data (10 invoices, 5 customers)
    └── demoSimulation.js   # Terminal demo of AI decision engine
```

---

## Team

Built at Hackathon 2026

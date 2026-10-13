# Splitzy 💸

> **AI-Powered Mobile Expense Sharing & UPI Settlements**

Splitzy is a modern, mobile-first Splitwise alternative tailored for flats, roommates, trips, and groups. It eliminates manual math with deterministic paise calculations, simplified debt settlements, one-tap UPI transfers, and a Gemini-powered AI expense assistant.

---

## 🌟 Key Features
- **Mobile First**: Built with React Native & Expo for smooth Android & iOS performance.
- **Financial Precision**: All monetary figures calculated in **integer paise** (₹1 = 100 paise) to prevent floating-point rounding errors.
- **Flexible Splitting**: Equal splits, custom exact amounts, percentages, and share-based allocations.
- **Debt Simplification**: Greedy minimum-cash-flow algorithm reducing transitive debts into minimal peer-to-peer transfers.
- **UPI Settlement**: Direct `upi://pay` deep link generation with prefilled VPA and amount for instant payment via Google Pay, PhonePe, or Paytm.
- **AI Expense Assistant**: Natural language expense drafting ("Paid ₹1,850 for groceries split equally"), receipt itemization, and spending analytics powered by Google Gemini.
- **Robust Security**: Supabase JWT authentication and PostgreSQL Row Level Security (RLS) ensuring group-level data isolation.

---

## 🏗️ Architecture

```
splitzy/
├── apps/
│   └── mobile/             # React Native Expo app (Expo Router, TypeScript)
├── backend/                # FastAPI backend (Financial engine, UPI service, AI service)
├── supabase/
│   ├── migrations/         # PostgreSQL DDL migrations with RLS policies
│   └── seed.sql            # Seed data for a 6-member flat
├── packages/
│   └── contracts/          # Shared TypeScript type definitions
└── docs/
    ├── architecture.md     # Deep-dive system architecture
    └── development.md      # Setup, local running, and testing guide
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** >= 20.x
- **Python** >= 3.12
- **Expo Go** app on Android/iOS (or Android Emulator)
- A free **Supabase** project

### 2. Setup Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
pytest
uvicorn app.main:app --reload --port 8000
```

### 3. Setup Mobile App
```bash
cd apps/mobile
npm install
npx expo start
```

---

## 🧪 Testing
```bash
# Run backend tests
cd backend
source .venv/bin/activate
pytest -v
```

---

## 📄 License
MIT

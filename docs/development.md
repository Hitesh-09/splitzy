# Splitzy Development & Onboarding Guide

## 1. Local Environment Setup

### Required Tools
- Node.js 20+ & npm 10+
- Python 3.12+
- Supabase account (free tier)

### Repository Setup
```bash
git clone https://github.com/Hitesh-09/splitzy.git
cd splitzy
cp .env.example .env
```

---

## 2. Supabase Configuration

1. Create a project at [database.new](https://database.new) (Supabase).
2. Go to **SQL Editor** in the Supabase dashboard.
3. Paste and run [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql).
4. (Optional) Run [`supabase/seed.sql`](../supabase/seed.sql) to populate 6 test flatmates and demo expenses.
5. In your project settings, locate:
   - Project URL -> `SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL`
   - Anon / Public Key -> `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key -> `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret -> `SUPABASE_JWT_SECRET`

---

## 3. Backend Development (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run test suite
pytest -v

# Start development server
uvicorn app.main:app --reload --port 8000
```

The interactive API documentation is accessible at `http://localhost:8000/docs`.

---

## 4. Mobile App Development (Expo / React Native)

```bash
cd apps/mobile
npm install

# Start Expo dev server
npx expo start
```
- Scan QR code using Expo Go on your Android/iOS device.
- Or press `a` for Android emulator, `i` for iOS simulator, `w` for Web.

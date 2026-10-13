# AGENTS.md — Working Rules for Splitzy

This repository contains **Splitzy**, an AI-powered expense sharing mobile application with integrated UPI settlement flows.

## 1. Core Engineering Invariants
- **Deterministic Currency Storage**: All amounts **must** be stored and computed as integer **paise** (`bigint` in PostgreSQL, `int` in Python/TypeScript). Never store floating-point currency values.
- **Financial Balance Invariant**: For any expense $e$, $\sum \text{share\_paise} == \text{amount\_paise}$. Across any group $G$, $\sum_{u \in G} \text{net\_balance}_u == 0$.
- **AI Boundaries**: AI is an assistant, never an autonomous financial actor.
  - AI can extract drafts and suggest expense structures, but **cannot** save expenses without explicit user review.
  - AI **cannot** mark payments as settled or mutate balances.
  - Spending questions **must** query pre-aggregated, authorized data endpoints, never unstructured raw SQL execution.
- **Payment Verification**: Launching a UPI app (`upi://pay`) or user tapping "I have paid" does **not** equal a verified settlement. It marks the settlement as `pending` until reconciled via provider webhook or verified confirmation.
- **Authorization**: All group resources require membership validation. A user cannot access or mutate groups they do not belong to.

## 2. Directory Structure
```
splitzy/
├── apps/
│   └── mobile/             # React Native + Expo + TypeScript + Expo Router
├── backend/                # Python 3.12 + FastAPI + Pydantic v2
├── supabase/
│   ├── migrations/         # PostgreSQL schema & RLS migrations
│   └── seed.sql            # Seed dataset for local testing
├── packages/
│   └── contracts/          # Shared TypeScript type definitions
└── docs/                   # System architecture and guides
```

## 3. Technology Stack & Tooling
- **Mobile**: React Native 0.76+, Expo 52+, Expo Router, TypeScript, React Query.
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Pytest.
- **Database/Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth.
- **AI**: Google Gemini API via `google-genai` SDK using structured JSON schema outputs.

## 4. Development Workflow
1. Never commit `.env` or credentials.
2. Ensure automated tests pass (`cd backend && pytest`) before marking milestones complete.
3. Keep code modular: routes validate and delegate to services; services implement business logic; repositories/clients interact with the database.

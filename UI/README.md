# Northbank — Frontend (Vite + Tailwind CSS + JavaScript + React)

A modern, high-trust digital banking interface built with **React 19**, **Vite**, **Tailwind CSS**, and **JavaScript** (ESM).

## Features

- **Authentication**:
  - Sign in and Sign up (Registration) tabs
  - Quick "Demo User" auto-fill for instant preview
  - Form validation with inline feedback
  - JWT session management via cookies/localStorage
- **Dashboard**:
  - Dynamic greeting with personalized user initials
  - Concentric glowing circular accents on the **Available Balance Card**
  - Currency and number formatting with Google Fonts `JetBrains Mono`
  - Active account status badge
- **Transaction History**:
  - Category filters: `All`, `Deposits (Incoming)`, `Transfers (Outgoing)`
  - Visual status and counterparty badges
  - Real-time updates as transfers/deposits are performed
- **Financial Actions Panel**:
  - **Transfer Money**: Recipient name, account ID, amount, optional note, idempotency key generation, and insufficient balance guards
  - **Deposit Funds**: Instant credit deposits with quick preset amounts ($100, $500, $1000, $2500)
  - **Account Details**: View account number, status, currency, and create linked accounts
- **API Integration & Demo Fallback**:
  - Connects to the Express backend (`/api/auth/*`, `/api/transactions/*`, `/api/account/*`) via Vite proxy (`http://localhost:3000`).
  - Seamlessly falls back to an interactive local demo state if the backend is offline, allowing 100% functionality out of the box.

## Getting Started

1. Navigate to this directory:
   ```bash
   cd UI
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## From the Root Project Folder

You can also run the frontend directly from the project root:
```bash
npm run dev:ui
```


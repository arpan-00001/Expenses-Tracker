# 💰 TeenTrack — Frontend Application

A sleek, responsive, dark-first React web application built with **React 18, Vite, React Router, Recharts, and React Hot Toast** to help teenagers track income and expenses, visualize budgets, and achieve their savings goals.

---

## 🚀 Features

- **Dashboard:** Real-time balances, income vs expense breakdowns, spending categories pie charts, and monthly trend graphs.
- **Transaction Tracker:** Filter, search, categorize, and log expenses and incomes with payment methods (Cash, UPI, Debit Card, etc.).
- **Budget Management:** Set monthly limits per category with dynamic progress bars and instant overspending warnings.
- **Savings Goals:** Set targets, track progress percentages, and log contributions with deadline countdowns.
- **Smart Recommendations:** Contextual insights and actionable tips to boost savings.
- **Authentication:** Secure JWT authentication with protected routes and persistent sessions.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Vanilla CSS design system (Dark mode with glassmorphic accents)
- **Routing:** React Router v7
- **Charts:** Recharts
- **Notifications:** React Hot Toast
- **Icons:** React Icons

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production deployment (e.g. on Vercel or Netlify), update `VITE_API_URL` to point to your deployed backend API URL (e.g., `https://your-backend.onrender.com/api`).

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

App will run at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Build output will be in the `dist/` directory.

---

## 🚢 Deployment (Vercel / Netlify)

1. Import this repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://your-backend.onrender.com/api`)
5. Click **Deploy**!

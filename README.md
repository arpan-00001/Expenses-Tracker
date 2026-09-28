# 💰 TeenTrack — Teenager Expense Tracker

A modern, full-stack web application that helps teenagers understand where their money goes, track income and expenses, visualize spending habits, set budgets, and receive practical money-saving suggestions.

![Stack](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![Stack](https://img.shields.io/badge/Express-000000?style=flat&logo=express)
![Stack](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase)
![Stack](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql)

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** — Register, login, logout with bcrypt password hashing and JWT tokens
- 💳 **Transaction Management** — Full CRUD for income & expenses with categories, search, filter, sort
- 🎯 **Budget System** — Monthly category budgets with usage tracking and warnings
- 🏆 **Savings Goals** — Set goals, add money incrementally, track progress
- 📊 **Visual Analytics** — Pie charts, bar charts, line charts powered by Recharts
- 💡 **Smart Insights** — Rule-based recommendation engine with personalized spending tips
- 👤 **Profile Management** — Update name, email, and change password

### User Experience
- 🌙 Dark theme with modern glassmorphism aesthetics
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Loading, empty, and error states for every page
- 🔔 Toast notifications for all actions
- ✅ Form validation on frontend and backend
- 🗑️ Confirmation dialogs for destructive actions

---

## 🏗️ Architecture

```
React.js Frontend
      ↓
    Axios
      ↓
Express.js REST API
      ↓
  MVC Architecture
      ↓
  Supabase Client
      ↓
PostgreSQL Database
```

### Backend MVC Structure
- **Models** — Data access layer (Supabase queries)
- **Controllers** — Request handling and business logic
- **Routes** — RESTful API endpoint definitions
- **Services** — Analytics, recommendations logic
- **Middleware** — Auth, error handling, validation
- **Validators** — Input validation with express-validator

---

## 📁 Project Structure

```
teen-expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── layouts/        # App layout with sidebar
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer (Axios)
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Root component with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global design system
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Supabase client
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── models/         # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # AppError, response helpers
│   │   ├── validators/     # Input validation rules
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── __tests__/          # Jest test suite
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql          # Complete database schema
│   └── seed.sql            # Development seed data
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios, Recharts, react-hot-toast |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (via Supabase) |
| Auth | bcryptjs, JWT (jsonwebtoken) |
| Security | Helmet, CORS, express-rate-limit |
| Validation | express-validator |
| Testing | Jest, Supertest |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Supabase Setup

1. Create a new Supabase project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the contents of `database/schema.sql`
3. (Optional) Run `database/seed.sql` for demo data
4. Copy your project URL and keys from **Settings → API**

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-at-least-32-characters-long
FRONTEND_URL=http://localhost:5173
```

Install and run:
```bash
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

The default `.env` points to localhost:5000:
```env
VITE_API_URL=http://localhost:5000/api
```

Install and run:
```bash
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Yes | Sign out |
| GET | `/api/auth/me` | Yes | Get current user |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Yes | Get profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/change-password` | Yes | Change password |

### Transactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/transactions` | Yes | List transactions (with filters) |
| GET | `/api/transactions/:id` | Yes | Get single transaction |
| POST | `/api/transactions` | Yes | Create transaction |
| PUT | `/api/transactions/:id` | Yes | Update transaction |
| DELETE | `/api/transactions/:id` | Yes | Delete transaction |

**Query Parameters**: `type`, `category_id`, `startDate`, `endDate`, `search`, `payment_method`, `sortBy`, `sortOrder`, `page`, `limit`

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Yes | List categories |
| POST | `/api/categories` | Yes | Create custom category |
| PUT | `/api/categories/:id` | Yes | Update custom category |
| DELETE | `/api/categories/:id` | Yes | Delete custom category |

### Budgets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/budgets` | Yes | List budgets |
| POST | `/api/budgets` | Yes | Create budget |
| PUT | `/api/budgets/:id` | Yes | Update budget |
| DELETE | `/api/budgets/:id` | Yes | Delete budget |

### Savings Goals
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/savings-goals` | Yes | List goals |
| POST | `/api/savings-goals` | Yes | Create goal |
| PUT | `/api/savings-goals/:id` | Yes | Update goal |
| POST | `/api/savings-goals/:id/add-money` | Yes | Add money to goal |
| DELETE | `/api/savings-goals/:id` | Yes | Delete goal |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/summary` | Yes | Dashboard summary |
| GET | `/api/analytics/categories` | Yes | Category breakdown |
| GET | `/api/analytics/monthly` | Yes | Monthly income vs expenses |
| GET | `/api/analytics/trends` | Yes | Daily spending trends |
| GET | `/api/analytics/budget-usage` | Yes | Budget usage details |

### Recommendations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/recommendations` | Yes | Smart spending insights |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## 🔒 Security

- **Passwords** — Hashed with bcrypt (12 salt rounds), never stored or returned in plain text
- **Authentication** — JWT tokens in Authorization header, verified on every protected request
- **Authorization** — Users can only access their own data; user_id derived server-side from JWT
- **Input Validation** — Both frontend and backend validation using express-validator
- **Rate Limiting** — Auth endpoints: 20 req/15min, API endpoints: 200 req/15min
- **Security Headers** — Helmet.js for HTTP security headers
- **CORS** — Configured to only allow the frontend origin
- **Environment Variables** — All secrets in `.env`, never committed to Git
- **Row Level Security** — Supabase RLS policies as defense-in-depth
- **SQL Injection** — Protected through Supabase client parameterized queries

---

## 🧪 Testing

```bash
cd backend
npm test
```

Tests cover:
- Registration validation (name, email, password strength)
- Login validation
- Protected route authentication
- Health check endpoint
- 404 handling
- Input validation

---

## 💰 Currency

Default currency is **INR (₹)**. The application uses `NUMERIC(12,2)` PostgreSQL columns for monetary values to avoid floating-point precision issues. Currency formatting uses `Intl.NumberFormat` with `en-IN` locale.

---

## 📱 Responsive Design

The application is built mobile-first and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops and desktops (1024px+)

Key responsive features:
- Collapsible sidebar with overlay on mobile
- Responsive grid cards
- Horizontally scrollable tables
- Touch-friendly buttons and form elements
- Responsive charts (Recharts ResponsiveContainer)

---

## 🚢 Production Deployment

### Backend
```bash
cd backend
npm start
```

Set `NODE_ENV=production` and use a process manager like PM2.

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to any static hosting (Vercel, Netlify, etc.).

Update `VITE_API_URL` to point to your production backend URL.

---

## 📄 License

This project is for educational purposes. Built with ❤️ for teenagers who want to be smart with money.

# Akanti Frontend

The web client for **Akanti**, a personal finance app built for Nigeria. It is a React single-page application that tracks income, expenses, budgets and debts, visualises cash flow, exports reports, and hosts an AI assistant called **Ask Akanti**.

The companion API lives in [Akanti-Backend](https://github.com/PsalamDev/Akanti-Backend).

---

## Contents

- [What it does](#what-it-does)
- [Screens](#screens)
- [Tech stack](#tech-stack)
- [Project layout](#project-layout)
- [Requirements](#requirements)
- [Running locally](#running-locally)
- [Configuration](#configuration)
- [How it works](#how-it-works)
  - [Authentication](#authentication)
  - [Data flow](#data-flow)
  - [Reports and exports](#reports-and-exports)
  - [Notifications](#notifications)
  - [Ask Akanti](#ask-akanti)
  - [Admin](#admin)
- [Design](#design)
- [Building](#building)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## What it does

- Sign up and sign in with email and password; reset a forgotten password by code.
- Record income and expenses with categories, dates and notes.
- Set budgets per category and see how close each one is to its limit.
- Track money lent and borrowed, record partial payments, and send reminders.
- Review cash flow and period trends with charts.
- Export reports as **CSV** or download them as **PDF**.
- Receive in-app notifications in the header bell, including reminders sent by other users.
- Chat with an AI assistant that answers from your own figures.
- Manage users and inspect audit logs from an admin panel (admins only).

## Screens

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Landing | Public marketing page |
| `/docs` | Documentation | Feature and usage guide |
| `/login`, `/register` | Auth | Public; signed-in users are redirected |
| `/forgot-password` | Password reset | Code-based flow |
| `/dashboard` | Dashboard | Balances, recent activity, budget signals |
| `/dashboard/income` | Income | List, add, edit, delete |
| `/dashboard/expenses` | Expenses | List, add, edit, delete |
| `/dashboard/budgets` | Budgets | Limits, progress, alerts |
| `/dashboard/debts` | Debts | Lent/borrowed, payments, reminders |
| `/dashboard/cashflow` | Cash Flow | Monthly line chart, expense breakdown |
| `/dashboard/reports` | Reports | Summary/daily/weekly/monthly/annual, CSV/PDF |
| `/dashboard/assistant` | Assistant | Full-page chat |
| `/dashboard/notifications` | Notifications | Inbox with read/delete |
| `/dashboard/profile` | Profile | Account details, change password |
| `/admin` | Admin dashboard | Platform totals |
| `/admin/users` | User list | Search, paginate, activate/deactivate |
| `/admin/users/:id` | User detail | Totals and status |
| `/admin/audit-logs` | Audit logs | Recent system events |

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| HTTP | Axios |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| PDF export | html2pdf.js |
| Hosting | Vercel |

## Project layout

```
Akanti-Frontend/
├── public/
│   └── akanti-logo.jpeg     App logo, also used as the loading indicator
├── src/
│   ├── components/          Header, sidebars, modals, floating assistant
│   │   └── ui/              Button, Card, Badge, Spinner, Loading
│   ├── context/             AuthContext, ThemeContext
│   ├── layouts/             DashboardLayout, AdminLayout
│   ├── pages/               One component per route
│   ├── services/api.js      Axios instance and endpoint groups
│   ├── App.jsx              Routes, lazy loading, guards
│   ├── main.jsx             App bootstrap
│   └── index.css            Tailwind layers and CSS variables
├── vercel.json              SPA fallback and /api proxy
├── tailwind.config.js       Brand colours
└── vite.config.js           Dev server and proxy
```

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm 9 or newer
- A running Akanti API (default `http://localhost:5145`)

## Running locally

```bash
git clone https://github.com/PsalamDev/Akanti-Frontend.git
cd Akanti-Frontend
npm install
npm run dev
```

The app opens on **http://localhost:5180**.

The dev server proxies every `/api` request to `http://localhost:5145`, so start the backend first. Both ports are fixed in `vite.config.js` (`strictPort: true`).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |

## Configuration

The frontend needs no environment variables in development or on Vercel, because:

- Development uses the Vite proxy.
- Production uses the `vercel.json` rewrite, which forwards `/api/*` to the hosted backend.

If you point the app at a different backend, update the rewrite destination in `vercel.json` (production) and the proxy target in `vite.config.js` (development). To call the API directly instead, set `VITE_API_BASE_URL` and read it from `import.meta.env` in `src/services/api.js`.

## How it works

### Authentication

`AuthContext` stores the JWT in `localStorage` and exposes `user`, `token`, `loading`, `login`, `register` and `logout`.

- `ProtectedRoute` renders a page only when a token exists; otherwise it redirects to `/login`.
- `PublicRoute` sends signed-in users to `/dashboard`.
- `AdminRoute` additionally checks `user.isAdmin`.
- An Axios request interceptor attaches `Authorization: Bearer <token>` to every call. A `401` clears the session.
- Logging out asks for confirmation before clearing the token.

### Data flow

Pages own their data. On mount they call the relevant group in `src/services/api.js` (`incomeAPI`, `expenseAPI`, `budgetAPI`, `debtAPI`, `notificationAPI`, `aiAPI`, `adminAPI`), keep the result in local state, and re-fetch after a mutation. There is no global store; the trade-off is simplicity and predictable refreshes.

All money is displayed in **Nigerian Naira (₦)** with thousands separators. The API stores plain decimals.

### Reports and exports

The reports page groups transactions by the selected tab:

- **Summary** — totals for all time
- **Daily / Weekly / Monthly / Annual** — grouped trends with a bar chart

The **Download Report** button offers only two choices: **CSV** and **PDF**. The export uses whichever tab is active, so you choose the period on the page and then choose the format.

- **CSV** — a spreadsheet-friendly file with `Income (NGN)` and `Expenses (NGN)` columns; values stay numeric.
- **PDF** — generated in the browser with `html2pdf.js` and saved directly as `akanti-<period>-report.pdf`. No print dialog is involved.

### Notifications

The header bell polls `/api/notification/unread-count` every 30 seconds and listens for a local `notifications-updated` event, so marking an item read updates the badge immediately. The notifications page supports mark-one, mark-all and delete.

Debt reminders are created on the server. If the person who owes money owns an Akanti account, they receive the reminder in this same bell.

### Ask Akanti

`FloatingAssistant` renders a launcher at the bottom-right of signed-in pages and links to the full-page assistant. It is deliberately not in the sidebar.

The assistant receives aggregate figures only, not individual transactions. Answers are plain text. When the model is unavailable the API returns a deterministic answer from your records and flags it as a fallback; the UI shows the reply either way.

### Admin

Admins see an **Admin Panel** entry in the sidebar. The panel is a separate layout with its own header and sidebar:

- `/admin` — platform totals
- `/admin/users` — search, paginate, activate/deactivate
- `/admin/users/:id` — per-user totals
- `/admin/audit-logs` — recent events

Non-admins are redirected away.

## Design

- **Background:** `#071A17` dark surface for the signature look.
- **Accent:** `#10B981` green, exposed as `akanti.accent` in Tailwind and `--akanti-accent` in CSS.
- Light and dark modes are supported; the toggle lives in the header.
- Page loading uses the Akanti logo with a gentle pulse rather than a generic spinner.

## Building

```bash
npm run build
```

The output is written to `dist/`. Vite code-splits by route, so each page is fetched on demand.

## Deployment

Vercel is the intended host.

1. Import the repository into Vercel.
2. Set the project root to `Akanti-Frontend/`.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Deploy.

`vercel.json` provides:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://akanti-backend.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The first rule proxies API calls through the same origin, avoiding CORS entirely. The second rule makes client-side routes survive a refresh. If the backend URL changes, update the first rule.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Blank page with 404s on refresh | SPA rewrite missing — check `vercel.json` |
| Every API call fails in development | Backend not running on port 5145, or port mismatch |
| `401` loop after a deploy | Backend JWT key changed; sign in again |
| Charts render empty | No transactions in the selected period |
| PDF button downloads nothing | The browser blocked the automatic download, or the page has no data to export |
| Notifications badge stuck | Backend unreachable, or token expired |

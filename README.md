# CV Creator — Full Scaffold

A complete, runnable CV-builder application — Angular 18 frontend + Node.js/Express backend + **SQLite** (local file, no external DB server needed).

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 18, Tailwind CSS, Lucide icons |
| Backend | Node.js, Express 4 |
| Database | **SQLite** (local file: `database/cv-creator.db`) |
| Auth | JWT (access + refresh tokens), optional Google OAuth |
| Email | Nodemailer (optional — app works without it) |

---

## Project Structure

### Backend (`/backend`) — Node.js / Express / SQLite
- `server.js` — app entry point; initialises the SQLite schema automatically, wires up CORS, Helmet, rate limiting, and all route groups.
- `db/pool.js` — SQLite connection; one file per table: users, templates, userCvs, reviews, orders, activityLog.
- `routes/` — `auth`, `templates`, `cvs`, `orders`, `contact`, `admin` route groups.
- `middleware/auth.js` — `requireAuth` / `requireAdmin` JWT middleware.
- `services/` — `email.service.js` (Nodemailer) and `pdf.service.js` (stub — see notes below).
- `.env.example` — all required environment variables.
- `database/schema.sql` — full SQLite schema with triggers to keep `avg_rating` and `sold_count` in sync.

### Frontend (`/frontend`) — Angular + Tailwind + Lucide
- `src/app/app.component.ts`, `app.config.ts`, `app.routes.ts`, `main.ts` — app shell and bootstrap, with navbar + router outlet and `authInterceptor` registered globally.
- `core/` — `AuthService`, `authGuard`, `authInterceptor`.
- `shared/components/` — floating glass `navbar` and `theme-switcher`.
- `features/home` — 5-section landing page.
- `features/templates` — gallery (hover "Select" overlay) + preview page (4-color picker, 5-star rating, "Use This Template").
- `features/make-cv` — 70/30 split reactive CV editor with floating Full Preview / Save / Download PDF toolbar.
- `features/my-cv` — dashboard grid + CV detail page.
- `features/auth/login.component.ts` — honours `returnUrl`.
- `features/about`, `features/contact` — snap-scroll about page and floating contact form.
- `features/admin/` — admin portal: dashboard (KPI cards), customers, templates management, reports, settings. Protected by `adminGuard`.
- `tailwind.config.js` — azure/obsidian glassmorphism palette, `darkMode: 'class'`.

---

## How the "must log in to select a template" flow works

Enforced in three layers:

1. **UI** — `onSelect()` calls `AuthService.requireLoginOrRedirect()`. Logged-out users are sent to `/login?returnUrl=/templates/preview/:id`.
2. **Router guard** — `authGuard` is attached to `templates/preview/:id`, `make-cv`, `my-cv`, `my-cv/:cv_id`.
3. **API** — `POST /api/v1/templates/:id/select` requires `requireAuth`; unauthorized calls get `401`.

After login, `LoginComponent` reads `returnUrl` and navigates the user back automatically.

---

## Getting It Running Locally (Mac)

### Prerequisites

1. **Install Node.js** (v18 or v20 LTS recommended)
   - Download from https://nodejs.org → click **LTS** → run the `.pkg` installer
   - Verify: open Terminal and run `node --version`

2. No database server needed — SQLite is a local file bundled with the project ✅

---

### Backend

```bash
cd CreateCV-main/backend

# 1. The .env file is already created for local development
#    Edit it if you want to add Google OAuth or email (SMTP) support

# 2. Install dependencies
npm install

# 3. Start the server (auto-restarts on file changes)
npm run dev
# API running at http://localhost:4000
# Health check: http://localhost:4000/health  → {"ok":true}
```

The SQLite database at `../database/cv-creator.db` is initialised automatically on first run.

---

### Frontend

```bash
cd CreateCV-main/frontend

# 1. Install dependencies
npm install

# 2. Start the Angular dev server
npm start
# App running at http://localhost:4200
```

> Make sure the backend is running first so API calls succeed.

---

### Create an Admin Account

```bash
cd backend
node create-admin.js
```

---

## Environment Variables (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default `4000`) |
| `CORS_ORIGIN` | No | Frontend origin (default `http://localhost:4200`) |
| `JWT_SECRET` | **Yes** | Long random string for access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | Long random string for refresh tokens |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID — leave blank to disable |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No | Gmail SMTP — leave blank to disable email |

---

## Known Stubs / Not Yet Implemented

- `services/pdf.service.js` — returns a placeholder URL. Replace with Puppeteer + cloud storage for real PDF export.
- `routes/orders.routes.js` webhook — payment provider signature not verified. Plug in Stripe/PayPal SDK.
- No automated test suite included.


# CV Creator — Full Scaffold

A complete, runnable-shape scaffold covering every screen and route in the brief.

## Backend (`/backend`) — Node.js / Express / PostgreSQL
- `server.js` — app entry point; wires up CORS, Helmet, rate limiting, and all route groups.
- `db/` — PostgreSQL access layer (raw `pg`, one file per table: users, templates, userCvs, reviews, orders) plus `pool.js`.
- `routes/` — `auth`, `templates`, `cvs`, `orders`, `contact`, `admin` route groups, all matching `routes/README.md`'s route map.
- `middleware/auth.js` — `requireAuth` / `requireAdmin` JWT middleware.
- `services/` — `email.service.js` (nodemailer → sokkhim519@gmail.com) and `pdf.service.js` (PDF generation stub with a documented Puppeteer implementation path).
- `.env.example` — all required environment variables.
- `database/schema.sql` — full schema with triggers to keep `avg_rating` and `sold_count` in sync automatically.

## Frontend (`/frontend`) — Angular + Tailwind + Lucide
- `src/app/app.component.ts`, `app.config.ts`, `app.routes.ts`, `main.ts` — app shell and bootstrap, with the navbar + router outlet wired up and the `authInterceptor` registered globally.
- `core/` — `AuthService` (session state, login redirect helper), `authGuard`, `authInterceptor`.
- `shared/components/` — floating glass `navbar` and `theme-switcher`.
- `features/home` — 5-section landing page.
- `features/templates` — gallery (hover "Select" overlay) + preview page (4-color picker, 5-star rating, "Use This Template").
- `features/make-cv` — the 70/30 split reactive workstation with the floating Full Preview / Save / Download PDF toolbar.
- `features/my-cv` — dashboard grid (hover "Edit" overlay) + CV detail page (color options, live preview, save/download).
- `features/auth/login.component.ts` — honors `returnUrl`.
- `features/about`, `features/contact` — snap-scroll about page and floating contact form.
- `features/admin/` — full admin portal: shell (top nav + sidebar), dashboard (KPI cards + collapsible widgets), customers, templates management, reports (date-range + time-of-day), settings, about. Protected by `adminGuard`.
- `tailwind.config.js` — azure/obsidian glassmorphism palette, `darkMode: 'class'`.

## How the "must log in to select a template" flow works
This is enforced in three layers so it can't be bypassed by skipping the UI:

1. **UI (Template Gallery)** — `template-gallery.component.ts`'s `onSelect()` calls `AuthService.requireLoginOrRedirect()`. If logged out, the user is sent to `/login?returnUrl=/templates/preview/:id` instead of navigating to the preview page.
2. **Router guard** — `authGuard` (`core/guards/auth.guard.ts`) is attached to `templates/preview/:id`, `make-cv`, `my-cv`, and `my-cv/:cv_id` in `app.routes.ts`. Even a direct URL visit while logged out redirects to login.
3. **API** — `POST /api/v1/templates/:id/select` is wrapped in `requireAuth`. If a logged-out session somehow calls the API directly, it gets `401 UNAUTHENTICATED`, and the `authInterceptor` catches that globally and redirects to `/login` too.

After a successful login, `LoginComponent` reads the `returnUrl` query param and `AuthService.login()` navigates the user right back to the template they wanted.

## Getting it running

**Backend**
```
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT secrets, SMTP creds
npm install
psql "$DATABASE_URL" -f ../database/schema.sql
npm run dev             # http://localhost:4000
```

**Frontend**
```
cd frontend
npm install
npx ng new . --skip-install --defaults   # if scaffolding a fresh Angular CLI workspace around these files
npm start                # http://localhost:4200
```

## What's still a stub, by design
- `services/pdf.service.js` returns a placeholder URL — swap in the documented Puppeteer + object-storage flow (or a client-side html2canvas/jsPDF approach) for real PDF output.
- `routes/orders.routes.js`'s webhook handler doesn't verify a real payment provider signature yet — plug in Stripe/PayPal's SDK.
- Angular components call REST endpoints directly; swap in real HTTP error/loading states and toasts as needed for production polish.
- No test suite is included.
"# CreateCV" 

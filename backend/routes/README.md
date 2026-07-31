# CV Creator — REST API Route Map

Base URL: `/api/v1`

Auth: JWT bearer token (`Authorization: Bearer <token>`), issued on login/register.
`requireAuth` middleware protects any route below marked 🔒.
`requireAdmin` middleware protects any route marked 🛡️ (implies 🔒 too).

## Auth — `/api/v1/auth`
| Method | Path              | Description                                   |
|--------|-------------------|------------------------------------------------|
| POST   | /register         | Create account (name, email, password)         |
| POST   | /login            | Returns JWT + user profile                     |
| POST   | /logout           | 🔒 Invalidate refresh token / clear session     |
| GET    | /me               | 🔒 Current logged-in user profile               |
| POST   | /refresh-token     | Exchange refresh token for new access token     |

## Templates — `/api/v1/templates`
| Method | Path                  | Description                                                   |
|--------|-----------------------|-----------------------------------------------------------------|
| GET    | /                     | Public list (grid) — filter by category, search                |
| GET    | /:id                  | Public single template preview (design + rating summary)        |
| POST   | /:id/select           | 🔒 Marks template as "selected" for the current user session — **login required**, unauthenticated calls return 401 so the frontend redirects to `/login` |
| GET    | /:id/reviews          | Public — list of reviews                                        |
| POST   | /:id/reviews          | 🔒 Submit/update a 1–5 star rating + optional comment            |
| POST   | /                     | 🛡️ Create new template                                          |
| PUT    | /:id                  | 🛡️ Update template (incl. active/inactive toggle)                |
| DELETE | /:id                  | 🛡️ Remove template                                               |

## CVs (user-owned) — `/api/v1/cvs`
| Method | Path              | Description                                        |
|--------|-------------------|-----------------------------------------------------|
| GET    | /                 | 🔒 List current user's saved CVs ("My CV" dashboard) |
| GET    | /:id              | 🔒 Get single CV (full content JSON)                 |
| POST   | /                 | 🔒 Create new CV from a templateId                   |
| PUT    | /:id              | 🔒 Update CV content (autosave from Make CV workstation) |
| PUT    | /:id/color        | 🔒 Update selected color scheme                      |
| POST   | /:id/download      | 🔒 Generate & return PDF (stream or signed URL)      |
| DELETE | /:id              | 🔒 Delete a saved CV                                  |

## Orders — `/api/v1/orders`
| Method | Path              | Description                                    |
|--------|-------------------|--------------------------------------------------|
| POST   | /                 | 🔒 Create order for a template ($3 flat pricing)  |
| GET    | /                 | 🔒 Current user's order history                   |
| GET    | /:id              | 🔒 Order detail / receipt                         |
| POST   | /:id/webhook      | Payment provider webhook (verifies signature)     |

## Contact — `/api/v1/contact`
| Method | Path | Description                                                        |
|--------|------|----------------------------------------------------------------------|
| POST   | /    | Public — sends inquiry via email service to sokkhim519@gmail.com     |

## Admin — `/api/v1/admin` (all 🛡️ requireAdmin)
| Method | Path                          | Description                                          |
|--------|-------------------------------|--------------------------------------------------------|
| GET    | /dashboard/kpis               | Total users, templates, sold, revenue, orders           |
| GET    | /dashboard/users              | Collapsible "All Users" widget data                      |
| GET    | /dashboard/top-templates       | Collapsible "Top Selling Templates" widget                |
| GET    | /customers                    | User management list + filters                          |
| GET    | /customers/:id                | User profile + activity log                             |
| PATCH  | /customers/:id                | Update user (activate/deactivate, role)                 |
| GET    | /templates                    | Admin template list w/ category & search filters         |
| PATCH  | /templates/:id/toggle-active   | Enable/disable a template                                 |
| GET    | /reports                      | Sales telemetry filtered by date range / time-of-day       |
| GET    | /settings/profile              | Admin's own profile                                       |
| PUT    | /settings/profile              | Update admin profile                                       |
| PUT    | /settings/password             | Change password                                            |
| POST   | /settings/users                | Create a new admin/staff user                              |
| DELETE | /settings/users/:id            | Delete an account                                           |

---

## Middleware summary
- `requireAuth` — verifies JWT, attaches `req.user`, else `401 { error: 'UNAUTHENTICATED' }`
- `requireAdmin` — runs after requireAuth, checks `req.user.role === 'admin'`, else `403`
- `validateBody(schema)` — zod/joi request validation
- `rateLimiter` — applied to /auth/* and /contact

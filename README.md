# Citizen Monitors — Web Frontend

Citizen Monitors is a platform for crowdsourcing election data in Africa, starting with Nigeria. Citizens upload polling-unit result sheets and incident reports, and the platform collates them and compares them against official (INEC IReV) results.

This repo is the web app: the public site, the user portal, and the admin panel. It talks to a separate backend API.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript
- [Ant Design 5](https://ant.design/) and Tailwind CSS
- Redux Toolkit for state, axios for API calls
- Recharts for charts
- Stripe for donations
- `next-pwa` (installable app), `next-sitemap` (runs after build)

## Getting started

Requirements: Node 18+ and Yarn.

```bash
yarn install
cp .env.example .env    # then fill in the values
yarn dev                # http://localhost:3010
```

Other scripts:

| Command      | What it does                                   |
| ------------ | ---------------------------------------------- |
| `yarn dev`   | Dev server on port 3010 (PWA disabled)         |
| `yarn build` | Production build, then generates the sitemap   |
| `yarn start` | Serve the production build on port 3010        |
| `yarn lint`  | Run ESLint                                     |

## Environment variables

See [`.env.example`](.env.example). Never commit your real `.env`.

| Variable                                    | Exposed to browser? | Purpose                                              |
| ------------------------------------------- | ------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_API_URL`               | Yes                 | Backend API base URL (ends in `/api`)                |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`              | Yes                 | Google Sign-In                                       |
| `NEXT_PUBLIC_APP_VERSION`                   | Yes                 | Sent with Google auth requests                       |
| `NEXT_PUBLIC_STRIPE_DONATE_PUBLISHABLE_KEY` | Yes                 | Stripe publishable key (donate page)                 |
| `NEXT_PUBLIC_STRIPE_DONATE_RETURN_URL`      | Yes                 | Where Stripe returns after payment                   |
| `STRIPE_DONATE_SECRET_KEY`                  | No (server only)    | Stripe secret key, used by `app/api/donate`          |
| `METADATA_BASEURL`                          | No (build time)     | Public site URL for SEO metadata and the sitemap     |
| `INHOUSE_API_ACCESS_TOKEN`                  | No (server only)    | Secret the backend requires on every request         |
| `BACKEND_API_URL`                           | No (optional)       | Server-side backend URL; defaults to the public one  |

> **Note:** anything prefixed `NEXT_PUBLIC_`, or listed under `env` in `next.config.mjs`, is built into the JavaScript sent to browsers and is **not secret**. Never expose `INHOUSE_API_ACCESS_TOKEN` that way.

### How the access token stays private

The browser never calls the backend directly. Client code sends requests to `/api/backend/*` on this site, and [`middleware.ts`](middleware.ts) forwards them to the backend with the `X-Inhouse-Access-Token` header added on the server. Code running on the server calls the backend directly and adds the header itself (see [`app/data/axiosConfig.ts`](app/data/axiosConfig.ts)).

The middleware passes the client IP in `X-Forwarded-For`, so the backend should trust the proxy header (e.g. Express `app.set("trust proxy", true)`) for rate limiting and logs.

## Project structure

```
app/
  (pages)/
    (landing)/     Public site: home, collation, pulse, insights, press,
                   resources, donate, pvc-report, legal pages
    auth/          Login, 4-step signup, Google callback, password flows
    portal/        Signed-in user area: dashboard, elections, live results,
                   uploads, inbox, calendar, pulse, settings
    admin/         Admin panel: dashboard, elections, uploads, flagged,
                   verification, users, admins, outbox, schedule, settings
    speaker-invite/  Public speaker booking via invite link
  api/             Next.js API routes (Stripe donate, speaker-invite mocks)
  components/      UI, grouped by area (landing, auth, portal, admin, shared)
  redux/           Store and slices (features/ = user, admin-features/ = admin)
  data/            Backend routes (backend.ts), axios config, API clients,
                   static content (insights/press articles), mock data
  hooks/ utils/ types/ providers/
public/            Static assets, PWA icons, generated sitemap and service worker
```

Key files:

- [`app/data/backend.ts`](app/data/backend.ts): every backend endpoint path
- [`app/data/axiosConfig.ts`](app/data/axiosConfig.ts): axios setup and auth headers
- [`app/utils/userRoleAccess.ts`](app/utils/userRoleAccess.ts): what each role can do

## User roles

| Role            | Can do                                                        |
| --------------- | ------------------------------------------------------------- |
| `public-viewer` | View results and Pulse; can upgrade to volunteer              |
| `volunteer`     | Upload results/reports, appraise uploads; can become observer |
| `observer`      | Accredited monitor for a polling unit; uploads data           |
| admin           | Uses the `/admin` panel                                       |

## Deployment

Deployed on Vercel. Pushing to `main` runs [`.github/workflows/vercel-trigger.yml`](.github/workflows/vercel-trigger.yml), which adds an empty commit as the `citizenmonitors` account so Vercel deploys. That is why the history has many `chore: trigger vercel deployment` commits.

Remotes:

- `origin`: `citizenmonitors/frontend`
- `codeoracle`: `codeoracle/citizen-monitors-dev` (pushes also go to its `main`)

Set environment variables in the Vercel project settings, not in a committed `.env`.

## Mock data

Some features still use sample data, mainly the speaker-invite API routes (`app/data/speaker-invite-mock.ts`) and parts of collation (`mockElectionDetail.ts`, `mockIrevCollation.ts`). Mock content is marked in the UI with `MockTag`.

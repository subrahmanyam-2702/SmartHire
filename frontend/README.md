# SmartHire — Frontend

React + Vite + Tailwind frontend for SmartHire.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL to your backend URL
npm run dev
```

Runs on http://localhost:5173 by default. Make sure the backend is running on the URL set in
`VITE_API_URL` (defaults to `http://localhost:5000/api`).

## Structure

- `src/api` — one file per backend resource, all requests go through `axiosInstance.js`
  (attaches the JWT automatically, redirects to `/login` on 401)
- `src/store/authStore.js` — Zustand store for the logged-in user + token
- `src/routes/AppRouter.jsx` — all routes, wrapped in `ProtectedRoute` + `RoleGuard`
- `src/pages` — one folder per role (`candidate`, `recruiter`, `admin`) plus shared pages
- `src/components` — organized the same way as pages, plus `common/` and `messages/`

## Candidate routes (mirror the reference app)

- `/candidate` — Dashboard: Matches / Applications / Interviews tabs
- `/candidate/profile` — Resume upload, profile form, "Regenerate Embedding"
- `/candidate/career-tools` — Resume Feedback / Career Growth Plan tabs
- `/candidate/messages` — Conversations with recruiters

## Recruiter routes

- `/recruiter` — Dashboard with stats + job list
- `/recruiter/jobs`, `/recruiter/jobs/new` — manage / post jobs
- `/recruiter/jobs/:jobId/matches` — ranked candidates, invite/message
- `/recruiter/jobs/:jobId/applications` — pipeline board, schedule interviews
- `/recruiter/analytics` — hiring funnel
- `/recruiter/messages` — conversations with candidates

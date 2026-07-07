# SmartHire — Backend

Node.js + Express + MongoDB backend for SmartHire, an AI resume ↔ job matching SaaS.
Uses **Groq** (free LLM inference) and **Hugging Face Inference API** (free embeddings) —
no OpenAI billing required.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in .env with your free API keys (see below)
npm run dev
```

## Free resources you need

| Service | Where to get a free key | Used for |
|---|---|---|
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas (M0 free cluster) | Database |
| Groq | https://console.groq.com/keys | Resume parsing, feedback, growth plans, cover letters, match explanations |
| Hugging Face | https://huggingface.co/settings/tokens | Semantic embeddings (sentence-transformers/all-MiniLM-L6-v2) |
| Cloudinary | https://cloudinary.com (free tier) | Resume PDF storage |
| Gmail App Password | https://myaccount.google.com/apppasswords | Job alert emails |

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/PUT /api/candidate/profile`, `POST /api/candidate/profile/regenerate-embedding`
- `POST /api/resumes/upload` (multipart, field `resume`), `GET /api/resumes`, `GET /api/resumes/latest`
- `POST/GET /api/jobs`, `GET /api/jobs/mine`, `GET/PUT/DELETE /api/jobs/:id`
- `GET /api/matches/candidate`, `GET /api/matches/candidate/:jobId/skill-gap`, `GET /api/matches/job/:jobId`
- `POST /api/applications`, `GET /api/applications/candidate`, `GET /api/applications/candidate/interviews`
- `GET /api/applications/job/:jobId`, `PUT /api/applications/:id/status`, `POST /api/applications/:id/cover-letter`
- `POST /api/career-tools/resume-feedback`, `POST /api/career-tools/growth-plan`
- `GET/POST /api/messages/conversations`, `GET/POST /api/messages/conversations/:id`
- `GET /api/notifications`, `PUT /api/notifications/:id/read`
- `GET /api/analytics/recruiter`
- `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/organizations`

All routes except `/auth/register` and `/auth/login` require `Authorization: Bearer <token>`.

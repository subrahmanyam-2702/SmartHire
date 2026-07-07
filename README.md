# SmartHire

AI-powered resume ↔ job matching SaaS. Built with **Groq** (free LLM) and **Hugging Face**
(free embeddings) — no OpenAI billing required.

```
SmartHire/
├── backend/    Node.js + Express + MongoDB API
└── frontend/   React + Vite + Tailwind SPA
```

## Quick start

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in your free API keys
npm run dev            # http://localhost:5000
```

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev             # http://localhost:5173
```

**3. Try it**
- Register as a **recruiter** → post a job.
- Register as a **candidate** → go to Profile → upload a resume PDF (AI auto-fills your
  skills/career goal) → check your Dashboard's **Matches** tab.
- Apply to a job → recruiter sees it on the pipeline, can schedule an interview → shows up
  on the candidate's **Interviews** tab.
- Try **Career Tools** → Resume Feedback and Career Growth Plan.
- Recruiter can message/invite a candidate from the Candidate Matches page → shows up in
  **Messages** on both sides.

## Free resources used

| Purpose | Service | Free tier |
|---|---|---|
| LLM (parsing, feedback, growth plans, cover letters) | Groq | Yes — https://console.groq.com |
| Embeddings (semantic matching) | Hugging Face Inference API | Yes — https://huggingface.co |
| Database | MongoDB Atlas | M0 free cluster |
| Resume file storage | Cloudinary | Free tier |
| Email (job alerts) | Gmail SMTP | Free (app password) |
| Hosting | Render (backend) + Vercel/Netlify (frontend) | Free tiers |

See `backend/README.md` and `frontend/README.md` for full setup details and API references.

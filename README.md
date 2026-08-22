# LabTrack — University Lab Equipment Management System

A full-stack web app for managing university lab equipment: inventory,
borrowing requests (with approval workflow), returns, and damage reports.

**Stack**
- Frontend: React (Vite) + Tailwind CSS → deployed to **Cloudflare Pages**
- Backend: Node.js + Express → deployed to **Render**
- Database + Auth + Storage: **Supabase** (PostgreSQL)

```
lab-equipment-system/
├── database/     SQL files to run in Supabase (schema, RLS policies, seed data)
├── backend/      Express REST API
└── frontend/     React app (Vite + Tailwind)
```

---

## 1. Set up Supabase (Database + Auth + Storage)

1. Go to [supabase.com](https://supabase.com) → create a free account → **New Project**.
   Pick the region closest to you (e.g. Singapore for South/Southeast Asia).
2. Open **SQL Editor** and run these files **in order**:
   - `database/01_schema.sql`
   - `database/02_rls_policies.sql`
   - `database/03_seed_data.sql` (optional — adds sample equipment)
3. Go to **Storage** → create a new bucket named `damage-reports` → make it **Public**.
4. Go to **Authentication → Providers** → confirm **Email** is enabled.
   (Optional: under **Authentication → Settings**, turn off "Confirm email" while
   developing, so you don't need to click a confirmation link every time you sign up.)
5. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret — backend only!)

### Creating your first admin account
The sign-up form only allows choosing student / faculty / staff. To get an
**admin** account (full access), sign up normally through the app, then in
Supabase go to **Table Editor → profiles**, find your row, and change `role`
to `admin`.

---

## 2. Run the backend locally

```bash
cd backend
cp .env.example .env
# open .env and paste your Supabase Project URL + service_role key
npm install
npm run dev
```

The API will run at `http://localhost:5000`.

---

## 3. Run the frontend locally

```bash
cd frontend
cp .env.example .env
# open .env and paste your Supabase Project URL + anon key
# VITE_API_URL should point at your local backend (http://localhost:5000)
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Sign up, promote yourself to
`admin` in Supabase (see above), and you'll see the Dashboard, Requests,
Damage Reports, and Manage Equipment tabs.

---

## 4. Deploy — free hosting

### 4a. Backend → Render
1. Push this project to a GitHub repo.
2. Go to [render.com](https://render.com) → **New → Web Service** → connect your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install` — Start command: `node src/server.js`.
5. Add environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CLIENT_ORIGIN`
   (set `CLIENT_ORIGIN` after step 4b, once you know your Cloudflare Pages URL).
6. Deploy. You'll get a URL like `https://labtrack-api.onrender.com`.

> Render's free tier sleeps after 15 minutes of inactivity — the first
> request after a nap takes ~30–50 seconds. Open the site once before a
> demo to "wake it up."

### 4b. Frontend → Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create a project** → connect your repo.
2. Set **Root Directory** to `frontend`.
3. Build command: `npm run build` — Output directory: `dist`.
4. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   and `VITE_API_URL` (your Render backend URL from step 4a).
5. Deploy. You'll get a URL like `https://labtrack.pages.dev`.
6. Go back to Render and set `CLIENT_ORIGIN` to this Cloudflare Pages URL so
   CORS allows requests from your live frontend.

That's it — everything is on free tiers.

---

## Features

- **Role-based auth** (student / faculty / staff / admin) via Supabase Auth + Row Level Security
- **Equipment inventory**: add/edit/delete, search & filter, live availability count
- **Borrowing workflow**: request → staff approval/rejection → issued → returned
- **Damage reports**: submit with photo upload (Supabase Storage), staff triage (pending → under repair → resolved)
- **Dashboard**: total equipment, pending requests, currently issued items, most-borrowed ranking

## Notes for your report/viva

- Database diagram: `profiles → borrow_requests → equipment`, plus `returns`
  and `damage_reports` referencing both. See `database/01_schema.sql`.
- Security model: the Express backend uses the Supabase **service role key**
  (bypasses RLS) but enforces role checks itself via `middleware/auth.js`.
  The frontend, when it talks to Supabase directly (auth, storage), is
  protected by **Row Level Security** policies in `database/02_rls_policies.sql`.

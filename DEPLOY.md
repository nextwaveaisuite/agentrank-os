# AgentRank OS — Deployment Guide
## Vercel + GitHub + Supabase

---

## Step 1 — Supabase (Database)

1. Go to https://supabase.com and sign in
2. Click "New project" — name it `agentrank-os`
3. Choose a region closest to you (Australia → Singapore or Sydney)
4. Set a strong database password and save it
5. Wait for project to finish building (~2 mins)
6. Go to Settings → Database → Connection string
7. Select "Transaction" pooler (port 6543)
8. Copy the URI — this is your DATABASE_URL

---

## Step 2 — GitHub

1. Create a new repository on GitHub named `agentrank-os`
2. Extract this zip file on your computer
3. Open terminal in the extracted folder and run:

```bash
git init
git add .
git commit -m "Initial AgentRank OS build"
git remote add origin https://github.com/YOUR_USERNAME/agentrank-os.git
git push -u origin main
```

---

## Step 3 — Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `agentrank-os` repository
4. Framework Preset: select "Other"
5. Build Command: `pnpm build`
6. Output Directory: `dist/public`
7. Install Command: `pnpm install`

### Add Environment Variables in Vercel:
Click "Environment Variables" and add each one from `.env.example`:

| Key | Value |
|-----|-------|
| DATABASE_URL | Your Supabase connection string |
| JWT_SECRET | Any random 32+ char string |
| VITE_APP_ID | Your app ID |
| OAUTH_SERVER_URL | https://oauth.manus.im |
| OWNER_OPEN_ID | Your open ID |
| BUILT_IN_FORGE_API_KEY | Your API key |
| BUILT_IN_FORGE_API_URL | https://forge.manus.im |

8. Click "Deploy"

---

## Step 4 — Database Migration

Once deployed, run migrations to create your tables in Supabase:

```bash
# On your local machine (with DATABASE_URL set in your local .env)
pnpm db:push
```

This creates all 8 tables in your Supabase database automatically.

---

## Step 5 — You're Live!

Visit your Vercel URL, sign in, and your AI Office will:
1. Automatically set up your 6-agent team
2. Generate your first morning briefing
3. Be ready to launch campaigns and find leads

---

## Troubleshooting

**Build fails on Vercel:** Check that all environment variables are set correctly.

**Database connection error:** Make sure you're using the Transaction pooler URL (port 6543), not the direct connection (port 5432).

**Agents not responding:** Check that BUILT_IN_FORGE_API_KEY is valid.

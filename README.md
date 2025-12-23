# 2-Build

Minimal scaffold for the 2-Build web application (prototype).

Quick start

1. Install backend dependencies:

```powershell
cd "d:\Project 2Build"
npm install express cors body-parser better-sqlite3
```

2. Install frontend dependencies and run dev server:

```powershell
cd "d:\Project 2Build\frontend"
npm install
npm run dev
```

3. Run backend server:

```powershell
cd "d:\Project 2Build"
npm run server
```

API endpoints

- `GET /api/profiles` — list profiles
- `POST /api/profiles` — create profile { name, role, skills:[], bio }
- `GET /api/projects` — list projects
- `POST /api/projects` — create project { title, description, required_skills:[], equity_offered }
- `GET /api/match?profileId=ID` — returns projects scored by matching skills

Notes

- This is a minimal prototype to explore matching and collaboration flows. Extend with auth, persistence migration, UI flows, and equity negotiation features.

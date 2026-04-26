# CLAUDE.md — kozeletimozaik
> Frissítve: 2026-04-13

## ⚠️ REPO AZONOSÍTÁS

**Ez a `kozeletimozaik` repo** (`gaiagent0/kozeletimozaik`)  
Mappa: `C:\Users\istva\Dev\portfolio\Projects\kozeletimozaik`  
Live URL: https://valasztasibingo.hu | https://kozeletimozaik.vercel.app

**NE keverd a `valasztasibingo` repóval** (egyszerűbb önálló bingó, külön repo/mappa).
```bash
git remote -v  # → kozeletimozaik
```

---

## Projekt

Választási Bingó 2026 — interaktív 4-képernyős PWA a 2026-os magyar választáshoz.

---

## Tech stack

React 18 + Vite 5 + Tailwind CSS 3 (Material Design 3)  
Supabase (PostgreSQL + Auth + Realtime) · Vercel Edge Function  
Google Material Symbols · Plus Jakarta Sans + Manrope · html2canvas

---

## Infrastruktúra

| | |
|---|---|
| Vercel projekt | gaiagent0/kozeletimozaik |
| Supabase projekt ID | `zkjmdxibelcnxsryirph` |
| Supabase URL | `https://zkjmdxibelcnxsryirph.supabase.co` |
| Domain | valasztasibingo.hu (Rackhost DNS → Vercel) |

---

## Képernyők (`src/screens/`)

1. `BingoScreen` — welcome + 5×5 játéktábla, konfetti, hang, haptic, screenshot
2. `CommunityScreen` — realtime leaderboard, TE badge, aktivitás feed, napi kihívás
3. `NewsScreen` — RSS hírek (Telex/444/HVG), politikai szűrés
4. `SettingsScreen` — Google/anon auth, profil, togglek (localStorage)

---

## Fontos fájlok

```
src/
  lib/supabase.js, auth.js, settings.js
  hooks/useAuth.js, useDailyChallenge.js
  components/TopBar.jsx, BottomNav.jsx
  screens/Bingo|Community|News|SettingsScreen.jsx
api/news.js          ← Vercel Edge Function, RSS + politikai szűrés
public/manifest.json, sw.js
```

---

## Supabase táblák

- `profiles` — total_points, total_bingos, level
- `bingo_sessions` — játékok mentése
- `leaderboard` — view (rank() függvény)
- `daily_challenges` — napi kihívás
- Auth: Anonymous sign-in ✅, Google OAuth ✅

---

## Kész funkciók

PWA, hangeffektek (Web Audio API), haptic, LocalStorage, Web Share + html2canvas,
politikai hírek szűrés (34 kulcsszó), napi kihívás, realtime leaderboard, aktivitás feed,
TopBar gombok (bal→bingo, jobb→settings), "Választási Bingó 2026" branding.

---

## Fejlesztési szabályok

1. `npm run build` — 0 hibával fusson commit előtt
2. Design rendszert ne változtasd (Tailwind konfig, CSS változók)
3. Commit prefix: `feat:` / `fix:` / `chore:`
4. Csak a megjelölt fájlt módosítsd — ne törj el más screen-eket

---

## Parancsok

```bash
npm run dev        # lokális dev
npm run build      # prod build
git remote -v      # repo ellenőrzés (!)
git add -A && git commit -m "feat: ..." && git push
```

---

## Nyitott feladatok

- Dark mode
- Több RSS forrás (index.hu, mno.hu)
- Profil szerkesztés (username)
- TikTok/Instagram OAuth (placeholder)

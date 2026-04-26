# Választási Bingó 2026 – Projekt kontextus (új chat indításához)

## Projektek

| Projekt | Repo | URL | Leírás |
|---------|------|-----|--------|
| **kozeletimozaik** | gaiagent0/kozeletimozaik | valasztasibingo.hu | 4-screen app (FŐ PROJEKT) |
| valasztasibingo | gaiagent0/valasztasibingo | valasztasibingo.vercel.app | Egyszerű bingó (mellék) |

## Infrastruktúra

- **Vercel team:** gaiagents-projects (team_o7InAc4l8ZLViJ6QyId5mile)
- **Supabase projekt:** zkjmdxibelcnxsryirph (https://zkjmdxibelcnxsryirph.supabase.co)
- **Domain:** valasztasibingo.hu → kozeletimozaik Vercel projekt ✅
  - DNS (Rackhost): A @ → 76.76.21.21 | CNAME www → cname.vercel-dns.com
- **Lokális mappa:** C:\Users\istva\Dev\portfolio\Projects\kozeletimozaik

## Tech stack

- React 18 + Vite 5 + Tailwind CSS 3 (Material Design 3)
- Supabase (PostgreSQL + Auth + Realtime)
- Vercel Edge Function (api/news.js – RSS + 34 politikai kulcsszó)
- Google Material Symbols ikonok
- Plus Jakarta Sans + Manrope betűtípusok
- html2canvas + off-screen Canvas (branded share kép)

## Supabase táblák

- `profiles` – felhasználói profil (total_points, total_bingos, level)
- `bingo_sessions` – bingó játékok mentése
- `leaderboard` – view (profiles alapján, rank() függvénnyel)
- `daily_challenges` – napi kihívások (sv-SE dátum, .maybeSingle())
- Auth: Anonymous ✅, Google OAuth ✅, Facebook OAuth ⏳ (App Review szükséges)

## OAuth konfiguráció

| Provider | Státusz | Megjegyzés |
|---|---|---|
| Google | ✅ Kész | redirectTo: valasztasibingo.hu |
| Anonymous | ✅ Kész | |
| Facebook | ⏳ App Review | App ID: 959053850035761, Supabase konfigurálva, de Live mód kell |
| TikTok | ⏳ Hamarosan | Disabled placeholder |
| Instagram | ⏳ Hamarosan | Disabled placeholder |

## Képernyők (src/screens/)

1. **BingoScreen** – welcome + visszaszámláló (2026-04-12 19:00 CEST, UTC) + 3D bingó tábla + "Hogyan játssz?" leírás + napi statisztika Supabase-ből + branded share kép
2. **CommunityScreen** – Realtime leaderboard, TE badge, aktivitás feed (RLS fallback), Napi Bajnok élő, napi kihívás; "Közös Bingó Est" inaktív
3. **NewsScreen** – RSS hírek (Telex/444/HVG), politikai szűrés
4. **SettingsScreen** – Google + Facebook(hamarosan) + anon auth, profil stats, togglek

## Fontos fájlok

- `src/lib/supabase.js` – Supabase kliens
- `src/lib/auth.js` – signInWithGoogle, signInWithFacebook, signInAnonymously, signOut
- `src/lib/settings.js` – localStorage togglek, playSound, vibrate
- `src/lib/data.js` – BUZZWORDS (63 szó), NEWS, LEADERBOARD
- `src/hooks/useAuth.js` – session figyelés
- `src/hooks/useDailyChallenge.js` – sv-SE dátum + maybeSingle
- `src/components/TopBar.jsx` – leftIcon prop, null → rejtett
- `src/components/BottomNav.jsx` – 4 tab navigáció
- `src/components/LegalFooter.jsx` – copyright + 3 jogi link, minden oldalon
- `api/news.js` – Vercel Edge Function, RSS + politikai szűrés
- `public/manifest.json` – PWA (icon-192.png, icon-512.png)
- `public/sw.js` – Service Worker
- `public/icon-192.png`, `public/icon-512.png` – valódi PNG ikonok
- `public/privacy.html`, `public/terms.html`, `public/delete.html` – jogi oldalak

## MCP-k (Claude Code-ban)

- github (ghp_REDACTED)
- filesystem (C:\Users\istva\Dev)
- vercel (vcp_REDACTED)
- supabase (sbp_REDACTED)

## Elvégzett fejlesztések ✅

- PWA (manifest + sw + valódi PNG ikonok → Chrome install prompt)
- Hangeffektek (Web Audio API) + haptika
- LocalStorage persistens togglek
- Branded share kép (off-screen canvas: trikolór + fejléc + grid + URL)
- Asztali fallback: automatikus PNG letöltés + szöveg vágólapra + toast
- Viral share szövegek (3-3 véletlenszerű, bingó/játék állapothoz)
- Politikai hírek szűrése (34 kulcsszó)
- Napi kihívás (sv-SE + maybeSingle)
- Realtime leaderboard + aktivitás feed (RLS fallback)
- Napi Bajnok élő Supabase adattal
- useCountdown bugfix (UTC, stale closure fix)
- 3D bingó tábla (raised/pressed/win gradient+shadow)
- "Közös Bingó Est" → inaktív/Hamarosan
- Facebook OAuth gomb (App Review szükséges Live-hoz)
- TikTok + Instagram disabled placeholder
- Domain: valasztasibingo.hu → kozeletimozaik
- Jogi oldalak (privacy/terms/delete) GDPR-kompatibilis
- LegalFooter komponens – minden képernyőn (copyright + 3 link)
- TopBar: home ikon másik screen-eken, főoldalon rejtett
- "Hogyan játssz?" szekció a főoldalon
- Copyright: © 2026 Gai Agent TechServices · gaiagent.cc
- Bingó szótár frissítve: 63 szó (Pálinkás százados, Henry, Gundalf, Da-da-da, PADME, stb.)
- Napi statisztika élő Supabase adattal a főoldalon
- "Közösségi Játék" kártya → Community screen navigáció

## Következő lehetséges feladatok

- Facebook App Review elvégzése (Live mód)
- Több RSS forrás (index.hu, mno.hu)
- Dark mode
- Profil szerkesztés (username változtatás)
- Napi kihívás automatikus rotáció
- Promóció (Reddit, Facebook, TikTok poszt szöveg)

## Claude Code indítás

```powershell
cd C:\Users\istva\Dev\portfolio\Projects\kozeletimozaik
claude
```

Első prompt: "Olvasd el a CLAUDE.md-t. git remote -v → kozeletimozaik. git pull origin main."


# Közéleti Mozaik – Fejlesztési feladatlista

## Projekt kontextus

**Alkalmazás neve:** Közéleti Mozaik – Választási Bingó 2026  
**GitHub repo:** https://github.com/gaiagent0/kozeletimozaik  
**Vercel projekt:** kozeletimozaik (gaiagents-projects team)  
**Live URL:** https://kozeletimozaik.vercel.app  
**Supabase projekt:** https://zkjmdxibelcnxsryirph.supabase.co

**Tech stack:**
- Frontend: React 18 + Tailwind CSS 3 (Material Design 3 színrendszer) + Vite 5
- Backend: Supabase (PostgreSQL + Auth + Realtime)
- Deploy: Vercel (automatikus git push-ra)
- Hírek: Vercel Edge Function + RSS feed parsing

**Design nyelv:** Material Design 3, magyar piros-fehér-zöld (#aa0424, #3f6748, #fbf9f6), Plus Jakarta Sans + Manrope betűtípusok, Google Material Symbols ikonok

---

## FONTOS: Első lépés – Repo szinkronizálás

A lokális mappa a régi egyszerű bingó verziót tartalmazza. A GitHub-on van a helyes 4-képernyős verzió. Futtasd:

```bash
git pull origin main
npm install
```

Ha a pull után a `src/screens/` mappa létezik és van benne `BingoScreen.jsx`, folytathatod a következő feladatokkal.

---

## Feladatok – Ebben a sorrendben hajtsd végre

### 1. FELADAT: Supabase integráció alapjai

**Telepítsd a Supabase klienst:**
```bash
npm install @supabase/supabase-js
```

**Hozd létre:** `src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

### 2. FELADAT: Supabase adatbázis táblák (Supabase MCP-vel)

A Supabase MCP-n keresztül hozd létre az alábbi táblákat SQL migrációval:

**`profiles` tábla:**
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  level integer default 1,
  total_points integer default 0,
  total_bingos integer default 0,
  total_tips integer default 0,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
```

**`bingo_sessions` tábla:**
```sql
create table public.bingo_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  points_earned integer default 0,
  words_matched text[],
  completed_at timestamptz default now()
);
alter table public.bingo_sessions enable row level security;
create policy "Users can insert own sessions" on public.bingo_sessions for insert with check (auth.uid() = user_id);
create policy "Sessions are viewable by everyone" on public.bingo_sessions for select using (true);
```

**`leaderboard` view (nem tábla, hanem nézet):**
```sql
create or replace view public.leaderboard as
  select
    p.id,
    p.display_name,
    p.avatar_url,
    p.total_points,
    p.total_bingos,
    p.level,
    rank() over (order by p.total_points desc) as rank
  from public.profiles p
  order by p.total_points desc
  limit 50;
```

**Trigger – új user esetén automatikusan létrehoz profilt:**
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Névtelen Választó'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

### 3. FELADAT: Supabase Auth (Google login + Anonymous)

**Hozd létre:** `src/lib/auth.js`
```js
import { supabase } from './supabase'

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({ provider: 'google',
    options: { redirectTo: window.location.origin }
  })

export const signInAnonymously = () =>
  supabase.auth.signInAnonymously()

export const signOut = () => supabase.auth.signOut()

export const getUser = () => supabase.auth.getUser()
```

**Hozd létre:** `src/hooks/useAuth.js`
```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

**Frissítsd a `SettingsScreen.jsx`-t** hogy valódi auth adatokat mutasson (display_name, total_points, total_bingos), és a Kijelentkezés gomb valóban kijelentkeztessen.

**Frissítsd a `BingoScreen.jsx`-t** hogy bingó esetén mentse a session-t Supabase-be:
```js
// Bingó után, ha van bejelentkezett user:
await supabase.from('bingo_sessions').insert({
  user_id: user.id,
  points_earned: count * 10,
  words_matched: Array.from(selected).map(i => board[i])
})
// Majd frissítse a profilt:
await supabase.from('profiles')
  .update({ 
    total_bingos: supabase.rpc('increment', { row_id: user.id, column: 'total_bingos' }),
    total_points: supabase.rpc('increment', { row_id: user.id, column: 'total_points', amount: count * 10 })
  })
  .eq('id', user.id)
```

---

### 4. FELADAT: Valódi leaderboard a CommunityScreen-ben

**Frissítsd a `CommunityScreen.jsx`-t:**

Töltsd be a leaderboard adatokat Supabase-ből:
```js
const [leaders, setLeaders] = useState([])
useEffect(() => {
  supabase.from('leaderboard').select('*').limit(5)
    .then(({ data }) => setLeaders(data ?? []))
}, [])
```

Használd a `leaders` tömböt a hardcoded `LEADERBOARD` adat helyett. Ha a leaders üres, mutass skeleton loader-t (szürke placeholder kártyák).

---

### 5. FELADAT: Hírek modul – Vercel Edge Function + RSS

**Hozd létre:** `api/news.js` (Vercel serverless function)

```js
export const config = { runtime: 'edge' }

const RSS_FEEDS = [
  { url: 'https://telex.hu/rss', source: 'Telex' },
  { url: 'https://444.hu/feed', source: '444' },
  { url: 'https://hvg.hu/rss', source: 'HVG' },
]

export default async function handler(req) {
  const results = []

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KozeletiMozaik/1.0)' }
      })
      const xml = await res.text()

      // Parse RSS items
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3)
      
      for (const [, item] of items) {
        const title = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
        const link = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ||
                     item.match(/<link href="(.*?)"/)?.[1]?.trim()
        const description = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]
          ?.replace(/<[^>]+>/g, '')?.trim()?.slice(0, 200)
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim()
        const image = item.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
                      item.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ||
                      item.match(/<media:content[^>]+url="([^"]+)"/)?.[1]

        if (title && link) {
          results.push({
            id: Buffer.from(link).toString('base64').slice(0, 12),
            title,
            description: description || '',
            link,
            image: image || null,
            source: feed.source,
            pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
          })
        }
      }
    } catch (err) {
      console.error(`RSS fetch error for ${feed.source}:`, err)
    }
  }

  // Sort by date, newest first
  results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

  return new Response(JSON.stringify(results.slice(0, 12)), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=900, stale-while-revalidate=1800', // 15 perc cache
      'Access-Control-Allow-Origin': '*'
    }
  })
}
```

**Frissítsd a `NewsScreen.jsx`-t** hogy az API-ból töltse be a híreket:

```js
const [articles, setArticles] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/news')
    .then(r => r.json())
    .then(data => { setArticles(data); setLoading(false) })
    .catch(() => setLoading(false))
}, [])
```

Minden hírelem így jelenjen meg:
- Ha van kép: teljes szélességű kép felül (aspect-video, object-cover)
- Forrás badge (pl. "Telex", "444") + relatív idő (pl. "2 órája")
- Cím (font-headline font-bold text-lg)
- Leírás első 150 karaktere (text-sm text-on-surface-variant)
- "Elolvasom →" link ami `target="_blank"`-ban nyitja az eredeti cikket
- Ha nincs kép: csak szöveges kártya

Ha `loading === true`: mutass 3 skeleton kártyát (animált szürke placeholder).

---

### 6. FELADAT: Supabase Auth beállítás a dashboardon

A Supabase dashboardon (https://supabase.com/dashboard/project/zkjmdxibelcnxsryirph) engedélyezd:
- Authentication → Providers → Google (ezt manuálisan kell, nem MCP-vel)
- Authentication → Providers → Anonymous sign-ins: **Enable**

Az Anonymous sign-in engedélyezéséhez futtasd MCP-vel:
```sql
-- Ez nem SQL, ezt a dashboardon kell bekapcsolni manuálisan
```

---

### 7. FELADAT: package.json frissítés és build ellenőrzés

Frissítsd a `package.json` `name` mezőjét:
```json
"name": "kozeletimozaik"
```

Futtasd és ellenőrizd hogy hiba nélkül buildelődik:
```bash
npm run build
```

Ha vannak TypeScript vagy import hibák, javítsd őket.

---

### 8. FELADAT: Git commit és Vercel deploy

Ha minden feladat kész és a build sikeres:

```bash
git add .
git commit -m "feat: Supabase auth + leaderboard + RSS news feed"
git push origin main
```

A Vercel automatikusan deployol a push után.

---

## Amit NE csinálj

- Ne változtasd meg a design rendszert (színek, betűtípusok, Tailwind config)
- Ne add hozzá a `.env.local`-t githez (már gitignore-ban van)
- Ne változtasd meg a bingó játékmechanikát (5x5, checkWin logika)
- A `.mcp.json` fájlt ne commitold (token van benne)

## Siker kritériumok

Az alkalmazás akkor kész, ha:
- [ ] `npm run build` hiba nélkül fut
- [ ] A Bingó képernyőn a tábla működik, bingó esetén konfetti van
- [ ] A Közösség képernyőn valódi adatok jelennek meg Supabase-ből
- [ ] A Hírek képernyőn valódi magyar politikai hírek jelennek meg képekkel
- [ ] A Beállítások képernyőn ki lehet jelentkezni
- [ ] A Vercel deploy sikeres és az app él production-ban

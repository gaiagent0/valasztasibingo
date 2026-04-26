# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Service Worker fix + kisebb hibák

## 1. sw.js már javítva (helyben) – push kell
A public/sw.js frissítve:
- CACHE neve v1 → v2 (régi cache kiürül)
- BYPASS_DOMAINS lista: cloud.umami.is, supabase.co, fonts
- Külső domaineket NEM interceptálja → Umami betölt, nincs ERR_FAILED

## 2. index.html – deprecated meta tag javítása
A konzolon: `apple-mobile-web-app-capable` deprecated

Cseréld le az index.html-ben:
```html
<!-- Régi: -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Új: -->
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```
(Mindkettő kell – Apple Safari + Android Chrome kompatibilitáshoz)

## 3. daily_challenges 404 – Supabase SQL futtatás
A konzolban: `daily_challenges?date=eq.2026-04-04` → 404

Futtasd Supabase MCP-vel vagy Dashboard SQL Editor-ban:
```sql
INSERT INTO public.daily_challenges (date, title, description, target_words, min_matches, bonus_points, active)
VALUES (
  '2026-04-04',
  'A Kampányhajrá Szavai',
  'Jelölj be legalább 3 mai varázsszót a közvetítés alatt!',
  ARRAY['Százados', 'Csád', 'Gundalf', 'Henry', 'Pancser'],
  3,
  50,
  true
) ON CONFLICT (date) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  target_words = EXCLUDED.target_words,
  active = true;
```

## Lépések
1. `npm run build` – 0 hiba
2. `git add public/sw.js index.html`
3. `git commit -m "fix: sw.js bypass külső domainek (Umami/Supabase), deprecated meta tag"`
4. `git push origin main`
5. Supabase SQL futtatása (daily_challenges mai rekord)

## Siker kritériumok
- [ ] Konzolban nincs ERR_FAILED az Umami scriptnél
- [ ] Umami dashboard-on megjelennek a látogatók
- [ ] daily_challenges 404 eltűnik
- [ ] `npm run build` 0 hiba

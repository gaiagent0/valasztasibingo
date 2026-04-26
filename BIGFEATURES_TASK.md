# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# Ellenőrizd: git remote -v → kozeletimozaik | git pull origin main

# Nagy fejlesztési csomag – 6 feature

---

## 1. BEÁLLÍTÁSOK – Működő togglek (localStorage perzisztencia)

**Fájl: `src/screens/SettingsScreen.jsx`**

A togglek (Hírértesítések, Haptikus visszajelzés, Hanghatások) jelenleg csak React state-ben élnek.
Perzisztálni kell localStorage-ba, és a többi screennek is el kell érnie.

**Hozd létre: `src/lib/settings.js`**
```js
const DEFAULTS = { notifs: true, haptic: false, sounds: true }

export function getSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('app_settings') || '{}') }
  } catch { return DEFAULTS }
}

export function saveSettings(settings) {
  localStorage.setItem('app_settings', JSON.stringify(settings))
}

// Haptikus visszajelzés
export function vibrate(pattern = [50]) {
  if (navigator.vibrate) navigator.vibrate(pattern)
}

// Hangeffekt (Web Audio API – nem kell külső fájl)
export function playSound(type = 'tap') {
  const settings = getSettings()
  if (!settings.sounds) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    if (type === 'tap') { osc.frequency.value = 800; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1) }
    if (type === 'bingo') { osc.frequency.value = 1200; gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4) }
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch (e) {}
}

// Push értesítések kérése
export async function requestNotifPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}
```

**Frissítsd a SettingsScreen.jsx toggleket:**
```js
import { getSettings, saveSettings, requestNotifPermission } from '../lib/settings.js'

// useState helyett:
const [settings, setSettings] = useState(getSettings())

const updateSetting = (key, value) => {
  const next = { ...settings, [key]: value }
  setSettings(next)
  saveSettings(next)
  // Ha értesítés bekapcsolva, kérjünk permission-t
  if (key === 'notifs' && value) requestNotifPermission()
}
```

A SettingRow-okban:
```jsx
<Toggle checked={settings.notifs} onChange={() => updateSetting('notifs', !settings.notifs)} />
<Toggle checked={settings.haptic} onChange={() => updateSetting('haptic', !settings.haptic)} />
<Toggle checked={settings.sounds} onChange={() => updateSetting('sounds', !settings.sounds)} />
```

---

## 2. BINGÓ – Hangeffekt + Haptikus visszajelzés

**Fájl: `src/screens/BingoScreen.jsx`**

Importáld a settings helpereket:
```js
import { playSound, vibrate, getSettings } from '../lib/settings.js'
```

A `toggleCell` függvényben cellára kattintáskor:
```js
const s = getSettings()
if (s.sounds) playSound('tap')
if (s.haptic) vibrate([30])
```

Bingó esetén:
```js
if (bingo && !isBingo) {
  launchConfetti()
  if (s.sounds) playSound('bingo')
  if (s.haptic) vibrate([100, 50, 100, 50, 200])
  // ... Supabase session mentés
}
```

---

## 3. HÍREK – Politikai/választási szűrés

**Fájl: `api/news.js`**

Az RSS lekérés után szűrd a cikkeket kulcsszavak alapján.
Add hozzá a fetch után, a sort előtt:

```js
const POLITICAL_KEYWORDS = [
  'választás', 'választási', 'kampány', 'párt', 'kormány', 'ellenzék',
  'miniszter', 'parlament', 'politika', 'politikai', 'fidesz', 'tisza',
  'magyar péter', 'orbán', 'szavazás', 'szavazat', 'képviselő',
  'törvény', 'alaptörvény', 'eu', 'brüsszel', 'korrupció',
  'önkormányzat', 'polgármester', 'főpolgármester', 'ellenzéki',
  'koalíció', 'frakció', 'budget', 'költségvetés', 'adó', 'rezsi'
]

function isPolitical(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase()
  return POLITICAL_KEYWORDS.some(kw => text.includes(kw))
}

// Szűrés – ha van elég politikai cikk, csak azt mutassuk
const political = results.filter(r => isPolitical(r.title, r.description))
const finalResults = political.length >= 4 ? political : results // fallback ha kevés
```

Cseréld le az utolsó return-ben:
```js
return new Response(JSON.stringify(finalResults.slice(0, 12)), { ... })
```

---

## 4. VIRAL MEGOSZTÁS – Egyedi link bingó eredményhez

**Fájl: `src/screens/BingoScreen.jsx`**

A megosztás gomb generáljon egyedi URL-t ami tartalmazza a megjelölt szavakat:

```js
const handleShare = () => {
  const count = selected.size - 1
  const url = import.meta.env.VITE_APP_URL || 'https://valasztasibingo.hu'
  
  // Encode a kiválasztott szavakat az URL-be
  const words = Array.from(selected)
    .filter(i => i !== CENTER)
    .map(i => board[i])
    .slice(0, 5) // max 5 szó az URL-be
  const encoded = encodeURIComponent(words.join(','))
  const shareUrl = `${url}?words=${encoded}&score=${count}`
  
  const text = isBingo
    ? `🇭🇺 BINGÓ! ${count} mezőm volt – "${words[0]}" és még ${count - 1} más! Próbáld ki: ${shareUrl} #valasztas2026`
    : `🗳️ ${count}/24 mezőnél tartok a Választási Bingón. Próbáld ki: ${shareUrl} #valasztas2026`
  
  if (navigator.share) {
    navigator.share({ title: 'Választási Bingó 2026', text, url: shareUrl }).catch(() => copyToClipboard(text))
  } else {
    copyToClipboard(text)
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard?.writeText(text)
    .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
    .catch(() => {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch {}
      document.body.removeChild(ta)
    })
}
```

A mobilon a **Web Share API** (`navigator.share`) natív megosztó sheettet nyit — sokkal jobb UX mint a vágólap.

---

## 5. PWA – Telepíthető mobilra

**Hozd létre: `public/manifest.json`**
```json
{
  "name": "Közéleti Mozaik – Választási Bingó 2026",
  "short_name": "Bingó 2026",
  "description": "Interaktív választási bingó a 2026-os kampányhoz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fbf9f6",
  "theme_color": "#aa0424",
  "orientation": "portrait",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23aa0424'/><text y='.9em' font-size='80' x='10'>🗳️</text></svg>",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

**Hozd létre: `public/sw.js`** (Service Worker cache)
```js
const CACHE = 'kozeletimozaik-v1'
const ASSETS = ['/', '/index.html']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  )
})
```

**Frissítsd: `index.html`** – add a `<head>`-be:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Bingó 2026" />
```

**Frissítsd: `src/main.jsx`** – service worker regisztráció:
```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
```

---

## 6. NAPI KIHÍVÁS – Valódi Supabase logika

**Supabase SQL (futtasd a dashboardon vagy MCP-vel):**
```sql
create table if not exists public.daily_challenges (
  id uuid default gen_random_uuid() primary key,
  date date unique default current_date,
  title text not null,
  description text,
  target_words text[],
  min_matches integer default 3,
  bonus_points integer default 50,
  active boolean default true
);
alter table public.daily_challenges enable row level security;
create policy "Challenges viewable by all" on public.daily_challenges for select using (true);

-- Mai kihívás beillesztése
insert into public.daily_challenges (title, description, target_words, min_matches, bonus_points)
values (
  'A Parlament Hangjai',
  'Jelölj be legalább 3 politikai varázsszót ma!',
  ARRAY['Brüsszel', 'Szuverenitás', 'Migráció', 'Béke', 'Gyurcsány'],
  3,
  50
) on conflict (date) do nothing;
```

**Hozd létre: `src/hooks/useDailyChallenge.js`**
```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useDailyChallenge(user) {
  const [challenge, setChallenge] = useState(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    supabase.from('daily_challenges')
      .select('*').eq('date', new Date().toISOString().split('T')[0]).eq('active', true).single()
      .then(({ data }) => { if (data) setChallenge(data) })
  }, [])

  const checkChallenge = (selectedWords) => {
    if (!challenge || completed) return false
    const matches = challenge.target_words.filter(w => selectedWords.includes(w))
    if (matches.length >= challenge.min_matches) {
      setCompleted(true)
      // Pont jóváírás ha bejelentkezett
      if (user) {
        supabase.from('profiles').update({
          total_points: supabase.rpc('increment_points', { user_id: user.id, amount: challenge.bonus_points })
        }).eq('id', user.id)
      }
      return true
    }
    return false
  }

  return { challenge, completed, checkChallenge }
}
```

**Frissítsd a `CommunityScreen.jsx` "A Parlament Hangjai" kártyát:**
```js
import { useDailyChallenge } from '../hooks/useDailyChallenge.js'

// A komponensben:
const { challenge, completed } = useDailyChallenge(user)

// A kihívás kártya dynamikus:
<h4>{challenge?.title ?? 'A Parlament Hangjai'}</h4>
<p>{challenge?.description ?? 'Tölts ki 3 mezőt a mai közvetítés alatt!'}</p>
{completed && <span className="bg-secondary-container text-on-secondary-container text-xs px-2 py-1 rounded-full">✓ Teljesítve +{challenge?.bonus_points} pont</span>}
```

---

## Sorrend és ellenőrzés

1. `src/lib/settings.js` létrehozása
2. `SettingsScreen.jsx` toggle frissítés
3. `BingoScreen.jsx` hang + haptic + viral share
4. `api/news.js` politikai szűrés
5. `public/manifest.json` + `public/sw.js`
6. `index.html` manifest link
7. `src/main.jsx` SW regisztráció
8. `src/hooks/useDailyChallenge.js` létrehozása
9. `CommunityScreen.jsx` napi kihívás bekötése

```bash
npm run build
# Ha sikeres:
git add src/lib/settings.js src/hooks/useDailyChallenge.js \
  src/screens/BingoScreen.jsx src/screens/SettingsScreen.jsx \
  src/screens/CommunityScreen.jsx api/news.js \
  public/manifest.json public/sw.js index.html src/main.jsx
git commit -m "feat: PWA + hangok + haptic + viral share + politikai hírek + napi kihívás"
git push origin main
```

## Siker kritériumok
- [ ] Toggle értékek megmaradnak újratöltés után (localStorage)
- [ ] Bingó esetén rezgés és hang (ha engedélyezve)
- [ ] Hírek közt túlnyomóan politikai témák
- [ ] Megosztás gomb mobilon natív sheet-et nyit
- [ ] Chrome-ban "Telepítés" lehetőség jelenik meg (PWA)
- [ ] Napi kihívás kártya valódi adatot mutat
- [ ] Build 0 hibával, push sikeres

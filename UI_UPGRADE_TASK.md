# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# Ellenőrizd: git remote -v → kozeletimozaik | git pull origin main

# UI javítások és bővítések – 5 feladat

Stack: React 18 + Vite 5 + Tailwind CSS 3 (MD3 design tokenek)
⚠️ NE változtasd: tailwind.config.js, CSS változók, más screen-eket

---

## 1. useCountdown bugfix (src/screens/BingoScreen.jsx)

**Probléma:** A jelenlegi implementáció két hibát tartalmaz:
- Az `if (remaining === 0) return` a stale closure-t olvassa ([] dep), nem az aktuális értéket
- A timezone kezelés nem megbízható minden böngészőben

**Cseréld le a teljes `useCountdown` függvényt erre a ref-alapú verzióra:**

```js
const ELECTION_TARGET = new Date('2026-04-12T17:00:00Z').getTime() // UTC: 2026-04-12 19:00 CEST = 17:00 UTC

function useCountdown() {
  const [display, setDisplay] = useState(() => calcDisplay())

  function calcDisplay() {
    const remaining = Math.max(0, ELECTION_TARGET - Date.now())
    const days  = Math.floor(remaining / 86400000)
    const hours = Math.floor((remaining % 86400000) / 3600000)
    const mins  = Math.floor((remaining % 3600000) / 60000)
    const secs  = Math.floor((remaining % 60000) / 1000)
    const pad   = n => String(n).padStart(2, '0')
    return { days, time: `${pad(hours)}:${pad(mins)}:${pad(secs)}`, done: remaining === 0 }
  }

  useEffect(() => {
    const id = setInterval(() => {
      const d = calcDisplay()
      setDisplay(d)
      if (d.done) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, []) // [] helyes itt mert calcDisplay minden hívásnál friss Date.now()-t olvas

  return display
}
```

A `countdown.days`, `countdown.time`, `countdown.done` API marad ugyanaz – a JSX nem változik.

---

## 2. Bingó tábla 3D vizuális upgrade (src/screens/BingoScreen.jsx)

**Cél:** Látványosabb, prémiumabb bingó tábla – 3D hatású cellák, jobb tipográfia, de az MD3 arculat megmarad.

### 2a. Bingó tábla wrapper – keret + shadow upgrade

Cseréld le a `<div id="bingo-grid" ...>` elemet:

```jsx
<div
  id="bingo-grid"
  className="rounded-3xl overflow-hidden"
  style={{
    background: 'linear-gradient(145deg, var(--md-sys-color-surface-container-high), var(--md-sys-color-surface-container))',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.15)',
    padding: '10px',
  }}
>
```

### 2b. Cella stílusok – 3D pressed/raised hatás

A `board.map(...)` blokkban cseréld le a cellClass logikát és a button JSX-et:

```jsx
// Cellastílusok
const baseStyle = {
  borderRadius: '12px',
  transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
  userSelect: 'none',
}
const raisedStyle = {
  background: 'linear-gradient(160deg, #ffffff 0%, var(--md-sys-color-surface-container-lowest) 100%)',
  boxShadow: '0 4px 0 rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  transform: 'translateY(-1px)',
  border: '1px solid rgba(0,0,0,0.06)',
}
const pressedStyle = {
  background: 'linear-gradient(160deg, var(--md-sys-color-secondary-container) 0%, color-mix(in srgb, var(--md-sys-color-secondary-container) 80%, transparent) 100%)',
  boxShadow: '0 1px 0 rgba(0,0,0,0.10), inset 0 2px 4px rgba(0,0,0,0.10)',
  transform: 'translateY(1px)',
  border: '1px solid rgba(0,0,0,0.04)',
  color: 'var(--md-sys-color-on-secondary-container)',
}
const winStyle = {
  background: 'linear-gradient(135deg, var(--md-sys-color-primary) 0%, color-mix(in srgb, var(--md-sys-color-primary) 80%, #000) 100%)',
  boxShadow: '0 4px 0 rgba(170,4,36,0.35), 0 0 20px rgba(170,4,36,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
  transform: 'translateY(-2px) scale(1.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--md-sys-color-on-primary)',
}
const centerStyle = {
  background: 'linear-gradient(135deg, rgba(170,4,36,0.12) 0%, rgba(170,4,36,0.06) 100%)',
  boxShadow: '0 2px 0 rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
  border: '2px solid rgba(170,4,36,0.2)',
}

const cellStyle = isCenter ? centerStyle : isWin ? winStyle : isSel ? pressedStyle : raisedStyle

return (
  <button
    key={i}
    onClick={() => toggleCell(i)}
    className="aspect-square flex flex-col items-center justify-center p-1 text-center active:scale-95"
    style={{ ...baseStyle, ...cellStyle }}
  >
    {isCenter ? (
      <>
        <span className="material-symbols-outlined text-primary text-xl mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          how_to_vote
        </span>
        <span className="text-[7px] font-black uppercase tracking-widest text-primary leading-none">FREE</span>
      </>
    ) : (
      <span
        className="leading-tight break-words w-full"
        style={{
          fontSize: 'clamp(7px, 1.9vw, 10px)',
          fontFamily: 'var(--font-headline)',
          fontWeight: isWin ? 800 : isSel ? 700 : 600,
          textAlign: 'center',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: isWin ? 'var(--md-sys-color-on-primary)' :
                 isSel ? 'var(--md-sys-color-on-secondary-container)' :
                         'var(--md-sys-color-on-surface)',
          textShadow: isWin ? '0 1px 2px rgba(0,0,0,0.25)' : 'none',
          letterSpacing: '-0.01em',
        }}
      >
        {word}
      </span>
    )}
  </button>
)
```

### 2c. Grid gap finomítás

A grid div-en:
```jsx
<div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}>
```
Marad ugyanaz, csak a cella stílusok változnak fentebb.

---

## 3. Share kép javítás (src/screens/BingoScreen.jsx)

**Probléma:** scale: 2 nem elég éles; a megosztott képen a szöveg rosszul látható.

A `handleShare` függvényben az `html2canvas` hívást cseréld le:

```js
const canvas = await html2canvas(grid, {
  backgroundColor: '#f5f0eb',
  scale: 3,           // 2 → 3: élesebb kép
  logging: false,
  useCORS: true,
  imageTimeout: 0,
  removeContainer: true,
})
```

A `text` változóban (megosztott üzenet) is adj hozzá egy sort a láthatóság kedvéért:
```js
const text = isBingo
  ? `🇭🇺 BINGÓ! ${count} mezőm volt!\n"${words.slice(0,3).join('", "')}" – és más szavak.\n▶ Próbáld ki: ${shareUrl}\n#valasztas2026 #bingo2026`
  : `🗳️ ${count}/24 mezőnél tartok a Választási Bingón!\n▶ Próbáld ki: ${shareUrl}\n#valasztas2026 #bingo2026`
```

---

## 4. "Közös Bingó Est" kártya inaktiválása (src/screens/CommunityScreen.jsx)

Keresd meg a "Közös Bingó Est" kártyát és cseréld le:

**Előtte:**
```jsx
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
  ...Közös Bingó Est...
  <button onClick={() => showToast('Értesítés beállítva! 🔔')} ...>
```

**Utána** (inaktív / "hamarosan" állapot):
```jsx
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4 opacity-50">
  <div className="bg-surface-container-high p-3.5 rounded-xl flex-shrink-0">
    <span className="material-symbols-outlined text-on-surface-variant text-2xl">groups</span>
  </div>
  <div className="flex-1">
    <h4 className="font-headline font-bold text-on-surface-variant text-sm">Közös Bingó Est</h4>
    <p className="font-body text-xs text-on-surface-variant mt-0.5">Hamarosan elérhető</p>
  </div>
  <span className="bg-surface-container text-on-surface-variant text-[10px] font-headline font-bold px-2 py-1 rounded-full">
    Hamarosan
  </span>
</div>
```

---

## 5. Facebook OAuth + TikTok/Instagram placeholder (src/lib/auth.js + src/screens/SettingsScreen.jsx)

### 5a. auth.js – Facebook bejelentkezés hozzáadása

```js
export const signInWithFacebook = () =>
  supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin,
      scopes: 'email,public_profile',
    }
  })
```

⚠️ A Facebook OAuth-hoz a Supabase dashboardon is be kell kapcsolni:
Authentication → Providers → Facebook → engedélyezni + App ID + App Secret megadni.
Ha nincs konfigurálva, a gomb toast üzenetet mutasson: "Facebook bejelentkezés hamarosan!"

### 5b. SettingsScreen.jsx – bejelentkezési gombok bővítése

A nem-belépett állapot (user === null) kártyájában a Google gomb UTÁN add hozzá:

```jsx
{/* Elválasztó */}
<div className="flex items-center gap-3 w-full">
  <div className="flex-1 h-px bg-outline-variant/40" />
  <span className="text-[10px] text-on-surface-variant font-headline uppercase tracking-wider">vagy</span>
  <div className="flex-1 h-px bg-outline-variant/40" />
</div>

{/* Facebook gomb */}
<button
  onClick={handleFacebookLogin}
  disabled={authBusy}
  className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1877F2] text-white rounded-2xl font-headline font-bold text-sm active:scale-95 transition-transform disabled:opacity-60"
>
  {/* Facebook F logó */}
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  Bejelentkezés Facebookkal
</button>

{/* TikTok és Instagram – hamarosan */}
<div className="w-full grid grid-cols-2 gap-2">
  {[
    { name: 'TikTok', color: '#000', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
      </svg>
    )},
    { name: 'Instagram', color: '#E1306C', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )},
  ].map(({ name, color, icon }) => (
    <button
      key={name}
      disabled
      className="flex items-center justify-center gap-2 py-3 rounded-2xl font-headline font-bold text-xs text-white opacity-40"
      style={{ backgroundColor: color }}
    >
      {icon}
      {name}
    </button>
  ))}
</div>
<p className="text-[10px] text-on-surface-variant text-center">TikTok és Instagram – hamarosan</p>
```

A SettingsScreen-ben add hozzá a handleFacebookLogin handlert:
```js
import { signInWithGoogle, signInAnonymously, signOut, signInWithFacebook } from '../lib/auth.js'

const handleFacebookLogin = async () => {
  setAuthBusy(true)
  const { error } = await signInWithFacebook()
  if (error) {
    // Ha nincs konfigurálva a Supabase-ben
    setToast('Facebook bejelentkezés hamarosan! 🔜')
  }
  setAuthBusy(false)
}
```

Ha nincs `toast` + `showToast` a SettingsScreen-ben, add hozzá:
```js
const [toast, setToast] = useState(null)
const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
```
És a JSX végére (`</div>` elé):
```jsx
{toast && (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface text-sm font-headline font-bold px-5 py-3 rounded-2xl shadow-lg whitespace-nowrap">
    {toast}
  </div>
)}
```

---

## Sorrend

1. `src/screens/BingoScreen.jsx` → useCountdown bugfix (UTC timestamp)
2. `src/screens/BingoScreen.jsx` → 3D bingó tábla stílusok
3. `src/screens/BingoScreen.jsx` → share scale 3 + jobb szöveg
4. `src/screens/CommunityScreen.jsx` → "Közös Bingó Est" inaktív
5. `src/lib/auth.js` → signInWithFacebook hozzáadása
6. `src/screens/SettingsScreen.jsx` → Facebook gomb + TikTok/Instagram placeholder
7. `npm run build` – 0 hiba
8. `git add -A && git commit -m "feat: 3D bingo tabla, countdown fix, facebook login, kozossegi kartya inaktiv" && git push origin main`

## NE változtasd
- tailwind.config.js
- CSS custom property-ket (--md-sys-color-*)
- NewsScreen, más screen-ek
- BottomNav, TopBar komponensek

## Siker kritériumok
- [ ] Visszaszámláló helyes értéket mutat (UTC-alapú számítás)
- [ ] Bingó cellák 3D raised/pressed/win hatással rendelkeznek
- [ ] Megnyomott cella vizuálisan "lenyomódik", win cella "kiemelkedik"
- [ ] Share képe scale 3, text tartalmaz hashtageket
- [ ] "Közös Bingó Est" kártya szürke + "Hamarosan" badge
- [ ] Facebook gomb látható és kattintható a bejelentkezési képernyőn
- [ ] TikTok + Instagram disabled gombként jelenik meg
- [ ] `npm run build` 0 hibával
- [ ] `git push origin main` sikeres

# Választási Bingó 2026 – fejlesztési útmutató (Cursor / Cline)

## Stack
- React 18 + Vite 5
- Lucide React (ikonok)
- Inline stílusok (nincs Tailwind, nincs CSS modul)
- Deployment: Vercel (automatikus a `main` ágról)

## Projekt struktúra
```
valasztasibingo/
├── src/
│   ├── App.jsx       ← Teljes alkalmazás (egyetlen fájl)
│   ├── index.css     ← Minimális reset
│   └── main.jsx      ← Belépési pont
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Kulcskonstansok (App.jsx tetején)
```js
const CREATOR_URL = 'https://gaiagent.hu';         // Készítői link – IDE írd a valódi URL-t!
const APP_URL = 'https://valasztasibingo.vercel.app'; // Publikus URL
const APP_HASHTAG = 'valasztas2026';                 // Social hashtag
const COUNTER_BASE = 12847;                          // Alap játékszám (növeld idővel)
const SEEN_KEY = 'vb2026_seen_welcome';              // LocalStorage – welcome modal állapota
```

## Fejlesztési feladatok (backlog)

### Prioritás 1 – Azonnali
- [ ] `CREATOR_URL` beállítása a valódi weboldalra
- [ ] `APP_URL` beállítása a production domain-re (ha nem Vercel)
- [ ] OG meta tagek hozzáadása az `index.html`-be (link-preview Facebookhoz, Twitterhez)
- [ ] Favicon + apple-touch-icon hozzáadása

### Prioritás 2 – Közösségi funkciók
- [ ] Valós játékszámláló (pl. Supabase free tier, vagy countapi)
  - API: `https://api.countapi.xyz/hit/valasztasibingo.hu/plays`
  - Fallback: localStorage (már megvalósítva)
- [ ] "Eredménykártya" képgenerálás (html2canvas) megosztáshoz
- [ ] Szavazás: "Melyik szólam hangzott el leggyakrabban?"

### Prioritás 3 – UX
- [ ] Hangeffekt a bingó-ra (Web Audio API, nem kell külső lib)
- [ ] Sötét mód (`prefers-color-scheme`)
- [ ] Mobilon swipe-to-new-card gesztus
- [ ] Accessibility: ARIA labelek a grid cellákra

### Prioritás 4 – Tartalom
- [ ] Admin UI: varázsszavak egyszerű szerkesztése JSON-ból
- [ ] Különböző "csomagok": Orbán-bingó, Ellenzék-bingó, TV2-bingó stb.
- [ ] Kampányidőszakra szabott szavak frissítése

## Beágyazás (iframe embed)
```html
<iframe
  src="https://valasztasibingo.vercel.app"
  width="520"
  height="720"
  frameborder="0"
  style="border-radius:12px;overflow:hidden;"
  title="Választási Bingó 2026"
  loading="lazy"
></iframe>
```

## Színpaletta
| Szín | HEX | Hol |
|------|-----|-----|
| Magyar piros | `#CE2939` | header, akciógombok, win cellák |
| Sötét piros | `#A01F2C` | hover, árnyék |
| Magyar zöld | `#477050` | selected cellák, center, success |
| Sötét zöld | `#2F4D37` | hover |
| Háttér | `#F9FAFB` | oldal háttér |

## Deploy
```bash
npm install
npm run dev        # localhost:5173
npm run build      # dist/ mappa
```
Vercel automatikusan builden a `main` ágra push után.

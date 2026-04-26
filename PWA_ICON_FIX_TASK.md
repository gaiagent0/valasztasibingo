# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# PWA icon fix + Copyright footer minden oldalon

---

## 1. PWA install prompt javítás – valódi PNG ikonok

### Probléma
A Chrome mobilon nem mutat PWA telepítési promptot mert a manifest.json-ban
`data:` URL-es SVG ikon van – a Chrome ezt nem fogadja el.
Valódi PNG fájlok kellenek (192x192, 512x512).

### 1a. Ikon PNG-k generálása

```bash
pip install cairosvg --break-system-packages -q

python3 << 'EOF'
import cairosvg

svg = """<svg width="512" height="512" viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="680" fill="#aa0424" rx="120"/>
  <rect x="80" y="80" width="520" height="520" fill="#ffffff" rx="72"/>
  <path d="M80 80 h520 v24 h-520 z" fill="#CE2939"/>
  <rect x="80" y="104" width="520" height="14" fill="#ffffff"/>
  <rect x="80" y="118" width="520" height="14" fill="#477050"/>
  <path d="M80 558 h520 v42 q0 27 -27 27 h-466 q-27 0 -27 -27 z" fill="#477050"/>
  <text x="340" y="172" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="46" fill="#aa0424" letter-spacing="2">VÁLASZTÁSI</text>
  <g fill="none" stroke="#aa0424" stroke-width="5">
    <rect x="120" y="190" width="440" height="330" rx="8" stroke-width="6"/>
    <line x1="230" y1="190" x2="230" y2="520"/>
    <line x1="340" y1="190" x2="340" y2="520"/>
    <line x1="450" y1="190" x2="450" y2="520"/>
    <line x1="120" y1="273" x2="560" y2="273"/>
    <line x1="120" y1="356" x2="560" y2="356"/>
    <line x1="120" y1="439" x2="560" y2="439"/>
  </g>
  <rect x="123" y="193" width="104" height="77" rx="4" fill="#aa0424" opacity="0.12"/>
  <rect x="343" y="276" width="104" height="77" rx="4" fill="#aa0424" opacity="0.12"/>
  <rect x="453" y="193" width="104" height="77" rx="4" fill="#aa0424" opacity="0.12"/>
  <rect x="123" y="359" width="104" height="77" rx="4" fill="#aa0424" opacity="0.12"/>
  <rect x="233" y="442" width="104" height="75" rx="4" fill="#aa0424" opacity="0.12"/>
  <circle cx="340" cy="314" r="30" fill="#aa0424"/>
  <text x="340" y="324" text-anchor="middle" font-size="34" fill="white" font-family="sans-serif">★</text>
  <text x="340" y="608" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="62" fill="white" letter-spacing="10">BINGÓ</text>
  <text x="340" y="556" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="22" fill="white" opacity="0.8">2026</text>
</svg>"""

for size in [192, 512]:
    cairosvg.svg2png(
        bytestring=svg.encode(),
        write_to=f'public/icon-{size}.png',
        output_width=size,
        output_height=size
    )
    print(f'icon-{size}.png kész')
EOF
```

### 1b. public/manifest.json csere

```json
{
  "name": "Választási Bingó 2026",
  "short_name": "Bingó 2026",
  "description": "Interaktív választási bingó a 2026-os kampányhoz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fbf9f6",
  "theme_color": "#aa0424",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 1c. index.html – favicon frissítése

A `<head>`-ben cseréld le a favicon sort:
```html
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

---

## 2. Copyright + jogi linkek footer – MINDEN oldalon

### 2a. SettingsScreen.jsx – copyright már megvan, kiegészítés jogi linkekkel

A meglévő copyright blokk alá add hozzá a jogi linkeket:

```jsx
{/* Copyright + jogi linkek – MINDIG látható */}
<div className="text-center pt-2 pb-2 space-y-1">
  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-headline font-bold opacity-40">
    Választási Bingó 2026 v2.0.0
  </p>
  <a
    href="https://gaiagent.cc/"
    target="_blank"
    rel="noopener noreferrer"
    className="block text-[10px] text-on-surface-variant font-body opacity-40 hover:opacity-70 transition-opacity"
  >
    © 2026 Gai Agent TechServices · gaiagent.cc
  </a>
  <div className="flex items-center justify-center gap-3 pt-1">
    <a href="/privacy" target="_blank" className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
      Adatvédelem
    </a>
    <span className="text-on-surface-variant opacity-20 text-[10px]">·</span>
    <a href="/terms" target="_blank" className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
      ÁSZF
    </a>
    <span className="text-on-surface-variant opacity-20 text-[10px]">·</span>
    <a href="/delete" target="_blank" className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
      Adattörlés
    </a>
  </div>
</div>
```

⚠️ Ez a blokk a `{user && ...}` feltételen KÍVÜL legyen, közvetlenül `</main>` előtt.

### 2b. public/privacy.html, public/terms.html, public/delete.html

Mindhárom fájlban a meglévő footer részt cseréld le erre (egységes stílus):

```html
<hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
<div style="font-size: 12px; color: #999; text-align: center; line-height: 2;">
  <div>
    © 2026 <a href="https://gaiagent.cc/" style="color: #999;">Gai Agent TechServices</a>
    · <a href="/" style="color: #999;">Választási Bingó 2026</a>
  </div>
  <div>
    <a href="/privacy" style="color: #999;">Adatvédelem</a>
    &nbsp;·&nbsp;
    <a href="/terms" style="color: #999;">ÁSZF</a>
    &nbsp;·&nbsp;
    <a href="/delete" style="color: #999;">Adattörlés</a>
  </div>
</div>
```

---

## Lépések sorban

1. Python script futtatása → `public/icon-192.png` + `public/icon-512.png`
2. `public/manifest.json` csere
3. `index.html` favicon frissítése
4. `src/screens/SettingsScreen.jsx` – copyright + jogi linkek (user-től függetlenül)
5. `public/privacy.html` – footer frissítése
6. `public/terms.html` – footer frissítése
7. `public/delete.html` – footer frissítése
8. `npm run build` – 0 hiba
9. `git add -A`
10. `git commit -m "fix: PWA PNG ikonok, copyright + jogi linkek minden oldalon"`
11. `git push origin main`

## Siker kritériumok
- [ ] `public/icon-192.png` és `public/icon-512.png` létezik
- [ ] manifest.json PNG ikonokra mutat
- [ ] Chrome mobilon megjelenik a telepítési prompt
- [ ] SettingsScreen alján: copyright + Adatvédelem · ÁSZF · Adattörlés linkek (vendég módban is)
- [ ] privacy.html / terms.html / delete.html alján: copyright + mindhárom jogi link
- [ ] `npm run build` 0 hiba

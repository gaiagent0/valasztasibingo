# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Játék leírás + Copyright – 3 hely

## 1. BingoScreen welcome – játék leírás kártya hozzáadása

A "Buzword chips preview" szekció és a CTA gomb KÖZÉ szúrj be egy leírás kártyát:

```jsx
{/* Játék leírás */}
<div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 space-y-3">
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
    <h3 className="font-headline font-bold text-base text-on-surface">Hogyan játssz?</h3>
  </div>
  <ol className="space-y-2">
    {[
      { n: '1', text: 'Indíts el egy bingó táblát és hallgasd a közvetítést vagy kampánybeszédet.' },
      { n: '2', text: 'Ha elhangzik egy szó a táblán, kattints rá – a cella megjelölődik.' },
      { n: '3', text: 'Ha egy teljes sort, oszlopot vagy átlót bejelöltél: BINGÓ!' },
      { n: '4', text: 'Oszd meg az eredményed és versenyezz a közösséggel a ranglistán.' },
    ].map(item => (
      <li key={item.n} className="flex gap-3 items-start">
        <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.n}</span>
        <p className="text-sm font-body text-on-surface-variant leading-snug">{item.text}</p>
      </li>
    ))}
  </ol>
</div>
```

---

## 2. SettingsScreen – Copyright sor hozzáadása

A kijelentkezés gomb alatt, a verziószám mellé add hozzá (vagy cseréld le a meglévő verziószám sort):

```jsx
<div className="text-center mt-6 space-y-1">
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
</div>
```

Ha nincs bejelentkezett user (user === null), a copyright a login kártya alján jelenjen meg ugyanígy.

---

## 3. Jogi oldalak footer – Copyright frissítése

A `public/privacy.html`, `public/terms.html`, `public/delete.html` fájlokban
a `<body>` végén (a "Vissza" link után) add hozzá:

```html
<hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
<p style="font-size: 12px; color: #999; text-align: center;">
  © 2026 <a href="https://gaiagent.cc/" style="color: #999;">Gai Agent TechServices</a> ·
  <a href="/" style="color: #999;">Választási Bingó 2026</a>
</p>
```

---

## Lépések

1. `src/screens/BingoScreen.jsx` – játék leírás kártya
2. `src/screens/SettingsScreen.jsx` – copyright sor
3. `public/privacy.html`, `public/terms.html`, `public/delete.html` – footer copyright
4. `npm run build` – 0 hiba
5. `git add -A`
6. `git commit -m "feat: játék leírás, copyright Gai Agent TechServices"`
7. `git push origin main`

## Siker kritériumok
- [ ] Főoldalon megjelenik a "Hogyan játssz?" szekció a CTA előtt
- [ ] Beállítások képernyőn © 2026 Gai Agent TechServices · gaiagent.cc link
- [ ] Jogi oldalakon footer copyright link
- [ ] `npm run build` 0 hiba

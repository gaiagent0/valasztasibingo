# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Két feladat: 1) Varázsszavak teljes lista  2) Umami Analytics

---

## 1. "+26 más..." chip → kinyitható varázsszó lista (BingoScreen.jsx)

### Probléma
A welcome képernyőn a "Néhány varázsszó" szekcióban van egy "+26 más..."
chip, de kattintásra semmi nem történik.

### Megoldás

A BingoScreen-ben add hozzá:
```js
const [showAllWords, setShowAllWords] = useState(false)
```

A "Néhány varázsszó" szekciót cseréld le:

```jsx
{/* Varázsszavak */}
<div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20">
  <div className="flex items-center justify-between mb-3">
    <p className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">
      {showAllWords ? 'Összes varázsszó' : 'Néhány varázsszó'}
    </p>
    <span className="text-xs text-on-surface-variant font-body">{BUZZWORDS.length} szó</span>
  </div>
  <div className="flex flex-wrap gap-2">
    {(showAllWords ? BUZZWORDS : BUZZWORDS.slice(0, 8)).map(w => (
      <span
        key={w}
        className="text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-body font-medium border border-outline-variant/30"
      >
        {w}
      </span>
    ))}
    {!showAllWords && (
      <button
        onClick={() => setShowAllWords(true)}
        className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-body font-medium active:scale-95 transition-transform"
      >
        +{BUZZWORDS.length - 8} más...
      </button>
    )}
    {showAllWords && (
      <button
        onClick={() => setShowAllWords(false)}
        className="text-xs bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-body font-medium active:scale-95 transition-transform"
      >
        Kevesebb ↑
      </button>
    )}
  </div>
</div>
```

---

## 2. Umami Analytics hozzáadása

### Miért Umami?
- Ingyenes (10k esemény/hó cloud verzió)
- Nincs cookie → nincs GDPR süti-banner szükséges
- Adatvédelmi szempontból a legjobb

### 2a. Regisztráció (manuálisan, nem a coder feladata)
1. Menj: https://cloud.umami.is
2. Regisztrálj (Google fiókkal is lehet)
3. Add hozzá a website-ot: `valasztasibingo.hu`
4. Kapni fogsz egy `data-website-id`-t (pl. `abc123-...`)

### 2b. Script beillesztése – index.html

A `<head>` szekcióba, a záró `</head>` tag elé add hozzá:

```html
<!-- Umami Analytics – GDPR-kompatibilis, cookie-mentes -->
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="IDE-KERÜL-AZ-UMAMI-WEBSITE-ID"
></script>
```

⚠️ A `data-website-id` értékét a regisztráció után kell beírni!
Egyelőre tedd be placeholder-ként, hogy a kód helyes legyen:
```html
data-website-id="UMAMI_WEBSITE_ID_PLACEHOLDER"
```

### 2c. Egyéni esemény tracking (opcionális, de hasznos)

A BingoScreen-ben a `startGame` függvénybe:
```js
// Játék indítása tracking
if (typeof window !== 'undefined' && window.umami) {
  window.umami.track('game_started')
}
```

A bingó esetén (`launchConfetti()` után):
```js
if (typeof window !== 'undefined' && window.umami) {
  window.umami.track('bingo_achieved', { count })
}
```

A share gombban:
```js
if (typeof window !== 'undefined' && window.umami) {
  window.umami.track('share_clicked', { isBingo })
}
```

### 2d. Microsoft Clarity (opcionális hőtérkép)

Ha hőtérkép is kell, a Clarity script az Umami UTÁN kerüljön az index.html-be:
```html
<!-- Microsoft Clarity – hőtérkép és session recording -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","CLARITY_ID_PLACEHOLDER");
</script>
```

---

## Lépések

1. `src/screens/BingoScreen.jsx` – showAllWords state + varázsszó lista
2. `index.html` – Umami script + opcionálisan Clarity script
3. `src/screens/BingoScreen.jsx` – umami event tracking (startGame, bingo, share)
4. `npm run build` – 0 hiba
5. `git add src/screens/BingoScreen.jsx index.html`
6. `git commit -m "feat: varázsszavak kinyitható lista, Umami analytics, esemény tracking"`
7. `git push origin main`

## Siker kritériumok
- [ ] "+26 más..." gombra kattintva megjelenik az összes szó
- [ ] "Kevesebb ↑" gombra visszazárul
- [ ] Az összes szó száma helyesen jelenik meg (63)
- [ ] index.html-ben benne van az Umami script
- [ ] umami.track() hívások a fő eseményeknél
- [ ] `npm run build` 0 hiba

## FONTOS – manuális lépés utána
A deploy után:
1. Regisztrálj az Umami Cloud-on (https://cloud.umami.is)
2. Add hozzá a valasztasibingo.hu domaint
3. Másold ki a Website ID-t
4. Cseréld ki az `UMAMI_WEBSITE_ID_PLACEHOLDER`-t a valódi ID-ra
5. git commit + push

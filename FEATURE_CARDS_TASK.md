# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Főoldal feature kártyák – valódi funkciók

A BingoScreen welcome képernyőn van 2 kártya ami nem csinál semmit:
- "Közösségi Játék – Játsszon barátaival élőben"
- "Napi Statisztika – Friss hívószavak"

Ezeket valódi funkcióra kell bekötni.

---

## 1. "Közösségi Játék" kártya → navigál a Community screenre

A kártyán jelenleg nincs onClick. Add hozzá:

```jsx
<div
  className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between h-36 cursor-pointer active:scale-95 transition-transform"
  onClick={() => onNavigate('community')}
>
  <span className="material-symbols-outlined text-secondary text-3xl">groups</span>
  <div>
    <h3 className="font-headline font-bold text-base leading-tight">Közösségi Játék</h3>
    <p className="text-xs text-on-surface-variant mt-1">Játsszon barátaival élőben</p>
  </div>
</div>
```

---

## 2. "Napi Statisztika" kártya → valódi adatok Supabase-ből

Jelenleg statikus szöveg. Töltsd fel valódi adattal:

### 2a. State + useEffect a BingoScreen-ben (welcome phase előtt)

```js
const [stats, setStats] = useState({ bingos: 0, players: 0, topWord: '—' })

useEffect(() => {
  const today = new Date().toLocaleDateString('sv-SE')
  // Mai bingók száma
  supabase
    .from('bingo_sessions')
    .select('id', { count: 'exact', head: true })
    .gte('completed_at', today + 'T00:00:00')
    .then(({ count }) => setStats(s => ({ ...s, bingos: count ?? 0 })))

  // Aktív játékosok (összes profil)
  supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .then(({ count }) => setStats(s => ({ ...s, players: count ?? 0 })))

  // Legtöbbet megjelölt szó ma
  supabase
    .from('bingo_sessions')
    .select('words_matched')
    .gte('completed_at', today + 'T00:00:00')
    .limit(20)
    .then(({ data }) => {
      if (!data?.length) return
      const freq = {}
      data.forEach(row => (row.words_matched || []).forEach(w => { freq[w] = (freq[w] || 0) + 1 }))
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
      if (top) setStats(s => ({ ...s, topWord: top[0] }))
    })
}, [])
```

### 2b. A "Napi Statisztika" kártya JSX

```jsx
<div className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between h-36">
  <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
  <div>
    <h3 className="font-headline font-bold text-base leading-tight">Napi Statisztika</h3>
    <div className="flex gap-3 mt-1">
      <span className="text-xs text-on-surface-variant">
        <span className="font-bold text-on-surface">{stats.bingos}</span> bingó ma
      </span>
      <span className="text-xs text-on-surface-variant">
        <span className="font-bold text-on-surface">{stats.players}</span> játékos
      </span>
    </div>
    {stats.topWord !== '—' && (
      <p className="text-xs text-primary font-bold mt-0.5 truncate">🔥 {stats.topWord}</p>
    )}
  </div>
</div>
```

---

## 3. onNavigate prop ellenőrzése

A `BingoScreen` komponens már kapja az `onNavigate` propot. Ellenőrizd hogy
az `App.jsx`-ben (vagy ahol a navigáció kezelve van) a `'community'` route
be van-e kötve. Ha nincs, add hozzá:

```js
// App.jsx-ben a navigáció kezelőben:
case 'community': setActiveTab('community'); break;
// vagy ami a meglévő pattern
```

---

## Lépések

1. `src/screens/BingoScreen.jsx` – stats state + useEffect hozzáadása
2. "Közösségi Játék" kártya – onClick bekötése
3. "Napi Statisztika" kártya – valódi adatok megjelenítése
4. `npm run build` – 0 hiba
5. `git add src/screens/BingoScreen.jsx`
6. `git commit -m "feat: főoldal kártyák bekötve – közösségi navigáció + napi statisztika"`
7. `git push origin main`

## Siker kritériumok
- [ ] "Közösségi Játék" kártyára kattintva a Community screen nyílik meg
- [ ] "Napi Statisztika" kártyán valódi számok jelennek meg (vagy 0 ha nincs adat)
- [ ] Ha van mai bingó adat, a leggyakoribb szó megjelenik
- [ ] `npm run build` 0 hiba

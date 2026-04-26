# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Két feladat: 1) Teszt userek törlése Supabase-ből  2) Névválasztó a SettingsScreen-ben

---

## 1. Teszt userek törlése – Supabase MCP-vel

Futtasd le ezeket a Supabase MCP-n keresztül:

```sql
-- Minden profil törlése (CASCADE törli a bingo_sessions-t is)
DELETE FROM public.profiles;

-- Minden bingo_session törlése
DELETE FROM public.bingo_sessions;

-- Auth userek törlése (Supabase Admin API kell hozzá)
-- Ha az MCP támogatja:
-- DELETE FROM auth.users;
-- Ha nem: a Supabase Dashboard → Authentication → Users → Select All → Delete
```

⚠️ Ha az MCP nem tud auth.users-t törölni, a Dashboard-on kézzel kell:
Supabase Dashboard → Authentication → Users → pipáld be mindet → Delete

---

## 2. Névválasztó – SettingsScreen.jsx

### Cél
- Ha a user be van jelentkezve, megjelenjen egy "Megjelenítési név" szerkesztő
- Kínáljon fel 6 véletlenszerű, vicces magyar politikai témájú generált nevet
- A user választhat egyet, vagy beírhatja a sajátját
- Mentés Supabase profiles táblába (display_name mező)

### 2a. Generált nevek listája (a fájl tetejére)

```js
const GENERATED_NAMES = [
  'Névtelen Szavazó', 'Titkos Bingós', 'Brüsszel Bajnok',
  'Rezsi Harcos', 'Szuverén Játékos', 'Béke Vadász',
  'Kétharmad Király', 'Hatvanpusztai', 'Konzultációs Hős',
  'Ukrán Kém 🕵️', 'Da-da-da Mester', 'Pálinkás Hős',
  'Gundalf a Nagy', 'PADME Lovag', 'Lázárinfós',
  'Feketeruhás', 'Pancser Százados', 'Százados Fan',
]

function getRandomNames(n = 6) {
  const shuffled = [...GENERATED_NAMES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}
```

### 2b. State a komponensben

```js
const [editingName, setEditingName] = useState(false)
const [nameInput, setNameInput] = useState('')
const [suggestedNames, setSuggestedNames] = useState([])
const [savingName, setSavingName] = useState(false)
```

### 2c. Profil kártya alá – névszerkesztő szekció

A profil kártya (`{user && (...)}`) belsejében, a stat mezők UTÁN add hozzá:

```jsx
{/* Névválasztó */}
{!editingName ? (
  <button
    onClick={() => {
      setNameInput(displayName)
      setSuggestedNames(getRandomNames(6))
      setEditingName(true)
    }}
    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-surface-container rounded-2xl text-sm font-headline font-bold text-on-surface-variant active:scale-95 transition-transform border border-outline-variant/20"
  >
    <span className="material-symbols-outlined text-base">edit</span>
    Megjelenítési név módosítása
  </button>
) : (
  <div className="w-full mt-3 space-y-3">
    {/* Szövegmező */}
    <input
      type="text"
      value={nameInput}
      onChange={e => setNameInput(e.target.value)}
      maxLength={30}
      placeholder="Írd be a neved..."
      className="w-full px-4 py-3 bg-surface-container rounded-2xl text-sm font-body text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
    />

    {/* Generált nevek */}
    <div className="flex flex-wrap gap-2">
      {suggestedNames.map(name => (
        <button
          key={name}
          onClick={() => setNameInput(name)}
          className={`text-xs px-3 py-1.5 rounded-full font-body border transition-all ${
            nameInput === name
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container text-on-surface-variant border-outline-variant/30 active:scale-95'
          }`}
        >
          {name}
        </button>
      ))}
    </div>

    {/* Gombok */}
    <div className="flex gap-2">
      <button
        onClick={async () => {
          if (!nameInput.trim()) return
          setSavingName(true)
          const { error } = await supabase
            .from('profiles')
            .update({ display_name: nameInput.trim() })
            .eq('id', user.id)
          if (!error) {
            setProfile(p => ({ ...p, display_name: nameInput.trim() }))
            showToast('✓ Név mentve!')
            setEditingName(false)
          } else {
            showToast('Hiba a mentésnél, próbáld újra')
          }
          setSavingName(false)
        }}
        disabled={savingName || !nameInput.trim()}
        className="flex-1 py-2.5 bg-primary text-on-primary rounded-2xl text-sm font-headline font-bold active:scale-95 transition-transform disabled:opacity-50"
      >
        {savingName ? 'Mentés…' : 'Mentés'}
      </button>
      <button
        onClick={() => setEditingName(false)}
        className="px-4 py-2.5 bg-surface-container text-on-surface-variant rounded-2xl text-sm font-headline font-bold active:scale-95 transition-transform"
      >
        Mégse
      </button>
    </div>
  </div>
)}
```

### 2d. displayName frissítése

A `displayName` sor már jól működik:
```js
const displayName = profile?.display_name || user?.user_metadata?.full_name || 'Névtelen Választó'
```
Ez automatikusan az új nevet mutatja mentés után.

---

## Lépések

1. Supabase: teszt userek törlése (profiles + bingo_sessions + auth.users)
2. `src/screens/SettingsScreen.jsx`:
   - GENERATED_NAMES + getRandomNames() a fájl tetejére
   - editingName, nameInput, suggestedNames, savingName state-ek
   - Névszerkesztő UI a profil kártya alá
3. `npm run build` – 0 hiba
4. `git add src/screens/SettingsScreen.jsx`
5. `git commit -m "feat: névválasztó generált nevekkel, teszt adatok törölve"`
6. `git push origin main`

## Siker kritériumok
- [ ] Supabase-ben nincsenek teszt userek (profiles + auth.users üres)
- [ ] Bejelentkezett usernek megjelenik "Megjelenítési név módosítása" gomb
- [ ] 6 véletlenszerű, politikai témájú nevet ajánl fel
- [ ] A user beírhat saját nevet (max 30 karakter)
- [ ] Mentés után azonnal frissül a profilkártya neve
- [ ] Toast visszajelzés mentés után
- [ ] `npm run build` 0 hiba

# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# Ellenőrizd: git remote -v → kozeletimozaik | git pull origin main

# Halott UI elemek javítása – CommunityScreen + SettingsScreen

A következő UI elemek láthatók az appban, de NEM csinálnak semmit (vagy hibásan működnek).
Minden elemet vagy működővé kell tenni, vagy el kell távolítani és valami hasznosra cserélni.

---

## 1. CommunityScreen – Napi kihívás "Csatlakozom" gomb

**Probléma:** A gomb látszólag navigál, de a `useDailyChallenge` hook nem tölti be az adatot Supabase-ből, ezért a challenge state `null` marad, és a UI hardcoded fallback szöveget mutat.

**Javítás `src/hooks/useDailyChallenge.js`-ben:**

Ellenőrizd hogy a mai dátum ISO formátuma egyezik-e a Supabase `date` mezőjével. Ha nem találja meg a mai kihívást, a hook `null`-t ad vissza és sosem mutatja a valódi adatot.

```js
// Helyes lekérdezés – timezone-biztos dátum
const today = new Date().toLocaleDateString('sv-SE') // "2026-04-04" formátum

const { data, error } = await supabase
  .from('daily_challenges')
  .select('*')
  .eq('date', today)
  .eq('active', true)
  .maybeSingle() // .single() helyett – nem dob hibát ha nincs találat
```

Ha a Supabase-ben nincs mai rekord, szúrd be:
```sql
INSERT INTO public.daily_challenges (date, title, description, target_words, min_matches, bonus_points, active)
VALUES (
  current_date,
  'A Parlament Hangjai',
  'Tölts ki 3 mezőt a mai közvetítés alatt!',
  ARRAY['Brüsszel', 'Szuverenitás', 'Migráció', 'Béke', 'Gyurcsány'],
  3,
  50,
  true
) ON CONFLICT (date) DO NOTHING;
```

**A "Csatlakozom" gomb** a `CommunityScreen.jsx`-ben már helyesen `onNavigate('bingo')`-t hív – ez rendben van. Ellenőrizd hogy az `onNavigate` prop megérkezik-e.

---

## 2. CommunityScreen – "Közösségi Játék" és "Napi Statisztika" placeholder kártyák

**Probléma:** Ha ezek a kártyák megjelennek az appban, de nem szerepelnek a jelenlegi `CommunityScreen.jsx`-ben, akkor vagy egy régebbi build fut, vagy más komponensből kerülnek be.

**Teendő:**
1. Futtasd: `npm run build && npm run preview` – ellenőrizd lokálisan hogy mi jelenik meg
2. Ha megtalálod a kártyákat a kódban: vagy implementáld valódi funkcióval, vagy töröld őket

**Ha implementálni kell a "Közösségi Játék" kártyát:**
```jsx
// CommunityScreen.jsx – Challenges szekció ELÉ szúrd be
<div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
  <div className="bg-primary-fixed p-3.5 rounded-xl flex-shrink-0">
    <span className="material-symbols-outlined text-primary text-2xl">group_work</span>
  </div>
  <div className="flex-1">
    <h4 className="font-headline font-bold text-on-surface text-sm">Közösségi Játék</h4>
    <p className="font-body text-xs text-on-surface-variant mt-0.5">Játsszon barátaival élőben</p>
  </div>
  <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-headline font-bold px-2 py-1 rounded-full">Hamarosan</span>
</div>
```

**Ha implementálni kell a "Napi Statisztika" kártyát:**
```jsx
// A leaderboard szekció és aktivitás feed KÖZÖTT
<section className="space-y-3">
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
    <h3 className="text-lg font-headline font-bold text-on-surface">Napi Statisztika</h3>
  </div>
  <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 grid grid-cols-3 gap-4">
    {[
      { label: 'Mai bingók', value: '—', icon: 'grid_view' },
      { label: 'Friss szavak', value: '—', icon: 'tag' },
      { label: 'Aktív játékos', value: '—', icon: 'person' },
    ].map(s => (
      <div key={s.label} className="text-center">
        <span className="material-symbols-outlined text-on-surface-variant text-lg">{s.icon}</span>
        <p className="font-headline font-bold text-on-surface text-lg">{s.value}</p>
        <p className="text-[10px] font-body text-on-surface-variant">{s.label}</p>
      </div>
    ))}
  </div>
</section>
```

Töltsd fel valódi adattal Supabase-ből:
```js
const [stats, setStats] = useState({ bingos: 0, words: 0, players: 0 })

useEffect(() => {
  const today = new Date().toLocaleDateString('sv-SE')
  supabase
    .from('bingo_sessions')
    .select('id', { count: 'exact' })
    .gte('completed_at', today + 'T00:00:00')
    .then(({ count }) => setStats(s => ({ ...s, bingos: count ?? 0 })))

  supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .then(({ count }) => setStats(s => ({ ...s, players: count ?? 0 })))
}, [])
```

---

## 3. SettingsScreen – "Fiók Biztonság" placeholder elemek

**Probléma:** Ha a SettingsScreen mutat "Jelszó megváltoztatása" és "Kétlépcsős azonosítás (2FA)" sorokat, de ezek `chevron_right`-tal és "Legutóbb 3 hónapja módosítva" felirattal jelennek meg – ezek placeholder UI elemek amelyek nem csinálnak semmit.

**Teendő:** Keresd meg ezeket a `SettingRow` elemeket, és kezeld le valahogy:

**Opció A – Töröld őket** (legegyszerűbb, ha nincs ilyen feature):
Távolítsd el a teljes "Fiók Biztonság" szekciót a SettingsScreen-ből.

**Opció B – Toast üzenet** (gyors fix):
```jsx
// Minden chevron_right-os sorra:
<SettingRow
  icon="lock"
  iconBg="bg-surface-container-high text-on-surface-variant"
  title="Jelszó megváltoztatása"
  subtitle="Legutóbb 3 hónapja módosítva"
  right={
    <button
      onClick={() => showToast('Ez a funkció hamarosan elérhető!')}
      className="text-on-surface-variant active:opacity-60"
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  }
/>
```

Ehhez add hozzá a `showToast` state-et a SettingsScreen-be:
```js
const [toast, setToast] = useState(null)
const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
```

És a JSX végére (de `</main>` után, `</div>` előtt):
```jsx
{toast && (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface text-sm font-headline font-bold px-5 py-3 rounded-2xl shadow-lg whitespace-nowrap">
    {toast}
  </div>
)}
```

---

## 4. CommunityScreen – Aktivitás feed üres marad

**Probléma:** Ha a `bingo_sessions` tábla RLS miatt nem enged join-t `profiles`-szal, a feed üres marad.

**Javítás – fallback-safe lekérdezés:**
```js
const loadActivity = async () => {
  // Próbáljuk join-nal
  const { data, error } = await supabase
    .from('bingo_sessions')
    .select('id, completed_at, points_earned, profiles(display_name)')
    .order('completed_at', { ascending: false })
    .limit(5)

  if (data?.length) {
    setActivity(data)
  } else {
    // Fallback: profiles nélkül
    const { data: plain } = await supabase
      .from('bingo_sessions')
      .select('id, completed_at, points_earned')
      .order('completed_at', { ascending: false })
      .limit(5)
    setActivity((plain ?? []).map(d => ({ ...d, profiles: { display_name: 'Játékos' } })))
  }
}
```

---

## Sorrend

1. `src/hooks/useDailyChallenge.js` – dátum fix + `.maybeSingle()`
2. SQL futtatás a Supabase dashboardon (mai kihívás rekord)
3. `src/screens/CommunityScreen.jsx` – aktivitás feed fallback fix
4. `src/screens/CommunityScreen.jsx` – placeholder kártyák kezelése (törlés vagy "Hamarosan" badge)
5. `src/screens/SettingsScreen.jsx` – "Fiók Biztonság" elemek toast-ra cserélve
6. `npm run build` – 0 hiba
7. `git add -A && git commit -m "fix: halott UI elemek, napi kihívás dátum, aktivitás feed fallback" && git push origin main`

## Siker kritériumok
- [ ] "A Parlament Hangjai" kihívás valódi Supabase adatot mutat
- [ ] "Csatlakozom" gomb működik (bingo screen-re navigál)
- [ ] Aktivitás feed mutat adatot (vagy "Még nincs aktivitás" üzenetet)
- [ ] Placeholder kártyák nem mutatnak üres/kattintható-de-holt UI-t
- [ ] SettingsScreen-ben minden kattintható elem reagál valamire
- [ ] `npm run build` 0 hibával fut

# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Egységes jogi footer – minden képernyőn

## Cél
Minden app képernyő (Bingó, Közösségi, Hírek, Beállítások) alján
egységesen jelenjen meg:

  © 2026 Gai Agent TechServices · gaiagent.cc
  Adatvédelem · ÁSZF · Adattörlés

## Megoldás – új LegalFooter komponens + App.jsx

### 1. Hozd létre: src/components/LegalFooter.jsx

```jsx
export default function LegalFooter() {
  return (
    <div className="w-full text-center py-3 space-y-1.5 pb-36">
      <a
        href="https://gaiagent.cc/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body"
      >
        © 2026 Gai Agent TechServices · gaiagent.cc
      </a>
      <div className="flex items-center justify-center gap-2">
        <a href="/privacy" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
          Adatvédelem
        </a>
        <span className="text-on-surface-variant opacity-20 text-[10px]">·</span>
        <a href="/terms" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
          ÁSZF
        </a>
        <span className="text-on-surface-variant opacity-20 text-[10px]">·</span>
        <a href="/delete" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-on-surface-variant opacity-30 hover:opacity-60 transition-opacity font-body">
          Adattörlés
        </a>
      </div>
    </div>
  )
}
```

### 2. Minden screen-ben add hozzá a LegalFooter-t

Minden screen `<main>` tag legvégén, a `</main>` előtt:

```jsx
import LegalFooter from '../components/LegalFooter.jsx'

// A <main> tartalom legvégén:
<LegalFooter />
```

Érintett fájlok:
- `src/screens/BingoScreen.jsx` (welcome AND game fázis `<main>`-jébe is)
- `src/screens/CommunityScreen.jsx`
- `src/screens/NewsScreen.jsx`
- `src/screens/SettingsScreen.jsx` – itt TÖRÖLD a meglévő copyright blokkot és használd a LegalFooter-t helyette

### 3. SettingsScreen.jsx – régi copyright blokk törlése

Keresd meg és töröld a SettingsScreen-ből az összes meglévő copyright/jogi
szöveget (a `space-y-1`, `Választási Bingó 2026 v2.0.0`, `gaiagent.cc` részeket),
mert a LegalFooter felváltja őket.

A verziószámot tartsd meg, de egyszerűsítve a LegalFooter-ben:

```jsx
// LegalFooter.jsx-ben a © sor fölé add:
<p className="text-[10px] text-on-surface-variant opacity-20 font-headline uppercase tracking-widest">
  Választási Bingó 2026 v2.0.0
</p>
```

---

## Lépések

1. `src/components/LegalFooter.jsx` létrehozása (verziószám + copyright + 3 link)
2. `src/screens/BingoScreen.jsx` – LegalFooter import + elhelyezés (welcome + game fázis)
3. `src/screens/CommunityScreen.jsx` – LegalFooter import + elhelyezés
4. `src/screens/NewsScreen.jsx` – LegalFooter import + elhelyezés
5. `src/screens/SettingsScreen.jsx` – régi copyright törlése + LegalFooter
6. `npm run build` – 0 hiba
7. `git add src/components/LegalFooter.jsx src/screens/BingoScreen.jsx src/screens/CommunityScreen.jsx src/screens/NewsScreen.jsx src/screens/SettingsScreen.jsx`
8. `git commit -m "feat: egységes jogi footer minden képernyőn (copyright + adatvédelem + ászf + adattörlés)"`
9. `git push origin main`

## Siker kritériumok
- [ ] Bingó főoldalon látszik a footer (scrollozva alul)
- [ ] Bingó játék közben látszik a footer
- [ ] Közösségi képernyőn látszik
- [ ] Hírek képernyőn látszik
- [ ] Beállítások képernyőn látszik (régi copyright helyett)
- [ ] Minden linke kattintható, új fülön nyílik
- [ ] `npm run build` 0 hiba

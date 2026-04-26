# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# TopBar bal gomb – logikus navigáció és helyes ikonok

## Probléma
A TopBar bal gombja mindenhol `menu` (hamburger) ikont mutat és `goToBingo`-t hív.
- BingoScreen welcome fázisban: nem csinál semmit (már ott vagy)
- Más screen-eken: visszamegy a főoldalra, de hamburger ikon helyett `home` ikon kellene

## Megoldás – src/App.jsx

Minden screen más bal ikont és más viselkedést kap:

```jsx
// App.jsx – renderScreen() függvényt cseréld le:

const renderScreen = () => {
  switch (activeTab) {
    case 'bingo':
      return (
        <BingoScreen
          user={user}
          onNavigate={setActiveTab}
          onMenuClick={null}          // főoldalon nincs bal gomb
          onProfileClick={goToSettings}
        />
      )
    case 'community':
      return (
        <CommunityScreen
          user={user}
          onNavigate={setActiveTab}
          onMenuClick={goToBingo}     // home gomb → vissza a főoldalra
          onProfileClick={goToSettings}
          leftIcon="home"
        />
      )
    case 'news':
      return (
        <NewsScreen
          onNavigate={setActiveTab}
          onMenuClick={goToBingo}
          onProfileClick={goToSettings}
          leftIcon="home"
        />
      )
    case 'settings':
      return (
        <SettingsScreen
          user={user}
          loading={loading}
          onNavigate={setActiveTab}
          onMenuClick={goToBingo}
          onProfileClick={openSettingsMenu}
          leftIcon="home"
        />
      )
    default:
      return (
        <BingoScreen
          user={user}
          onNavigate={setActiveTab}
          onMenuClick={null}
          onProfileClick={goToSettings}
        />
      )
  }
}
```

## Megoldás – src/components/TopBar.jsx

Add hozzá a `leftIcon` propot, és ha `onLeftClick` null, rejtsd el a bal gombot:

```jsx
export default function TopBar({ title, leftIcon = 'menu', rightIcon = 'account_circle', onLeftClick, onRightClick }) {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-2xl mx-auto">
        {/* Bal gomb – csak ha van onClick */}
        {onLeftClick ? (
          <button
            onClick={onLeftClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-stone-600">{leftIcon}</span>
          </button>
        ) : (
          <div className="w-10 h-10" /> // placeholder a layout megtartásához
        )}

        <h1 className="font-headline font-black text-primary uppercase tracking-widest text-lg select-none">
          {title}
        </h1>

        <button
          onClick={onRightClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">{rightIcon}</span>
        </button>
      </div>
      <div className="h-px bg-surface-container-high w-full" />
    </header>
  )
}
```

## Eredmény

| Screen | Bal gomb | Ikon |
|---|---|---|
| BingoScreen | rejtve (nem látszik) | – |
| CommunityScreen | → BingoScreen | `home` |
| NewsScreen | → BingoScreen | `home` |
| SettingsScreen | → BingoScreen | `home` |

## Lépések

1. `src/components/TopBar.jsx` – leftIcon prop + null kezelés
2. `src/App.jsx` – renderScreen() frissítése
3. `npm run build` – 0 hiba
4. `git add src/components/TopBar.jsx src/App.jsx`
5. `git commit -m "fix: topbar bal gomb logikus navigáció, home ikon, főoldalon rejtve"`
6. `git push origin main`

## Siker kritériumok
- [ ] BingoScreen főoldalon nincs bal gomb (vagy láthatatlan)
- [ ] Community/News/Settings screen-eken home ikon látszik
- [ ] Home ikonra kattintva visszamegy a BingoScreen-re
- [ ] Layout nem törik el (cím középen marad)
- [ ] `npm run build` 0 hiba

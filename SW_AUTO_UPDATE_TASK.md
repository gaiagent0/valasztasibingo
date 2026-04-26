# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# SW automatikus frissítés – main.jsx már javítva helyben

## Probléma
A régi Service Worker (v1) még aktív a felhasználók böngészőjében.
A main.jsx frissítve: új SW telepítésekor automatikusan újratölti az oldalt.

## Csak push kell:

```bash
npm run build
git add src/main.jsx
git commit -m "fix: SW automatikus frissítés – új verzió azonnal átvesz, oldal újratöltés"
git push origin main
```

## Siker kritériumok
- [ ] Deploy után az oldal első látogatáskor automatikusan újratölti magát ha régi SW volt
- [ ] Umami ERR_FAILED eltűnik
- [ ] `npm run build` 0 hiba

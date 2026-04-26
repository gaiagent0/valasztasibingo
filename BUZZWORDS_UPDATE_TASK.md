# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Bingó szótár frissítve – push

A src/lib/data.js már frissítve van helyben.
Csak build + push kell.

```bash
npm run build
git add src/lib/data.js
git commit -m "feat: bingó szótár frissítve – 2025-2026 kampány, botrányok, mémek (Pálinkás, Henry, Gundalf, PADME, da-da-da)"
git push origin main
```

## Siker kritériumok
- [ ] `npm run build` 0 hiba
- [ ] Push sikeres
- [ ] Az appban a bingótáblán megjelennek az új szavak (pl. "Pálinkás százados", "Henry ügynök", "Da-da-da")

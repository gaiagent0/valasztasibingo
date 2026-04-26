# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Facebook gomb → "Hamarosan" placeholder

## Probléma
A Facebook OAuth egyelőre nem elérhető publikusan (App Review szükséges).
A gombot alakítsd át disabled "Hamarosan" placeholderré.

## Javítás – src/screens/SettingsScreen.jsx

Keresd meg a Facebook bejelentkezés gombot és cseréld le:

```jsx
{/* Facebook gomb – Hamarosan */}
<button
  disabled
  className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1877F2]/40 text-white/60 rounded-2xl font-headline font-bold text-sm cursor-not-allowed"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  Facebook – Hamarosan
</button>
```

## Lépések
1. Módosítsd a SettingsScreen.jsx-et
2. `npm run build` – 0 hiba
3. `git add src/screens/SettingsScreen.jsx`
4. `git commit -m "fix: facebook gomb hamarosan placeholder"`
5. `git push origin main`

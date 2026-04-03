# ⚠️ FIGYELEM – REPO AZONOSÍTÁS

> **Ez a `valasztasibingo` repo (`gaiagent0/valasztasibingo`)**
> **GitHub URL:** https://github.com/gaiagent0/valasztasibingo
> **NE commitolj ide `kozeletimozaik` kódot!**
> **A két projekt KÜLÖNBÖZŐ mappában és KÜLÖNBÖZŐ repóban él:**
> - `valasztasibingo` → `C:\Users\istva\Dev\portfolio\Projects\valasztasibingo`
> - `kozeletimozaik` → `C:\Users\istva\Dev\portfolio\Projects\kozeletimozaik`
>
> **Ellenőrizd minden commit előtt:** `git remote -v` → `valasztasibingo`-t kell mutatnia!

---

# Választási Bingó – valasztasibingo

## Projekt kontextus

**Alkalmazás neve:** Választási Bingó 2026
**GitHub repo:** https://github.com/gaiagent0/valasztasibingo
**Vercel projekt:** valasztasibingo
**Live URL:** https://valasztasibingo.vercel.app
**Domain:** https://valasztasibingo.hu

## Tech stack

- React 18 + Vite 5
- Inline styles (nincs Tailwind!)
- Lucide React ikonok
- Magyar piros-fehér-zöld arculat (#CE2939, #477050)

## Struktúra

Ez egy **egyszerű, önálló bingó app** – egyetlen `App.jsx` fájl, nincs backend, nincs Supabase.

```
src/
  App.jsx      ← az egyetlen screen, minden logika itt van
  main.jsx
  index.css
```

## Mit NE csinálj ebben a repóban

- ❌ Ne add hozzá a Supabase klienst
- ❌ Ne hozz létre `src/screens/` mappát
- ❌ Ne importálj Tailwind-et
- ❌ Ne hozz létre `api/` mappát
- ❌ Ne változtasd meg az arculatot

## Amit szabad csinálni

- ✅ Bővíteni a BUZZWORDS listát
- ✅ Javítani a bingó logikát
- ✅ Javítani a megosztás szövegét
- ✅ Kisebb UI javítások az `App.jsx`-ben

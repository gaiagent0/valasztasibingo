# 🇭🇺 Választási Bingó 2026

> Interaktív bingó a 2026-os magyar országgyűlési választási kampányhoz.

**Live:** [valasztasibingo.vercel.app](https://valasztasibingo.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Deploy](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)

---

## Hogyan működik?

1. **Generálj táblát** – minden játékos egyedi, random 5×5-ös táblát kap a 34 varázsszóból
2. **Játssz** – vitát vagy kampánybeszédet hallgatsz? Kattints a mezőre, ha elhangzik a szó
3. **Bingó!** – ha megvan 5 egy sorban (vízszintesen, függőlegesen vagy átlósan), konfetti jár 🎉
4. **Oszd meg** – egy gombnyomással másolható a szöveg Twitter/X, Reddit, Facebook poszthoz

## Funkciók

- ✅ 5×5-ös bingótábla, fix középső "Ingyen mező"
- ✅ 34 politikai varázsszóból random generált, egyedi tábla
- ✅ Győzelem detektálás (sor, oszlop, átló) + konfetti animáció
- ✅ Piros-fehér-zöld magyar zászló arculat
- ✅ Megosztás gomb – vágólapra másol, kész poszt szöveg hashtagekkel
- ✅ Mobilra optimalizált, reszponzív

## Tech stack

| Réteg | Technológia |
|-------|-------------|
| UI | React 18 |
| Build | Vite 5 |
| Ikonok | Lucide React |
| Deploy | Vercel |

## Helyi futtatás

```bash
npm install
npm run dev
```

## Testreszabás

A varázsszavak az `src/App.jsx` tetején lévő `BUZZWORDS` tömbben találhatók. Csak cseréld ki, és deploy!

---

Készült szórakoztatási céllal · `#valasztas2026`

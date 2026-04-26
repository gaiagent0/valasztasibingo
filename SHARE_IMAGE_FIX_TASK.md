# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Két feladat: 1) Share kép szöveg levágás fix  2) Umami API info

---

## 1. Share kép – szöveg levágás javítás

### Probléma
A html2canvas a DOM-ot veszi át, ahol a cellák:
- `overflow: hidden` → levágja a szöveget
- `-webkit-line-clamp: 4` → csak 4 sort mutat
- Kis fontméret (7-10px) → canvas-on alig látható

### Megoldás: Canvas-alapú grid rajzolás (NE html2canvas a gridre)

A `handleShare` függvényben a gridCanvas generálást cseréld le egy
**teljes Canvas API-alapú grid rajzolásra**, ami közvetlenül a board[]
tömbből dolgozik és nem a DOM-ból:

```js
const handleShare = async () => {
  if (typeof window !== 'undefined' && window.umami)
    window.umami.track('share_clicked', { isBingo })

  const count = selected.size - 1
  const url = 'https://valasztasibingo.hu'
  const words = Array.from(selected).filter(i => i !== CENTER).map(i => board[i]).slice(0, 3)

  const shareTexts = {
    bingo: [
      `🇭🇺 BINGÓ! Kiszúrtam ${count} politikai varázsszót!\n"${words.join('", "')}" – és még több.\n🗳️ Játssz te is! → ${url}\n#ValasztasiBingo #valasztas2026`,
      `🎯 BINGÓ! ${count} mezőm van – köztük: "${words[0]}"!\nHallgatod a kampánybeszédeket? Játssz velem!\n→ ${url}\n#bingo2026 #valasztas2026`,
      `🏆 Megcsináltam! ${count}/24 mező – BINGÓ!\nA magyar politika legjobb játéka.\n→ ${url} #ValasztasiBingo`,
    ],
    playing: [
      `🗳️ ${count}/24 mezőnél tartok a Választási Bingón!\nMár hallottam: "${words[0] || 'Brüsszel'}"...\n→ ${url}\n#valasztas2026 #bingo2026`,
      `🎮 Élőben játszom a Választási Bingót – ${count} szó eddig!\nPróbáld ki te is!\n→ ${url}`,
      `📻 Hallgatom a kampányt és bingózok 🎯\n${count}/24 – ki tudja mi hangzik el még!\n→ ${url} #ValasztasiBingo`,
    ]
  }
  const textPool = isBingo ? shareTexts.bingo : shareTexts.playing
  const shareText = textPool[Math.floor(Math.random() * textPool.length)]

  // === CANVAS ALAPÚ GRID RAJZOLÁS ===
  const COLS = 5
  const CELL = 110          // cella méret px
  const GAP = 6             // rés cellák között
  const PAD = 16            // grid belső padding
  const HEADER = 90         // fejléc magasság
  const FOOTER = 70         // lábléc magasság
  const OUTER_PAD = 20      // külső padding

  const gridW = COLS * CELL + (COLS - 1) * GAP + PAD * 2
  const gridH = COLS * CELL + (COLS - 1) * GAP + PAD * 2
  const totalW = gridW + OUTER_PAD * 2
  const totalH = HEADER + gridH + FOOTER + OUTER_PAD * 2

  const canvas = document.createElement('canvas')
  canvas.width = totalW
  canvas.height = totalH
  const ctx = canvas.getContext('2d')

  // 1. Háttér
  ctx.fillStyle = '#f5f0eb'
  ctx.fillRect(0, 0, totalW, totalH)

  // 2. Magyar trikolór csík tetején
  const S = 7
  ctx.fillStyle = '#CE2939'; ctx.fillRect(0, 0, totalW, S)
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, S, totalW, S)
  ctx.fillStyle = '#477050'; ctx.fillRect(0, S * 2, totalW, S)

  // 3. Fejléc szöveg
  ctx.fillStyle = '#aa0424'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('VÁLASZTÁSI BINGÓ 2026', totalW / 2, S * 3 + 30)
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#888'
  ctx.fillText('🗳️ valasztasibingo.hu', totalW / 2, S * 3 + 52)

  // 4. Grid háttér (rounded rect)
  const gx = OUTER_PAD
  const gy = HEADER
  ctx.fillStyle = '#e8e4e0'
  ctx.beginPath()
  ctx.roundRect(gx, gy, gridW, gridH, 16)
  ctx.fill()

  // 5. Cellák rajzolása
  board.forEach((word, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const cx = gx + PAD + col * (CELL + GAP)
    const cy = gy + PAD + row * (CELL + GAP)
    const isCenter = i === CENTER
    const isWin = winCells.has(i)
    const isSel = selected.has(i)

    // Cella háttér
    if (isCenter) {
      ctx.fillStyle = 'rgba(170,4,36,0.10)'
    } else if (isWin) {
      ctx.fillStyle = '#aa0424'
    } else if (isSel) {
      ctx.fillStyle = '#c0eec6'
    } else {
      ctx.fillStyle = '#ffffff'
    }
    ctx.beginPath()
    ctx.roundRect(cx, cy, CELL, CELL, 10)
    ctx.fill()

    // Cella szöveg
    if (isCenter) {
      ctx.fillStyle = '#aa0424'
      ctx.font = 'bold 13px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('FREE', cx + CELL / 2, cy + CELL / 2 + 5)
    } else {
      ctx.fillStyle = isWin ? '#ffffff' : isSel ? '#2d5a35' : '#1b1c1a'
      ctx.textAlign = 'center'
      // Szöveg tördelés – max 3 sor, 13px
      const maxW = CELL - 12
      const fontSize = 11
      ctx.font = `${isWin ? 'bold ' : ''}${fontSize}px sans-serif`
      const lines = wrapText(ctx, word, maxW)
      const lineH = fontSize + 3
      const startY = cy + CELL / 2 - ((lines.length - 1) * lineH) / 2
      lines.forEach((line, li) => {
        ctx.fillText(line, cx + CELL / 2, startY + li * lineH)
      })
    }
  })

  // 6. Lábléc
  const footerY = HEADER + gridH + OUTER_PAD + 16
  ctx.fillStyle = isBingo ? '#aa0424' : '#555'
  ctx.font = `bold ${isBingo ? 20 : 16}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(
    isBingo ? `🏆 BINGÓ! ${count}/24 mező` : `${count}/24 mező megjelölve`,
    totalW / 2, footerY
  )
  ctx.fillStyle = '#999'
  ctx.font = '13px sans-serif'
  ctx.fillText('#ValasztasiBingo #valasztas2026', totalW / 2, footerY + 22)

  // 7. Export
  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'valasztasi-bingo-2026.png', { type: 'image/png' })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'Választási Bingó 2026', text: shareText, files: [file] })
      return
    }
    // Asztali fallback
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'valasztasi-bingo-2026.png'
    a.click()
    URL.revokeObjectURL(a.href)
    await navigator.clipboard?.writeText(shareText).catch(() => {})
    setCopied(true)
    setShareMsg('📥 Kép letöltve + szöveg másolva! Illeszd be közösségi médiába.')
    setTimeout(() => { setCopied(false); setShareMsg('') }, 5000)
  }, 'image/png')
}

// Szöveg tördelő segédfüggvény – a handleShare elé tedd:
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3) // max 3 sor
}
```

### Fontos: `html2canvas` import eltávolítható a handleShare-ből
Az új megoldás nem használja a html2canvas-t – törölheted a dynamic import-ot.
(Ha a fájlban máshol nem szerepel, az npm dependency is eltávolítható,
de ez opcionális.)

---

## 2. Umami – API key nem kell a látogatók látásához

Az Umami dashboard-on a látogatók megjelennek API key nélkül is –
csak be kell jelentkezni a https://cloud.umami.is oldalon.

**Ha nem látszanak látogatók:**
1. Ellenőrizd hogy a script tényleg betöltődik-e:
   - Nyisd meg a valasztasibingo.hu-t
   - F12 → Network fül → keress "script.js" vagy "umami" kifejezést
   - Ha 404 → a website ID rossz
2. Ellenőrizd az index.html-ben a `data-website-id` értékét:
   Jelenleg: `296444ae-9682-45ed-bbb1-7fc946246f63`
   Ez az Umami Cloud-on regisztrált website ID-nak kell lennie

**Nem szükséges teendő a kódban** – az Umami egy manuális ellenőrzés.

---

## Lépések

1. `src/screens/BingoScreen.jsx`:
   - `wrapText` helper függvény hozzáadása (handleShare elé)
   - `handleShare` teljes cseréje az új Canvas-alapú verzióra
   - html2canvas dynamic import törlése
2. `npm run build` – 0 hiba
3. `git add src/screens/BingoScreen.jsx`
4. `git commit -m "fix: share kép Canvas API-alapú rajzolás, szöveg nem vágódik le, wrapText helper"`
5. `git push origin main`

## Siker kritériumok
- [ ] A letöltött PNG-ben a bingó cellák szövege teljes – nem vágódik le
- [ ] Magyar trikolór csík tetején + fejléc + cellák + lábléc + hashtag látszik
- [ ] Win cellák (bingó) pirosak, selected cellák zöldek, üresek fehérek
- [ ] FREE cella középen
- [ ] Asztali Edge-en letöltődik a kép + vágólap szöveg
- [ ] `npm run build` 0 hiba

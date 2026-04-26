# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Megosztás upgrade – jobb kép + vonzó szöveg + Canvas-alapú share kártya

## Probléma
1. A Web Share API-val generált kép (html2canvas a bingó gridről) Paint-ben
   rosszul néz ki – csak a grid jelenik meg, nincs fejléc/szöveg/branding
2. Edge-en a megosztási szöveg nem elég vonzó/viral
3. Asztali böngészőn nincs natív share – csak vágólap másolás történik,
   de a felhasználó nem tudja mit csináljon utána

## Megoldás

### 1. Share kártya canvas – teljes branded kép (nem csak a grid!)

A `handleShare` függvényben NE a `bingo-grid` div-et rögzítsd,
hanem hozz létre egy **off-screen canvas-t** Javascriptben amely
tartalmazza:
- Fejléc: magyar zászló + "VÁLASZTÁSI BINGÓ 2026" felirat
- A bingó grid (html2canvas-szal, scale 3)
- Alul: eredmény szöveg + URL

```js
const handleShare = async () => {
  const count = selected.size - 1
  const url = 'https://valasztasibingo.hu'
  const words = Array.from(selected)
    .filter(i => i !== CENTER)
    .map(i => board[i])
    .slice(0, 3)

  // === Vonzó share szövegek ===
  const shareTexts = {
    bingo: [
      `🇭🇺 BINGÓ! Kiszúrtam ${count} politikai varázsszót a mai közvetítésen!\n"${words.join('", "')}" – és még több.\n🗳️ Te is játszol? → ${url}\n#ValasztasiBingo #valasztas2026`,
      `🎯 BINGÓ! ${count} mezőm van – köztük: "${words[0]}"!\nHallgatod te is a kampánybeszédeket? Játssz velem!\n→ ${url}\n#bingo2026 #valasztas2026`,
      `🏆 Megcsináltam! ${count}/24 mező – BINGÓ!\nA magyar politika legjobb italbulija… ital nélkül.\n→ ${url} #ValasztasiBingo`,
    ],
    playing: [
      `🗳️ ${count}/24 mezőnél tartok a Választási Bingón!\nMár hallottam: "${words[0] || 'Brüsszel'}"... Ki tudja hány lesz még?\n→ ${url}\n#valasztas2026 #bingo2026`,
      `🎮 Élőben játszom a Választási Bingót – ${count} szó eddig!\nTe is próbáld ki a választási kampány közvetítése alatt!\n→ ${url}`,
      `📻 Hallgatom Orbánt / Magyar Pétert és bingózok 🎯\n${count}/24 eddig, ki tudja mi hangzik el még!\n→ ${url} #ValasztasiBingo`,
    ]
  }

  const textPool = isBingo ? shareTexts.bingo : shareTexts.playing
  const shareText = textPool[Math.floor(Math.random() * textPool.length)]

  // === Branded kép generálása ===
  try {
    const { default: html2canvas } = await import('html2canvas')
    const grid = document.getElementById('bingo-grid')

    // 1. Grid screenshot
    const gridCanvas = await html2canvas(grid, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    })

    // 2. Branded wrapper canvas
    const W = gridCanvas.width
    const headerH = 80
    const footerH = 70
    const padding = 24
    const totalH = headerH + gridCanvas.height + footerH + padding * 2

    const branded = document.createElement('canvas')
    branded.width = W + padding * 2
    branded.height = totalH
    const ctx = branded.getContext('2d')

    // Háttér
    ctx.fillStyle = '#fbf9f6'
    ctx.fillRect(0, 0, branded.width, branded.height)

    // Magyar trikolór csík tetején
    const stripeH = 8
    ctx.fillStyle = '#CE2939'; ctx.fillRect(0, 0, branded.width, stripeH)
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, stripeH, branded.width, stripeH)
    ctx.fillStyle = '#477050'; ctx.fillRect(0, stripeH * 2, branded.width, stripeH)

    // Fejléc szöveg
    ctx.fillStyle = '#aa0424'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🗳️ VÁLASZTÁSI BINGÓ 2026', branded.width / 2, stripeH * 3 + 44)

    // Grid
    ctx.drawImage(gridCanvas, padding, headerH)

    // Eredmény sor
    const resultY = headerH + gridCanvas.height + 20
    ctx.fillStyle = isBingo ? '#aa0424' : '#555'
    ctx.font = `bold ${isBingo ? 26 : 20}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(
      isBingo ? `🏆 BINGÓ! ${count}/24 mező` : `${count}/24 mező megjelölve`,
      branded.width / 2,
      resultY
    )

    // URL
    ctx.fillStyle = '#888'
    ctx.font = '18px sans-serif'
    ctx.fillText('valasztasibingo.hu', branded.width / 2, resultY + 30)

    // Kép exportálása
    branded.toBlob(async (blob) => {
      const file = new File([blob], 'valasztasi-bingo-2026.png', { type: 'image/png' })

      // Natív share (mobil)
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Választási Bingó 2026',
          text: shareText,
          files: [file]
        })
        return
      }

      // Asztali fallback: kép letöltése + szöveg másolása
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'valasztasi-bingo-2026.png'
      a.click()
      URL.revokeObjectURL(a.href)

      // Szöveg vágólapra
      await navigator.clipboard?.writeText(shareText).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)

    }, 'image/png')

  } catch (err) {
    console.error('Share error:', err)
    // Pure fallback: csak szöveg vágólapra
    await navigator.clipboard?.writeText(shareText).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }
}
```

### 2. Megosztás gomb szövege és toast üzenet – asztali UX

Az asztali felhasználónak jelezni kell mi történt. A `copied` state
mellé adj egy `shareMsg` state-et:

```js
const [shareMsg, setShareMsg] = useState('')

// handleShare-ben a letöltés után:
setShareMsg('📥 Kép letöltve + szöveg másolva! Illeszd be közösségi médiába.')
setTimeout(() => setShareMsg(''), 5000)
```

A Megosztás gomb helyett amikor `copied` igaz:
```jsx
<button ...>
  <span className="material-symbols-outlined text-base">
    {copied ? 'download_done' : 'share'}
  </span>
  {copied ? 'Letöltve + Másolva!' : 'Megosztás'}
</button>
```

Toast üzenet ha `shareMsg` nem üres – a meglévő toast rendszer mellé:
```jsx
{shareMsg && (
  <div className="fixed bottom-32 left-4 right-4 z-50 bg-on-surface text-surface text-sm font-headline font-bold px-5 py-3 rounded-2xl shadow-lg text-center">
    {shareMsg}
  </div>
)}
```

### 3. Az ID marad: `id="bingo-grid"` – NE változtasd meg

---

## Lépések

1. `src/screens/BingoScreen.jsx` – `handleShare` teljes cseréje
2. `shareMsg` state hozzáadása
3. Megosztás gomb szöveg frissítése
4. Toast üzenet a letöltés jelzésére
5. `npm run build` – 0 hiba
6. `git add src/screens/BingoScreen.jsx`
7. `git commit -m "feat: branded share kép (fejléc+grid+URL), viral szövegek, asztali letöltés fallback"`
8. `git push origin main`

## Siker kritériumok
- [ ] Mobilon: natív share sheet nyílik branded képpel
- [ ] Asztali Edge-en: a kép automatikusan letöltődik jó minőségben (fejléc + grid + URL látható)
- [ ] Vágólapra kerül a viral szöveg
- [ ] Toast üzenet jelzi: "Kép letöltve + szöveg másolva"
- [ ] A kép Paint-ben is jól néz ki (fehér háttér, trikolór, cím, grid, URL)
- [ ] Bingó esetén más (ünneplő) szöveg jelenik meg mint sima játék közben
- [ ] `npm run build` 0 hiba

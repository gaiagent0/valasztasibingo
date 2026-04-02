import React, { useState, useEffect, useCallback } from 'react';
import { Share2, RotateCcw, Check } from 'lucide-react';

const BUZZWORDS = [
  "Brüsszel", "Családok", "Infláció", "Szuverenitás", "Béke",
  "Háború", "Dollárbaloldal", "Korrupció", "Megvédjük", "Gyurcsány",
  "Mészáros", "EU-s pénzek", "Soros", "Rezsi", "Nyugdíjasok",
  "Kétharmad", "Diktatúra", "Pedofilbotrány", "Gazdasági növekedés", "Adócsökkentés",
  "Elmúlt 14 év", "Migráció", "Példátlan", "Nemzeti érdek", "Propaganda",
  "Oktatás állapota", "Egészségügy", "Válság", "Külföldi ügynök", "Alaptörvény",
  "Vidéki Magyarország", "Elszámoltatás", "Felelősség", "Európai értékek"
];

const SIZE = 5;
const CENTER = Math.floor((SIZE * SIZE) / 2);

function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

function checkWin(sel) {
  const hits = [];
  for (let r = 0; r < SIZE; r++) {
    if ([...Array(SIZE)].every((_, c) => sel.has(r * SIZE + c))) {
      for (let c = 0; c < SIZE; c++) hits.push(r * SIZE + c);
    }
  }
  for (let c = 0; c < SIZE; c++) {
    if ([...Array(SIZE)].every((_, r) => sel.has(r * SIZE + c))) {
      for (let r = 0; r < SIZE; r++) hits.push(r * SIZE + c);
    }
  }
  const d1 = [...Array(SIZE)].every((_, i) => sel.has(i * SIZE + i));
  const d2 = [...Array(SIZE)].every((_, i) => sel.has(i * SIZE + (SIZE - 1 - i)));
  if (d1) for (let i = 0; i < SIZE; i++) hits.push(i * SIZE + i);
  if (d2) for (let i = 0; i < SIZE; i++) hits.push(i * SIZE + (SIZE - 1 - i));
  return new Set(hits);
}

function HungarianFlag({ size = 28 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 3 2"
      style={{ borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', display: 'inline-block', verticalAlign: 'middle' }}>
      <rect width="3" height="0.667" y="0" fill="#CE2939" />
      <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
      <rect width="3" height="0.667" y="1.333" fill="#477050" />
    </svg>
  );
}

function launchConfetti() {
  const colors = ['#CE2939', '#477050', '#FFFFFF', '#A01F2C', '#2F4D37', '#F5E6E8'];
  const existing = document.getElementById('confetti-layer');
  if (existing) existing.remove();
  const layer = document.createElement('div');
  layer.id = 'confetti-layer';
  layer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(layer);
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    const isRect = Math.random() > 0.5;
    p.style.cssText = `
      position:absolute;left:${Math.random() * 100}%;top:-12px;
      width:${isRect ? '10px' : '8px'};height:${isRect ? '6px' : '8px'};
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${isRect ? '2px' : '50%'};
      animation:fall ${1.4 + Math.random() * 2}s ${Math.random() * 0.9}s linear forwards;
      transform:rotate(${Math.random() * 360}deg);opacity:1;
    `;
    layer.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}`;
  layer.appendChild(style);
  setTimeout(() => layer.remove(), 4500);
}

export default function App() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(new Set([CENTER]));
  const [winCells, setWinCells] = useState(new Set());
  const [isBingo, setIsBingo] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateBoard = useCallback(() => {
    const words = shuffle(BUZZWORDS).slice(0, SIZE * SIZE);
    words[CENTER] = 'INGYEN\nMEZŐ';
    setBoard(words);
    setSelected(new Set([CENTER]));
    setWinCells(new Set());
    setIsBingo(false);
  }, []);

  useEffect(() => { generateBoard(); }, [generateBoard]);

  const toggleCell = (i) => {
    if (i === CENTER) return;
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    const wins = checkWin(next);
    const bingo = wins.size > 0;
    if (bingo && !isBingo) launchConfetti();
    setSelected(next);
    setWinCells(wins);
    setIsBingo(bingo);
  };

  const handleShare = () => {
    const count = selected.size - 1;
    const url = 'https://valasztasibingo.vercel.app';
    const text = isBingo
      ? `🇭🇺 BINGÓ! ${count} megjelölt mező, kijött a sor! Próbáld ki: ${url} #valasztas2026`
      : `🗳️ ${count}/24 mezőnél tartok a Választási Bingón. Próbáld ki: ${url} #valasztas2026`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => flash()).catch(() => fallback(text));
    } else { fallback(text); }
  };

  const fallback = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash(); } catch (e) {}
    document.body.removeChild(ta);
  };

  const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 2500); };
  const count = selected.size - 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
      {/* Top tricolor */}
      <div style={{ display: 'flex', height: 6 }}>
        <div style={{ flex: 1, background: '#CE2939' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }} />
        <div style={{ flex: 1, background: '#477050' }} />
      </div>

      {/* Header */}
      <header style={{ background: '#CE2939', color: 'white', padding: '1.25rem 1rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <HungarianFlag size={32} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>Választási Bingó 2026</h1>
          <HungarianFlag size={32} />
        </div>
        <p style={{ fontSize: 13, opacity: 0.9, maxWidth: 340, margin: '0 auto', lineHeight: 1.5 }}>
          Vitát vagy kampánybeszédet hallgatsz? Kattints, ha elhangzik a varázsszó!
        </p>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', padding: '1rem' }}>
        {/* Bingo banner */}
        <div style={{ overflow: 'hidden', maxHeight: isBingo ? 80 : 0, transition: 'max-height 0.4s ease', marginBottom: isBingo ? 12 : 0 }}>
          <div style={{ background: 'white', border: '2px solid #CE2939', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🏆</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#CE2939', letterSpacing: 1 }}>BINGÓ! Megvan a sor!</span>
            <span style={{ fontSize: 20 }}>🏆</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, background: '#E5E7EB', padding: 6, borderRadius: 16, border: '1px solid #D1D5DB' }}>
          {board.map((word, i) => {
            const isCenter = i === CENTER;
            const isWin = winCells.has(i);
            const isSel = selected.has(i);
            let bg = 'white', color = '#374151', border = '1px solid #E5E7EB';
            if (isCenter) { bg = '#477050'; color = 'white'; border = '1px solid #2F4D37'; }
            else if (isWin) { bg = '#CE2939'; color = 'white'; border = '1px solid #A01F2C'; }
            else if (isSel) { bg = '#477050'; color = 'white'; border = '1px solid #2F4D37'; }
            return (
              <button key={i} onClick={() => toggleCell(i)} style={{
                aspectRatio: '1', background: bg, color, border, borderRadius: 8,
                fontSize: 9, fontWeight: 600, padding: '4px 3px',
                cursor: isCenter ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', lineHeight: 1.3, transition: 'all 0.12s',
                transform: isSel && !isCenter ? 'scale(0.95)' : 'scale(1)',
                userSelect: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word', hyphens: 'auto',
              }}>
                {word}
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {count} / {SIZE * SIZE - 1} mező megjelölve
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={generateBoard} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 10px', background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <RotateCcw size={15} /> Új tábla
          </button>
          <button onClick={handleShare} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 10px', background: copied ? '#477050' : '#CE2939', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
            {copied ? <><Check size={15} /> Másolva!</> : <><Share2 size={15} /> Megosztás</>}
          </button>
        </div>

        {/* Word list */}
        <details style={{ marginTop: 14, background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 12px' }}>
          <summary style={{ fontSize: 12, color: '#6B7280', cursor: 'pointer' }}>Mind a 34 varázsszó</summary>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {BUZZWORDS.map(w => (
              <span key={w} style={{ fontSize: 10, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 20, padding: '2px 8px', color: '#6B7280' }}>{w}</span>
            ))}
          </div>
        </details>
      </main>

      {/* Bottom tricolor */}
      <div style={{ display: 'flex', height: 6 }}>
        <div style={{ flex: 1, background: '#CE2939' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }} />
        <div style={{ flex: 1, background: '#477050' }} />
      </div>

      <footer style={{ textAlign: 'center', padding: '10px', fontSize: 11, color: '#9CA3AF', background: '#F3F4F6' }}>
        Készült szórakoztatási céllal · valasztasibingo.hu · #valasztas2026
      </footer>
    </div>
  );
}

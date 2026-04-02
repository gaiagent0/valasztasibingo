import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Share2, RotateCcw, Check, Code2, HelpCircle, X, Users } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────
const BUZZWORDS = [
  "Brüsszel", "Családok", "Infláció", "Szuverenitás", "Béke",
  "Háború", "Dollárbaloldal", "Korrupció", "Megvédjük", "Gyurcsány",
  "Mészáros", "EU-s pénzek", "Soros", "Rezsi", "Nyugdíjasok",
  "Kétharmad", "Diktatúra", "Pedofilbotrány", "Gazdasági növekedés", "Adócsökkentés",
  "Elmúlt 14 év", "Migráció", "Példátlan", "Nemzeti érdek", "Propaganda",
  "Oktatás állapota", "Egészségügy", "Válság", "Külföldi ügynök", "Alaptörvény",
  "Vidéki Magyarország", "Elszámoltatás", "Felelősség", "Európai értékek",
  "Átláthatóság", "Civil szervezet", "Szankciók", "Miniszterelnök", "Ellenzék"
];

const CREATOR_URL = 'https://gaiagent.cc/';
const APP_URL = 'https://valasztasibingo.hu';
const APP_HASHTAG = 'valasztas2026';
const SIZE = 5;
const CENTER = Math.floor((SIZE * SIZE) / 2);
const COUNTER_KEY = 'vb2026_plays';
const COUNTER_BASE = 12847;
const SEEN_KEY = 'vb2026_seen_welcome';

// ─── Helpers ────────────────────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => 0.5 - Math.random()); }

function checkWin(sel) {
  const hits = [];
  for (let r = 0; r < SIZE; r++) {
    if ([...Array(SIZE)].every((_, c) => sel.has(r * SIZE + c)))
      for (let c = 0; c < SIZE; c++) hits.push(r * SIZE + c);
  }
  for (let c = 0; c < SIZE; c++) {
    if ([...Array(SIZE)].every((_, r) => sel.has(r * SIZE + c)))
      for (let r = 0; r < SIZE; r++) hits.push(r * SIZE + c);
  }
  const d1 = [...Array(SIZE)].every((_, i) => sel.has(i * SIZE + i));
  const d2 = [...Array(SIZE)].every((_, i) => sel.has(i * SIZE + (SIZE - 1 - i)));
  if (d1) for (let i = 0; i < SIZE; i++) hits.push(i * SIZE + i);
  if (d2) for (let i = 0; i < SIZE; i++) hits.push(i * SIZE + (SIZE - 1 - i));
  return new Set(hits);
}

function getCounter() {
  try { return parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10); } catch { return 0; }
}
function incCounter() {
  try {
    const n = getCounter() + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return n;
  } catch { return 0; }
}
function formatCount(n) {
  const total = COUNTER_BASE + n;
  return total.toLocaleString('hu-HU');
}

function launchConfetti() {
  const colors = ['#CE2939', '#477050', '#FFFFFF', '#A01F2C', '#2F4D37', '#FFD700'];
  const existing = document.getElementById('confetti-layer');
  if (existing) existing.remove();
  const layer = document.createElement('div');
  layer.id = 'confetti-layer';
  layer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(layer);
  for (let i = 0; i < 100; i++) {
    const p = document.createElement('div');
    const isRect = Math.random() > 0.5;
    p.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-14px;
      width:${isRect?'10px':'8px'};height:${isRect?'6px':'8px'};
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${isRect?'2px':'50%'};
      animation:fall ${1.4+Math.random()*2}s ${Math.random()*0.9}s linear forwards;
      transform:rotate(${Math.random()*360}deg);opacity:1;`;
    layer.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}`;
  layer.appendChild(style);
  setTimeout(() => layer.remove(), 5000);
}

// ─── Sub-components ─────────────────────────────────────────────────────────
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

function Modal({ isOpen, onClose, title, children, maxWidth = 480 }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:1000,
      display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',
      backdropFilter:'blur(3px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'white',borderRadius:16,width:'100%',maxWidth,
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)',overflow:'hidden',
        animation:'modalIn 0.22s ease'
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{display:'flex',height:5}}>
          <div style={{flex:1,background:'#CE2939'}}/>
          <div style={{flex:1,background:'#fff',borderTop:'1px solid #eee',borderBottom:'1px solid #eee'}}/>
          <div style={{flex:1,background:'#477050'}}/>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.25rem 0.75rem'}}>
          <h2 style={{fontSize:18,fontWeight:700,color:'#1a1a1a',margin:0}}>{title}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',padding:4,borderRadius:6,display:'flex'}}>
            <X size={20}/>
          </button>
        </div>
        <div style={{padding:'0 1.25rem 1.25rem'}}>{children}</div>
      </div>
    </div>
  );
}

function WelcomeModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗳️ Üdvözöl a Választási Bingó!">
      <div style={{fontSize:14,lineHeight:1.7,color:'#374151'}}>
        <div style={{background:'#FFF8E1',border:'1px solid #FFD700',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13}}>
          ⚠️ <strong>FIGYELEM:</strong> Ez az alkalmazás szórakoztató célú politikai szótár-bingó. Minden párt, szólam és politikus egyforma eséllyel kerülhet a kártyára!
        </div>
        <p style={{marginBottom:12}}>Ismered azt az érzést, amikor politikus szól a tévében, és már előre tudod, mi fog elhangzani? <strong>Most nyerhetsz is vele!</strong> 🏆</p>
        <div style={{background:'#F3F4F6',borderRadius:10,padding:'12px 14px',marginBottom:14}}>
          <p style={{fontWeight:700,marginBottom:8,color:'#111'}}>🎮 Hogyan játssz?</p>
          <ol style={{paddingLeft:18,margin:0,display:'flex',flexDirection:'column',gap:6}}>
            <li>Kapcsold be a tévét, nyisd meg a rádiót – legyen valami <strong>kampány, vita, interjú</strong></li>
            <li>Ha elhangzik egy varázsszó a kártyán, <strong>kattints rá!</strong></li>
            <li>Tölts be egy sort vízszintesen, függőlegesen vagy átlósan – <strong>BINGÓ!</strong></li>
            <li>Oszd meg az eredményed – a barátaid biztosan sírni fognak a röhögéstől 😂</li>
          </ol>
        </div>
        <p style={{fontSize:12,color:'#6B7280',marginBottom:16}}>A kártyán 39 tipikus kampányszólam szerepel. Minden játéknál véletlenszerűen 24 kerül a táblára.</p>
        <button onClick={onClose} style={{
          width:'100%',padding:'13px',background:'#CE2939',color:'white',
          border:'none',borderRadius:10,fontSize:15,fontWeight:700,cursor:'pointer',
          letterSpacing:0.5
        }}>
          🚀 Játszunk! Bingó-t a nevükre!
        </button>
      </div>
    </Modal>
  );
}

function ShareModal({ isOpen, onClose, isBingo, count }) {
  const [copied, setCopied] = useState(false);
  const text = isBingo
    ? `🇭🇺 BINGÓ! ${count} megjelölt mezővel meglett a sor a Választási Bingón! Próbáld ki te is: ${APP_URL} #${APP_HASHTAG} #valasztasibingo`
    : `🗳️ ${count}/24 mezőnél tartok a Választási Bingón – próbáld ki: ${APP_URL} #${APP_HASHTAG}`;

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(APP_URL);

  const copyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch(e){}
      document.body.removeChild(ta);
    }
  };

  const platforms = [
    { name: 'Twitter / X', icon: '𝕏', bg: '#000', url: `https://twitter.com/intent/tweet?text=${encodedText}` },
    { name: 'Facebook', icon: 'f', bg: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}` },
    { name: 'WhatsApp', icon: '💬', bg: '#25D366', url: `https://wa.me/?text=${encodedText}` },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isBingo ? '🏆 BINGÓ! Oszd meg!' : '📤 Megosztás'}>
      <div style={{fontSize:14,color:'#374151'}}>
        {isBingo && (
          <div style={{background:'linear-gradient(135deg,#CE2939,#A01F2C)',borderRadius:10,padding:'12px 16px',color:'white',marginBottom:14,textAlign:'center'}}>
            <div style={{fontSize:24,marginBottom:4}}>🏆</div>
            <div style={{fontWeight:700,fontSize:16}}>GRATULÁLUNK! BINGÓ!</div>
            <div style={{fontSize:12,opacity:0.9,marginTop:4}}>{count} megjelölt mezővel meglett a sor!</div>
          </div>
        )}
        <p style={{marginBottom:12,fontSize:13,color:'#6B7280'}}>Csábítsd el a barátaidat is – legyenek ők is bingósok a következő adásnál!</p>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
          {platforms.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              style={{
                display:'flex',alignItems:'center',gap:12,padding:'11px 16px',
                background:p.bg,color:'white',borderRadius:10,textDecoration:'none',
                fontWeight:600,fontSize:14,transition:'opacity 0.15s'
              }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >
              <span style={{width:24,textAlign:'center',fontWeight:900}}>{p.icon}</span>
              Megosztás – {p.name}
            </a>
          ))}
        </div>
        <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:10,padding:'10px 12px',fontSize:12,color:'#6B7280',marginBottom:12,wordBreak:'break-all',lineHeight:1.5}}>
          {text}
        </div>
        <button onClick={copyText} style={{
          width:'100%',padding:'11px',background:copied?'#477050':'#374151',color:'white',
          border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',transition:'background 0.2s',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8
        }}>
          {copied ? <><Check size={15}/> Vágólapra másolva!</> : <><Share2 size={15}/> Szöveg másolása</>}
        </button>
      </div>
    </Modal>
  );
}

function EmbedModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe\n  src="${APP_URL}"\n  width="520"\n  height="720"\n  frameborder="0"\n  style="border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);"\n  title="Választási Bingó 2026"\n  loading="lazy"\n></iframe>`;

  const copyCode = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2500); });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔗 Beágyazás a weboldaladba">
      <div style={{fontSize:14,color:'#374151'}}>
        <p style={{marginBottom:12,fontSize:13,lineHeight:1.6}}>Másold be ezt a kódot a weboldaladba, cikkedbe vagy blogodon – a játék azonnal megjelenik, regisztráció nélkül!</p>
        <div style={{background:'#1a1a2e',color:'#a8e6cf',borderRadius:10,padding:'14px',fontFamily:'monospace',fontSize:12,lineHeight:1.6,marginBottom:12,overflow:'auto',whiteSpace:'pre'}}>
          {code}
        </div>
        <button onClick={copyCode} style={{
          width:'100%',padding:'11px',background:copied?'#477050':'#CE2939',color:'white',
          border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',transition:'background 0.2s',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12
        }}>
          {copied ? <><Check size={15}/> Kód másolva!</> : <><Code2 size={15}/> Kód másolása</>}
        </button>
        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:8,padding:'10px 12px',fontSize:12,color:'#166534'}}>
          ✅ <strong>Teljesen ingyenes</strong> – hivatkozás nem szükséges, de szívesen vesszük! A bingó automatikusan frissül az új kampányidőszakokra.
        </div>
      </div>
    </Modal>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(new Set([CENTER]));
  const [winCells, setWinCells] = useState(new Set());
  const [isBingo, setIsBingo] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [playCount, setPlayCount] = useState(getCounter());

  const generateBoard = useCallback(() => {
    const words = shuffle(BUZZWORDS).slice(0, SIZE * SIZE);
    words[CENTER] = 'INGYEN\nMEZŐ';
    setBoard(words);
    setSelected(new Set([CENTER]));
    setWinCells(new Set());
    setIsBingo(false);
    const n = incCounter();
    setPlayCount(n);
  }, []);

  useEffect(() => {
    generateBoard();
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      setTimeout(() => setShowWelcome(true), 400);
      localStorage.setItem(SEEN_KEY, '1');
    }
  }, [generateBoard]);

  const toggleCell = (i) => {
    if (i === CENTER) return;
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    const wins = checkWin(next);
    const bingo = wins.size > 0;
    if (bingo && !isBingo) { launchConfetti(); setTimeout(() => setShowShare(true), 1200); }
    setSelected(next);
    setWinCells(wins);
    setIsBingo(bingo);
  };

  const count = selected.size - 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} isBingo={isBingo} count={count} />
      <EmbedModal isOpen={showEmbed} onClose={() => setShowEmbed(false)} />

      {/* Top tricolor */}
      <div style={{ display: 'flex', height: 7 }}>
        <div style={{ flex: 1, background: '#CE2939' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }} />
        <div style={{ flex: 1, background: '#477050' }} />
      </div>

      {/* Header */}
      <header style={{ background: 'linear-gradient(160deg, #CE2939 0%, #A01F2C 100%)', color: 'white', padding: '1.25rem 1rem 1.4rem', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => setShowWelcome(true)}
          style={{ position:'absolute',top:14,right:14,background:'rgba(255,255,255,0.18)',border:'none',borderRadius:8,padding:'6px 8px',cursor:'pointer',color:'white',display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600 }}>
          <HelpCircle size={15}/> Leírás
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <HungarianFlag size={32} />
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>Választási Bingó 2026</h1>
          <HungarianFlag size={32} />
        </div>
        <p style={{ fontSize: 13, opacity: 0.92, maxWidth: 340, margin: '0 auto', lineHeight: 1.5 }}>
          Vitát vagy kampánybeszédet hallgatsz? Kattints, ha elhangzik a varázsszó! 🎙️
        </p>
        <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.15)',borderRadius:20,padding:'4px 12px',marginTop:10,fontSize:12,fontWeight:600 }}>
          <Users size={13}/> {formatCount(playCount)} lejátszott kör
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', padding: '1rem' }}>

        <div style={{ overflow: 'hidden', maxHeight: isBingo ? 80 : 0, transition: 'max-height 0.4s ease', marginBottom: isBingo ? 12 : 0 }}>
          <div style={{ background: 'linear-gradient(135deg,#CE2939,#A01F2C)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'white', letterSpacing: 1.5 }}>B I N G Ó !</span>
            <span style={{ fontSize: 22 }}>🏆</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, background: '#D1D5DB', padding: 5, borderRadius: 16, border: '2px solid #CE2939', boxShadow: '0 4px 20px rgba(206,41,57,0.12)' }}>
          {board.map((word, i) => {
            const isCenter = i === CENTER;
            const isWin = winCells.has(i);
            const isSel = selected.has(i);
            let bg = 'white', color = '#374151', border = '1px solid #E5E7EB', shadow = '';
            if (isCenter) { bg = '#477050'; color = 'white'; border = '1px solid #2F4D37'; }
            else if (isWin) { bg = 'linear-gradient(135deg,#CE2939,#A01F2C)'; color = 'white'; border = '1px solid #A01F2C'; shadow = '0 2px 8px rgba(206,41,57,0.4)'; }
            else if (isSel) { bg = '#477050'; color = 'white'; border = '1px solid #2F4D37'; shadow = '0 2px 6px rgba(71,112,80,0.35)'; }
            return (
              <button key={i} onClick={() => toggleCell(i)} style={{
                aspectRatio: '1', background: bg, color, border, borderRadius: 8,
                fontSize: 9, fontWeight: 600, padding: '4px 3px',
                cursor: isCenter ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', lineHeight: 1.3, transition: 'all 0.14s',
                transform: isSel && !isCenter ? 'scale(0.94)' : 'scale(1)',
                userSelect: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word', hyphens: 'auto',
                boxShadow: shadow,
              }}>
                {word}
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {count} / {SIZE * SIZE - 1} mező megjelölve
          {isBingo && <span style={{ color: '#CE2939', fontWeight: 700, marginLeft: 8 }}>🏆 BINGÓ!</span>}
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={generateBoard} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 8px', background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#CE2939';e.currentTarget.style.color='#CE2939';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#D1D5DB';e.currentTarget.style.color='#374151';}}>
            <RotateCcw size={14} /> Új tábla
          </button>
          <button onClick={() => setShowShare(true)} style={{ flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 8px', background: '#CE2939', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 12px rgba(206,41,57,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#A01F2C'}
            onMouseLeave={e=>e.currentTarget.style.background='#CE2939'}>
            <Share2 size={14} /> Megosztás
          </button>
          <button onClick={() => setShowEmbed(true)} title="Beágyazás" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '11px 12px', background: 'white', color: '#6B7280', border: '1.5px solid #D1D5DB', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#477050';e.currentTarget.style.color='#477050';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#D1D5DB';e.currentTarget.style.color='#6B7280';}}>
            <Code2 size={16} />
          </button>
        </div>

        <details style={{ marginTop: 12, background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 12px' }}>
          <summary style={{ fontSize: 12, color: '#6B7280', cursor: 'pointer', userSelect:'none' }}>📋 Mind a {BUZZWORDS.length} varázsszó megtekintése</summary>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            {BUZZWORDS.map(w => (
              <span key={w} style={{ fontSize: 10, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 20, padding: '3px 9px', color: '#6B7280' }}>{w}</span>
            ))}
          </div>
        </details>
      </main>

      {/* Bottom tricolor */}
      <div style={{ display: 'flex', height: 7 }}>
        <div style={{ flex: 1, background: '#CE2939' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }} />
        <div style={{ flex: 1, background: '#477050' }} />
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', borderTop: '1px solid #E5E7EB' }}>
        <span>Készült szórakoztatási céllal · #valasztas2026</span>
        <span style={{ margin: '0 8px', opacity:0.4 }}>|</span>
        <a href={CREATOR_URL} target="_blank" rel="noopener noreferrer"
          style={{ color: '#CE2939', fontWeight: 700, textDecoration: 'none', fontSize: 11, letterSpacing:0.3 }}
          onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
          onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
          🤖 Készítette: GaiAgent.cc
        </a>
      </footer>
    </div>
  );
}

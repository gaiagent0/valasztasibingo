import React, { useState } from 'react'
import { Grid3X3, Users, Newspaper, Settings } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import BingoScreen from './screens/BingoScreen'
import CommunityScreen from './screens/CommunityScreen'
import NewsScreen from './screens/NewsScreen'
import SettingsScreen from './screens/SettingsScreen'

const TABS = [
  { id: 'bingo', label: 'Bingó', icon: Grid3X3 },
  { id: 'community', label: 'Közösség', icon: Users },
  { id: 'news', label: 'Hírek', icon: Newspaper },
  { id: 'settings', label: 'Beállítások', icon: Settings },
]

function HungarianFlag({ size = 28 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 3 2" style={{ borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', display: 'inline-block', verticalAlign: 'middle' }}>
      <rect width="3" height="0.667" y="0" fill="#CE2939" />
      <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
      <rect width="3" height="0.667" y="1.333" fill="#477050" />
    </svg>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('bingo')
  const { user, loading } = useAuth()

  const renderScreen = () => {
    switch (activeTab) {
      case 'bingo':     return <BingoScreen user={user} />
      case 'community': return <CommunityScreen user={user} />
      case 'news':      return <NewsScreen />
      case 'settings':  return <SettingsScreen user={user} loading={loading} />
      default:          return <BingoScreen user={user} />
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F9FAFB', maxWidth: 520, margin: '0 auto' }}>

      {/* Top tricolor */}
      <div style={{ display: 'flex', height: 5, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#CE2939' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }} />
        <div style={{ flex: 1, background: '#477050' }} />
      </div>

      {/* Header */}
      <header style={{
        background: '#CE2939', color: 'white',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <HungarianFlag size={28} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Közéleti Mozaik</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Választási Bingó 2026</div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderScreen()}
      </main>

      {/* Bottom navigation */}
      <nav style={{
        display: 'flex', background: 'white', borderTop: '1px solid #E5E7EB',
        flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '10px 4px 8px', background: 'none', border: 'none', cursor: 'pointer',
              color: active ? '#CE2939' : '#9CA3AF', transition: 'color 0.15s',
              gap: 3,
            }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
              {active && (
                <div style={{ width: 20, height: 2, background: '#CE2939', borderRadius: 1 }} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

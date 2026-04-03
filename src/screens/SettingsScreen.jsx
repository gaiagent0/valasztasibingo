import React, { useState, useEffect } from 'react'
import { LogOut, LogIn, User, Trophy, Hash } from 'lucide-react'
import { signInWithGoogle, signInAnonymously, signOut } from '../lib/auth'
import { supabase } from '../lib/supabase'

export default function SettingsScreen({ user, loading }) {
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    if (!user) { setProfile(null); return }
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [user])

  const handleGoogleLogin = async () => {
    setAuthLoading(true)
    await signInWithGoogle()
    setAuthLoading(false)
  }

  const handleAnonLogin = async () => {
    setAuthLoading(true)
    await signInAnonymously()
    setAuthLoading(false)
  }

  const handleSignOut = async () => {
    setAuthLoading(true)
    await signOut()
    setAuthLoading(false)
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: '#6B7280' }}>Betöltés…</div>
      </div>
    )
  }

  const displayName = profile?.display_name || user?.user_metadata?.full_name || 'Névtelen Választó'
  const isAnon = user?.is_anonymous

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      {user ? (
        <>
          {/* Profile card */}
          <div style={{
            background: 'linear-gradient(135deg, #477050 0%, #2F4D37 100%)',
            borderRadius: 16, padding: '20px 16px', marginBottom: 16,
            color: 'white', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)' }}
              />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                <User size={28} color="white" />
              </div>
            )}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{displayName}</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                {isAnon ? 'Vendég fiók' : (user.email || 'Google fiók')}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Pont', value: profile?.total_points ?? 0, icon: <Trophy size={16} color="#CE2939" /> },
              { label: 'Bingó', value: profile?.total_bingos ?? 0, icon: '🏆' },
              { label: 'Szint', value: profile?.level ?? 1, icon: <Hash size={16} color="#477050" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: 'white', borderRadius: 12, padding: '14px 10px',
                border: '1px solid #E5E7EB', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={authLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', background: '#FEF2F2', color: '#991B1B',
              border: '1px solid #FECACA', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.7 : 1,
            }}
          >
            <LogOut size={16} />
            {authLoading ? 'Kijelentkezés…' : 'Kijelentkezés'}
          </button>
        </>
      ) : (
        <>
          {/* Login card */}
          <div style={{
            background: 'white', borderRadius: 16, padding: '24px 16px',
            border: '1px solid #E5E7EB', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗳️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              Csatlakozz a közösséghez!
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
              Jelentkezz be, hogy pontjaid megjelenjenek a toplistán és nyomd követni a haladásod.
            </p>
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px', background: 'white', color: '#374151',
              border: '1px solid #D1D5DB', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: authLoading ? 'not-allowed' : 'pointer', marginBottom: 10,
              opacity: authLoading ? 0.7 : 1, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Bejelentkezés Google-lel
          </button>

          {/* Anonymous login */}
          <button
            onClick={handleAnonLogin}
            disabled={authLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', background: '#F3F4F6', color: '#6B7280',
              border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.7 : 1,
            }}
          >
            <LogIn size={16} />
            Folytatás vendégként
          </button>
        </>
      )}

      {/* App info */}
      <div style={{ marginTop: 24, padding: '12px 0', borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          Közéleti Mozaik – Választási Bingó 2026<br />
          Készült szórakoztatási céllal · valasztasibingo.hu
        </p>
      </div>
    </div>
  )
}

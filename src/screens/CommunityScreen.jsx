import React, { useState, useEffect } from 'react'
import { Trophy, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

function SkeletonCard() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'white', borderRadius: 12, padding: '12px 16px',
      border: '1px solid #E5E7EB',
    }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: '60%', background: '#E5E7EB', borderRadius: 6, marginBottom: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 12, width: '40%', background: '#F3F4F6', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ width: 40, height: 20, background: '#E5E7EB', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  )
}

const RANK_COLORS = ['#CE2939', '#477050', '#6B7280']
const RANK_ICONS = ['🥇', '🥈', '🥉']

export default function CommunityScreen({ user }) {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leaderboard').select('*').limit(10)
      .then(({ data, error }) => {
        if (!error) setLeaders(data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #CE2939 0%, #A01F2C 100%)',
        borderRadius: 16, padding: '20px 16px', marginBottom: 16,
        color: 'white', textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>🏆</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Közösségi Toplista</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          Gyűjts pontokat bingóval!
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : leaders.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 12, padding: '32px 16px',
            textAlign: 'center', border: '1px solid #E5E7EB',
          }}>
            <Users size={32} color="#D1D5DB" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 14, color: '#6B7280' }}>Még nincsenek eredmények</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Légy az első! Játssz bingót!</p>
          </div>
        ) : (
          leaders.map((leader, idx) => (
            <div key={leader.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'white', borderRadius: 12, padding: '12px 16px',
              border: idx === 0 ? '2px solid #CE2939' : '1px solid #E5E7EB',
              boxShadow: idx === 0 ? '0 2px 8px rgba(206,41,57,0.15)' : 'none',
            }}>
              {/* Rank */}
              <div style={{ fontSize: 22, minWidth: 32, textAlign: 'center' }}>
                {idx < 3 ? RANK_ICONS[idx] : (
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#9CA3AF' }}>
                    {leader.rank || idx + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              {leader.avatar_url ? (
                <img
                  src={leader.avatar_url}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: idx < 3 ? RANK_COLORS[idx] : '#E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: 'white', fontWeight: 700,
                }}>
                  {(leader.display_name || 'N')[0].toUpperCase()}
                </div>
              )}

              {/* Name + level */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: '#111827',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {leader.display_name || 'Névtelen Választó'}
                  {user && leader.id === user.id && (
                    <span style={{ fontSize: 11, color: '#CE2939', marginLeft: 6 }}>(te)</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  Szint {leader.level || 1} · {leader.total_bingos || 0} bingó
                </div>
              </div>

              {/* Points */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: idx < 3 ? RANK_COLORS[idx] : '#374151' }}>
                  {leader.total_points || 0}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>pont</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

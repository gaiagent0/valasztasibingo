import React, { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} perce`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} órája`
  const days = Math.floor(hours / 24)
  return `${days} napja`
}

function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
      <div style={{ height: 160, background: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ height: 12, width: '30%', background: '#E5E7EB', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 16, background: '#E5E7EB', borderRadius: 6, marginBottom: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 16, width: '80%', background: '#E5E7EB', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

const SOURCE_COLORS = {
  'Telex': '#1a73e8',
  '444': '#e53935',
  'HVG': '#2e7d32',
}

export default function NewsScreen() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 14 }}>
        Magyar Politikai Hírek
      </h2>

      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
          padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#991B1B',
        }}>
          Nem sikerült betölteni a híreket. Ellenőrizd az internetkapcsolatot.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : articles.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 12, padding: '32px 16px',
            textAlign: 'center', border: '1px solid #E5E7EB',
          }}>
            <p style={{ fontSize: 14, color: '#6B7280' }}>Nincsenek elérhető hírek</p>
          </div>
        ) : (
          articles.map(article => (
            <div key={article.id} style={{
              background: 'white', borderRadius: 16, overflow: 'hidden',
              border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              {/* Image */}
              {article.image && (
                <img
                  src={article.image}
                  alt=""
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}

              <div style={{ padding: '12px 14px' }}>
                {/* Source + time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: 'white',
                    background: SOURCE_COLORS[article.source] || '#6B7280',
                    borderRadius: 4, padding: '2px 7px',
                  }}>
                    {article.source}
                  </span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {timeAgo(article.pubDate)}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.4, marginBottom: 6 }}>
                  {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 10 }}>
                    {article.description.slice(0, 150)}{article.description.length > 150 ? '…' : ''}
                  </p>
                )}

                {/* Link */}
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 13, fontWeight: 600, color: '#CE2939', textDecoration: 'none',
                  }}
                >
                  Elolvasom <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

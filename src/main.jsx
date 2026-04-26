import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // Ha van várakozó új SW, azonnal aktiváljuk
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Új SW telepítve – oldal újratöltése az átvételhez
                window.location.reload()
              }
            })
          }
        })
      })
      .catch(() => {})
  })
}

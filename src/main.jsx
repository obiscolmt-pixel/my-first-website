import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1035139589680-a3ek728162s71mcr25et5mfue7fn6dna.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)

// Unregister all service workers on iOS
if ('serviceWorker' in navigator) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (isIOS) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister())
    })
  }
}

// Register Service Worker — skip on iOS Safari to prevent blank page bug
if ('serviceWorker' in navigator) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  
  if (!isIOS) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('SW registered:', reg)
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload()
              }
            })
          })
        })
        .catch((err) => console.log('SW error:', err))
    })
  }
}
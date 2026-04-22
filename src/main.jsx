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
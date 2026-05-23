import React, { useState } from 'react'

const DeleteAccount = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Something went wrong')
      } else {
        setConfirmed(true)
        setMessage('Your account has been deleted successfully.')
        localStorage.clear()
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#111827',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '40px 32px',
          maxWidth: 440, width: '100%', textAlign: 'center'
        }}>
          <div style={{
            width: 64, height: 64, background: '#dcfce7', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28
          }}>✅</div>
          <h2 style={{ color: '#111827', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Account Deleted</h2>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
            Your Obisco Store account and all associated data have been permanently deleted.
          </p>
          <a href="https://obisco.store" style={{
            display: 'block', background: '#f97316', color: 'white',
            borderRadius: 50, padding: '13px 32px', textDecoration: 'none',
            fontWeight: 700, fontSize: 14
          }}>Back to Obisco Store</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#111827',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1f2937', padding: '10px 20px', borderRadius: 50, marginBottom: 24
          }}>
            <span style={{ color: '#f97316', fontWeight: 700, fontSize: 16 }}>OBISCO</span>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>STORE</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>Delete Account</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Permanently remove your account and data</p>
        </div>

        {/* Warning */}
        <div style={{
          background: '#450a0a', border: '1px solid #7f1d1d',
          borderRadius: 12, padding: 16, marginBottom: 20,
          display: 'flex', gap: 12, alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>This action is permanent</p>
            <p style={{ color: '#f87171', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              All your data including orders, wallet balance and personal information will be permanently deleted and cannot be recovered.
            </p>
          </div>
        </div>

        {/* What will be deleted */}
        <div style={{
          background: '#1f2937', borderRadius: 12, padding: 16, marginBottom: 20
        }}>
          <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>What will be deleted</p>
          {['Your profile and personal information', 'Your complete order history', 'Your wallet balance', 'Your wishlist and saved items', 'Your notification preferences'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#ef4444', fontSize: 16 }}>✕</span>
              <span style={{ color: '#d1d5db', fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#111827' }}>Confirm your identity</h3>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              color: '#dc2626', fontSize: 13
            }}>{error}</div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#9ca3af' : '#dc2626',
              color: 'white', border: 'none', borderRadius: 50,
              padding: 13, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 12
            }}
          >
            {loading ? 'Deleting...' : 'Delete my account permanently'}
          </button>

          <a href="https://obisco.store" style={{
            display: 'block', textAlign: 'center', color: '#6b7280',
            fontSize: 14, textDecoration: 'none'
          }}>Cancel — go back to store</a>
        </div>

        <p style={{ color: '#4b5563', fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          Need help? Contact us on WhatsApp: +234 904 986 3067
        </p>
      </div>
    </div>
  )
}

export default DeleteAccount
import React, { useState, useEffect } from 'react'

const CookieBanner = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('obisco_cookie_consent')
    const consentDate = localStorage.getItem('obisco_cookie_consent_date')

    if (!consent) {
      // No consent yet — show banner
      setTimeout(() => setVisible(true), 2000)
      return
    }

    // Check if 30 days have passed
    if (consentDate) {
      const daysSince = (Date.now() - parseInt(consentDate)) / (1000 * 60 * 60 * 24)
      if (daysSince > 30) {
        // Consent expired — show banner again
        localStorage.removeItem('obisco_cookie_consent')
        localStorage.removeItem('obisco_cookie_consent_date')
        setTimeout(() => setVisible(true), 2000)
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('obisco_cookie_consent', 'accepted')
    localStorage.setItem('obisco_cookie_consent_date', Date.now().toString())
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('obisco_cookie_consent', 'declined')
    localStorage.setItem('obisco_cookie_consent_date', Date.now().toString())
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🍪</span>
          <div className="flex-1">
            <p className="font-bold text-white text-sm mb-1">
              We use Cookies
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              OBISCO Store uses cookies to improve your shopping experience,
              remember your cart and wishlist, and keep you signed in.
              By continuing to use our site you agree to our use of cookies.
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                onClick={handleAccept}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full transition"
              >
                Accept All 🍪
              </button>
              <button
                onClick={handleDecline}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold px-5 py-2 rounded-full transition"
              >
                Decline
              </button>
              <a href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert(`🍪 OBISCO Store Cookie Policy\n\nWe use the following cookies:\n\n• Authentication cookies — to keep you signed in\n• Wishlist cookies — to save your wishlist\n• Recently viewed — to show products you viewed\n• Cart cookies — to save your cart items\n\nConsent expires after 30 days.\nWe do not sell your data to third parties.\n\nContact us: obiscostore1@gmail.com`)
                }}
                className="text-orange-400 text-xs underline hover:text-orange-300 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
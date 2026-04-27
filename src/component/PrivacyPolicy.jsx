import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const PrivacyPolicy = ({ open, setOpen }) => {
  if (!open) return null

  return (
    <>
      <div className='fixed inset-0 bg-black/60 z-[60]' onClick={() => setOpen(false)} />
      <div className='fixed inset-0 sm:inset-4 md:inset-8 bg-white z-[70] rounded-2xl shadow-2xl flex flex-col overflow-hidden'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 py-4 border-b bg-gray-950 shrink-0'>
          <div>
            <h2 className='text-xl font-black text-white'>🔒 Privacy Policy</h2>
            <p className='text-xs text-gray-400 mt-0.5'>Last updated: April 2026</p>
          </div>
          <button onClick={() => setOpen(false)} className='text-gray-400 hover:text-white transition'>
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full'>

          <div className='flex flex-col gap-6 text-gray-700 text-sm leading-relaxed'>

            <div>
              <h1 className='text-2xl font-black text-gray-900 mb-2'>Privacy Policy</h1>
              <p>Welcome to OBISCO Store. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use and protect your information when you visit our website at <strong>obisco.store</strong> or use our mobile app.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>1. Information We Collect</h2>
              <p className='mb-2'>We collect information you provide directly to us when you:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Create an account — name, email address, phone number</li>
                <li>Place an order — delivery address, city, state</li>
                <li>Sign in with Google — name, email, profile picture</li>
                <li>Contact us via WhatsApp or email</li>
                <li>Register your business on our marketplace</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>2. How We Use Your Information</h2>
              <p className='mb-2'>We use the information we collect to:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Process and deliver your orders</li>
                <li>Send order confirmation and status update emails</li>
                <li>Send promotional emails and announcements (you can unsubscribe anytime)</li>
                <li>Improve our website and services</li>
                <li>Respond to your customer service requests</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>3. Cookies and Local Storage</h2>
              <p className='mb-2'>OBISCO Store uses browser storage technologies including:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li><strong>Authentication tokens</strong> — to keep you signed in</li>
                <li><strong>Wishlist data</strong> — to save your wishlist items</li>
                <li><strong>Recently viewed</strong> — to show products you recently viewed</li>
                <li><strong>Cart data</strong> — to save your cart items</li>
                <li><strong>Cookie consent</strong> — to remember your cookie preferences</li>
              </ul>
              <p className='mt-2'>You can clear these at any time through your browser settings.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>4. Information Sharing</h2>
              <p className='mb-2'>We do not sell, trade or rent your personal information to third parties. We may share your information with:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li><strong>Verified Specialists</strong> — when you request a product or service from a specialist on our marketplace, we may share your contact details with them to fulfill your request</li>
                <li><strong>Service Providers</strong> — we use trusted services like MongoDB, Google, and email providers to operate our platform</li>
                <li><strong>Legal Requirements</strong> — if required by Nigerian law or court order</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>5. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information including:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1 mt-2'>
                <li>Password encryption using bcrypt</li>
                <li>JWT token authentication</li>
                <li>HTTPS encryption via SSL/TLS</li>
                <li>Cloudflare DDoS protection</li>
                <li>Rate limiting on all API endpoints</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>6. Your Rights</h2>
              <p className='mb-2'>Under the Nigeria Data Protection Regulation (NDPR) you have the right to:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing emails</li>
                <li>Lodge a complaint with the National Information Technology Development Agency (NITDA)</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>7. Children's Privacy</h2>
              <p>OBISCO Store is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and sending an email to registered users.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy please contact us:</p>
              <div className='bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2'>
                <p><strong>OBISCO Store</strong></p>
                <p>📍 Lagos, Nigeria</p>
                <p>📧 Email: obiscostore1@gmail.com</p>
                <p>📱 WhatsApp: +234 904 986 3067</p>
                <p>🌐 Website: obisco.store</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}

export default PrivacyPolicy
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const TermsConditions = ({ open, setOpen }) => {
  if (!open) return null

  return (
    <>
      <div className='fixed inset-0 bg-black/60 z-[60]' onClick={() => setOpen(false)} />
      <div className='fixed inset-0 sm:inset-4 md:inset-8 bg-white z-[70] rounded-2xl shadow-2xl flex flex-col overflow-hidden'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 py-4 border-b bg-gray-950 shrink-0'>
          <div>
            <h2 className='text-xl font-black text-white'>📋 Terms & Conditions</h2>
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
              <h1 className='text-2xl font-black text-gray-900 mb-2'>Terms & Conditions</h1>
              <p>Welcome to OBISCO Store. By accessing or using our website at <strong>obisco.store</strong> or our mobile app, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>1. About OBISCO Store</h2>
              <p>OBISCO Store is a Nigerian online marketplace based in Lagos, Nigeria. We connect customers with verified specialists across gadgets, fashion and lifestyle products. We deliver across Nigeria.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>2. Account Registration</h2>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>You must be at least 13 years old to create an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must provide accurate and complete information when registering</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>3. Orders and Payments</h2>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>All prices are displayed in Nigerian Naira (₦)</li>
                <li>Payment is made via bank transfer to our verified accounts</li>
                <li>Orders are confirmed after payment verification</li>
                <li>We reserve the right to cancel orders if payment is not received</li>
                <li>Prices may change without prior notice</li>
                <li>We accept payment via Fidelity Bank and OPay</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>4. Delivery</h2>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>We deliver across Nigeria within 2-5 business days</li>
                <li>Delivery times may vary depending on location</li>
                <li>You are responsible for providing accurate delivery information</li>
                <li>OBISCO Store is not liable for delays caused by incorrect addresses</li>
                <li>Risk of loss transfers to you upon delivery</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>5. Returns and Refunds</h2>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Returns must be requested within 7 days of delivery</li>
                <li>Items must be in original condition and packaging</li>
                <li>Contact us via WhatsApp to initiate a return</li>
                <li>Refunds will be processed within 5-7 business days</li>
                <li>Shipping costs for returns may be borne by the customer</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>6. Marketplace & Verified Specialists</h2>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>OBISCO Store operates as a marketplace connecting customers with verified specialists</li>
                <li>Specialists are independent vendors reviewed and approved by OBISCO Store</li>
                <li>OBISCO Store is not liable for disputes between customers and specialists</li>
                <li>We reserve the right to remove any specialist from our platform</li>
                <li>Specialists must comply with our marketplace standards</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>7. Prohibited Activities</h2>
              <p className='mb-2'>You agree not to:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Use our platform for any illegal purposes</li>
                <li>Attempt to hack or disrupt our services</li>
                <li>Post false or misleading reviews</li>
                <li>Impersonate other users or OBISCO Store staff</li>
                <li>Use our platform to send spam or unsolicited messages</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>8. Intellectual Property</h2>
              <p>All content on OBISCO Store including logos, images, text and designs are the property of OBISCO Store or our content suppliers. You may not use our content without written permission.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>9. Limitation of Liability</h2>
              <p>OBISCO Store shall not be liable for any indirect, incidental or consequential damages arising from your use of our platform. Our total liability shall not exceed the amount paid for the specific order in dispute.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>10. Governing Law</h2>
              <p>These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>11. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. We will notify registered users of significant changes via email. Continued use of our platform after changes constitutes acceptance of the new Terms.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>12. Contact Us</h2>
              <p>For any questions about these Terms and Conditions:</p>
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

export default TermsConditions
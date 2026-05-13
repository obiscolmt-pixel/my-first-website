import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const RefundPolicy = ({ open, setOpen }) => {
  if (!open) return null

  return (
    <>
      <div className='fixed inset-0 bg-black/60 z-[60]' onClick={() => setOpen(false)} />
      <div className='fixed inset-0 sm:inset-4 md:inset-8 bg-white z-[70] rounded-2xl shadow-2xl flex flex-col overflow-hidden'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 py-4 border-b bg-gray-950 shrink-0'>
          <div>
            <h2 className='text-xl font-black text-white'>💰 Refund Policy</h2>
            <p className='text-xs text-gray-400 mt-0.5'>Last updated: May 2026</p>
          </div>
          <button onClick={() => setOpen(false)} className='text-gray-400 hover:text-white transition'>
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full'>
          <div className='flex flex-col gap-6 text-gray-700 text-sm leading-relaxed'>

            <div>
              <h1 className='text-2xl font-black text-gray-900 mb-2'>Refund Policy</h1>
              <p>At OBISCO Store, we are committed to ensuring your satisfaction with every purchase. If you are not completely satisfied with your order, we are here to help.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>1. Eligibility for Refund</h2>
              <p className='mb-2'>To be eligible for a refund, the following conditions must be met:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Item must be returned within <strong>7 days</strong> of delivery</li>
                <li>Item must be unused, in its original packaging and same condition as received</li>
                <li>You must provide proof of purchase (order ID or receipt)</li>
                <li>Item must not be in the non-refundable category below</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>2. Non-Refundable Items</h2>
              <p className='mb-2'>The following items are not eligible for refunds:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li><strong>VTU services</strong> (airtime, data, electricity, cable TV) — once purchased and delivered, these cannot be reversed</li>
                <li>Items that have been used, damaged, or altered after delivery</li>
                <li>Items without original packaging</li>
                <li>Sale or discounted items marked as final sale</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>3. Refund Process</h2>
              <p className='mb-2'>To request a refund:</p>
              <ul className='list-disc pl-5 flex flex-col gap-1'>
                <li>Contact us at <strong>obiscostore1@gmail.com</strong> or WhatsApp: <strong>+234 904 986 3067</strong></li>
                <li>Provide your order ID and reason for return</li>
                <li>We will review your request within <strong>2 business days</strong></li>
                <li>If approved, return the item to our address</li>
                <li>Refund processed within <strong>5–7 business days</strong> after we receive the item</li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>4. Refund Method</h2>
              <p>Refunds will be issued via bank transfer to your Nigerian bank account. You will be notified by email once the refund has been processed.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>5. Damaged or Wrong Items</h2>
              <p>If you received a damaged or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photos. We will arrange a replacement or full refund at no additional cost.</p>
            </div>

            <div>
              <h2 className='text-lg font-black text-gray-900 mb-2'>6. Contact Us</h2>
              <p>For any refund-related questions, please reach us at:</p>
              <div className='bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2'>
                <p><strong>OBISCO Store</strong></p>
                <p>📍 Plot 928 Amokpo Umuchigbo Ujem Nike, Enugu State, Nigeria</p>
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

export default RefundPolicy

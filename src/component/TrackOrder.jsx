import React, { useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { trackOrder } from '../api/api.js'

const steps = [
  { key: 'pending', label: 'Order Placed', icon: '🛒', desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Payment verified, order confirmed' },
  { key: 'shipped', label: 'Shipped', icon: '📦', desc: 'Your order is on its way' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', desc: 'Arriving today!' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order delivered successfully' },
]

const statusIndex = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
}

const TrackOrder = ({ trackOpen, setTrackOpen }) => {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError('Please enter your Order ID.')
      return
    }
    setLoading(true)
    setError('')
    setOrder(null)
    const res = await trackOrder(orderId.trim())
    setLoading(false)
    if (res._id) {
      setOrder(res)
    } else {
      setError(res.message || 'Order not found. Please check your Order ID.')
    }
  }

  const handleClose = () => {
    setTrackOpen(false)
    setOrderId('')
    setOrder(null)
    setError('')
  }

  const currentStep = order ? (statusIndex[order.status] ?? 0) : 0

  if (!trackOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className='bg-black/60 fixed inset-0 z-40'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='
        fixed z-50
        bottom-0 left-0 right-0 rounded-t-3xl
        sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto
        sm:-translate-x-1/2 sm:-translate-y-1/2
        sm:rounded-2xl sm:w-[500px]
        bg-white shadow-2xl
        max-h-[92vh] sm:max-h-[90vh]
        flex flex-col
        duration-300
      '>

        {/* Drag handle mobile */}
        <div className='sm:hidden flex justify-center pt-3 pb-1 shrink-0'>
          <div className='w-10 h-1 bg-gray-300 rounded-full' />
        </div>

        {/* Header */}
        <div className='flex justify-between items-center px-5 sm:px-6 py-4 border-b shrink-0'>
          <div>
            <h2 className='text-xl sm:text-2xl font-black text-gray-800'>
              🚚 Track Order
            </h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              Enter your Order ID to track your delivery
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-black transition p-1'
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto flex-1 px-5 sm:px-6 py-4'>

          {/* Search Input */}
          <div className='flex gap-2 mb-4'>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              placeholder='Enter Order ID...'
              className='flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500'
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className='bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-xl transition flex items-center gap-2 text-sm font-bold'
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <AiOutlineSearch size={18} />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-xl p-3 mb-4'>
              <p className='text-red-500 text-sm text-center'>{error}</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className='flex flex-col gap-4'>

              {/* Order Info */}
              <div className='bg-gray-50 rounded-xl p-4 border'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <p className='text-xs text-gray-400 uppercase tracking-wide'>Order ID</p>
                    <p className='font-bold text-gray-800 text-sm'>{order._id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.paymentStatus === 'paid' ? '💰 Paid' : '⏳ Payment Pending'}
                  </span>
                </div>
                <p className='text-xs text-gray-400 mt-1'>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className='text-orange-500 font-bold mt-1'>
                  Total: ₦{order.totalAmount.toLocaleString()}
                </p>
              </div>

              {/* Delivery Info */}
              <div className='bg-orange-50 border border-orange-100 rounded-xl p-4'>
                <p className='text-xs font-bold text-orange-600 uppercase mb-2'>
                  📍 Delivery Address
                </p>
                <p className='text-sm text-gray-700 font-semibold'>{order.delivery.fullName}</p>
                <p className='text-sm text-gray-500'>{order.delivery.phone}</p>
                <p className='text-sm text-gray-500'>
                  {order.delivery.address}, {order.delivery.city}, {order.delivery.state}
                </p>
              </div>

              {/* Status Timeline */}
              <div>
                <p className='text-sm font-bold text-gray-700 mb-4'>Order Status</p>
                <div className='relative'>
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep
                    const isUpcoming = index > currentStep

                    return (
                      <div key={step.key} className='flex gap-4 mb-4 last:mb-0'>

                        {/* Line + Circle */}
                        <div className='flex flex-col items-center'>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 border-2 transition
                            ${isCompleted ? 'bg-orange-500 border-orange-500' :
                              isCurrent ? 'bg-orange-500 border-orange-500 ring-4 ring-orange-100' :
                              'bg-white border-gray-200'}`}
                          >
                            {isCompleted ? '✓' : step.icon}
                          </div>
                          {index < steps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${
                              isCompleted ? 'bg-orange-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>

                        {/* Text */}
                        <div className='pb-4'>
                          <p className={`font-bold text-sm ${
                            isUpcoming ? 'text-gray-300' : 'text-gray-800'
                          }`}>
                            {step.label}
                            {isCurrent && (
                              <span className='ml-2 text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full'>
                                Current
                              </span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${
                            isUpcoming ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {step.desc}
                          </p>
                        </div>

                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className='border rounded-xl overflow-hidden'>
                <p className='text-xs font-bold text-gray-700 uppercase px-4 py-3 bg-gray-50 border-b'>
                  Items Ordered
                </p>
                {order.items.map((item, index) => (
                  <div key={index} className='flex items-center gap-3 px-4 py-3 border-b last:border-0'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-12 h-12 object-cover rounded-lg shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-xs truncate'>{item.name}</p>
                      <p className='text-gray-400 text-xs capitalize'>{item.category}</p>
                      {item.color && (
                        <p className='text-gray-400 text-xs'>{item.color}</p>
                      )}
                    </div>
                    <div className='text-right shrink-0'>
                      <p className='text-orange-500 font-bold text-xs'>
                        ₦{item.amount.toLocaleString()}
                      </p>
                      <p className='text-gray-400 text-xs'>x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Empty state */}
          {!order && !error && !loading && (
            <div className='text-center py-10'>
              <p className='text-4xl mb-3'>📦</p>
              <p className='text-gray-500 text-sm'>Enter your Order ID above to track your delivery</p>
              <p className='text-gray-400 text-xs mt-1'>
                Your Order ID was shown after checkout
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default TrackOrder
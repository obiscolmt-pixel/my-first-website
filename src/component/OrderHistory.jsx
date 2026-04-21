import React, { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { getUserOrders } from '../api/api.js'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  shipped: 'bg-purple-100 text-purple-600',
  out_for_delivery: 'bg-orange-100 text-orange-600',
  delivered: 'bg-green-100 text-green-600',
}

const statusEmoji = {
  pending: '⏳',
  confirmed: '✅',
  shipped: '📦',
  out_for_delivery: '🚚',
  delivered: '🎉',
}

const OrderHistory = ({ orderHistoryOpen, setOrderHistoryOpen }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (orderHistoryOpen) {
      loadOrders()
    }
  }, [orderHistoryOpen])

  const loadOrders = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('User from localStorage:', user)
    if (!user) return

    setLoading(true)
    try {
      const data = await getUserOrders(user._id || user.id)
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOrderHistoryOpen(false)
    setSelectedOrder(null)
  }

  if (!orderHistoryOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className='bg-black/60 fixed inset-0 z-40' onClick={handleClose} />

      {/* Drawer */}
      <div className='fixed top-0 right-0 w-full sm:w-[480px] h-screen bg-white z-50 flex flex-col shadow-2xl'>

        {/* Header */}
        <div className='flex justify-between items-center px-4 sm:px-6 py-4 border-b shrink-0'>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
              📋 My Orders
            </h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-black transition p-1'
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4'>

          {loading ? (
            <div className='flex flex-col items-center justify-center h-full gap-3'>
              <div className='w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin' />
              <p className='text-gray-400 text-sm'>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center py-10'>
              <p className='text-5xl mb-4'>📭</p>
              <p className='text-gray-500 text-lg font-semibold'>No orders yet</p>
              <p className='text-gray-400 text-sm mt-1'>
                Your orders will appear here after you shop!
              </p>
              <button
                onClick={handleClose}
                className='mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition text-sm font-semibold'
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className='border rounded-xl overflow-hidden hover:border-orange-200 transition'
                >
                  {/* Order Header */}
                  <div
                    className='p-4 cursor-pointer hover:bg-gray-50 transition'
                    onClick={() => setSelectedOrder(
                      selectedOrder?._id === order._id ? null : order
                    )}
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                            {statusEmoji[order.status]} {order.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-500'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className='text-xs text-gray-400 truncate'>
                          ID: {order._id}
                        </p>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          {new Date(order.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className='text-right shrink-0 ml-2'>
                        <p className='font-black text-orange-500'>
                          ₦{order.totalAmount.toLocaleString()}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Item previews */}
                    <div className='flex gap-2 mt-3'>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.image}
                          alt={item.name}
                          className='w-12 h-12 object-cover rounded-lg border'
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className='w-12 h-12 rounded-lg border bg-gray-100 flex items-center justify-center'>
                          <p className='text-xs text-gray-500 font-bold'>+{order.items.length - 3}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?._id === order._id && (
                    <div className='border-t bg-gray-50 p-4'>

                      {/* Status Timeline */}
                      <div className='mb-4'>
                        <p className='text-xs font-bold text-gray-500 uppercase mb-3'>Order Progress</p>
                        <div className='flex items-center justify-between'>
                          {['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'].map((s, i, arr) => {
                            const currentIndex = arr.indexOf(order.status)
                            const stepIndex = i
                            const isCompleted = stepIndex <= currentIndex
                            const isCurrent = stepIndex === currentIndex
                            return (
                              <div key={s} className='flex flex-col items-center flex-1'>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                                  isCompleted
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'bg-white border-gray-200 text-gray-300'
                                } ${isCurrent ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}>
                                  {statusEmoji[s]}
                                </div>
                                <p className={`text-xs mt-1 text-center leading-tight ${
                                  isCompleted ? 'text-orange-500 font-semibold' : 'text-gray-300'
                                }`}>
                                  {s.replace('_', ' ')}
                                </p>
                                {i < arr.length - 1 && (
                                  <div className={`absolute h-0.5 w-full ${
                                    stepIndex < currentIndex ? 'bg-orange-500' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Items */}
                      <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Items</p>
                      <div className='flex flex-col gap-2 mb-4'>
                        {order.items.map((item, i) => (
                          <div key={i} className='flex items-center gap-3'>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='w-12 h-12 object-cover rounded-lg shrink-0'
                            />
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-bold truncate'>{item.name}</p>
                              <p className='text-xs text-gray-400'>
                                {item.color && `${item.color} • `}x{item.quantity}
                              </p>
                            </div>
                            <p className='text-sm font-bold text-orange-500 shrink-0'>
                              ₦{(item.amount * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Delivery Address</p>
                      <div className='bg-white rounded-xl p-3 border text-sm text-gray-600'>
                        <p className='font-bold text-gray-800'>{order.delivery.fullName}</p>
                        <p>{order.delivery.phone}</p>
                        <p>{order.delivery.address}, {order.delivery.city}, {order.delivery.state}</p>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OrderHistory
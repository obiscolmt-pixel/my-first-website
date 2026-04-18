import React, { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { getAllOrders, updateOrderStatus } from '../api/api.js'

const ADMIN_PASSWORD = 'obisco2025'

const statusOptions = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered']
const paymentOptions = ['unpaid', 'paid']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  shipped: 'bg-purple-100 text-purple-600',
  out_for_delivery: 'bg-orange-100 text-orange-600',
  delivered: 'bg-green-100 text-green-600',
}

const AdminDashboard = ({ adminOpen, setAdminOpen }) => {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      loadOrders()
    } else {
      alert('Wrong password!')
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  const handleUpdateStatus = async (orderId, status, paymentStatus) => {
    setUpdating(orderId)
    const res = await updateOrderStatus(orderId, { status, paymentStatus })
    if (res.order) {
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? res.order : o)
      )
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(res.order)
      }
    } else {
      alert('Failed to update order.')
    }
    setUpdating(null)
  }

  const handleClose = () => {
    setAdminOpen(false)
    setAuthenticated(false)
    setPassword('')
    setOrders([])
    setSelectedOrder(null)
  }

  if (!adminOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className='bg-black/60 fixed inset-0 z-40'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 sm:inset-4 md:inset-8 bg-white z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 sm:px-6 py-4 border-b bg-gray-950 shrink-0'>
          <div>
            <h2 className='text-xl font-black text-white'>
              ⚙️ Admin Dashboard
            </h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              OBISCO Gadgets — Order Management
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-white transition p-1'
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>

          {/* Password Gate */}
          {!authenticated ? (
            <div className='flex flex-col items-center justify-center h-full px-6 py-10'>
              <p className='text-4xl mb-4'>🔐</p>
              <h3 className='text-xl font-black text-gray-800 mb-1'>Admin Access</h3>
              <p className='text-gray-400 text-sm mb-6'>Enter your admin password to continue</p>
              <div className='w-full max-w-sm flex flex-col gap-3'>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder='Admin Password'
                  className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
                />
                <button
                  onClick={handleLogin}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm'
                >
                  Access Dashboard
                </button>
              </div>
            </div>

          ) : (
            <div className='p-4 sm:p-6'>

              {/* Stats */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'>
                {[
                  { label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-50 text-yellow-600' },
                  { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-50 text-green-600' },
                  { label: 'Unpaid', value: orders.filter(o => o.paymentStatus === 'unpaid').length, color: 'bg-red-50 text-red-600' },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
                    <p className='text-2xl font-black'>{stat.value}</p>
                    <p className='text-xs font-semibold mt-1'>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Refresh button */}
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-black text-gray-800'>All Orders</h3>
                <button
                  onClick={loadOrders}
                  className='text-orange-500 text-sm font-semibold hover:underline'
                >
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className='flex justify-center py-10'>
                  <div className='w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin' />
                </div>
              ) : orders.length === 0 ? (
                <div className='text-center py-10'>
                  <p className='text-4xl mb-3'>📭</p>
                  <p className='text-gray-500'>No orders yet</p>
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
                        className='flex justify-between items-start p-4 cursor-pointer hover:bg-gray-50'
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        <div>
                          <p className='font-bold text-sm text-gray-800'>
                            {order.delivery.fullName}
                          </p>
                          <p className='text-xs text-gray-400 mt-0.5'>
                            {order._id}
                          </p>
                          <p className='text-xs text-gray-400'>
                            {new Date(order.createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-black text-orange-500 text-sm'>
                            ₦{order.totalAmount.toLocaleString()}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <br />
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-500'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {selectedOrder?._id === order._id && (
                        <div className='border-t bg-gray-50 p-4'>

                          {/* Delivery info */}
                          <div className='mb-4'>
                            <p className='text-xs font-bold text-gray-500 uppercase mb-2'>
                              Delivery Details
                            </p>
                            <p className='text-sm text-gray-700'>{order.delivery.phone}</p>
                            <p className='text-sm text-gray-700'>
                              {order.delivery.address}, {order.delivery.city}, {order.delivery.state}
                            </p>
                          </div>

                          {/* Items */}
                          <div className='mb-4'>
                            <p className='text-xs font-bold text-gray-500 uppercase mb-2'>
                              Items
                            </p>
                            {order.items.map((item, i) => (
                              <div key={i} className='flex items-center gap-2 mb-2'>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className='w-10 h-10 object-cover rounded-lg'
                                />
                                <div className='flex-1'>
                                  <p className='text-xs font-bold'>{item.name}</p>
                                  <p className='text-xs text-gray-400'>x{item.quantity} — ₦{item.amount.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Update Status */}
                          <div className='flex flex-col sm:flex-row gap-3'>
                            <div className='flex-1'>
                              <p className='text-xs font-bold text-gray-500 uppercase mb-1'>
                                Update Status
                              </p>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value, order.paymentStatus)}
                                disabled={updating === order._id}
                                className='w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white'
                              >
                                {statusOptions.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <div className='flex-1'>
                              <p className='text-xs font-bold text-gray-500 uppercase mb-1'>
                                Payment Status
                              </p>
                              <select
                                value={order.paymentStatus}
                                onChange={(e) => handleUpdateStatus(order._id, order.status, e.target.value)}
                                disabled={updating === order._id}
                                className='w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white'
                              >
                                {paymentOptions.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {updating === order._id && (
                            <p className='text-xs text-orange-500 mt-2 text-center'>
                              Updating...
                            </p>
                          )}

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
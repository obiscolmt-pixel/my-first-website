import React, { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import { TbTruckDelivery } from 'react-icons/tb'
import { MdFavorite } from 'react-icons/md'
import { FaSignOutAlt, FaUser, FaLock, FaPhone, FaEnvelope } from 'react-icons/fa'
import { getUserOrders } from '../api/api.js'

const BASE_URL = 'https://obisco-gadgets-backend.onrender.com/api'

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

const ProfilePage = ({ profileOpen, setProfileOpen, wishlist = [] }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Edit profile
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')

  // Change password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (profileOpen) {
      const stored = JSON.parse(localStorage.getItem('user'))
      setUser(stored)
      setEditForm({ fullName: stored?.fullName || '', phone: stored?.phone || '' })
    }
  }, [profileOpen])

  useEffect(() => {
    if (profileOpen && activeTab === 'orders' && user) {
      loadOrders()
    }
  }, [activeTab, profileOpen, user])

  const loadOrders = async () => {
    if (!user) return
    setOrdersLoading(true)
    try {
      const data = await getUserOrders(user._id || user.id)
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) return alert('Name cannot be empty')
    setSavingProfile(true)
    setProfileSuccess('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editForm.fullName,
          phone: editForm.phone,
        }),
      })
      const data = await res.json()
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setEditing(false)
        setProfileSuccess('Profile updated successfully!')
        setTimeout(() => setProfileSuccess(''), 3000)
      } else {
        alert(data.message || 'Failed to update profile')
      }
    } catch (err) {
      alert('Connection error. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return setPasswordError('Please fill in all fields')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError('New passwords do not match')
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters')
    }
    setSavingPassword(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      const data = await res.json()
      if (data.message === 'Password changed successfully') {
        setPasswordSuccess('Password changed successfully! ✅')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPasswordSuccess(''), 3000)
      } else {
        setPasswordError(data.message || 'Failed to change password')
      }
    } catch (err) {
      setPasswordError('Connection error. Please try again.')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.reload()
  }

  const handleClose = () => {
    setProfileOpen(false)
    setActiveTab('profile')
    setEditing(false)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordError('')
    setPasswordSuccess('')
    setProfileSuccess('')
  }

  if (!profileOpen || !user) return null

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'orders', label: '📋 Orders' },
    { id: 'security', label: '🔑 Security' },
  ]

  return (
    <>
      <div className="bg-black/60 fixed inset-0 z-40" onClick={handleClose} />

      <div className="fixed top-0 right-0 w-full sm:w-[480px] h-screen bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-gray-950 px-5 py-4 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xl">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-white font-black text-lg leading-tight">{user.fullName}</h2>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition p-1">
              <AiOutlineClose size={22} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-orange-500 font-black text-xl">{orders.length}</p>
              <p className="text-gray-400 text-xs">Orders</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-orange-500 font-black text-xl">{wishlist.length}</p>
              <p className="text-gray-400 text-xs">Wishlist</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-orange-500 font-black text-xl">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-gray-400 text-xs">Delivered</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-500 hover:text-orange-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="p-5">

              {profileSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-green-600 text-sm font-semibold">
                  ✅ {profileSuccess}
                </div>
              )}

              {/* Profile Info Card */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-gray-800">Personal Info</h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 text-orange-500 text-sm font-semibold hover:underline"
                    >
                      <AiOutlineEdit size={16} /> Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                      <input
                        value={editForm.fullName}
                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                      <input
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                        type="tel"
                      />
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 rounded-full transition text-sm"
                      >
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => { setEditing(false); setEditForm({ fullName: user.fullName, phone: user.phone }) }}
                        className="px-5 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full transition text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <FaUser size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p className="font-bold text-gray-800 text-sm">{user.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <FaEnvelope size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email Address</p>
                        <p className="font-bold text-gray-800 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <FaPhone size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone Number</p>
                        <p className="font-bold text-gray-800 text-sm">{user.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-2xl border overflow-hidden mb-4">
                <h3 className="font-black text-gray-800 px-4 pt-4 pb-2">Quick Actions</h3>
                <div
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition border-t"
                >
                  <TbTruckDelivery size={20} className="text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">My Orders</p>
                    <p className="text-xs text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
                <div
                  onClick={() => setActiveTab('security')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition border-t"
                >
                  <FaLock size={16} className="text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Change Password</p>
                    <p className="text-xs text-gray-400">Update your security</p>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition border-t">
                  <MdFavorite size={20} className="text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Wishlist</p>
                    <p className="text-xs text-gray-400">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold py-3 rounded-full transition text-sm border border-red-200"
              >
                <FaSignOutAlt size={14} /> Sign Out
              </button>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div className="p-4">
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-gray-500 text-lg font-semibold">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your orders will appear here after you shop!</p>
                  <button
                    onClick={handleClose}
                    className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition text-sm font-semibold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map(order => (
                    <div key={order._id} className="border rounded-xl overflow-hidden hover:border-orange-200 transition">
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                                {statusEmoji[order.status]} {order.status.replace('_', ' ')}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">ID: {order._id}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="font-black text-orange-500">₦{order.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border" />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-lg border bg-gray-100 flex items-center justify-center">
                              <p className="text-xs text-gray-500 font-bold">+{order.items.length - 3}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedOrder?._id === order._id && (
                        <div className="border-t bg-gray-50 p-4">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Items</p>
                          <div className="flex flex-col gap-2 mb-4">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.color && `${item.color} • `}x{item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-orange-500 shrink-0">₦{(item.amount * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Address</p>
                          <div className="bg-white rounded-xl p-3 border text-sm text-gray-600">
                            <p className="font-bold text-gray-800">{order.delivery.fullName}</p>
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
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div className="p-5">
              <div className="bg-gray-50 rounded-2xl p-4 border">
                <h3 className="font-black text-gray-800 mb-4">🔑 Change Password</h3>

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-green-600 text-sm font-semibold">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-red-500 text-sm font-semibold">
                    ❌ {passwordError}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  {passwordForm.confirmPassword && (
                    <p className={`text-xs ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordForm.newPassword === passwordForm.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                    </p>
                  )}
                  <button
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2 mt-1"
                  >
                    {savingPassword ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing...</>
                    ) : '🔑 Change Password'}
                  </button>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-4">
                <p className="font-bold text-blue-700 text-sm mb-2">🛡️ Account Security</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600">Email verified</p>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">✅ Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600">Google account</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.isGoogleUser ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {user.isGoogleUser ? '✅ Linked' : 'Not linked'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePage
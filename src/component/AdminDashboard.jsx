import React, { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { getAllOrders, updateOrderStatus, fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/api.js'

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

const emptyForm = {
  name: '', category: '', price: '$', amount: '', image: '', description: ''
}

const AdminDashboard = ({ adminOpen, setAdminOpen }) => {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Products state
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(emptyForm)
  const [savingProduct, setSavingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [productSearch, setProductSearch] = useState('')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      loadOrders()
    } else {
      alert('Wrong password!')
    }
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    const data = await getAllOrders()
    setOrders(data)
    setOrdersLoading(false)
  }

  const loadProducts = async () => {
    setProductsLoading(true)
    const data = await fetchProducts()
    setProducts(data)
    setProductsLoading(false)
  }

  useEffect(() => {
    if (authenticated && activeTab === 'products') {
      loadProducts()
    }
    if (authenticated && activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab, authenticated])

  const handleUpdateStatus = async (orderId, status, paymentStatus) => {
    setUpdating(orderId)
    const res = await updateOrderStatus(orderId, { status, paymentStatus })
    if (res.order) {
      setOrders((prev) => prev.map((o) => o._id === orderId ? res.order : o))
      if (selectedOrder?._id === orderId) setSelectedOrder(res.order)
    } else {
      alert('Failed to update order.')
    }
    setUpdating(null)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      amount: product.amount,
      image: product.image,
      description: product.description || '',
    })
    setShowProductForm(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.category || !productForm.amount || !productForm.image) {
      alert('Please fill in Name, Category, Price and Image.')
      return
    }
    setSavingProduct(true)
    if (editingProduct) {
      const res = await updateProduct(editingProduct._id, {
        ...productForm,
        amount: Number(productForm.amount),
      })
      if (res.product) {
        setProducts((prev) => prev.map((p) => p._id === editingProduct._id ? res.product : p))
        resetForm()
      } else {
        alert('Failed to update product.')
      }
    } else {
      const res = await createProduct({
        ...productForm,
        amount: Number(productForm.amount),
      })
      if (res.message) {
        await loadProducts()
        resetForm()
      } else {
        alert('Failed to create product.')
      }
    }
    setSavingProduct(false)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setDeletingProduct(id)
    const res = await deleteProduct(id)
    if (res.message) {
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } else {
      alert('Failed to delete product.')
    }
    setDeletingProduct(null)
  }

  const resetForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    setProductForm(emptyForm)
  }

  const handleClose = () => {
    setAdminOpen(false)
    setAuthenticated(false)
    setPassword('')
    setOrders([])
    setSelectedOrder(null)
    resetForm()
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  if (!adminOpen) return null

  return (
    <>
      <div className='bg-black/60 fixed inset-0 z-40' onClick={handleClose} />

      <div className='fixed inset-0 sm:inset-4 md:inset-8 bg-white z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 sm:px-6 py-4 border-b bg-gray-950 shrink-0'>
          <div>
            <h2 className='text-xl font-black text-white'>⚙️ Admin Dashboard</h2>
            <p className='text-xs text-gray-400 mt-0.5'>OBISCO Store — Management</p>
          </div>
          <button onClick={handleClose} className='text-gray-400 hover:text-white transition p-1'>
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
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
            <div className='flex flex-col h-full'>

              {/* Tabs */}
              <div className='flex border-b px-4 shrink-0'>
                {['orders', 'products'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-bold capitalize border-b-2 transition ${
                      activeTab === tab
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500 hover:text-orange-400'
                    }`}
                  >
                    {tab === 'orders' ? '📦 Orders' : '🛍️ Products'}
                  </button>
                ))}
              </div>

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className='p-4 sm:p-6'>
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

                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-black text-gray-800'>All Orders</h3>
                    <button onClick={loadOrders} className='text-orange-500 text-sm font-semibold hover:underline'>
                      🔄 Refresh
                    </button>
                  </div>

                  {ordersLoading ? (
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
                        <div key={order._id} className='border rounded-xl overflow-hidden hover:border-orange-200 transition'>
                          <div
                            className='flex justify-between items-start p-4 cursor-pointer hover:bg-gray-50'
                            onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                          >
                            <div>
                              <p className='font-bold text-sm text-gray-800'>{order.delivery.fullName}</p>
                              <p className='text-xs text-gray-400 mt-0.5'>{order._id}</p>
                              <p className='text-xs text-gray-400'>
                                {new Date(order.createdAt).toLocaleDateString('en-NG', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className='text-right'>
                              <p className='font-black text-orange-500 text-sm'>₦{order.totalAmount.toLocaleString()}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                              <br />
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${
                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          {selectedOrder?._id === order._id && (
                            <div className='border-t bg-gray-50 p-4'>
                              <div className='mb-4'>
                                <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Delivery Details</p>
                                <p className='text-sm text-gray-700'>{order.delivery.phone}</p>
                                <p className='text-sm text-gray-700'>
                                  {order.delivery.address}, {order.delivery.city}, {order.delivery.state}
                                </p>
                              </div>
                              <div className='mb-4'>
                                <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Items</p>
                                {order.items.map((item, i) => (
                                  <div key={i} className='flex items-center gap-2 mb-2'>
                                    <img src={item.image} alt={item.name} className='w-10 h-10 object-cover rounded-lg' />
                                    <div className='flex-1'>
                                      <p className='text-xs font-bold'>{item.name}</p>
                                      <p className='text-xs text-gray-400'>x{item.quantity} — ₦{item.amount.toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className='flex flex-col sm:flex-row gap-3'>
                                <div className='flex-1'>
                                  <p className='text-xs font-bold text-gray-500 uppercase mb-1'>Update Status</p>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value, order.paymentStatus)}
                                    disabled={updating === order._id}
                                    className='w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white'
                                  >
                                    {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                                  </select>
                                </div>
                                <div className='flex-1'>
                                  <p className='text-xs font-bold text-gray-500 uppercase mb-1'>Payment Status</p>
                                  <select
                                    value={order.paymentStatus}
                                    onChange={(e) => handleUpdateStatus(order._id, order.status, e.target.value)}
                                    disabled={updating === order._id}
                                    className='w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white'
                                  >
                                    {paymentOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                                  </select>
                                </div>
                              </div>
                              {updating === order._id && (
                                <p className='text-xs text-orange-500 mt-2 text-center'>Updating...</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className='p-4 sm:p-6'>

                  {/* Product Form */}
                  {showProductForm && (
                    <div className='bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6'>
                      <h3 className='font-black text-gray-800 mb-4'>
                        {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                      </h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input
                          placeholder='Product Name'
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white'
                        />
                        <input
                          placeholder='Category (e.g. phones, laptops)'
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white'
                        />
                        <input
                          placeholder='Amount in Naira (e.g. 150000)'
                          type='number'
                          value={productForm.amount}
                          onChange={(e) => setProductForm({ ...productForm, amount: e.target.value })}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white'
                        />
                        <select
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white'
                        >
                          <option value='$'>$ — Under ₦50k</option>
                          <option value='$$'>$$ — ₦50k-₦150k</option>
                          <option value='$$$'>$$$ — ₦150k-₦500k</option>
                          <option value='$$$$'>$$$$ — ₦500k+</option>
                        </select>
                        <input
                          placeholder='Image URL (Cloudinary or Unsplash)'
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white sm:col-span-2'
                        />
                        <textarea
                          placeholder='Description (optional)'
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={2}
                          className='border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white sm:col-span-2 resize-none'
                        />
                      </div>

                      {/* Image Preview */}
                      {productForm.image && (
                        <div className='mt-3 flex items-center gap-3'>
                          <img
                            src={productForm.image}
                            alt='preview'
                            className='w-16 h-16 object-contain rounded-xl border bg-gray-50'
                          />
                          <p className='text-xs text-gray-400'>Image preview</p>
                        </div>
                      )}

                      <div className='flex gap-3 mt-4'>
                        <button
                          onClick={handleSaveProduct}
                          disabled={savingProduct}
                          className='flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 rounded-full transition text-sm flex items-center justify-center gap-2'
                        >
                          {savingProduct ? (
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          ) : (
                            editingProduct ? 'Save Changes' : 'Add Product'
                          )}
                        </button>
                        <button
                          onClick={resetForm}
                          className='px-6 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full transition text-sm hover:bg-gray-50'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className='flex justify-between items-center mb-4 flex-wrap gap-3'>
                    <div>
                      <h3 className='font-black text-gray-800'>All Products</h3>
                      <p className='text-xs text-gray-400'>{products.length} products in database</p>
                    </div>
                    <div className='flex gap-2'>
                      <button onClick={loadProducts} className='text-orange-500 text-sm font-semibold hover:underline'>
                        🔄 Refresh
                      </button>
                      {!showProductForm && (
                        <button
                          onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(emptyForm) }}
                          className='flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full transition'
                        >
                          <AiOutlinePlus size={16} />
                          Add Product
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <input
                    placeholder='Search products...'
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className='w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 mb-4'
                  />

                  {productsLoading ? (
                    <div className='flex justify-center py-10'>
                      <div className='w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin' />
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                      {filteredProducts.map((product) => (
                        <div key={product._id} className='border rounded-xl overflow-hidden bg-white hover:border-orange-200 transition'>
                          <div className='h-[120px] bg-gray-50 flex items-center justify-center overflow-hidden'>
                            <img
                              src={product.image}
                              alt={product.name}
                              className='w-full h-full object-contain p-2'
                            />
                          </div>
                          <div className='p-2'>
                            <p className='font-bold text-xs text-gray-800 truncate'>{product.name}</p>
                            <p className='text-orange-500 font-black text-xs mt-0.5'>₦{product.amount?.toLocaleString()}</p>
                            <p className='text-gray-400 text-xs capitalize mt-0.5'>{product.category}</p>
                            <div className='flex gap-1 mt-2'>
                              <button
                                onClick={() => handleEditProduct(product)}
                                className='flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-1.5 rounded-full transition'
                              >
                                <AiOutlineEdit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                disabled={deletingProduct === product._id}
                                className='flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded-full transition'
                              >
                                {deletingProduct === product._id ? (
                                  <div className='w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin' />
                                ) : (
                                  <><AiOutlineDelete size={12} /> Delete</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
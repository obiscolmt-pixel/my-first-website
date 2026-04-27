const BASE_URL = 'https://obisco-gadgets-backend.onrender.com/api'

// ─── AUTH ───────────────────────────────────────────
export const registerUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  return res.json()
}

export const loginUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  return res.json()
}

// ─── PRODUCTS ───────────────────────────────────────
export const fetchProducts = async (department = '') => {
  const url = department
    ? `${BASE_URL}/products?department=${department}`
    : `${BASE_URL}/products`
  const res = await fetch(url)
  return res.json()
}

// ─── ORDERS ─────────────────────────────────────────
export const placeOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })
  return res.json()
}

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export const resetPassword = async (email, code, password) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password }),
  })
  return res.json()
}

// Track order by ID
export const trackOrder = async (orderId) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`)
  return res.json()
}

// Update order status (admin)
export const updateOrderStatus = async (orderId, data) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Get all orders (admin)
export const getAllOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`)
  return res.json()
}

// ─── REVIEWS ─────────────────────────────────────────
export const getReviews = async (productId) => {
  const res = await fetch(`${BASE_URL}/reviews/${productId}`)
  return res.json()
}

export const addReview = async (productId, reviewData) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}/reviews/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  })
  return res.json()
}

// ─── PROMO ─────────────────────────────────────────
export const validatePromo = async (code, orderTotal) => {
  const res = await fetch(`${BASE_URL}/promo/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderTotal }),
  })
  return res.json()
}

export const usePromo = async (code) => {
  const res = await fetch(`${BASE_URL}/promo/use`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  return res.json()
}

// Get orders by user
export const getUserOrders = async (userId) => {
  const res = await fetch(`${BASE_URL}/orders/user/${userId}`)
  return res.json()
}

// Google Sign In
export const googleSignIn = async (token) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    return { message: 'Connection timeout. Please try again.' }
  }
}

// ─── PRODUCT MANAGEMENT (Admin) ─────────────────────
export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([productData]),
  })
  return res.json()
}

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })
  return res.json()
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

export const getPromoCodes = async () => {
  const res = await fetch(`${BASE_URL}/promo`)
  return res.json()
}

export const createPromoCode = async (data) => {
  const res = await fetch(`${BASE_URL}/promo/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deletePromoCode = async (id) => {
  const res = await fetch(`${BASE_URL}/promo/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

export const sendBroadcast = async (data) => {
  const res = await fetch(`${BASE_URL}/broadcast/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/auth/users`)
  return res.json()
}
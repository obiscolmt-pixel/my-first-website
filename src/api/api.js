const BASE_URL = 'http://localhost:5000/api'

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
export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`)
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
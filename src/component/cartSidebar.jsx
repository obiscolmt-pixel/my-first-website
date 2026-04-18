import React, { useState } from 'react'
import { BsFillCartFill } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import { placeOrder } from '../api/api.js'

const CartSidebar = ({ cartOpen, setCartOpen, cartItems, removeFromCart, increaseQty, decreaseQty, setCartItems }) => {
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [totalAmountSnapshot, setTotalAmountSnapshot] = useState(0)

  const totalAmount = cartItems.reduce((acc, i) => acc + i.amount * i.quantity, 0)
  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state) {
      alert('Please fill in all delivery details before placing your order.')
      return
    }

    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const snapshot = totalAmount
      const res = await placeOrder({
        userId: user?._id || null,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          image: item.image,
          amount: item.amount,
          quantity: item.quantity,
          color: item.color || 'Default',
          category: item.category,
        })),
        totalAmount: snapshot,
        delivery: form,
      })

      if (res.orderId) {
        setTotalAmountSnapshot(snapshot)
        setOrderId(res.orderId)
        setOrderPlaced(true)
        setCartItems([])
      } else {
        alert(res.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      alert('Failed to place order. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCartOpen(false)
    setCheckout(false)
    setOrderPlaced(false)
    setOrderId(null)
    setForm({ fullName: '', phone: '', address: '', city: '', state: '' })
  }

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className='bg-black/60 fixed w-full h-screen z-20 top-0 left-0'
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div className={cartOpen
        ? 'fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-white z-30 duration-300 flex flex-col'
        : 'fixed top-0 right-[-100%] w-full sm:w-[420px] h-screen bg-white z-30 duration-300 flex flex-col'
      }>

        {/* Header */}
        <div className='flex justify-between items-center px-4 sm:px-6 py-4 border-b shrink-0'>
          <h2 className='text-xl sm:text-2xl font-bold'>
            {orderPlaced ? '✅ Order Placed' : checkout ? '📦 Checkout' : 'My Cart'}
            {!checkout && !orderPlaced && (
              <span className='text-orange-500 ml-1 text-lg sm:text-xl'>({totalItems})</span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-black transition p-1'
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4'>

          {/* Order Success */}
          {orderPlaced ? (
            <div className='flex flex-col items-center justify-center h-full text-center px-2'>
              <p className='text-5xl sm:text-6xl mb-4'>🎉</p>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                Order Confirmed!
              </h3>
              <p className='text-gray-500 text-sm mb-1'>
                Thank you, <span className='font-bold text-orange-500'>{form.fullName}</span>!
              </p>
              <p className='text-gray-500 text-xs sm:text-sm mb-2'>
                Delivering to{' '}
                <span className='font-bold'>{form.address}, {form.city}, {form.state}</span>
              </p>
              {orderId && (
                <p className='text-xs text-gray-400 mb-6'>
                  Order ID: <span className='font-bold text-gray-600'>{orderId}</span>
                </p>
              )}

              {/* Payment reminder */}
              <div className='bg-orange-50 border border-orange-200 rounded-xl p-4 w-full text-left mb-3'>
                <p className='text-sm font-bold text-orange-600 mb-2'>
                  💳 Complete Your Payment
                </p>
                <p className='text-xs text-orange-600 mb-3'>
                  Transfer{' '}
                  <span className='font-black text-orange-500'>
                    ₦{totalAmountSnapshot.toLocaleString()}
                  </span>{' '}
                  to any of the accounts below:
                </p>

                {/* Fidelity */}
                <div className='bg-white rounded-lg p-3 mb-2 border border-orange-100'>
                  <p className='text-xs font-bold text-orange-500 uppercase'>Fidelity Bank</p>
                  <p className='text-lg sm:text-xl font-black tracking-widest text-gray-800'>
                    6315564573
                  </p>
                  <p className='text-xs text-gray-500'>Ariogba Patrick Obinna</p>
                </div>

                {/* OPay */}
                <div className='bg-white rounded-lg p-3 border border-green-100'>
                  <p className='text-xs font-bold text-green-500 uppercase'>OPay</p>
                  <p className='text-lg sm:text-xl font-black tracking-widest text-gray-800'>
                    9049863067
                  </p>
                  <p className='text-xs text-gray-500'>Ariogba Patrick Obinna</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className='mt-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition w-full text-sm sm:text-base'
              >
                Continue Shopping
              </button>
            </div>

          ) : checkout ? (
            /* Checkout Form */
            <div className='flex flex-col gap-4'>

              {/* Order Summary */}
              <div className='bg-gray-50 rounded-xl p-3 sm:p-4 border'>
                <p className='font-bold text-sm text-gray-700 mb-2'>🧾 Order Summary</p>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className='flex justify-between text-xs sm:text-sm py-1.5 border-b last:border-0'
                  >
                    <span className='text-gray-600 pr-2 truncate'>
                      {item.name} x{item.quantity}
                      {item.color && (
                        <span className='text-gray-400 ml-1'>({item.color})</span>
                      )}
                    </span>
                    <span className='font-bold text-orange-500 shrink-0'>
                      ₦{(item.amount * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className='flex justify-between mt-3 font-bold'>
                  <span className='text-sm'>Total</span>
                  <span className='text-orange-500 text-base sm:text-lg'>
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className='font-bold text-gray-700 mb-3 text-sm sm:text-base'>
                  📍 Delivery Address
                </p>
                <div className='flex flex-col gap-2 sm:gap-3'>
                  <input
                    name='fullName'
                    value={form.fullName}
                    onChange={handleFormChange}
                    placeholder='Full Name'
                    className='border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                  <input
                    name='phone'
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder='Phone Number'
                    className='border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                  <textarea
                    name='address'
                    value={form.address}
                    onChange={handleFormChange}
                    placeholder='Street Address'
                    rows={2}
                    className='border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full resize-none'
                  />
                  <div className='flex gap-2'>
                    <input
                      name='city'
                      value={form.city}
                      onChange={handleFormChange}
                      placeholder='City'
                      className='border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full'
                    />
                    <input
                      name='state'
                      value={form.state}
                      onChange={handleFormChange}
                      placeholder='State'
                      className='border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full'
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <p className='font-bold text-gray-700 mb-3 text-sm sm:text-base'>
                  💳 Payment Details
                </p>

                {/* Fidelity Bank */}
                <div className='bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 mb-3'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='text-xs font-bold text-orange-600 uppercase tracking-wide'>
                      Fidelity Bank
                    </p>
                    <span className='text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full'>
                      Option 1
                    </span>
                  </div>
                  <p className='text-xl sm:text-2xl font-black text-gray-800 tracking-widest my-1'>
                    6315564573
                  </p>
                  <p className='text-xs sm:text-sm text-gray-600'>Ariogba Patrick Obinna</p>
                </div>

                {/* OPay */}
                <div className='bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-3'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='text-xs font-bold text-green-600 uppercase tracking-wide'>
                      OPay
                    </p>
                    <span className='text-xs bg-green-500 text-white px-2 py-0.5 rounded-full'>
                      Option 2
                    </span>
                  </div>
                  <p className='text-xl sm:text-2xl font-black text-gray-800 tracking-widest my-1'>
                    9049863067
                  </p>
                  <p className='text-xs sm:text-sm text-gray-600'>Ariogba Patrick Obinna</p>
                </div>

                {/* Payment Notice */}
                <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-3'>
                  <p className='text-xs text-yellow-700 font-semibold'>💡 Payment Notice</p>
                  <p className='text-xs text-yellow-600 mt-1'>
                    Transfer{' '}
                    <span className='font-bold'>₦{totalAmount.toLocaleString()}</span>{' '}
                    to any account above. Order confirmed after payment verification.
                  </p>
                </div>
              </div>

            </div>

          ) : (
            /* Cart Items */
            <>
              {cartItems.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center py-10'>
                  <BsFillCartFill size={50} className='text-gray-200 mb-4' />
                  <p className='text-gray-500 text-base sm:text-lg font-semibold'>
                    Your cart is empty
                  </p>
                  <p className='text-gray-400 text-xs sm:text-sm mt-1'>
                    Add some gadgets to get started!
                  </p>
                  <button
                    onClick={handleClose}
                    className='mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition text-sm font-semibold'
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className='flex flex-col gap-3'>
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className='flex items-center gap-3 border rounded-xl p-2.5 sm:p-3 shadow-sm'
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0'
                      />

                      {/* Info */}
                      <div className='flex-1 min-w-0'>
                        <p className='font-bold text-xs sm:text-sm truncate'>{item.name}</p>
                        <p className='text-orange-500 text-xs capitalize'>{item.category}</p>
                        {item.color && (
                          <p className='text-gray-400 text-xs'>{item.color}</p>
                        )}
                        <p className='text-orange-600 font-bold text-xs sm:text-sm mt-0.5'>
                          ₦{item.amount.toLocaleString()}
                        </p>

                        {/* Quantity controls */}
                        <div className='flex items-center gap-2 mt-1.5'>
                          <button
                            onClick={() => decreaseQty(item._id)}
                            className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold hover:bg-gray-100 transition'
                          >
                            −
                          </button>
                          <span className='font-bold text-xs sm:text-sm w-4 text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item._id)}
                            className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold hover:bg-gray-100 transition'
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className='flex flex-col items-end gap-2 shrink-0'>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className='text-gray-400 hover:text-red-500 transition text-lg'
                        >
                          🗑
                        </button>
                        <p className='text-xs font-bold text-gray-700'>
                          ₦{(item.amount * item.quantity).toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className='px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 shrink-0'>
            {!checkout && (
              <>
                <div className='flex justify-between items-center mb-1'>
                  <p className='text-gray-500 text-xs sm:text-sm'>
                    Total Items:{' '}
                    <span className='font-bold text-black'>{totalItems}</span>
                  </p>
                  <button
                    onClick={() => setCartItems([])}
                    className='text-red-400 hover:text-red-600 text-xs sm:text-sm underline transition'
                  >
                    Clear All
                  </button>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <p className='text-gray-500 text-xs sm:text-sm'>Total Amount:</p>
                  <p className='text-orange-500 font-bold text-lg sm:text-xl'>
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
              </>
            )}

            <div className='flex gap-2 sm:gap-3'>
              {checkout && (
                <button
                  onClick={() => setCheckout(false)}
                  disabled={loading}
                  className='w-full border border-orange-500 text-orange-500 font-bold py-2.5 sm:py-3 rounded-full transition hover:bg-orange-50 text-sm disabled:opacity-50'
                >
                  ← Back
                </button>
              )}
              <button
                onClick={checkout ? handlePlaceOrder : () => setCheckout(true)}
                disabled={loading}
                className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 sm:py-3 rounded-full transition text-sm sm:text-base flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Placing Order...
                  </>
                ) : (
                  checkout ? 'Place Order 🎉' : 'Checkout →'
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default CartSidebar
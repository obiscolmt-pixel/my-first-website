import React, { useState } from 'react'
import { BsFillCartFill } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'

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

  const totalAmount = cartItems.reduce((acc, i) => acc + i.amount * i.quantity, 0)
  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = () => {
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state) {
      alert('Please fill in all delivery details before placing your order.')
      return
    }
    setOrderPlaced(true)
    setCartItems([])
  }

  const handleClose = () => {
    setCartOpen(false)
    setCheckout(false)
    setOrderPlaced(false)
    setForm({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
    })
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
        ? 'fixed top-0 right-0 w-full sm:w-[450px] h-screen bg-white z-30 duration-300 flex flex-col'
        : 'fixed top-0 right-[-100%] w-full sm:w-[450px] h-screen bg-white z-30 duration-300 flex flex-col'
      }>

        {/* Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b'>
          <h2 className='text-2xl font-bold'>
            {orderPlaced ? '✅ Order Placed' : checkout ? '📦 Checkout' : 'My Cart'}
            {!checkout && !orderPlaced && (
              <span className='text-orange-500 ml-1'>({totalItems})</span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-black text-2xl font-bold'
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-6 py-4'>

          {/* Order Success Screen */}
          {orderPlaced ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <p className='text-6xl mb-4'>🎉</p>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>Order Confirmed!</h3>
              <p className='text-gray-500 text-sm mb-1'>
                Thank you, <span className='font-bold text-orange-500'>{form.fullName}</span>!
              </p>
              <p className='text-gray-500 text-sm mb-6'>
                Your order will be delivered to{' '}
                <span className='font-bold'>{form.address}, {form.city}, {form.state}</span>
              </p>

              {/* Payment reminder */}
              <div className='bg-orange-50 border border-orange-200 rounded-xl p-4 w-full text-left mb-3'>
                <p className='text-sm font-bold text-orange-600 mb-2'>💳 Complete Your Payment</p>
                <p className='text-xs text-orange-600 mb-3'>
                  Transfer <span className='font-black text-orange-500'>₦{totalAmount.toLocaleString()}</span> to any of the accounts below:
                </p>

                {/* Fidelity */}
                <div className='bg-white rounded-lg p-3 mb-2 border border-orange-100'>
                  <p className='text-xs font-bold text-orange-500 uppercase'>Fidelity Bank</p>
                  <p className='text-xl font-black tracking-widest text-gray-800'>6315564573</p>
                  <p className='text-xs text-gray-500'>Ariogba Patrick Obinna</p>
                </div>

                {/* OPay */}
                <div className='bg-white rounded-lg p-3 border border-green-100'>
                  <p className='text-xs font-bold text-green-500 uppercase'>OPay</p>
                  <p className='text-xl font-black tracking-widest text-gray-800'>9049863067</p>
                  <p className='text-xs text-gray-500'>Ariogba Patrick Obinna</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className='mt-4 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition w-full'
              >
                Continue Shopping
              </button>
            </div>

          ) : checkout ? (
            /* Checkout Form */
            <div className='flex flex-col gap-4'>

              {/* Order Summary */}
              <div className='bg-gray-50 rounded-xl p-4 border'>
                <p className='font-bold text-sm text-gray-700 mb-2'>🧾 Order Summary</p>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex justify-between text-sm py-1 border-b last:border-0'>
                    <span className='text-gray-600'>{item.name} x{item.quantity}</span>
                    <span className='font-bold text-orange-500'>
                      ₦{(item.amount * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className='flex justify-between mt-3 font-bold'>
                  <span>Total</span>
                  <span className='text-orange-500 text-lg'>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className='font-bold text-gray-700 mb-3'>📍 Delivery Address</p>
                <div className='flex flex-col gap-3'>
                  <input
                    name='fullName'
                    value={form.fullName}
                    onChange={handleFormChange}
                    placeholder='Full Name'
                    className='border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                  <input
                    name='phone'
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder='Phone Number'
                    className='border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                  <textarea
                    name='address'
                    value={form.address}
                    onChange={handleFormChange}
                    placeholder='Street Address'
                    rows={2}
                    className='border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-full resize-none'
                  />
                  <div className='flex gap-2'>
                    <input
                      name='city'
                      value={form.city}
                      onChange={handleFormChange}
                      placeholder='City'
                      className='border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-full'
                    />
                    <input
                      name='state'
                      value={form.state}
                      onChange={handleFormChange}
                      placeholder='State'
                      className='border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-full'
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <p className='font-bold text-gray-700 mb-3'>💳 Payment Details</p>

                {/* Fidelity Bank */}
                <div className='bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='text-xs font-bold text-orange-600 uppercase tracking-wide'>
                      Fidelity Bank
                    </p>
                    <span className='text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full'>
                      Option 1
                    </span>
                  </div>
                  <p className='text-2xl font-black text-gray-800 tracking-widest my-1'>
                    6315564573
                  </p>
                  <p className='text-sm text-gray-600'>Ariogba Patrick Obinna</p>
                </div>

                {/* OPay */}
                <div className='bg-green-50 border border-green-200 rounded-xl p-4 mb-3'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='text-xs font-bold text-green-600 uppercase tracking-wide'>
                      OPay
                    </p>
                    <span className='text-xs bg-green-500 text-white px-2 py-0.5 rounded-full'>
                      Option 2
                    </span>
                  </div>
                  <p className='text-2xl font-black text-gray-800 tracking-widest my-1'>
                    9049863067
                  </p>
                  <p className='text-sm text-gray-600'>Ariogba Patrick Obinna</p>
                </div>

                {/* Payment Notice */}
                <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-3'>
                  <p className='text-xs text-yellow-700 font-semibold'>💡 Payment Notice</p>
                  <p className='text-xs text-yellow-600 mt-1'>
                    Please transfer{' '}
                    <span className='font-bold'>₦{totalAmount.toLocaleString()}</span>{' '}
                    to any of the accounts above. Your order will be confirmed once payment is verified.
                  </p>
                </div>
              </div>

            </div>

          ) : (
            /* Cart Items */
            <>
              {cartItems.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center'>
                  <BsFillCartFill size={60} className='text-gray-200 mb-4' />
                  <p className='text-gray-500 text-lg font-semibold'>Your cart is empty</p>
                  <p className='text-gray-400 text-sm mt-1'>Add some gadgets to get started!</p>
                  <button
                    onClick={handleClose}
                    className='mt-6 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition'
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-4 border rounded-xl p-3 shadow-sm'
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-20 h-20 object-cover rounded-lg'
                      />
                      <div className='flex-1'>
                        <p className='font-bold text-sm'>{item.name}</p>
                        <p className='text-orange-500 text-xs capitalize'>{item.category}</p>
                        <p className='text-orange-600 font-bold text-sm mt-1'>
                          ₦{item.amount.toLocaleString()}
                        </p>
                        <div className='flex items-center gap-2 mt-2'>
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className='w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition'
                          >
                            −
                          </button>
                          <span className='font-bold text-sm w-4 text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className='w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition'
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-2'>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className='text-gray-400 hover:text-red-500 transition text-xl'
                        >
                          🗑
                        </button>
                        <p className='text-xs font-bold text-gray-600'>
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
          <div className='px-6 py-4 border-t bg-gray-50'>
            {!checkout && (
              <>
                <div className='flex justify-between items-center mb-1'>
                  <p className='text-gray-500 text-sm'>
                    Total Items:{' '}
                    <span className='font-bold text-black'>{totalItems}</span>
                  </p>
                  <button
                    onClick={() => setCartItems([])}
                    className='text-red-400 hover:text-red-600 text-sm underline transition'
                  >
                    Clear All
                  </button>
                </div>
                <div className='flex justify-between items-center mb-4'>
                  <p className='text-gray-500 text-sm'>Total Amount:</p>
                  <p className='text-orange-500 font-bold text-xl'>
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
              </>
            )}

            <div className='flex gap-3'>
              {checkout && (
                <button
                  onClick={() => setCheckout(false)}
                  className='w-full border border-orange-500 text-orange-500 font-bold py-3 rounded-full transition hover:bg-orange-50'
                >
                  ← Back
                </button>
              )}
              <button
                onClick={checkout ? handlePlaceOrder : () => setCheckout(true)}
                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-lg'
              >
                {checkout ? 'Place Order 🎉' : 'Checkout →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default CartSidebar
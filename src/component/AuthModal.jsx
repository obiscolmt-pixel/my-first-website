import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'

const AuthModal = ({ authOpen, setAuthOpen }) => {
  const [isSignIn, setIsSignIn] = useState(true)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (isSignIn) {
      if (!form.email || !form.password) {
        alert('Please fill in all fields.')
        return
      }
      setSuccess(true)
    } else {
      if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
        alert('Please fill in all fields.')
        return
      }
      if (form.password !== form.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      setSuccess(true)
    }
  }

  const handleClose = () => {
    setAuthOpen(false)
    setSuccess(false)
    setForm({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <>
      {/* Overlay */}
      {authOpen && (
        <div
          className='bg-black/60 fixed w-full h-screen z-20 top-0 left-0'
          onClick={handleClose}
        />
      )}

      {/* Modal */}
      <div className={authOpen
        ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-30 rounded-2xl shadow-2xl duration-300 p-6'
        : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-30 rounded-2xl shadow-2xl duration-300 p-6 opacity-0 pointer-events-none'
      }>

        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-black text-gray-800'>
            {success ? '🎉 Welcome!' : isSignIn ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={handleClose} className='text-gray-400 hover:text-black transition'>
            <AiOutlineClose size={24} />
          </button>
        </div>

        {success ? (
          /* Success Screen */
          <div className='text-center py-6'>
            <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FaUser size={30} className='text-orange-500' />
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>
              {isSignIn ? 'Welcome Back!' : 'Account Created!'}
            </h3>
            <p className='text-gray-500 text-sm mb-6'>
              {isSignIn
                ? `You are now signed in as ${form.email}`
                : `Welcome to OBISCO Gadgets, ${form.fullName}!`
              }
            </p>
            <button
              onClick={handleClose}
              className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition'
            >
              Continue Shopping
            </button>
          </div>

        ) : (
          <>
            {/* Toggle Tabs */}
            <div className='flex bg-gray-100 rounded-full p-1 mb-6'>
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                  isSignIn ? 'bg-orange-500 text-white shadow' : 'text-gray-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                  !isSignIn ? 'bg-orange-500 text-white shadow' : 'text-gray-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className='flex flex-col gap-3'>

              {/* Sign Up only fields */}
              {!isSignIn && (
                <>
                  <input
                    name='fullName'
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder='Full Name'
                    className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                  <input
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    placeholder='Phone Number'
                    className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
                  />
                </>
              )}

              {/* Common fields */}
              <input
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='Email Address'
                type='email'
                className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
              />
              <input
                name='password'
                value={form.password}
                onChange={handleChange}
                placeholder='Password'
                type='password'
                className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
              />

              {/* Sign Up only */}
              {!isSignIn && (
                <input
                  name='confirmPassword'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  type='password'
                  className='border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full'
                />
              )}

              {/* Forgot Password */}
              {isSignIn && (
                <p className='text-right text-xs text-orange-500 hover:underline cursor-pointer'>
                  Forgot Password?
                </p>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm mt-2'
              >
                {isSignIn ? 'Sign In' : 'Create Account'}
              </button>

              {/* Switch */}
              <p className='text-center text-xs text-gray-500 mt-2'>
                {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span
                  onClick={() => setIsSignIn(!isSignIn)}
                  className='text-orange-500 font-bold cursor-pointer hover:underline'
                >
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </span>
              </p>

            </div>
          </>
        )}

      </div>
    </>
  )
}

export default AuthModal
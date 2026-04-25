import React from 'react'
import {
  FaFacebookSquare,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

function Footer() {
  return (
    <div className='bg-gray-950 text-gray-300 mt-16'>

      <div className='max-w-[1240px] mx-auto py-16 px-8 grid lg:grid-cols-5 md:grid-cols-2 gap-10'>

        {/* Brand */}
        <div className='lg:col-span-2'>
          <img
            src="/obisco-logo.png"
            alt="OBISCO Store"
            className='h-30 w-auto object-contain mb-3'
          />
          <p className='text-sm text-gray-400 mt-3 leading-relaxed'>
            OBISCO Store is a growing Nigerian marketplace connecting customers with verified specialists across gadgets, fashion and lifestyle. Quality products at unbeatable prices delivered across Nigeria.
          </p>

          {/* App Download */}
          <div className='mt-5 bg-gray-900 rounded-xl p-4 border border-gray-800'>
            <p className='text-xs font-bold text-orange-500 uppercase tracking-wider mb-2'>📲 Get Our App</p>
            <p className='text-xs text-gray-400 mb-2'>Install OBISCO Store on your phone for the best shopping experience!</p>
            <div className='flex flex-col gap-1'>
              <p className='text-xs text-gray-300'>
                <span className='text-green-400'>Android:</span> Open site → Menu → Install App
              </p>
              <p className='text-xs text-gray-300'>
                <span className='text-blue-400'>iPhone:</span> Safari → Share → Add to Home Screen
              </p>
            </div>
          </div>

          <div className='flex gap-4 mt-6'>
            <a href='https://www.facebook.com/share/1Ke2BTu7dD/?mibextid=wwXIfr' target='_blank' rel='noreferrer' className='text-gray-400 hover:text-blue-500 transition'>
              <FaFacebookSquare size={26} />
            </a>
            <a href='https://www.instagram.com/obisco_gadgets?igsh=MTNkOHgyOGVpYXBnMQ%3D%3D&utm_source=qr' target='_blank' rel='noreferrer' className='text-gray-400 hover:text-pink-500 transition'>
              <FaInstagram size={26} />
            </a>
            <a href='https://www.tiktok.com/@obisco_gadgets?_r=1&_t=ZT-95PuaHLecEX' target='_blank' rel='noreferrer' className='text-gray-400 hover:text-white transition'>
              <FaTiktok size={26} />
            </a>
            <a href='https://wa.me/message/MZYPNJ5JS22EE1' target='_blank' rel='noreferrer' className='text-gray-400 hover:text-green-500 transition'>
              <FaWhatsapp size={26} />
            </a>
          </div>
        </div>

        {/* Departments */}
        <div>
          <h6 className='font-bold text-white text-sm uppercase tracking-widest mb-4'>Departments</h6>
          <ul className='flex flex-col gap-2'>
            <li className='text-xs text-orange-500 font-semibold uppercase tracking-wider mt-1'>📱 Gadgets</li>
            {['Phones', 'Laptops', 'Tablets', 'Accessories'].map((item) => (
              <li key={item}>
                <a href='#products' className='text-sm text-gray-400 hover:text-orange-500 transition'>{item}</a>
              </li>
            ))}
            <li className='text-xs text-orange-500 font-semibold uppercase tracking-wider mt-3'>👔 Fashion</li>
            {["Men's Wear", "Women's Wear", 'Native Wear'].map((item) => (
              <li key={item}>
                <a href='#' className='text-sm text-gray-400 hover:text-orange-500 transition'>{item}</a>
              </li>
            ))}
            <li className='text-xs text-orange-500 font-semibold uppercase tracking-wider mt-3'>✨ Lifestyle</li>
            {['Perfumes', 'Watches'].map((item) => (
              <li key={item}>
                <a href='#' className='text-sm text-gray-400 hover:text-orange-500 transition'>{item}</a>
              </li>
            ))}
          </ul>
        </div>


        {/* Contact Info */}
        <div>
          <h6 className='font-bold text-white text-sm uppercase tracking-widest mb-4'>Contact Us</h6>
          <ul className='flex flex-col gap-4'>
            <li className='flex items-start gap-3'>
              <MdLocationOn size={20} className='text-orange-500 mt-0.5 shrink-0' />
              <span className='text-sm text-gray-400'>Lagos, Nigeria</span>
            </li>
            <li className='flex items-center gap-3'>
              <MdPhone size={20} className='text-orange-500 shrink-0' />
              <a href='tel:+2349049863067' className='text-sm text-gray-400 hover:text-orange-500 transition'>
                +234 904 986 3067
              </a>
            </li>
            <li className='flex items-center gap-3'>
              <MdEmail size={20} className='text-orange-500 shrink-0' />
              <a href='mailto:obiscogadgets1@gmail.com' className='text-sm text-gray-400 hover:text-orange-500 transition'>
                obiscogadgets1@gmail.com
              </a>
            </li>
            <li className='flex items-center gap-3'>
              <FaWhatsapp size={20} className='text-green-500 shrink-0' />
              <a href='https://wa.me/message/MZYPNJ5JS22EE1' target='_blank' rel='noreferrer' className='text-sm text-gray-400 hover:text-green-500 transition'>
                Chat on WhatsApp
              </a>
            </li>
          </ul>

          {/* Customer Service */}
          <h6 className='font-bold text-white text-sm uppercase tracking-widest mb-4 mt-8'>Customer Service</h6>
          <ul className='flex flex-col gap-2'>
            {['Track My Order', 'Return Policy', 'Payment Guide', 'FAQs'].map((item) => (
              <li key={item}>
                <a href='#' className='text-sm text-gray-400 hover:text-orange-500 transition'>{item}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='max-w-[1240px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-gray-500'>© 2025 OBISCO Store. All rights reserved.</p>
          <div className='flex gap-6'>
            <a href='#' className='text-xs text-gray-500 hover:text-orange-500 transition'>Privacy Policy</a>
            <a href='#' className='text-xs text-gray-500 hover:text-orange-500 transition'>Terms of Service</a>
            <a href='#' className='text-xs text-gray-500 hover:text-orange-500 transition'>Refund Policy</a>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-500'>We accept:</span>
            <span className='bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded'>OPay</span>
            <span className='bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded'>Fidelity</span>
            <span className='bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded'>Transfer</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Footer
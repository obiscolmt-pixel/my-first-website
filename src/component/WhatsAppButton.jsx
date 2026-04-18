import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <div className='fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2'>

      {/* Tooltip */}
      {showTooltip && (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 max-w-[220px]'>
          <div>
            <p className='font-bold text-gray-800 text-sm'>Need help? 👋</p>
            <p className='text-gray-500 text-xs mt-0.5'>Chat with us on WhatsApp</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className='text-gray-400 hover:text-black shrink-0'
          >
            <AiOutlineClose size={14} />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      
        <a href='https://wa.me/message/MZYPNJ5JS22EE1'
        target='_blank'
        rel='noreferrer'
        onClick={() => setShowTooltip(false)}
        className='w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110'
      >
        <FaWhatsapp size={30} />
      </a>

    </div>
  )
}

export default WhatsAppButton
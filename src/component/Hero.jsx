import React from 'react'

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='relative overflow-hidden'>

      {/* Animated Background Image */}
      <div className='w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden'>
        <img
          src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=100&fit=crop"
          alt="Gadgets and Accessories"
          className='w-full h-full object-cover animate-kenburns'
        />
      </div>

      {/* Overlay */}
      <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center z-20'>
        <div className='px-6 sm:px-10 md:px-16 max-w-2xl'>

          <p className='text-orange-500 uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold mb-2 sm:mb-3'>
            Obisco Tech Store
          </p>

          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white'>
            Top{' '}
            <span className='text-orange-500'>Gadgets</span>{' '}
            &{' '}
            <br />
            <span className='text-orange-500'>Accessories</span>
          </h1>

          <p className='mt-3 sm:mt-4 text-gray-300 text-xs sm:text-sm md:text-base max-w-sm sm:max-w-md leading-relaxed'>
            Discover the latest smartphones, earbuds, chargers, and must-have
            accessories — all in one place. Quality tech at unbeatable prices.
          </p>

          <div className='mt-5 sm:mt-6 flex gap-3 sm:gap-4'>
            <button
              onClick={scrollToProducts}
              className='bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold transition text-sm sm:text-base'
            >
              Shop Now
            </button>
            <button
              onClick={scrollToProducts}
              className='border border-white text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full hover:bg-white hover:text-black transition text-sm sm:text-base'
            >
              Explore Deals
            </button>
          </div>

          <div className='mt-6 sm:mt-8 flex gap-6 sm:gap-8'>
            <div>
              <p className='text-white font-black text-lg sm:text-2xl'>500+</p>
              <p className='text-gray-400 text-xs sm:text-sm'>Products</p>
            </div>
            <div className='border-l border-gray-600 pl-6 sm:pl-8'>
              <p className='text-white font-black text-lg sm:text-2xl'>10k+</p>
              <p className='text-gray-400 text-xs sm:text-sm'>Customers</p>
            </div>
            <div className='border-l border-gray-600 pl-6 sm:pl-8'>
              <p className='text-white font-black text-lg sm:text-2xl'>4.9★</p>
              <p className='text-gray-400 text-xs sm:text-sm'>Rating</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Hero
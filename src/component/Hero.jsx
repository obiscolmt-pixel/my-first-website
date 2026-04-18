const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='relative'>
      <img
        className='w-full h-[500px] object-cover'
        src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=100&fit=crop"
        alt="Gadgets and Accessories"
      />
      <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center pl-8'>
        <div className='max-w-lg'>

          <p className='text-orange-500 uppercase tracking-widest text-sm mb-2'>
            Obisco Tech Store___
          </p>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white'>
            Top <span className='text-orange-500'>Gadgets</span> &<br />
            <span className='text-orange-500'>Accessories</span>
          </h1>

          <p className='mt-4 text-gray-300 text-sm sm:text-base max-w-md'>
            Discover the latest smartphones, earbuds, chargers, and must-have
            accessories — all in one place. Quality tech at unbeatable prices.
          </p>

          <div className='mt-6 flex gap-4'>
            {/* Shop Now */}
            <button
              onClick={scrollToProducts}
              className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition'
            >
              Shop Now
            </button>

            {/* Explore Deals */}
            <button
              onClick={scrollToProducts}
              className='border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition'
            >
              Explore Deals
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero
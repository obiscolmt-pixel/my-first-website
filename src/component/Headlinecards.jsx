import React from 'react'

const Headlinecards = () => {
  return (
    <div className='max-w-[1640px]mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
      {/* card */}
      <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Apple laptop</p>
          <p className='px-2'>now selling fast</p>
          <button className='borderwhite bg-white text-black mx-2 absolute bottom-4'>Buy Now</button>

        </div>
        <img className='max-h-[160px] md:max-h-[200] w-full object-cover rounded-xl' src="https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww" alt="/" />

      </div> 
       <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Apple headphone </p>
          <p className='px-2'>Added daily</p>
          <button className='borderwhite bg-white text-black mx-2 absolute bottom-4'>Buy Now</button>

        </div>
         <img className='max-h-[160px] md:max-h-[200] w-full object-cover rounded-xl' src="https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=1920&q=100&fit=crop" alt="/" />

      </div> 
       <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Apple phones</p>
          <p className='px-2'>Fast selling</p>
          <button className='borderwhite bg-white text-black mx-2 absolute bottom-4'>Buy Now</button>

        </div>
        <img className='max-h-[160px] md:max-h-[200] w-full object-cover rounded-xl' src="https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=1920&q=100&fit=crop" alt="/" />
      </div> 
      
    </div>
  )
}

export default Headlinecards

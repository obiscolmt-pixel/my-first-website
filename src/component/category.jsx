import React from 'react'
import { categories } from '../data/data.js'

const Category = () => {
  return (
    <div className='max-w-[1640px] mx-auto px-4 py-12'>

      {/* Heading */}
      <div className='text-center mb-10'>
        <p className='text-orange-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2'>
          Browse By Category
        </p>
        <h1 className='font-black text-4xl text-gray-800'>
          Shop Our <span className='text-orange-500'>Collections</span>
        </h1>
        <p className='text-gray-400 text-sm mt-2'>
          Find exactly what you need from our wide range of gadgets
        </p>
        {/* Decorative line */}
        <div className='flex items-center justify-center gap-3 mt-4'>
          <div className='h-px w-16 bg-orange-500 opacity-50' />
          <div className='w-2 h-2 rounded-full bg-orange-500' />
          <div className='h-px w-16 bg-orange-500 opacity-50' />
        </div>
      </div>

      {/* Category Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {categories.map((item, index) => (
          <div
            key={index}
            className='group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            {/* Background Image */}
            <div className='h-[160px] overflow-hidden'>
              <img
                src={item.image}
                alt={item.name}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
              />
            </div>

            {/* Dark overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

            {/* Category name */}
            <div className='absolute bottom-0 left-0 right-0 p-3'>
              <h2 className='text-white font-bold text-sm text-center'>
                {item.name}
              </h2>
              <p className='text-orange-400 text-xs text-center mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                Shop Now →
              </p>
            </div>

            {/* Orange border on hover */}
            <div className='absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition-all duration-300' />

          </div>
        ))}
      </div>

    </div>
  )
}

export default Category
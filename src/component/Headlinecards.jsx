import React from 'react'

const cards = [
  {
    title: 'Apple Laptops',
    sub: 'Now selling fast',
    badge: 'Hot Deal',
    badgeStyle: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=700&q=80&fit=crop',
    filter: 'laptops',
  },
  {
    title: 'Apple Headphones',
    sub: 'Added daily',
    badge: 'New Stock',
    badgeStyle: 'bg-white text-orange-500',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=1920&q=100&fit=crop',
    filter: 'headphones',
  },
  {
    title: 'Apple Phones',
    sub: 'Fast selling',
    badge: 'Best Seller',
    badgeStyle: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=1920&q=100&fit=crop',
    filter: 'phones',
  },
]

const Headlinecards = ({ onCategoryClick }) => {
  return (
    <div className='max-w-[1640px] mx-auto px-4 py-6 grid md:grid-cols-3 gap-4'>
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => onCategoryClick && onCategoryClick(card.filter)}
          className='group relative overflow-hidden rounded-2xl cursor-pointer h-[180px] md:h-[200px] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(249,115,22,0.25)]'
        >
          {/* Image */}
          <img
            src={card.image}
            alt={card.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
          />

          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent' />

          {/* Content */}
          <div className='absolute inset-0 p-5 flex flex-col justify-center'>
            <span className={`inline-block self-start text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider ${card.badgeStyle}`}>
              {card.badge}
            </span>
            <h2 className='text-white font-black text-xl md:text-2xl leading-tight'>
              {card.title}
            </h2>
            <p className='text-orange-300 text-xs mt-1'>{card.sub}</p>
            <button className='mt-3 self-start bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition'>
              Buy Now →
            </button>
          </div>

          {/* Orange border on hover */}
          <div className='absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition-all duration-300' />
        </div>
      ))}
    </div>
  )
}

export default Headlinecards
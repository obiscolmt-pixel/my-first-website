import React, { useState } from "react";
import { data } from "../data/data.js";
import { BsFillCartFill } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";

const Food = ({ searchQuery, addToCart }) => {
  const [foods, setFoods] = useState(data);
  const [activeType, setActiveType] = useState('All');
  const [activePrice, setActivePrice] = useState(null);
  const [toast, setToast] = useState(null);

  const filterType = (category) => {
    setActiveType(category);
    setActivePrice(null);
    setFoods(category === 'All' ? data : data.filter((item) => item.category === category));
  };

  const filterPrice = (price) => {
    setActivePrice(price);
    setActiveType(null);
    setFoods(data.filter((item) => item.price === price));
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setToast(item);
    setTimeout(() => setToast(null), 3000);
  };

  const displayedFoods = searchQuery
    ? data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : foods;

  return (
    <div className="max-w-[1640px] mx-auto px-4 relative" id="products">

      {/* Toast Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-orange-500">
          <div className="bg-orange-500 rounded-full p-1">
            <AiOutlineCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{toast.name}</p>
            <p className="text-gray-400 text-xs">Added to cart successfully!</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-4 text-gray-500 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Heading */}
      <h1 className="font-bold text-center text-4xl bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent mt-4 mb-2">
        Top Rated Gadgets & Accessories
      </h1>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between mt-4">

        {/* Filter Type */}
        <div>
          <p className="font-bold text-gray-700">Filter Type</p>
          <div className="flex flex-wrap gap-2">
            {['All', 'phones', 'laptops', 'headphones', 'speakers', 'chargers', 'tablets'].map((cat) => (
              <button
                key={cat}
                onClick={() => filterType(cat)}
                className={`m-1 border px-3 py-1 rounded-full capitalize transition
                  ${activeType === cat
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Price */}
        <div>
          <p className="font-bold text-gray-700">Filter Price</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Under ₦50k', value: '$' },
              { label: '₦50k - ₦150k', value: '$$' },
              { label: '₦150k - ₦500k', value: '$$$' },
              { label: '₦500k+', value: '$$$$' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => filterPrice(p.value)}
                className={`m-1 border px-3 py-1 rounded-full transition
                  ${activePrice === p.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Search result info */}
      {searchQuery && (
        <p className="text-gray-500 text-sm mt-2">
          {displayedFoods.length} result{displayedFoods.length !== 1 ? 's' : ''} for{' '}
          <span className="text-orange-500 font-semibold">"{searchQuery}"</span>
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {displayedFoods.map((item) => (
          <div
            key={item.id}
            className="shadow-lg rounded-lg hover:scale-105 duration-300 overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[200px] object-cover rounded-t-lg"
            />
            <div className="flex justify-between items-center px-2 py-2">
              <p className="font-bold text-sm">{item.name}</p>
              <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                ₦{item.amount.toLocaleString()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <div className="px-2 pb-3">
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full flex items-center justify-center gap-2 bg-orange-500
                hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-full
                transition duration-200"
              >
                <BsFillCartFill size={16} />
                Add to Cart
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedFoods.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No products found for "<span className="text-orange-500">{searchQuery}</span>"
          </p>
        </div>
      )}

    </div>
  );
};

export default Food;
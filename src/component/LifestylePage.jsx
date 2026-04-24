import React, { useState } from "react";
import { lifestyleProducts, lifestyleCategories } from "../data/data.js";
import { BsFillCartFill } from "react-icons/bs";

const LifestylePage = ({ addToCart, addToWishlist, isWishlisted, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [toast, setToast] = useState(null);

  const handleAddToCart = (item) => {
    addToCart({ ...item, _id: item.id, quantity: 1 });
    setToast(item);
    setTimeout(() => setToast(null), 3000);
  };

  const displayed = lifestyleProducts.filter((p) => {
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchCat =
      activeCategory === "all" || p.category === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen">

      {/* Hero Banner */}
      <div className="relative overflow-hidden h-[300px] sm:h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&q=100&fit=crop"
          alt="Lifestyle"
          className="w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-black/55 flex items-center px-6 sm:px-16">
          <div>
            <p className="text-orange-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
              Obisco Store
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              Lifestyle &{" "}
              <span className="text-orange-500">Luxury</span>
            </h1>
            <p className="text-gray-300 text-sm mt-3 max-w-md">
              Premium perfumes and luxury watches — smell great, look great.
            </p>
            <button
              onClick={() =>
                document.getElementById("lifestyle-products")?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition text-sm"
            >
              Shop Lifestyle →
            </button>
          </div>
        </div>
      </div>

      {/* Category Tiles */}
      <div className="max-w-[1640px] mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-orange-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Browse By Type
          </p>
          <h2 className="font-black text-3xl text-gray-800">
            Shop Our <span className="text-orange-500">Collections</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {lifestyleCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.name.toLowerCase());
                document.getElementById("lifestyle-products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer h-[200px] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(249,115,22,0.25)]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-white font-bold text-base">{cat.name}</h3>
                <p className="text-orange-400 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now →
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div id="lifestyle-products">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-black text-2xl sm:text-3xl bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent">
              {activeCategory === "all"
                ? "All Lifestyle"
                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["all", ...lifestyleCategories.map((c) => c.name.toLowerCase())].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition ${
                    activeCategory === cat
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayed.map((item) => (
              <div
                key={item.id}
                className="shadow-md rounded-xl hover:scale-105 duration-300 overflow-hidden bg-white cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[140px] sm:h-[180px] object-cover"
                  />
                  <button
                    onClick={() => addToWishlist({ ...item, _id: item.id })}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
                  >
                    {isWishlisted(item.id) ? (
                      <span className="text-red-500 text-base leading-none">♥</span>
                    ) : (
                      <span className="text-gray-400 text-base leading-none">♡</span>
                    )}
                  </button>
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="flex justify-between items-center px-2 py-2 gap-1">
                  <p className="font-bold text-xs sm:text-sm leading-tight">{item.name}</p>
                  <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold shrink-0">
                    ₦{item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="px-2 pb-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold py-2 rounded-full transition duration-200"
                  >
                    <BsFillCartFill size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {displayed.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No items found.</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
              >
                View All Lifestyle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-orange-500">
          <div className="bg-orange-500 rounded-full p-1">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <p className="font-bold text-sm">{toast.name}</p>
            <p className="text-gray-400 text-xs">Added to cart!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifestylePage;
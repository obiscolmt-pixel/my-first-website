import React, { useState, useEffect } from "react";
import { fetchProducts, getReviews, addReview } from "../api/api.js";
import { BsFillCartFill } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const Products = ({ searchQuery, addToCart }) => {
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [activePrice, setActivePrice] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [userRating, setUserRating] = useState(5)
  const [userComment, setUserComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setAllProducts(data)
        setProducts(data)
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filterType = (category) => {
    setActiveType(category);
    setActivePrice(null);
    setProducts(category === 'All' ? allProducts : allProducts.filter((item) => item.category === category));
  };

  const filterPrice = (price) => {
    setActivePrice(price);
    setActiveType(null);
    setProducts(allProducts.filter((item) => item.price === price));
  };

  const handleAddToCart = (item, qty = 1, color = '') => {
    addToCart({ ...item, quantity: qty, color });
    setToast(item);
    setTimeout(() => setToast(null), 3000);
  };

  const openProduct = async (item) => {
    setSelectedProduct(item)
    setSelectedColor(item.colors?.length > 0 ? item.colors[0].name : '')
    setSelectedImage(item.colors?.length > 0 ? item.colors[0].image : item.image)
    setQuantity(1)
    setReviews([])
    setAvgRating(0)
    setTotalReviews(0)
    setShowReviewForm(false)
    setUserComment('')
    setUserRating(5)

    try {
      const data = await getReviews(item._id)
      if (data.reviews) {
        setReviews(data.reviews)
        setAvgRating(data.avgRating)
        setTotalReviews(data.total)
      }
    } catch (err) {
      console.error('Failed to load reviews:', err)
    }
  };

  const closeProduct = () => setSelectedProduct(null);

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      alert('Please sign in to leave a review.')
      return
    }
    if (!userComment.trim()) {
      alert('Please write a comment.')
      return
    }
    setReviewLoading(true)
    const res = await addReview(selectedProduct._id, {
      rating: userRating,
      comment: userComment,
      fullName: user.fullName,
    })
    setReviewLoading(false)
    if (res.review) {
      setReviews((prev) => [res.review, ...prev])
      const newTotal = totalReviews + 1
      const newAvg = ((parseFloat(avgRating) * totalReviews + userRating) / newTotal).toFixed(1)
      setTotalReviews(newTotal)
      setAvgRating(newAvg)
      setUserComment('')
      setUserRating(5)
      setShowReviewForm(false)
    } else {
      alert(res.message || 'Failed to submit review.')
    }
  }

  const displayedProducts = searchQuery
    ? allProducts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const StarDisplay = ({ rating, size = 'text-sm' }) => (
    <div className="flex">
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          className={`${size} ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-[1640px] mx-auto px-4 py-16 text-center" id="products">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1640px] mx-auto px-3 sm:px-4 relative" id="products">

      {/* Toast Popup */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-orange-500">
          <div className="bg-orange-500 rounded-full p-1 shrink-0">
            <AiOutlineCheck size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{toast.name}</p>
            <p className="text-gray-400 text-xs">Added to cart successfully!</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-500 hover:text-white text-lg leading-none shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeProduct}
          />

          <div className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto w-full sm:max-w-3xl bg-white z-50 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col">

            <button
              onClick={closeProduct}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-black z-10 bg-white rounded-full p-1.5 shadow"
            >
              <AiOutlineClose size={20} />
            </button>

            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row overflow-y-auto">

              {/* Product Image */}
              <div className="w-full sm:w-1/2 h-[220px] sm:h-auto shrink-0">
                <img
                  src={selectedImage || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto">

                {/* Category & Name */}
                <div>
                  <p className="text-orange-500 uppercase tracking-widest text-xs font-semibold capitalize">
                    {selectedProduct.category}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
                    {selectedProduct.name}
                  </h2>
                </div>

                {/* Price + Rating */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-orange-500">
                    ₦{selectedProduct.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarDisplay rating={avgRating} />
                    <span className="text-xs text-gray-500">
                      {avgRating} ({totalReviews})
                    </span>
                  </div>
                </div>

                {/* In Stock */}
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-semibold w-fit">
                  In Stock
                </span>

                {/* Description */}
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Premium quality {selectedProduct.name} with the latest features.
                  Comes with full warranty and official accessories.
                  Fast delivery across Nigeria.
                </p>

                {/* Color Selection */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-700 text-sm mb-2">
                      Color: <span className="text-orange-500">{selectedColor}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color.name)
                            setSelectedImage(color.image)
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition
                            ${selectedColor === color.name
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                            }`}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <p className="font-bold text-gray-700 text-sm mb-2">Quantity</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="font-black text-lg w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Subtotal:{' '}
                      <span className="text-orange-500 font-bold">
                        ₦{(selectedProduct.amount * quantity).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <p className="text-xs text-orange-700 font-semibold mb-1">🚚 Delivery Info</p>
                  <p className="text-xs text-gray-500">
                    Fast delivery available across Nigeria. Order today and receive within 2-5 business days.
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, quantity, selectedColor)
                    closeProduct()
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition duration-200 text-sm"
                >
                  <BsFillCartFill size={16} />
                  Add to Cart — ₦{(selectedProduct.amount * quantity).toLocaleString()}
                </button>

                {/* Reviews Section */}
                <div className="border-t pt-4">

                  {/* Rating Summary */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StarDisplay rating={avgRating} size="text-base" />
                      <span className="font-black text-gray-800 text-sm">{avgRating}</span>
                      <span className="text-gray-400 text-xs">({totalReviews} reviews)</span>
                    </div>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-xs text-orange-500 font-bold hover:underline"
                    >
                      {showReviewForm ? 'Cancel' : '+ Write Review'}
                    </button>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100">
                      <p className="text-xs font-bold text-gray-700 mb-1">Your Rating</p>
                      <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className={`text-2xl transition ${
                              star <= userRating
                                ? 'text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 resize-none"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewLoading}
                        className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs font-bold py-2 rounded-full transition flex items-center justify-center gap-2"
                      >
                        {reviewLoading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : 'Submit Review ⭐'}
                      </button>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-2xl mb-1">⭐</p>
                      <p className="text-gray-400 text-xs">
                        No reviews yet. Be the first to review!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                      {reviews.map((review) => (
                        <div key={review._id} className="border rounded-xl p-3 bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-bold text-xs text-gray-800">{review.fullName}</p>
                              <p className="text-gray-300 text-xs">
                                {new Date(review.createdAt).toLocaleDateString('en-NG', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </p>
                            </div>
                            <StarDisplay rating={review.rating} size="text-xs" />
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed mt-1">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* Heading */}
      <h1 className="font-bold text-center text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent mt-4 mb-2">
        Top Rated Gadgets & Accessories
      </h1>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between mt-4 gap-4">

        {/* Filter Type */}
        <div>
          <p className="font-bold text-gray-700 text-sm">Filter Type</p>
          <div className="flex flex-wrap">
            {['All', 'phones', 'laptops', 'headphones', 'speakers', 'chargers', 'tablets'].map((cat) => (
              <button
                key={cat}
                onClick={() => filterType(cat)}
                className={`m-1 border px-3 py-1 rounded-full capitalize transition text-xs sm:text-sm
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
          <p className="font-bold text-gray-700 text-sm">Filter Price</p>
          <div className="flex flex-wrap">
            {[
              { label: 'Under ₦50k', value: '$' },
              { label: '₦50k-₦150k', value: '$$' },
              { label: '₦150k-₦500k', value: '$$$' },
              { label: '₦500k+', value: '$$$$' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => filterPrice(p.value)}
                className={`m-1 border px-3 py-1 rounded-full transition text-xs sm:text-sm
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
        <p className="text-gray-500 text-xs sm:text-sm mt-2">
          {displayedProducts.length} result{displayedProducts.length !== 1 ? 's' : ''} for{' '}
          <span className="text-orange-500 font-semibold">"{searchQuery}"</span>
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pt-4">
        {displayedProducts.map((item) => (
          <div
            key={item._id}
            className="shadow-md rounded-xl hover:scale-105 duration-300 overflow-hidden bg-white cursor-pointer"
          >
            <div onClick={() => openProduct(item)}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[150px] sm:h-[200px] object-cover"
              />
              <div className="flex justify-between items-center px-2 py-2 gap-1">
                <p className="font-bold text-xs sm:text-sm leading-tight">{item.name}</p>
                <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold shrink-0">
                  ₦{item.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
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

      {/* Empty State */}
      {displayedProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-base sm:text-lg">
            No products found for "<span className="text-orange-500">{searchQuery}</span>"
          </p>
        </div>
      )}

    </div>
  );
};

export default Products;
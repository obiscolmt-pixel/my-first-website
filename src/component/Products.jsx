import React, { useState, useEffect } from "react";
import { fetchProducts, getReviews, addReview } from "../api/api.js";
import { BsFillCartFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";

const GADGET_CATEGORIES = [
  {
    id: "phones",
    name: "Phones & Tablets",
    emoji: "📱",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&fit=crop",
    bg: "#1e3a5f",
  },
  {
    id: "laptops",
    name: "Laptops",
    emoji: "💻",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80&fit=crop",
    bg: "#1a3a2a",
  },
  {
    id: "accessories",
    name: "Accessories",
    emoji: "🎧",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fit=crop",
    bg: "#2a1a3a",
  },
];

const Products = ({ searchQuery, addToCart, addToWishlist, isWishlisted }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("obisco_recently_viewed")) || [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts("gadgets");
        setAllProducts(data);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const gadgetProducts = allProducts;

  const filterType = (category) => {
    setActiveType(category);
    if (category === "All") {
      setProducts(gadgetProducts);
    } else if (category === "phones") {
      // phones + tablets together
      setProducts(
        gadgetProducts.filter(
          (item) => item.category === "phones" || item.category === "tablets",
        ),
      );
    } else if (category === "accessories") {
      setProducts(
        gadgetProducts.filter(
          (item) =>
            item.category === "speakers" ||
            item.category === "chargers" ||
            item.category === "headphones" ||
            item.category === "accessories" ||
            item.category === "earbuds",
        ),
      );
    } else {
      setProducts(gadgetProducts.filter((item) => item.category === category));
    }
  };

  const handleAddToCart = (item, qty = 1, color = "") => {
    addToCart({ ...item, quantity: qty, color });
    setToast(item);
    setTimeout(() => setToast(null), 3000);
  };

  const openProduct = async (item) => {
    document.body.style.overflow = "hidden";
    setSelectedProduct(item);
    setRecentlyViewed((prev) => {
      const itemId = item._id || item.id;
      const filtered = prev.filter((i) => (i._id || i.id) !== itemId);
      const updated = [item, ...filtered].slice(0, 6);
      localStorage.setItem("obisco_recently_viewed", JSON.stringify(updated));
      return updated;
    });
    setSelectedColor(item.colors?.length > 0 ? item.colors[0].name : "");
    setSelectedImage(item.image);
    setQuantity(1);
    setReviews([]);
    setAvgRating(0);
    setTotalReviews(0);
    setShowReviewForm(false);
    setUserComment("");
    setUserRating(5);
    try {
      const data = await getReviews(item._id);
      if (data.reviews) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.total);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please sign in to leave a review.");
      return;
    }
    if (!userComment.trim()) {
      alert("Please write a comment.");
      return;
    }
    setReviewLoading(true);
    const res = await addReview(selectedProduct._id, {
      rating: userRating,
      comment: userComment,
      fullName: user.fullName,
    });
    setReviewLoading(false);
    if (res.review) {
      setReviews((prev) => [res.review, ...prev]);
      const newTotal = totalReviews + 1;
      const newAvg = (
        (parseFloat(avgRating) * totalReviews + userRating) /
        newTotal
      ).toFixed(1);
      setTotalReviews(newTotal);
      setAvgRating(newAvg);
      setUserComment("");
      setUserRating(5);
      setShowReviewForm(false);
    } else {
      alert(res.message || "Failed to submit review.");
    }
  };

  const displayedProducts = searchQuery
    ? allProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  const StarDisplay = ({ rating, size = "text-sm" }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${size} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div
        className="max-w-[1640px] mx-auto px-4 py-16 text-center"
        id="products"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" id="products">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-0 right-0 flex justify-center z-50 animate-slideDown">
          <div className="flex items-center gap-2 bg-green-400 shadow-2xl px-4 py-2.5 rounded-3xl">
            <img
              src={toast.image}
              alt={toast.name}
              className="w-6 h-6 object-contain rounded-full bg-orange-50 shrink-0"
            />
            <p className="text-[12px] text-white font-semibold">
              Item added to cart ✓
            </p>
            <div className="bg-orange-500 rounded-full p-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeProduct}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] sm:w-full sm:max-w-3xl bg-white z-50 rounded-2xl shadow-2xl overflow-hidden max-h-[65vh] sm:max-h-[90vh] flex flex-col">
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
              <div className="w-full sm:w-1/2 h-[180px] sm:h-auto shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain p-3 transition-all duration-300"
                />
              </div>
              <div className="w-full sm:w-1/2 p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 overflow-y-auto">
                <div>
                  <p className="text-orange-500 uppercase tracking-widest text-[10px] font-semibold capitalize">
                    {selectedProduct.category}
                  </p>
                  <h2 className="text-base sm:text-2xl font-bold text-gray-800 mt-1">
                    {selectedProduct.name}
                  </h2>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xl sm:text-3xl font-black text-orange-500">
                    ₦{selectedProduct.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarDisplay rating={avgRating} />
                    <span className="text-xs text-gray-500">
                      {avgRating} ({totalReviews})
                    </span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-semibold w-fit">
                  In Stock
                </span>
                <p className="text-gray-400 text-[11px] sm:text-sm leading-relaxed">
                  Premium quality {selectedProduct.name} with the latest
                  features. Comes with full warranty and official accessories.
                  Fast delivery across Nigeria.
                </p>
                <div>
                  <p className="font-semibold text-gray-700 text-xs mb-2">
                    Quantity
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="font-black text-lg w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Subtotal:{" "}
                      <span className="text-orange-500 font-bold">
                        ₦{(selectedProduct.amount * quantity).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-2">
                  <p className="text-xs text-orange-700 font-semibold mb-1">
                    🚚 Delivery Info
                  </p>
                  <p className="text-xs text-gray-500">
                    Fast delivery available across Nigeria. Order today and
                    receive within 2-5 business days.
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, quantity, selectedColor);
                    closeProduct();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition duration-200 text-sm"
                >
                  <BsFillCartFill size={16} />
                  Add to Cart — ₦
                  {(selectedProduct.amount * quantity).toLocaleString()}
                </button>
                <button
                  onClick={() => addToWishlist(selectedProduct)}
                  className={`w-full flex items-center justify-center gap-2 border-2 font-bold py-3 rounded-full transition duration-200 text-sm ${
                    isWishlisted(selectedProduct._id)
                      ? "border-red-500 text-red-500 hover:bg-red-50"
                      : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400"
                  }`}
                >
                  <MdFavorite size={16} />
                  {isWishlisted(selectedProduct._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StarDisplay rating={avgRating} size="text-base" />
                      <span className="font-black text-gray-800 text-sm">
                        {avgRating}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({totalReviews} reviews)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-xs text-orange-500 font-bold hover:underline"
                    >
                      {showReviewForm ? "Cancel" : "+ Write Review"}
                    </button>
                  </div>
                  {showReviewForm && (
                    <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100">
                      <p className="text-xs font-bold text-gray-700 mb-1">
                        Your Rating
                      </p>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className={`text-2xl transition ${star <= userRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
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
                        ) : (
                          "Submit Review ⭐"
                        )}
                      </button>
                    </div>
                  )}
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
                        <div
                          key={review._id}
                          className="border rounded-xl p-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-bold text-xs text-gray-800">
                                {review.fullName}
                              </p>
                              <p className="text-gray-300 text-xs">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <StarDisplay
                              rating={review.rating}
                              size="text-xs"
                            />
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

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden h-[300px] sm:h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=100&fit=crop"
          alt="Gadgets"
          className="w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center px-6 sm:px-16">
          <div>
            <p className="text-orange-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
              Obisco Store
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              Gadgets & <span className="text-orange-500">Tech</span>
            </h1>
            <p className="text-gray-300 text-sm mt-3 max-w-md">
              Phones, Laptops, Tablets, Accessories — top tech delivered across
              Nigeria.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("gadgets-products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition text-sm"
            >
              Shop Gadgets →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1640px] mx-auto px-4 py-10">
        {/* ── CATEGORY TILES ── */}
        <div className="text-center mb-8">
          <p className="text-orange-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Browse By Type
          </p>
          <h2 className="font-black text-3xl text-gray-800">
            Shop Our <span className="text-orange-500">Collections</span>
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-12">
          {GADGET_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                filterType(cat.id === "accessories" ? "accessories" : cat.id);
                document
                  .getElementById("gadgets-products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden rounded-2xl h-[140px] w-[140px] shrink-0 cursor-pointer..."
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="text-white font-bold text-sm">
                  {cat.emoji} {cat.name}
                </h3>
                <p className="text-orange-400 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now →
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* ── PRODUCTS SECTION ── */}
        <div id="gadgets-products">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-black text-2xl sm:text-3xl bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent">
              {activeType === "All"
                ? "All Gadgets"
                : activeType.charAt(0).toUpperCase() + activeType.slice(1)}
            </h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
              {["All", "phones", "laptops", "accessories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => filterType(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 capitalize transition ${
                    activeType === cat
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {cat === "phones"
                    ? "📱 Phones"
                    : cat === "laptops"
                      ? "💻 Laptops"
                      : cat === "accessories"
                        ? "🎧 Accessories"
                        : "🛍️ All"}
                </button>
              ))}
            </div>
          </div>

          {/* Search result info */}
          {searchQuery && (
            <p className="text-gray-500 text-xs sm:text-sm mb-4">
              {displayedProducts.length} result
              {displayedProducts.length !== 1 ? "s" : ""} for{" "}
              <span className="text-orange-500 font-semibold">
                "{searchQuery}"
              </span>
            </p>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((item) => (
              <div
                key={item._id}
                className="shadow-md rounded-xl hover:scale-105 duration-300 overflow-hidden bg-white cursor-pointer"
              >
                <div onClick={() => openProduct(item)} className="relative">
                  <div className="w-full h-[200px] bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(item);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
                  >
                    {isWishlisted(item._id) ? (
                      <span className="text-red-500 text-base leading-none">
                        ♥
                      </span>
                    ) : (
                      <span className="text-gray-400 text-base leading-none">
                        ♡
                      </span>
                    )}
                  </button>
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="flex justify-between items-center px-2 py-2 gap-1">
                  <p className="font-bold text-xs sm:text-sm leading-tight">
                    {item.name}
                  </p>
                  <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold shrink-0">
                    ₦{item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 pb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xs ${star <= Math.round(item.avgRating || 0) ? "text-yellow-400" : "text-gray-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {item.avgRating
                      ? `${item.avgRating} (${item.totalReviews})`
                      : "No reviews"}
                  </span>
                </div>
                <div className="px-2 pb-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold py-2 rounded-full transition duration-200"
                  >
                    <BsFillCartFill size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayedProducts.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-gray-400 text-base sm:text-lg">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No gadgets available yet"}
              </p>
              <button
                onClick={() => {
                  setActiveType("All");
                  setActivePrice(null);
                  setProducts(allProducts);
                }}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
              >
                View All Gadgets
              </button>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-black text-xl text-gray-800">
                👁️ Recently Viewed
              </h2>
              <button
                onClick={() => {
                  setRecentlyViewed([]);
                  localStorage.removeItem("obisco_recently_viewed");
                }}
                className="text-xs text-gray-400 hover:text-red-400 transition underline"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {recentlyViewed.map((item) => (
                <div
                  key={item._id || item.id}
                  onClick={() => openProduct(item)}
                  className="shrink-0 w-[140px] sm:w-[160px] border rounded-xl overflow-hidden bg-white cursor-pointer hover:border-orange-300 hover:shadow-md transition"
                >
                  <div className="h-[100px] bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-xs text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-orange-500 font-black text-xs mt-0.5">
                      ₦{item.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-[10px] capitalize mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast bottom */}
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

export default Products;

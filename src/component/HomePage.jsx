import { useState, useEffect, useRef } from "react";
import { fetchProducts, getReviews, addReview } from "../api/api.js";
import { BsFillCartFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaMobileAlt,
  FaTshirt,
  FaBolt,
  FaWallet,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const BANNERS = [
  {
    id: 1,
    bg: "from-orange-500 to-orange-700",
    emoji: "📱",
    title: "Top Gadgets & Accessories",
    subtitle: "Shop the latest smartphones, laptops & more",
    cta: "Shop Gadgets",
    dept: "gadgets",
  },
  {
    id: 2,
    bg: "from-purple-600 to-pink-600",
    emoji: "👗",
    title: "Fashion & Lifestyle",
    subtitle: "Dress to impress — new arrivals every week",
    cta: "Shop Fashion",
    dept: "fashion",
  },
  {
    id: 3,
    bg: "from-green-500 to-teal-600",
    emoji: "⚡",
    title: "Pay Bills Instantly",
    subtitle: "Airtime, Data, Electricity, Cable TV — all in one place",
    cta: "Pay Bills",
    dept: "vtu",
  },
];

const CATEGORIES = [
  {
    label: "Gadgets",
    icon: <FaMobileAlt size={22} />,
    dept: "gadgets",
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Fashion",
    icon: <FaTshirt size={22} />,
    dept: "fashion",
    color: "bg-pink-100 text-pink-600",
  },

  {
    label: "Pay Bills",
    icon: <FaBolt size={22} />,
    dept: "vtu",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Wallet",
    icon: <FaWallet size={22} />,
    dept: "wallet",
    color: "bg-green-100 text-green-600",
  },
];

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

export default function HomePage({
  addToCart,
  addToWishlist,
  isWishlisted,
  setActiveDepartment,
  setShowVTU,
  setWalletOpen,
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const bannerTimer = useRef(null);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("obisco_recently_viewed")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data);
        setFeaturedProducts(data.filter((p) => p.featured));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(bannerTimer.current);
  }, []);

  const goToBanner = (index) => {
    clearInterval(bannerTimer.current);
    setCurrentBanner(index);
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
  };

  const handleBannerCta = (dept) => {
    if (dept === "vtu") {
      setShowVTU(true);
      return;
    }
    if (dept === "wallet") {
      setWalletOpen(true);
      return;
    }
    setActiveDepartment(dept);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (dept) => {
    if (dept === "vtu") {
      setShowVTU(true);
      return;
    }
    if (dept === "wallet") {
      setWalletOpen(true);
      return;
    }
    setActiveDepartment(dept);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (item, qty = 1, color = "") => {
    addToCart({ ...item, quantity: qty, color });
    setToast(item);
    setTimeout(() => setToast(null), 3000);
  };

  const openProduct = async (item) => {
    document.body.style.overflow = "hidden";
    setSelectedProduct(item);

    // ── Save to recently viewed ──
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
    } catch {}
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

  // ── Filter products ──
  const gadgets = featuredProducts.filter((p) => p.department === "gadgets");
  const fashion = featuredProducts.filter((p) => p.department === "fashion");
  const hotDeals = allProducts.filter((p) => p.hotDeal);

  // ── Horizontal scroll product card ──
  const ProductCard = ({ item }) => (
    <div className="shadow-md rounded-xl hover:scale-105 duration-300 overflow-hidden bg-white cursor-pointer shrink-0 w-[160px] sm:w-[200px]">
      <div onClick={() => openProduct(item)} className="relative">
        <div className="w-full h-[140px] bg-gray-50 flex items-center justify-center overflow-hidden">
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
            <span className="text-red-500 text-base leading-none">♥</span>
          ) : (
            <span className="text-gray-400 text-base leading-none">♡</span>
          )}
        </button>
      </div>
      <div className="px-2 pt-2">
        <p className="font-bold text-xs leading-tight truncate">{item.name}</p>
        <p className="text-orange-500 font-black text-xs mt-0.5">
          ₦{item.amount.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarDisplay rating={item.avgRating || 0} size="text-xs" />
          <span className="text-[10px] text-gray-400">
            {item.avgRating ? `${item.avgRating}` : "No reviews"}
          </span>
        </div>
      </div>
      <div className="px-2 pb-3 mt-2">
        <button
          onClick={() => handleAddToCart(item)}
          className="w-full flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-full transition"
        >
          <BsFillCartFill size={12} /> Add to Cart
        </button>
      </div>
    </div>
  );

  // ── Section row (horizontal scroll) ──
  const SectionRow = ({ title, emoji, products, dept }) => {
    if (products.length === 0) return null;
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-lg sm:text-xl text-gray-800">
            {emoji} {title}
          </h2>
          <button
            onClick={() => handleCategoryClick(dept)}
            className="flex items-center gap-1 text-orange-500 text-xs font-bold hover:underline"
          >
            See all <FaArrowRight size={10} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1640px] mx-auto px-3 sm:px-4 pb-8">
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
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm"
                >
                  <BsFillCartFill size={16} /> Add to Cart — ₦
                  {(selectedProduct.amount * quantity).toLocaleString()}
                </button>
                <button
                  onClick={() => addToWishlist(selectedProduct)}
                  className={`w-full flex items-center justify-center gap-2 border-2 font-bold py-3 rounded-full transition text-sm ${isWishlisted(selectedProduct._id) ? "border-red-500 text-red-500 hover:bg-red-50" : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400"}`}
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
                        placeholder="Share your experience..."
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

      {/* ── SWIPEABLE BANNER ── */}
      <div className="relative mt-4 rounded-2xl overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {BANNERS.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full bg-gradient-to-r ${banner.bg} rounded-2xl p-6 sm:p-10 flex items-center justify-between`}
            >
              <div className="flex-1">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                  Obisco Store
                </p>
                <h2 className="text-white font-black text-xl sm:text-3xl leading-tight mb-2">
                  {banner.title}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mb-4">
                  {banner.subtitle}
                </p>
                <button
                  onClick={() => handleBannerCta(banner.dept)}
                  className="flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm hover:bg-gray-100 transition"
                >
                  {banner.cta} <FaArrowRight size={12} />
                </button>
              </div>
              <span className="text-6xl sm:text-8xl ml-4 hidden sm:block">
                {banner.emoji}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            goToBanner((currentBanner - 1 + BANNERS.length) % BANNERS.length)
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center transition"
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          onClick={() => goToBanner((currentBanner + 1) % BANNERS.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center transition"
        >
          <FaChevronRight size={14} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToBanner(i)}
              className={`w-2 h-2 rounded-full transition-all ${currentBanner === i ? "bg-white w-5" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORY ICONS ── */}
      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryClick(cat.dept)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition`}
            >
              {cat.icon}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 text-center">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── MARQUEE ── */}
      <div className="bg-orange-500 overflow-hidden py-2 mt-6 rounded-xl">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-8 text-white text-xs sm:text-sm font-semibold mx-4"
            >
              <span>🔥 iPhone 17 Pro Max</span>
              <span>⚡ Free delivery in Lagos</span>
              <span>💻 MacBook Pro 14</span>
              <span>📱 Samsung S25 Ultra</span>
              <span>🛒 Shop now & pay on delivery</span>
              <span>💥 Flash deals every day!</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading products...</p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {!loading && (
        <>
          {/* Featured sections — horizontal scroll */}
          <SectionRow
            title="Featured Gadgets"
            emoji="📱"
            products={gadgets}
            dept="gadgets"
          />

          <SectionRow
            title="Featured Fashion"
            emoji="👗"
            products={fashion}
            dept="fashion"
          />

          {/* Pay Bills dark banner */}
          <div
            onClick={() => setShowVTU(true)}
            className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 sm:p-8 flex items-center justify-between cursor-pointer hover:opacity-90 transition"
          >
            <div>
              <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">
                Pay Bills
              </p>
              <h3 className="text-white font-black text-lg sm:text-2xl mb-1">
                Airtime • Data • Light • Cable
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                All your bills in one place — fast and secure
              </p>
            </div>
            <div className="text-5xl ml-4">⚡</div>
          </div>

          {/* Hot Deals — grid */}
          {hotDeals.length > 0 && (
            <div className="mt-8">
              <div className="mb-3">
                <h2 className="font-black text-lg sm:text-xl text-gray-800">
                  🔥 Hot Deals
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Limited time offers — grab them fast!
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hotDeals.map((item) => (
                  <div
                    key={item._id}
                    className="shadow-md rounded-xl overflow-hidden bg-white cursor-pointer hover:scale-105 duration-300"
                  >
                    <div onClick={() => openProduct(item)} className="relative">
                      <div className="w-full h-[140px] bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        🔥 HOT
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
                    </div>
                    <div className="px-2 pt-2">
                      <p className="font-bold text-xs leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-orange-500 font-black text-xs mt-0.5">
                        ₦{item.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarDisplay
                          rating={item.avgRating || 0}
                          size="text-xs"
                        />
                        <span className="text-[10px] text-gray-400">
                          {item.avgRating ? `${item.avgRating}` : "No reviews"}
                        </span>
                      </div>
                    </div>
                    <div className="px-2 pb-3 mt-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-full transition"
                      >
                        <BsFillCartFill size={12} /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="mt-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-black text-lg sm:text-xl text-gray-800">
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

          {/* Empty state */}
          {featuredProducts.length === 0 && hotDeals.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="text-gray-500 text-base font-semibold">
                No featured products yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Add featured products from your admin dashboard
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useState } from "react";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Headlinecards from "./component/Headlinecards";
import Products from "./component/Products";
import Category from "./component/category";
import Footer from "./component/Footer";
import CartSidebar from "./component/cartSidebar";
import AuthModal from "./component/AuthModal";
import TrackOrder from "./component/TrackOrder";
import AdminDashboard from "./component/AdminDashboard";
import ChatBot from "./component/ChatBot";
import WishlistSidebar from "./component/WishListSidebar";
import OrderHistory from "./component/OrderHistory";
import FashionPage from "./component/FashionPage";
import LifestylePage from "./component/LifestylePage";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDepartment, setActiveDepartment] = useState("gadgets");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
const addToCart = (item) => {
  const itemId = item._id || item.id
  setCartItems((prev) => {
    const existing = prev.find((i) => {
      const existingId = i._id || i.id
      return existingId && itemId && existingId === itemId
    })
    if (existing) {
      return prev.map((i) => {
        const existingId = i._id || i.id
        return existingId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      })
    }
    return [...prev, { ...item, quantity: 1 }]
  })
}

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id && i.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i._id === id || i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === id || i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("obisco_wishlist")) || [];
    } catch {
      return [];
    }
  });
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const addToWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i._id === item._id || i.id === item.id);
      if (exists) {
        const updated = prev.filter((i) => i._id !== item._id && i.id !== item.id);
        localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
        return updated;
      }
      const updated = [...prev, item];
      localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id) =>
    wishlist.some((i) => i._id === id || i.id === id);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sharedProps = {
    addToCart,
    addToWishlist,
    isWishlisted,
    searchQuery,
    setSearchQuery,
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        setCartOpen={setCartOpen}
        setAuthOpen={setAuthOpen}
        setTrackOpen={setTrackOpen}
        setAdminOpen={setAdminOpen}
        wishlist={wishlist}
        setWishlistOpen={setWishlistOpen}
        setOrderHistoryOpen={setOrderHistoryOpen}
        activeDepartment={activeDepartment}
        setActiveDepartment={setActiveDepartment}
      />

      {/* ── Gadgets Department ── */}
      {activeDepartment === "gadgets" && (
        <>
          <Hero />
          <Headlinecards onCategoryClick={handleCategoryClick} />
          <Products
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            isWishlisted={isWishlisted}
          />
          <Category onCategoryClick={handleCategoryClick} />
        </>
      )}

      {/* ── Fashion Department ── */}
      {activeDepartment === "fashion" && (
        <FashionPage {...sharedProps} />
      )}

      {/* ── Lifestyle Department ── */}
      {activeDepartment === "lifestyle" && (
        <LifestylePage {...sharedProps} />
      )}

      <Footer />

      <CartSidebar
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        setCartItems={setCartItems}
      />
      <WishlistSidebar
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        wishlist={wishlist}
        addToCart={addToCart}
        addToWishlist={addToWishlist}
      />
      <OrderHistory
        orderHistoryOpen={orderHistoryOpen}
        setOrderHistoryOpen={setOrderHistoryOpen}
      />
      <AuthModal authOpen={authOpen} setAuthOpen={setAuthOpen} />
      <TrackOrder trackOpen={trackOpen} setTrackOpen={setTrackOpen} />
      <AdminDashboard adminOpen={adminOpen} setAdminOpen={setAdminOpen} />
      <ChatBot />
    </>
  );
};

export default App;
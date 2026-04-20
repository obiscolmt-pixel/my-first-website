import React, { useState } from "react";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Headlinecards from "./component/Headlinecards";
import Products from "./component/Products";
import Category from "./component/Category";
import Footer from "./component/footer";
import CartSidebar from "./component/CartSidebar";
import AuthModal from "./component/AuthModal";
import TrackOrder from "./component/TrackOrder";
import AdminDashboard from "./component/AdminDashboard";
import WhatsAppButton from "./component/WhatsAppButton";
import ChatBot from "./component/ChatBot";
import WishlistSidebar from "./component/WishlistSidebar";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
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
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        const updated = prev.filter((i) => i._id !== item._id);
        localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
        return updated;
      }
      const updated = [...prev, item];
      localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => i._id === id);

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
      />
      <Hero />
      <Headlinecards />
      <Products
        searchQuery={searchQuery}
        addToCart={addToCart}
        addToWishlist={addToWishlist}
        isWishlisted={isWishlisted}
      />

      <Category />
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

      <AuthModal authOpen={authOpen} setAuthOpen={setAuthOpen} />

      <TrackOrder trackOpen={trackOpen} setTrackOpen={setTrackOpen} />

      <AdminDashboard adminOpen={adminOpen} setAdminOpen={setAdminOpen} />
      <WhatsAppButton />
      <ChatBot />
    </>
  );
};

export default App;

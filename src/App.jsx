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
import ChatBot from './component/ChatBot'

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
      />
      <Hero />
      <Headlinecards />
      <Products
        searchQuery={searchQuery}
        addToCart={addToCart}
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

      <AuthModal authOpen={authOpen} setAuthOpen={setAuthOpen} />

      <TrackOrder trackOpen={trackOpen} setTrackOpen={setTrackOpen} />

      <AdminDashboard adminOpen={adminOpen} setAdminOpen={setAdminOpen} />
      <WhatsAppButton />
      <ChatBot />
    </>
  );
};

export default App;

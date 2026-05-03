import React, { useState, useEffect } from "react";
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
import RegisterBusiness from "./component/RegisterBusiness";
import CookieBanner from "./component/CookieBanner";
import PrivacyPolicy from "./component/PrivacyPolicy";
import TermsConditions from "./component/TermsConditions";
import VTUPage from "./component/VTUPage";
import { messaging, getToken } from './firebase'

// ── Onboarding Component ──
const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);

  const requestNotification = async () => {
  let granted = false;
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    granted = permission === "granted";
  }
  onDone(granted);
};

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#111827",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {step === 0 && (
        <>
          {/* Splash Screen */}
          <img
            src="/icons/icon-512.png"
            alt="Obisco Store"
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              marginBottom: 24,
            }}
          />
          <h1
            style={{
              color: "#f97316",
              fontSize: 32,
              fontWeight: 900,
              margin: 0,
            }}
          >
            Obisco Store
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 15, marginTop: 8 }}>
            Your one-stop shop in Nigeria
          </p>
          <button
            onClick={() => setStep(1)}
            style={{
              marginTop: 40,
              backgroundColor: "#f97316",
              color: "white",
              border: "none",
              borderRadius: 50,
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </>
      )}

      {step === 1 && (
        <>
          {/* Notification Permission */}
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔔</div>
          <h2
            style={{ color: "white", fontSize: 24, fontWeight: 800, margin: 0 }}
          >
            Stay Updated!
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 15,
              marginTop: 12,
              maxWidth: 300,
              lineHeight: 1.6,
            }}
          >
            Get notified about new deals, order updates and exclusive offers
            from Obisco Store.
          </p>
          <button
            onClick={requestNotification}
            style={{
              marginTop: 32,
              backgroundColor: "#f97316",
              color: "white",
              border: "none",
              borderRadius: 50,
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Allow Notifications
          </button>
         <button onClick={() => onDone(false)}
            style={{
              marginTop: 12,
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "none",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>
        </>
      )}
    </div>
  );
};

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDepartment, setActiveDepartment] = useState("gadgets");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [registerBizOpen, setRegisterBizOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showVTU, setShowVTU] = useState(false);


  const requestNotificationToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    })
    if (token) {
      console.log('FCM Token:', token)
      // Send token to backend
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/save-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      })
    }
  } catch (err) {
    console.log('Notification token error:', err.message)
  }
}

  // Check if first time opening
  useEffect(() => {
    const hasOnboarded = localStorage.getItem("obisco_onboarded");
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingDone = (permissionGranted = false) => {
  localStorage.setItem("obisco_onboarded", "true")
  setShowOnboarding(false)
  if (permissionGranted) {
    requestNotificationToken()
  }
}

  const addToCart = (item) => {
    const itemId = item._id || item.id;
    setCartItems((prev) => {
      const existing = prev.find((i) => {
        const existingId = i._id || i.id;
        return existingId && itemId && existingId === itemId;
      });
      if (existing) {
        return prev.map((i) => {
          const existingId = i._id || i.id;
          return existingId === itemId ? { ...i, quantity: i.quantity + 1 } : i;
        });
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id && i.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i._id === id || i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === id || i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        )
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
    const itemId = item._id || item.id;
    setWishlist((prev) => {
      const exists = prev.find((i) => {
        const existingId = i._id || i.id;
        return existingId && itemId && existingId === itemId;
      });
      if (exists) {
        const updated = prev.filter((i) => {
          const existingId = i._id || i.id;
          return existingId !== itemId;
        });
        localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
        return updated;
      }
      const updated = [...prev, item];
      localStorage.setItem("obisco_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => (i._id || i.id) === id);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
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
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}

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
        setRegisterBizOpen={setRegisterBizOpen}
        setShowVTU={setShowVTU}
      />

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

      {activeDepartment === "fashion" && <FashionPage {...sharedProps} />}
      {activeDepartment === "lifestyle" && <LifestylePage {...sharedProps} />}

      <Footer setPrivacyOpen={setPrivacyOpen} setTermsOpen={setTermsOpen} />

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
      <RegisterBusiness
        registerBizOpen={registerBizOpen}
        setRegisterBizOpen={setRegisterBizOpen}
      />
      <CookieBanner />
      <PrivacyPolicy open={privacyOpen} setOpen={setPrivacyOpen} />
      <TermsConditions open={termsOpen} setOpen={setTermsOpen} />
      {showVTU && <VTUPage onClose={() => setShowVTU(false)} />}
    </>
  );
};

export default App;

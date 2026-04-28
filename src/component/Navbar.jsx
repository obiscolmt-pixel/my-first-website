import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineClose,
  AiFillTag,
  AiOutlineHome,
} from "react-icons/ai";
import { BsFillCartFill, BsFillSaveFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { MdFavorite, MdHelp } from "react-icons/md";
import {
  FaUser,
  FaUserFriends,
  FaWallet,
  FaSignOutAlt,
  FaMobileAlt,
  FaTshirt,
  FaStar,
} from "react-icons/fa";
import { fetchProducts } from "../api/api.js";

const DEPARTMENTS = [
  { key: "gadgets", label: "Gadgets", icon: <FaMobileAlt size={14} /> },
  { key: "fashion", label: "Fashion", icon: <FaTshirt size={14} /> },
  { key: "lifestyle", label: "Lifestyle", icon: <FaStar size={14} /> },
];

const Navbar = ({
  searchQuery,
  setSearchQuery,
  cartItems,
  setCartOpen,
  setAuthOpen,
  setTrackOpen,
  setAdminOpen,
  setRegisterBizOpen,
  wishlist,
  setWishlistOpen,
  setOrderHistoryOpen,
  activeDepartment,
  setActiveDepartment,
}) => {
  const [nav, setNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts("");
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to load products for search:", err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowInstall(false);
      setNav(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    if (item.department && item.department !== activeDepartment) {
      setActiveDepartment(item.department);
    }
    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-50 shadow-sm" style={{ position: '-webkit-sticky', top: 0 }}>
        <div className="max-w-[1640px] mx-auto flex justify-between items-center px-5 py-0 pb-0">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div onClick={() => setNav(!nav)} className="cursor-pointer">
              <AiOutlineMenu size={28} />
            </div>
            <img
              src="/obisco-logo.png"
              alt="OBISCO Store"
              className="h-20 w-auto object-contain cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          {/* Search — desktop */}
          <div
            className="hidden md:block relative w-[300px] lg:w-[500px]"
            ref={searchRef}
          >
            <div className="flex items-center bg-gray-100 rounded-full px-4">
              <AiOutlineSearch size={22} className="text-gray-400" />
              <input
                className="bg-transparent p-2 w-full focus:outline-none text-sm"
                type="text"
                placeholder="Search all products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
              />
              {searchQuery && (
                <AiOutlineClose
                  size={18}
                  className="cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                />
              )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <p className="text-xs text-gray-400 px-4 py-2 border-b">
                  {suggestions.length} result
                  {suggestions.length !== 1 ? "s" : ""} found
                </p>
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition border-b last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-orange-500 capitalize">
                          {item.category}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            item.department === "fashion"
                              ? "bg-pink-100 text-pink-500"
                              : item.department === "lifestyle"
                                ? "bg-purple-100 text-purple-500"
                                : "bg-blue-100 text-blue-500"
                          }`}
                        >
                          {item.department || "gadgets"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-orange-500 shrink-0">
                      ₦{item.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div
                  onClick={() => {
                    setShowSuggestions(false);
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 text-center text-sm text-orange-500 font-bold hover:bg-orange-50 cursor-pointer transition"
                >
                  View all results for "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <AiOutlineSearch size={15} />
            </button>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() =>
                  user ? setShowUserMenu(!showUserMenu) : setAuthOpen(true)
                }
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-black rounded-full px-3 py-2 transition text-sm"
              >
                <FaUser size={12} />
                <span className="hidden sm:inline">
                  {user ? user.fullName.split(" ")[0] : "Account"}
                </span>
              </button>
              {showUserMenu && user && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 w-52 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-orange-50">
                      <p className="font-bold text-gray-800 text-sm">
                        {user.fullName}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li
                        onClick={() => {
                          setTrackOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <TbTruckDelivery
                          size={18}
                          className="text-orange-500"
                        />{" "}
                        Track Order
                      </li>
                      <li
                        onClick={() => {
                          setWishlistOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <MdFavorite size={18} className="text-orange-500" />{" "}
                        Wishlist
                      </li>
                      <li
                        onClick={() => {
                          setOrderHistoryOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <TbTruckDelivery
                          size={18}
                          className="text-orange-500"
                        />{" "}
                        My Orders
                      </li>
                    </ul>
                    <div className="border-t px-3 py-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-full transition text-sm"
                      >
                        <FaSignOutAlt size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="bg-black text-white flex items-center gap-2 rounded-full px-3 sm:px-5 py-2 relative transition hover:bg-gray-800"
            >
              <BsFillCartFill size={13} />
              <span className="hidden sm:inline text-sm">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Department Tabs ── */}
        <div className="border-t border-gray-100 bg-orange-50">
          <div className="max-w-[1640px] mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.key}
                onClick={() => {
                  setActiveDepartment(dept.key);
                  setSearchQuery("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeDepartment === dept.key
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-orange-400 hover:border-orange-300"
                }`}
              >
                {dept.icon}
                {dept.label}
              </button>
            ))}

            {/* Register Your Business Button */}

            <button
              onClick={() => setRegisterBizOpen(true)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent text-green-600 hover:text-green-500 hover:border-green-400 transition-all duration-200 shrink-0"
            >
              🏪 Register Business
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white shadow-sm" ref={searchRef}>
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <AiOutlineSearch size={20} className="text-gray-400" />
            <input
              className="bg-transparent p-2 w-full focus:outline-none text-sm"
              type="text"
              placeholder={`Search all products......`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <AiOutlineClose
                size={18}
                className="cursor-pointer text-gray-400"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
              />
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mt-2 overflow-hidden">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    handleSelectSuggestion(item);
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition border-b last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-orange-500 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-orange-500 shrink-0">
                    ₦{item.amount.toLocaleString()}
                  </p>
                </div>
              ))}
              <div
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchOpen(false);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 text-center text-sm text-orange-500 font-bold hover:bg-orange-50 cursor-pointer"
              >
                View all results for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {nav && (
        <div
          className="bg-black/80 fixed w-full h-screen z-[70] top-0 left-0"
          onClick={() => setNav(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={
          nav
            ? "bg-white fixed top-0 left-0 w-[280px] sm:w-[300px] h-screen z-[80] duration-300 flex flex-col"
            : "bg-white fixed top-0 left-[-100%] w-[280px] sm:w-[300px] h-screen z-[80] duration-300 flex flex-col"
        }
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-black">
            OBISCO <span className="text-orange-500">Store</span>
          </h2>
          <AiOutlineClose
            onClick={() => setNav(false)}
            size={22}
            className="cursor-pointer text-gray-500 hover:text-black"
          />
        </div>

        {user && (
          <div className="px-4 py-2 border-b bg-orange-50">
            <p className="font-bold text-gray-800 text-sm">{user.fullName}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
        )}

        {/* Department switcher in drawer */}
        <div className="px-4 py-2 border-b">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
            Departments
          </p>
          <div className="flex flex-col gap-1">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.key}
                onClick={() => {
                  setActiveDepartment(dept.key);
                  setSearchQuery("");
                  setNav(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeDepartment === dept.key
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                {dept.icon} {dept.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 border-b">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 rounded-full py-2 text-sm font-semibold hover:bg-red-100 transition"
            >
              <FaSignOutAlt size={14} /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthOpen(true);
                setNav(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-full py-2 text-sm font-semibold hover:bg-gray-200 transition"
            >
              <FaUser size={14} /> Sign In
            </button>
          )}
          <button
            onClick={() => {
              setCartOpen(true);
              setNav(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white rounded-full py-2 text-sm font-semibold hover:bg-orange-600 transition"
          >
            <BsFillCartFill size={14} /> Cart{" "}
            {cartItems.length > 0 &&
              `(${cartItems.reduce((acc, i) => acc + i.quantity, 0)})`}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col p-4 text-gray-800">
            {/* Install App Button */}
            {showInstall && (
              <li
                onClick={handleInstall}
                className="py-3 flex items-center border-b border-gray-100 cursor-pointer transition bg-orange-50 rounded-xl px-3 mb-2"
              >
                <span className="mr-4 text-2xl">📲</span>
                <div>
                  <p className="text-orange-500 font-bold text-base">
                    Install App
                  </p>
                  <p className="text-xs text-gray-400">Shop D Go</p>
                </div>
              </li>
            )}

            <li
              onClick={() => {
                setNav(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <AiOutlineHome size={22} className="mr-4 text-orange-500" /> Home
            </li>
            <li
              onClick={() => {
                setTrackOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <TbTruckDelivery size={22} className="mr-4 text-orange-500" />{" "}
              Track Order
            </li>
            <li
              onClick={() => {
                setOrderHistoryOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <TbTruckDelivery size={22} className="mr-4 text-orange-500" /> My
              Orders
            </li>
            <li
              onClick={() => {
                setWishlistOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <MdFavorite size={22} className="mr-4 text-orange-500" /> Wishlist
              {wishlist.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </li>
            <li
              onClick={() => {
                alert("💰 Wallet — Coming Soon!");
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <FaWallet size={22} className="mr-4 text-orange-500" /> Wallet
            </li>
            <li
              onClick={() => {
                alert("🛠️ Support — Coming Soon!");
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <MdHelp size={22} className="mr-4 text-orange-500" /> Support
            </li>
            <li
              onClick={() => {
                alert("🏷️ Deals & Offers — Coming Soon!");
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <AiFillTag size={22} className="mr-4 text-orange-500" /> Deals &
              Offers
            </li>
            <li
              onClick={() => {
                alert("👥 Refer a Friend — Coming Soon!");
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <FaUserFriends size={22} className="mr-4 text-orange-500" /> Refer
              a Friend
            </li>
            <li
              onClick={() => {
                setAdminOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center cursor-pointer hover:text-orange-500 transition"
            >
              <AiFillTag size={22} className="mr-4 text-orange-500" /> ⚙️ Admin
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t">
          <p className="text-xs text-gray-400 text-center">
            © 2025 OBISCO Store
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;

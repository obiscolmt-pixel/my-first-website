import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineClose,
  AiFillTag,
} from "react-icons/ai";
import { BsFillCartFill, BsFillSaveFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { MdFavorite, MdHelp } from "react-icons/md";
import { FaUser, FaUserFriends, FaWallet, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({
  searchQuery,
  setSearchQuery,
  cartItems,
  setCartOpen,
  setAuthOpen,
  setTrackOpen,
  setAdminOpen,
}) => {
  const [nav, setNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div onClick={() => setNav(!nav)} className="cursor-pointer">
            <AiOutlineMenu size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">
            <span className="font-bold text-black">OBISCO</span>{" "}
            <span className="text-orange-500">gadgets</span>
          </h1>
        </div>

        {/* Search — desktop */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 w-[300px] lg:w-[500px]">
          <AiOutlineSearch size={22} className="text-gray-400" />
          <input
            className="bg-transparent p-2 w-full focus:outline-none text-sm"
            type="text"
            placeholder="Search gadgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <AiOutlineClose
              size={18}
              className="cursor-pointer text-gray-400 hover:text-black"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search icon — mobile only */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <AiOutlineSearch size={22} />
          </button>

          {/* Account button — shows dropdown if logged in */}
          <div className="relative">
            <button
              onClick={() =>
                user ? setShowUserMenu(!showUserMenu) : setAuthOpen(true)
              }
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-black rounded-full px-3 py-2 transition text-sm"
            >
              <FaUser size={14} />
              <span className="hidden sm:inline">
                {user ? user.fullName.split(" ")[0] : "Account"}
              </span>
            </button>

            {/* Dropdown menu — only when logged in */}
            {showUserMenu && user && (
              <>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 w-52 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b bg-orange-50">
                    <p className="font-bold text-gray-800 text-sm">
                      {user.fullName}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <ul className="py-1">
                    <li
                      onClick={() => {
                        setTrackOpen(true);
                        setNav(false);
                      }}
                      className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
                    >
                      <TbTruckDelivery
                        size={22}
                        className="mr-4 text-orange-500"
                      />
                      Track Order
                    </li>
                    <li
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <MdFavorite size={18} className="text-orange-500" />
                      Wishlist
                    </li>
                    <li
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <AiFillTag size={18} className="text-orange-500" />
                      Deals & Offers
                    </li>
                  </ul>

                  {/* Sign out */}
                  <div className="border-t px-3 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-full transition text-sm"
                    >
                      <FaSignOutAlt size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="bg-black text-white flex items-center gap-2 rounded-full px-3 sm:px-5 py-2 relative transition hover:bg-gray-800"
          >
            <BsFillCartFill size={18} />
            <span className="hidden sm:inline text-sm">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4">
            <AiOutlineSearch size={20} className="text-gray-400" />
            <input
              className="bg-transparent p-2 w-full focus:outline-none text-sm"
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <AiOutlineClose
                size={18}
                className="cursor-pointer text-gray-400"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {nav && (
        <div
          className="bg-black/80 fixed w-full h-screen z-20 top-0 left-0"
          onClick={() => setNav(false)}
        />
      )}

      {/* Side drawer */}
      <div
        className={
          nav
            ? "bg-white fixed top-0 left-0 w-[280px] sm:w-[300px] h-screen z-30 duration-300 flex flex-col"
            : "bg-white fixed top-0 left-[-100%] w-[280px] sm:w-[300px] h-screen z-30 duration-300 flex flex-col"
        }
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-black">
            OBISCO <span className="text-orange-500">Gadgets</span>
          </h2>
          <AiOutlineClose
            onClick={() => setNav(false)}
            size={26}
            className="cursor-pointer text-gray-500 hover:text-black"
          />
        </div>

        {/* User info in drawer — if logged in */}
        {user ? (
          <div className="px-4 py-3 border-b bg-orange-50">
            <p className="font-bold text-gray-800 text-sm">{user.fullName}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        ) : null}

        {/* Mobile Account & Cart shortcuts */}
        <div className="flex gap-2 px-4 py-3 border-b">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 rounded-full py-2 text-sm font-semibold hover:bg-red-100 transition"
            >
              <FaSignOutAlt size={14} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthOpen(true);
                setNav(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-full py-2 text-sm font-semibold hover:bg-gray-200 transition"
            >
              <FaUser size={14} />
              Sign In
            </button>
          )}
          <button
            onClick={() => {
              setCartOpen(true);
              setNav(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white rounded-full py-2 text-sm font-semibold hover:bg-orange-600 transition"
          >
            <BsFillCartFill size={14} />
            Cart{" "}
            {cartItems.length > 0 &&
              `(${cartItems.reduce((acc, i) => acc + i.quantity, 0)})`}
          </button>
        </div>

        {/* Drawer Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col p-4 text-gray-800">
            <li
              onClick={() => {
                setTrackOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center border-b border-gray-100 cursor-pointer hover:text-orange-500 transition"
            >
              <TbTruckDelivery size={22} className="mr-4 text-orange-500" />
              Track Order
            </li>
            <li className="text-lg py-3 flex items-center border-b border-gray-100">
              <MdFavorite size={22} className="mr-4 text-orange-500" />
              Wishlist
            </li>
            <li className="text-lg py-3 flex items-center border-b border-gray-100">
              <FaWallet size={22} className="mr-4 text-orange-500" />
              Wallet
            </li>
            <li className="text-lg py-3 flex items-center border-b border-gray-100">
              <MdHelp size={22} className="mr-4 text-orange-500" />
              Support
            </li>
            <li className="text-lg py-3 flex items-center border-b border-gray-100">
              <AiFillTag size={22} className="mr-4 text-orange-500" />
              Deals & Offers
            </li>
            <li className="text-lg py-3 flex items-center border-b border-gray-100">
              <BsFillSaveFill size={22} className="mr-4 text-orange-500" />
              Saved Items
            </li>
            <li className="text-lg py-3 flex items-center">
              <FaUserFriends size={22} className="mr-4 text-orange-500" />
              Refer a Friend
            </li>
            <li
              onClick={() => {
                setAdminOpen(true);
                setNav(false);
              }}
              className="text-lg py-3 flex items-center cursor-pointer hover:text-orange-500 transition"
            >
              <AiFillTag size={22} className="mr-4 text-orange-500" />
              ⚙️ Admin
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-gray-400 text-center">
            © 2025 OBISCO Gadgets
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;

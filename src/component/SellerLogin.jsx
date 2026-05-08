import React, { useState } from "react";
import { FaStore, FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const API_BASE = import.meta.env.VITE_API_URL || "https://obisco-gadgets-backend.onrender.com";

const SellerLogin = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("sellerToken", data.token);
        localStorage.setItem("seller", JSON.stringify(data.seller));
        onLoginSuccess(data.seller);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[420px] bg-white z-[70] rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <FaStore size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Seller Login</p>
              <p className="text-orange-100 text-xs">Access your Seller Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-orange-200 transition">
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : "🏪 Sign In to Seller Dashboard"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Not a seller yet?{" "}
            <button onClick={onClose} className="text-orange-500 font-semibold hover:underline">
              Become a Seller
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SellerLogin;

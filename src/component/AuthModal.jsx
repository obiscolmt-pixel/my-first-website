import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../api/api.js";
import { GoogleLogin } from "@react-oauth/google";
import { googleSignIn } from "../api/api.js";

const AuthModal = ({ authOpen, setAuthOpen }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSignIn) {
      if (!form.email || !form.password) {
        alert("Please fill in all fields.");
        return;
      }
      setLoading(true);
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setLoggedInUser(res.user);
        setSuccess(true);
      } else {
        alert(res.message || "Login failed. Please try again.");
      }
    } else {
      if (
        !form.fullName ||
        !form.email ||
        !form.phone ||
        !form.password ||
        !form.confirmPassword
      ) {
        alert("Please fill in all fields.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      setLoading(true);
      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setLoading(false);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setLoggedInUser(res.user);
        setSuccess(true);
      } else {
        alert(res.message || "Registration failed. Please try again.");
      }
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const res = await googleSignIn(credentialResponse.credential)
      if (res.token) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
        setAuthOpen(false)
        window.location.reload()
      } else {
        // Auto retry once if server error
        const retry = await googleSignIn(credentialResponse.credential)
        if (retry.token) {
          localStorage.setItem("token", retry.token)
          localStorage.setItem("user", JSON.stringify(retry.user))
          setAuthOpen(false)
          window.location.reload()
        } else {
          alert("Google Sign In failed. Please try again in a moment.")
        }
      }
    } catch (err) {
      alert("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert("Please enter your email address.");
      return;
    }
    setLoading(true);
    const res = await forgotPassword(forgotEmail);
    setLoading(false);
    if (res.message) {
      setResetStep(2);
    } else {
      alert(res.message || "Something went wrong.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    const res = await resetPassword(forgotEmail, resetCode, newPassword);
    setLoading(false);
    if (res.message === "Password reset successful! You can now sign in.") {
      alert("✅ Password reset successful! Please sign in.");
      setForgotMode(false);
      setResetStep(1);
      setResetCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setForgotEmail("");
      setIsSignIn(true);
    } else {
      alert(res.message || "Something went wrong.");
    }
  };

  const handleClose = () => {
    setAuthOpen(false);
    setSuccess(false);
    setLoading(false);
    setForgotMode(false);
    setForgotEmail("");
    setForgotSent(false);
    setResetStep(1);
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  if (!authOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="bg-black/60 fixed inset-0 z-40" onClick={handleClose} />

      {/* Modal */}
      <div
        className="
        fixed z-50
        bottom-0 left-0 right-0 rounded-t-3xl
        sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto
        sm:-translate-x-1/2 sm:-translate-y-1/2
        sm:rounded-2xl sm:w-[420px]
        bg-white shadow-2xl
        max-h-[92vh] sm:max-h-[90vh]
        flex flex-col
        duration-300
      "
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 pb-6 pt-2 sm:pt-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800">
                {success
                  ? "🎉 Welcome!"
                  : forgotMode
                    ? resetStep === 1
                      ? "🔐 Forgot Password"
                      : resetStep === 2
                        ? "📧 Enter Code"
                        : "🔑 New Password"
                    : isSignIn
                      ? "Sign In"
                      : "Create Account"}
              </h2>
              {!success && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {forgotMode
                    ? resetStep === 1
                      ? "We will send you a 6-digit reset code"
                      : resetStep === 2
                        ? `Code sent to ${forgotEmail}`
                        : "Enter your new password"
                    : isSignIn
                      ? "Welcome back to OBISCO Gadgets"
                      : "Join OBISCO Gadgets today"}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-black transition p-1 shrink-0"
            >
              <AiOutlineClose size={22} />
            </button>
          </div>

          {/* Success Screen */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser size={28} className="text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {isSignIn ? "Welcome Back!" : "Account Created!"}
              </h3>
              <p className="text-gray-500 text-sm mb-1">
                {isSignIn ? "Signed in as " : "Welcome, "}
                <span className="font-bold text-orange-500">
                  {loggedInUser?.fullName || loggedInUser?.email}
                </span>
              </p>
              {!isSignIn && (
                <p className="text-gray-400 text-xs mb-2">
                  📧 A welcome email has been sent to{" "}
                  <span className="font-bold">{loggedInUser?.email}</span>
                </p>
              )}
              <p className="text-gray-400 text-xs mb-6">
                You can now shop and checkout seamlessly.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : forgotMode ? (
            /* Forgot Password Flow */
            <div className="flex flex-col gap-3">
              {/* Step 1 — Enter Email */}
              {resetStep === 1 && (
                <>
                  <p className="text-gray-500 text-sm">
                    Enter your registered email and we'll send you a 6-digit
                    reset code.
                  </p>
                  <input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Email Address"
                    type="email"
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                  />
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                  <button
                    onClick={() => setForgotMode(false)}
                    className="text-center text-sm text-gray-500 hover:text-orange-500 transition"
                  >
                    ← Back to Sign In
                  </button>
                </>
              )}

              {/* Step 2 — Enter Code */}
              {resetStep === 2 && (
                <>
                  <div className="text-center mb-2">
                    <p className="text-5xl mb-3">📧</p>
                    <p className="text-gray-500 text-sm">
                      We sent a 6-digit code to{" "}
                      <span className="text-orange-500 font-bold">
                        {forgotEmail}
                      </span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Check your spam folder if you don't see it.
                    </p>
                  </div>

                  {/* Code input */}
                  <input
                    value={resetCode}
                    onChange={(e) =>
                      setResetCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    type="text"
                    maxLength={6}
                    className="border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-4 text-center tracking-[0.8em] font-black text-2xl focus:outline-none w-full"
                  />

                  <button
                    onClick={() => {
                      if (resetCode.length !== 6) {
                        alert("Please enter the complete 6-digit code.");
                        return;
                      }
                      setResetStep(3);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm"
                  >
                    Verify Code →
                  </button>

                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-center text-sm text-orange-500 hover:underline disabled:opacity-50"
                  >
                    {loading ? "Resending..." : "Didn't receive code? Resend"}
                  </button>

                  <button
                    onClick={() => {
                      setResetStep(1);
                      setResetCode("");
                    }}
                    className="text-center text-sm text-gray-500 hover:text-orange-500 transition"
                  >
                    ← Change Email
                  </button>
                </>
              )}

              {/* Step 3 — Enter New Password */}
              {resetStep === 3 && (
                <>
                  <p className="text-gray-500 text-sm">
                    Enter your new password below.
                  </p>

                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    type="password"
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                  />
                  <input
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    type="password"
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                  />

                  {/* Password match indicator */}
                  {confirmNewPassword && (
                    <p
                      className={`text-xs ${newPassword === confirmNewPassword ? "text-green-500" : "text-red-500"}`}
                    >
                      {newPassword === confirmNewPassword
                        ? "✅ Passwords match"
                        : "❌ Passwords do not match"}
                    </p>
                  )}

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setResetStep(2);
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                    className="text-center text-sm text-gray-500 hover:text-orange-500 transition"
                  >
                    ← Back
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Toggle Tabs */}
              <div className="flex bg-gray-100 rounded-full p-1 mb-5">
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                    isSignIn
                      ? "bg-orange-500 text-white shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                    !isSignIn
                      ? "bg-orange-500 text-white shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-3">
                {/* Sign Up only fields */}
                {!isSignIn && (
                  <>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      type="tel"
                      className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                    />
                  </>
                )}

                {/* Common fields */}
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  type="email"
                  className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                />
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                />

                {/* Sign Up only */}
                {!isSignIn && (
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    type="password"
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                  />
                )}

                {/* Forgot Password */}
                {isSignIn && (
                  <p
                    onClick={() => {
                      setForgotMode(true);
                      setResetStep(1);
                    }}
                    className="text-right text-xs text-orange-500 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm mt-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Please wait...
                    </>
                  ) : isSignIn ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google Sign In */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      alert("Google Sign In failed. Please try again.")
                    }
                    text={isSignIn ? "signin_with" : "signup_with"}
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    width="360"
                  />
                </div>

                {/* Switch */}
                <p className="text-center text-xs text-gray-500 mt-1">
                  {isSignIn
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="text-orange-500 font-bold cursor-pointer hover:underline"
                  >
                    {isSignIn ? "Sign Up" : "Sign In"}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;

import React, { useState } from "react";
import { BsFillCartFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { placeOrder, validatePromo, usePromo } from "../api/api.js";

const CartSidebar = ({
  cartOpen,
  setCartOpen,
  cartItems,
  removeFromCart,
  increaseQty,
  decreaseQty,
  setCartItems,
}) => {
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [totalAmountSnapshot, setTotalAmountSnapshot] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);
  const [promoError, setPromoError] = useState("");

  const totalAmount = cartItems.reduce((acc, i) => acc + i.amount * i.quantity, 0);
  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const discountAmount = promoResult?.discount || 0;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    const res = await validatePromo(promoCode, totalAmount);
    setPromoLoading(false);
    if (res.valid) {
      setPromoResult(res);
    } else {
      setPromoError(res.message || "Invalid promo code.");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoResult(null);
    setPromoError("");
  };

  const validateForm = () => {
    if (!form.fullName || !form.phone || !form.email || !form.address || !form.city || !form.state) {
      alert("Please fill in all delivery details before placing your order.");
      return false;
    }
    return true;
  };

  const createOrder = async (paid = false) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await placeOrder({
      userId: user?._id || user?.id || null,
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        image: item.image,
        amount: item.amount,
        quantity: item.quantity,
        color: item.color || "Default",
        category: item.category,
      })),
      totalAmount: finalAmount,
      delivery: form,
      promoCode: promoResult?.code || null,
      discount: discountAmount || 0,
      paymentStatus: paid ? "paid" : "unpaid",
      paymentMethod: paid ? "paystack" : "bank_transfer",
    });
    return res;
  };

  const onPaystackSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await createOrder(true);
      if (res.orderId) {
        if (promoResult?.code) await usePromo(promoResult.code);
        setTotalAmountSnapshot(finalAmount);
        setOrderId(res.orderId);
        setOrderPlaced(true);
        setCartItems([]);
        setPromoResult(null);
        setPromoCode("");
      } else {
        alert(res.message || "Order failed after payment. Contact support with ref: " + response.reference);
      }
    } catch (err) {
      alert("Payment successful but order failed. Contact support with ref: " + response.reference);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!validateForm()) return;

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: finalAmount * 100,
      currency: "NGN",
      ref: `obisco_${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: form.fullName },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
          { display_name: "Address", variable_name: "address", value: `${form.address}, ${form.city}, ${form.state}` },
        ],
      },
      callback: function (response) {
        onPaystackSuccess(response);
      },
      onClose: function () {
        console.log("Payment closed");
      },
    });
    handler.openIframe();
  };

  const handleBankTransferOrder = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await createOrder(false);
      if (res.orderId) {
        if (promoResult?.code) await usePromo(promoResult.code);
        setTotalAmountSnapshot(finalAmount);
        setOrderId(res.orderId);
        setOrderPlaced(true);
        setCartItems([]);
        setPromoResult(null);
        setPromoCode("");
      } else {
        alert(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Failed to place order. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCartOpen(false);
    setCheckout(false);
    setOrderPlaced(false);
    setOrderId(null);
    setForm({ fullName: "", email: "", phone: "", address: "", city: "", state: "" });
  };

  const getItemId = (item) => item._id || item.id;

  return (
    <>
      {cartOpen && (
        <div className="bg-black/60 fixed w-full h-screen z-[60] top-0 left-0" onClick={handleClose} />
      )}

      <div className={cartOpen ? "fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-white z-[70] duration-300 flex flex-col" : "fixed top-0 right-[-100%] w-full sm:w-[420px] h-screen bg-white z-[70] duration-300 flex flex-col"}>

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold">
            {orderPlaced ? "✅ Order Placed" : checkout ? "📦 Checkout" : "My Cart"}
            {!checkout && !orderPlaced && (
              <span className="text-orange-500 ml-1 text-lg sm:text-xl">({totalItems})</span>
            )}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black transition p-1">
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">

          {/* Order Success */}
          {orderPlaced ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-2">
              <p className="text-5xl sm:text-6xl mb-4">🎉</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Thank you, <span className="font-bold text-orange-500">{form.fullName}</span>!
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-2">
                Delivering to <span className="font-bold">{form.address}, {form.city}, {form.state}</span>
              </p>
              {form.email && (
                <p className="text-xs text-gray-400 mb-2">
                  📧 Confirmation sent to <span className="font-bold text-orange-500">{form.email}</span>
                </p>
              )}
              {orderId && (
                <p className="text-xs text-gray-400 mb-6">
                  Order ID: <span className="font-bold text-gray-600">{orderId}</span>
                </p>
              )}

              {paymentMethod === "paystack" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full text-left mb-3">
                  <p className="text-sm font-bold text-green-600 mb-1">✅ Payment Successful!</p>
                  <p className="text-xs text-green-500">Your payment was confirmed. We'll process your order shortly.</p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 w-full text-left mb-3">
                  <p className="text-sm font-bold text-orange-600 mb-2">💳 Complete Your Payment</p>
                  <p className="text-xs text-orange-600 mb-3">
                    Transfer <span className="font-black text-orange-500">₦{totalAmountSnapshot.toLocaleString()}</span> to:
                  </p>
                  <div className="bg-white rounded-lg p-3 mb-2 border border-orange-100">
                    <p className="text-xs font-bold text-orange-500 uppercase">Fidelity Bank</p>
                    <p className="text-lg sm:text-xl font-black tracking-widest text-gray-800">6315564573</p>
                    <p className="text-xs text-gray-500">Ariogba Patrick Obinna</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs font-bold text-green-500 uppercase">OPay</p>
                    <p className="text-lg sm:text-xl font-black tracking-widest text-gray-800">9049863067</p>
                    <p className="text-xs text-gray-500">Ariogba Patrick Obinna</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const message =
                    `🛒 *Order Confirmation*\n\n` +
                    `Hi OBISCO Store!\n\n` +
                    `🆔 Order ID: ${orderId}\n` +
                    `👤 Name: ${form.fullName}\n` +
                    `📱 Phone: ${form.phone}\n` +
                    `📍 Address: ${form.address}, ${form.city}, ${form.state}\n` +
                    `💰 Total: ₦${totalAmountSnapshot.toLocaleString()}\n` +
                    `💳 Payment: ${paymentMethod === "paystack" ? "Paid via Paystack ✅" : "Bank Transfer (pending)"}\n\n` +
                    `Thank you! 🙏`;
                  window.open(`https://wa.me/2349049863067?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send WhatsApp Confirmation
              </button>

              <button onClick={handleClose} className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold transition w-full text-sm">
                Continue Shopping
              </button>
            </div>

          ) : checkout ? (
            <div className="flex flex-col gap-4">

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border">
                <p className="font-bold text-sm text-gray-700 mb-2">🧾 Order Summary</p>
                {cartItems.map((item) => (
                  <div key={getItemId(item)} className="flex justify-between text-xs sm:text-sm py-1.5 border-b last:border-0">
                    <span className="text-gray-600 pr-2 truncate">{item.name} x{item.quantity}</span>
                    <span className="font-bold text-orange-500 shrink-0">₦{(item.amount * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-3 text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                {promoResult && (
                  <div className="flex justify-between text-sm text-green-600 font-semibold mt-1">
                    <span>Discount ({promoResult.code})</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between mt-2 font-bold border-t pt-2">
                  <span className="text-sm">Total</span>
                  <span className="text-orange-500 text-base sm:text-lg">₦{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <p className="font-bold text-gray-700 mb-2 text-sm">🏷️ Promo Code</p>
                {promoResult ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-green-600 font-bold text-sm">{promoResult.code} ✅</p>
                      <p className="text-green-500 text-xs">{promoResult.message}</p>
                    </div>
                    <button onClick={handleRemovePromo} className="text-red-400 hover:text-red-600 text-xs underline transition">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                      placeholder="Enter promo code"
                      className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shrink-0"
                    >
                      {promoLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Apply"}
                    </button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-xs mt-1.5">{promoError}</p>}
              </div>

              {/* Delivery Address */}
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm sm:text-base">📍 Delivery Address</p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <input name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="Full Name" className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full" />
                  <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone Number" className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full" />
                  <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email Address" type="email" className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full" />
                  <textarea name="address" value={form.address} onChange={handleFormChange} placeholder="Street Address" rows={2} className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full resize-none" />
                  <div className="flex gap-2">
                    <input name="city" value={form.city} onChange={handleFormChange} placeholder="City" className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full" />
                    <input name="state" value={form.state} onChange={handleFormChange} placeholder="State" className="border rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 w-full" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm">💳 Payment Method</p>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setPaymentMethod("paystack")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${paymentMethod === "paystack" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-500"}`}
                  >
                    💳 Pay with Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${paymentMethod === "bank_transfer" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-500"}`}
                  >
                    🏦 Bank Transfer
                  </button>
                </div>

                {paymentMethod === "bank_transfer" && (
                  <div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 mb-3">
                      <p className="text-xs font-bold text-orange-500 uppercase">Fidelity Bank</p>
                      <p className="text-xl font-black tracking-widest text-gray-800">6315564573</p>
                      <p className="text-xs text-gray-500">Ariogba Patrick Obinna</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-3">
                      <p className="text-xs font-bold text-green-500 uppercase">OPay</p>
                      <p className="text-xl font-black tracking-widest text-gray-800">9049863067</p>
                      <p className="text-xs text-gray-500">Ariogba Patrick Obinna</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <p className="text-xs text-yellow-700 font-semibold">💡 Transfer ₦{finalAmount.toLocaleString()} to any account above</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          ) : (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <BsFillCartFill size={50} className="text-gray-200 mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg font-semibold">Your cart is empty</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Add some products to get started!</p>
                  <button onClick={handleClose} className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition text-sm font-semibold">Continue Shopping</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={getItemId(item)} className="flex items-center gap-3 border rounded-xl p-2.5 sm:p-3 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg shrink-0 bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-orange-500 text-xs capitalize">{item.category}</p>
                        {item.color && <p className="text-gray-400 text-xs">{item.color}</p>}
                        <p className="text-orange-600 font-bold text-xs sm:text-sm mt-0.5">₦{item.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => decreaseQty(getItemId(item))} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold hover:bg-gray-100 transition">−</button>
                          <span className="font-bold text-xs sm:text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => increaseQty(getItemId(item))} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold hover:bg-gray-100 transition">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button onClick={() => removeFromCart(getItemId(item))} className="text-gray-400 hover:text-red-500 transition text-lg">🗑</button>
                        <p className="text-xs font-bold text-gray-700">₦{(item.amount * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 shrink-0">
            {!checkout && (
              <>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-500 text-xs sm:text-sm">Total Items: <span className="font-bold text-black">{totalItems}</span></p>
                  <button onClick={() => setCartItems([])} className="text-red-400 hover:text-red-600 text-xs sm:text-sm underline transition">Clear All</button>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-500 text-xs sm:text-sm">Total Amount:</p>
                  <p className="text-orange-500 font-bold text-lg sm:text-xl">₦{totalAmount.toLocaleString()}</p>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              {checkout && (
                <button onClick={() => setCheckout(false)} disabled={loading} className="w-full border border-orange-500 text-orange-500 font-bold py-2.5 rounded-full transition hover:bg-orange-50 text-sm disabled:opacity-50">← Back</button>
              )}

              {checkout ? (
                paymentMethod === "paystack" ? (
                  <button
                    onClick={handlePaystackPayment}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                    ) : (
                      `💳 Pay ₦${finalAmount.toLocaleString()} with Paystack`
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleBankTransferOrder}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order...</>
                    ) : "Place Order 🎉"}
                  </button>
                )
              ) : (
                <button onClick={() => setCheckout(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 sm:py-3 rounded-full transition text-sm sm:text-base">
                  Checkout →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
import React, { useState, useEffect } from "react";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import {
  getAllOrders,
  updateOrderStatus,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPromoCodes,
  createPromoCode,
  deletePromoCode,
  sendBroadcast,
  getAllUsers,
} from "../api/api.js";

const ADMIN_PASSWORD = "obisco2025";

const statusOptions = [
  "pending",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered",
];
const paymentOptions = ["unpaid", "paid"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  shipped: "bg-purple-100 text-purple-600",
  out_for_delivery: "bg-orange-100 text-orange-600",
  delivered: "bg-green-100 text-green-600",
};

const emptyForm = {
  name: "",
  category: "",
  department: "gadgets",
  price: "$",
  amount: "",
  image: "",
  description: "",
};

const AdminDashboard = ({ adminOpen, setAdminOpen }) => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyForm);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Promos state
  const [promos, setPromos] = useState([]);
  const [promosLoading, setPromosLoading] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
  });
  const [savingPromo, setSavingPromo] = useState(false);
  const [deletingPromo, setDeletingPromo] = useState(null);

  // Broadcast state
  const [broadcastForm, setBroadcastForm] = useState({
    subject: "",
    message: "",
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  // Customers state
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      loadOrders();
    } else {
      alert("Wrong password!");
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setOrdersLoading(false);
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    const data = await fetchProducts();
    setProducts(Array.isArray(data) ? data : []);
    setProductsLoading(false);
  };

  const loadPromos = async () => {
    setPromosLoading(true);
    const data = await getPromoCodes();
    setPromos(Array.isArray(data) ? data : []);
    setPromosLoading(false);
  };

  useEffect(() => {
    if (authenticated && activeTab === "products") loadProducts();
    if (authenticated && activeTab === "orders") loadOrders();
    if (authenticated && activeTab === "promos") loadPromos();
    if (authenticated && activeTab === "customers") loadCustomers();
  }, [activeTab, authenticated]);

  const handleUpdateStatus = async (orderId, status, paymentStatus) => {
    setUpdating(orderId);
    const res = await updateOrderStatus(orderId, { status, paymentStatus });
    if (res.order) {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.order);
    } else {
      alert("Failed to update order.");
    }
    setUpdating(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      department: product.department || "gadgets",
      price: product.price,
      amount: product.amount,
      image: product.image,
      description: product.description || "",
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async () => {
    if (
      !productForm.name ||
      !productForm.category ||
      !productForm.amount ||
      !productForm.image
    ) {
      alert("Please fill in Name, Category, Amount and Image.");
      return;
    }
    setSavingProduct(true);
    if (editingProduct) {
      const res = await updateProduct(editingProduct._id, {
        ...productForm,
        amount: Number(productForm.amount),
      });
      if (res.product) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.product : p)),
        );
        resetForm();
      } else {
        alert("Failed to update product.");
      }
    } else {
      const res = await createProduct({
        ...productForm,
        amount: Number(productForm.amount),
      });
      if (res.message) {
        await loadProducts();
        resetForm();
      } else {
        alert("Failed to create product.");
      }
    }
    setSavingProduct(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setDeletingProduct(id);
    const res = await deleteProduct(id);
    if (res.message) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert("Failed to delete product.");
    }
    setDeletingProduct(null);
  };

  const handleCreatePromo = async () => {
    if (!promoForm.code || !promoForm.value) {
      alert("Please fill in Code and Value.");
      return;
    }
    setSavingPromo(true);
    const res = await createPromoCode({
      code: promoForm.code.toUpperCase(),
      type: promoForm.type,
      value: Number(promoForm.value),
      minOrder: Number(promoForm.minOrder) || 0,
      maxUses: Number(promoForm.maxUses) || null,
      expiresAt: promoForm.expiresAt || null,
    });
    setSavingPromo(false);
    if (res.promo) {
      setPromos((prev) => [res.promo, ...prev]);
      setPromoForm({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxUses: "",
        expiresAt: "",
      });
    } else {
      alert(res.message || "Failed to create promo code.");
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm("Delete this promo code?")) return;
    setDeletingPromo(id);
    const res = await deletePromoCode(id);
    if (res.message) {
      setPromos((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert("Failed to delete promo code.");
    }
    setDeletingPromo(null);
  };

  const handleSendBroadcast = async () => {
    if (!broadcastForm.subject || !broadcastForm.message) {
      alert("Please fill in Subject and Message.");
      return;
    }
    if (!window.confirm(`Send this message to ALL registered customers?`))
      return;
    setSendingBroadcast(true);
    setBroadcastResult(null);
    const res = await sendBroadcast({
      subject: broadcastForm.subject,
      message: broadcastForm.message,
      adminPassword: "obisco2025",
    });
    setSendingBroadcast(false);
    setBroadcastResult(res);
    if (res.sent > 0) {
      setBroadcastForm({ subject: "", message: "" });
    }
  };

  const loadCustomers = async () => {
    setCustomersLoading(true);
    const data = await getAllUsers();
    setCustomers(Array.isArray(data) ? data : []);
    setCustomersLoading(false);
  };

  const resetForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm(emptyForm);
  };

  const handleClose = () => {
    setAdminOpen(false);
    setAuthenticated(false);
    setPassword("");
    setOrders([]);
    setSelectedOrder(null);
    resetForm();
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchDept =
      departmentFilter === "all" || p.department === departmentFilter;
    return matchSearch && matchDept;
  });

  if (!adminOpen) return null;

  return (
    <>
      <div className="bg-black/60 fixed inset-0 z-40" onClick={handleClose} />

      <div className="fixed inset-0 sm:inset-4 md:inset-8 bg-white z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b bg-gray-950 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white">
              ⚙️ Admin Dashboard
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              OBISCO Store — Management
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!authenticated ? (
            /* Password Gate */
            <div className="flex flex-col items-center justify-center h-full px-6 py-10">
              <p className="text-4xl mb-4">🔐</p>
              <h3 className="text-xl font-black text-gray-800 mb-1">
                Admin Access
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Enter your admin password to continue
              </p>
              <div className="w-full max-w-sm flex flex-col gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Admin Password"
                  className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm"
                >
                  Access Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <div className="flex border-b px-4 shrink-0 overflow-x-auto scrollbar-hide">
                {["orders", "products", "promos", "broadcast", "customers"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-sm font-bold capitalize border-b-2 transition whitespace-nowrap ${
                        activeTab === tab
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-gray-500 hover:text-orange-400"
                      }`}
                    >
                      {tab === "orders"
                        ? "📦 Orders"
                        : tab === "products"
                          ? "🛍️ Products"
                          : tab === "promos"
                            ? "🏷️ Promos"
                            : tab === "broadcast"
                              ? "📢 Broadcast"
                              : "👥 Customers"}
                    </button>
                  ),
                )}
              </div>

              {/* ── ORDERS TAB ── */}
              {activeTab === "orders" && (
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      {
                        label: "Total Orders",
                        value: orders.length,
                        color: "bg-blue-50 text-blue-600",
                      },
                      {
                        label: "Pending",
                        value: orders.filter((o) => o.status === "pending")
                          .length,
                        color: "bg-yellow-50 text-yellow-600",
                      },
                      {
                        label: "Delivered",
                        value: orders.filter((o) => o.status === "delivered")
                          .length,
                        color: "bg-green-50 text-green-600",
                      },
                      {
                        label: "Unpaid",
                        value: orders.filter(
                          (o) => o.paymentStatus === "unpaid",
                        ).length,
                        color: "bg-red-50 text-red-600",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`${stat.color} rounded-xl p-4 text-center`}
                      >
                        <p className="text-2xl font-black">{stat.value}</p>
                        <p className="text-xs font-semibold mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-800">All Orders</h3>
                    <button
                      onClick={loadOrders}
                      className="text-orange-500 text-sm font-semibold hover:underline"
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border rounded-xl overflow-hidden hover:border-orange-200 transition"
                        >
                          <div
                            className="flex justify-between items-start p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() =>
                              setSelectedOrder(
                                selectedOrder?._id === order._id ? null : order,
                              )
                            }
                          >
                            <div>
                              <p className="font-bold text-sm text-gray-800">
                                {order.delivery.fullName}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {order._id}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-orange-500 text-sm">
                                ₦{order.totalAmount.toLocaleString()}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}
                              >
                                {order.status}
                              </span>
                              <br />
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${
                                  order.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-500"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          {selectedOrder?._id === order._id && (
                            <div className="border-t bg-gray-50 p-4">
                              <div className="mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                  Delivery Details
                                </p>
                                <p className="text-sm text-gray-700">
                                  {order.delivery.phone}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {order.delivery.address},{" "}
                                  {order.delivery.city}, {order.delivery.state}
                                </p>
                              </div>
                              <div className="mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                  Items
                                </p>
                                {order.items.map((item, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <p className="text-xs font-bold">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        x{item.quantity} — ₦
                                        {item.amount.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                    Update Status
                                  </p>
                                  <select
                                    value={order.status}
                                    onChange={(e) =>
                                      handleUpdateStatus(
                                        order._id,
                                        e.target.value,
                                        order.paymentStatus,
                                      )
                                    }
                                    disabled={updating === order._id}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
                                  >
                                    {statusOptions.map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                    Payment Status
                                  </p>
                                  <select
                                    value={order.paymentStatus}
                                    onChange={(e) =>
                                      handleUpdateStatus(
                                        order._id,
                                        order.status,
                                        e.target.value,
                                      )
                                    }
                                    disabled={updating === order._id}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
                                  >
                                    {paymentOptions.map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              {updating === order._id && (
                                <p className="text-xs text-orange-500 mt-2 text-center">
                                  Updating...
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── PRODUCTS TAB ── */}
              {activeTab === "products" && (
                <div className="p-4 sm:p-6">
                  {showProductForm && (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                      <h3 className="font-black text-gray-800 mb-4">
                        {editingProduct
                          ? "✏️ Edit Product"
                          : "➕ Add New Product"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                            Department
                          </p>
                          <div className="flex gap-2">
                            {["gadgets", "fashion", "lifestyle"].map((dept) => (
                              <button
                                key={dept}
                                onClick={() =>
                                  setProductForm({
                                    ...productForm,
                                    department: dept,
                                  })
                                }
                                className={`flex-1 py-2 rounded-full text-xs font-bold capitalize border transition ${
                                  productForm.department === dept
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "border-gray-300 text-gray-500 hover:border-orange-400"
                                }`}
                              >
                                {dept === "gadgets"
                                  ? "📱 Gadgets"
                                  : dept === "fashion"
                                    ? "👔 Fashion"
                                    : "✨ Lifestyle"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          placeholder="Product Name"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              name: e.target.value,
                            })
                          }
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />

                        <input
                          placeholder={
                            productForm.department === "gadgets"
                              ? "Category (e.g. phones, laptops)"
                              : productForm.department === "fashion"
                                ? "Category (e.g. men, women, native)"
                                : "Category (e.g. perfumes, watches)"
                          }
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                            })
                          }
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />

                        <input
                          placeholder="Amount in Naira (e.g. 150000)"
                          type="number"
                          value={productForm.amount}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              amount: e.target.value,
                            })
                          }
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />

                        <select
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              price: e.target.value,
                            })
                          }
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        >
                          <option value="$">$ — Under ₦50k</option>
                          <option value="$$">$$ — ₦50k-₦150k</option>
                          <option value="$$$">$$$ — ₦150k-₦500k</option>
                          <option value="$$$$">$$$$ — ₦500k+</option>
                        </select>

                        <input
                          placeholder="Image URL (Cloudinary or Unsplash)"
                          value={productForm.image}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              image: e.target.value,
                            })
                          }
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white sm:col-span-2"
                        />

                        <textarea
                          placeholder="Description (optional)"
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white sm:col-span-2 resize-none"
                        />
                      </div>

                      {productForm.image && (
                        <div className="mt-3 flex items-center gap-3">
                          <img
                            src={productForm.image}
                            alt="preview"
                            className="w-16 h-16 object-contain rounded-xl border bg-gray-50"
                          />
                          <p className="text-xs text-gray-400">Image preview</p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleSaveProduct}
                          disabled={savingProduct}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 rounded-full transition text-sm flex items-center justify-center gap-2"
                        >
                          {savingProduct ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : editingProduct ? (
                            "Save Changes"
                          ) : (
                            "Add Product"
                          )}
                        </button>
                        <button
                          onClick={resetForm}
                          className="px-6 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full transition text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="font-black text-gray-800">All Products</h3>
                      <p className="text-xs text-gray-400">
                        {filteredProducts.length} of {products.length} products
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={loadProducts}
                        className="text-orange-500 text-sm font-semibold hover:underline"
                      >
                        🔄 Refresh
                      </button>
                      {!showProductForm && (
                        <button
                          onClick={() => {
                            setShowProductForm(true);
                            setEditingProduct(null);
                            setProductForm(emptyForm);
                          }}
                          className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
                        >
                          <AiOutlinePlus size={16} />
                          Add Product
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                    <div className="flex gap-2">
                      {["all", "gadgets", "fashion", "lifestyle"].map(
                        (dept) => (
                          <button
                            key={dept}
                            onClick={() => setDepartmentFilter(dept)}
                            className={`px-3 py-2 rounded-full text-xs font-bold capitalize transition ${
                              departmentFilter === dept
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                            }`}
                          >
                            {dept}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {productsLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          className="border rounded-xl overflow-hidden bg-white hover:border-orange-200 transition"
                        >
                          <div className="h-[120px] bg-gray-50 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="p-2">
                            <p className="font-bold text-xs text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-orange-500 font-black text-xs mt-0.5">
                              ₦{product.amount?.toLocaleString()}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              <span className="text-gray-400 text-xs capitalize">
                                {product.category}
                              </span>
                              <span className="text-gray-300 text-xs">•</span>
                              <span
                                className={`text-xs font-semibold capitalize ${
                                  product.department === "fashion"
                                    ? "text-pink-500"
                                    : product.department === "lifestyle"
                                      ? "text-purple-500"
                                      : "text-blue-500"
                                }`}
                              >
                                {product.department || "gadgets"}
                              </span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-1.5 rounded-full transition"
                              >
                                <AiOutlineEdit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                disabled={deletingProduct === product._id}
                                className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded-full transition"
                              >
                                {deletingProduct === product._id ? (
                                  <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <AiOutlineDelete size={12} /> Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredProducts.length === 0 && !productsLoading && (
                        <div className="col-span-4 text-center py-10">
                          <p className="text-4xl mb-3">📦</p>
                          <p className="text-gray-500 text-sm">
                            No products found
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── PROMOS TAB ── */}
              {activeTab === "promos" && (
                <div className="p-4 sm:p-6">
                  {/* Create Promo Form */}
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                    <h3 className="font-black text-gray-800 mb-4">
                      🏷️ Create Promo Code
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          Code Name *
                        </label>
                        <input
                          value={promoForm.code}
                          onChange={(e) =>
                            setPromoForm({
                              ...promoForm,
                              code: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="e.g OBISCO10"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white uppercase"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          Discount Type *
                        </label>
                        <select
                          value={promoForm.type}
                          onChange={(e) =>
                            setPromoForm({ ...promoForm, type: e.target.value })
                          }
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        >
                          <option value="percentage">Percentage (%) off</option>
                          <option value="fixed">Fixed Amount (₦) off</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          {promoForm.type === "percentage"
                            ? "Percentage Value (e.g 10 for 10%)"
                            : "Fixed Amount (e.g 5000)"}{" "}
                          *
                        </label>
                        <input
                          value={promoForm.value}
                          onChange={(e) =>
                            setPromoForm({
                              ...promoForm,
                              value: e.target.value,
                            })
                          }
                          placeholder={
                            promoForm.type === "percentage"
                              ? "e.g 10"
                              : "e.g 5000"
                          }
                          type="number"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          Minimum Order (₦)
                        </label>
                        <input
                          value={promoForm.minOrder}
                          onChange={(e) =>
                            setPromoForm({
                              ...promoForm,
                              minOrder: e.target.value,
                            })
                          }
                          placeholder="e.g 50000"
                          type="number"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          Max Uses
                        </label>
                        <input
                          value={promoForm.maxUses}
                          onChange={(e) =>
                            setPromoForm({
                              ...promoForm,
                              maxUses: e.target.value,
                            })
                          }
                          placeholder="Leave empty for unlimited"
                          type="number"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                          Expiry Date
                        </label>
                        <input
                          value={promoForm.expiresAt}
                          onChange={(e) =>
                            setPromoForm({
                              ...promoForm,
                              expiresAt: e.target.value,
                            })
                          }
                          type="date"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCreatePromo}
                      disabled={savingPromo}
                      className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                    >
                      {savingPromo ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "🏷️ Create Promo Code"
                      )}
                    </button>
                  </div>

                  {/* Promos List */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-800">
                      All Promo Codes
                    </h3>
                    <button
                      onClick={loadPromos}
                      className="text-orange-500 text-sm font-semibold hover:underline"
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {promosLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : promos.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-3">🏷️</p>
                      <p className="text-gray-500">
                        No promo codes yet. Create one above!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {promos.map((promo) => (
                        <div
                          key={promo._id}
                          className="border rounded-xl p-4 hover:border-orange-200 transition bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-lg text-gray-800 tracking-widest">
                                  {promo.code}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    promo.isActive
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-500"
                                  }`}
                                >
                                  {promo.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-sm text-orange-500 font-bold">
                                {promo.type === "percentage"
                                  ? `${promo.value}% off`
                                  : `₦${promo.value.toLocaleString()} off`}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <span className="text-xs text-gray-400">
                                  Min Order:{" "}
                                  <span className="font-semibold text-gray-600">
                                    ₦{promo.minOrder?.toLocaleString() || "0"}
                                  </span>
                                </span>
                                <span className="text-xs text-gray-400">
                                  Used:{" "}
                                  <span className="font-semibold text-gray-600">
                                    {promo.usedCount || 0}
                                    {promo.maxUses
                                      ? `/${promo.maxUses}`
                                      : ""}{" "}
                                    times
                                  </span>
                                </span>
                                {promo.expiresAt && (
                                  <span className="text-xs text-gray-400">
                                    Expires:{" "}
                                    <span className="font-semibold text-gray-600">
                                      {new Date(
                                        promo.expiresAt,
                                      ).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeletePromo(promo._id)}
                              disabled={deletingPromo === promo._id}
                              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full transition shrink-0"
                            >
                              {deletingPromo === promo._id ? (
                                <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "🗑 Delete"
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── BROADCAST TAB ── */}
              {activeTab === "broadcast" && (
                <div className="p-4 sm:p-6">
                  <div className="max-w-2xl mx-auto">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
                      <p className="text-2xl">📢</p>
                      <div>
                        <p className="font-bold text-blue-700 text-sm">
                          Broadcast Message
                        </p>
                        <p className="text-xs text-blue-500 mt-0.5">
                          Send an email to ALL registered customers at once. Use
                          this for promotions, new arrivals or important
                          announcements.
                        </p>
                      </div>
                    </div>

                    {/* Broadcast Form */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                      <h3 className="font-black text-gray-800 mb-4">
                        ✍️ Compose Message
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                            Email Subject *
                          </label>
                          <input
                            value={broadcastForm.subject}
                            onChange={(e) =>
                              setBroadcastForm({
                                ...broadcastForm,
                                subject: e.target.value,
                              })
                            }
                            placeholder="e.g 🔥 Flash Sale — 20% off everything today!"
                            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                            Message *
                          </label>
                          <textarea
                            value={broadcastForm.message}
                            onChange={(e) =>
                              setBroadcastForm({
                                ...broadcastForm,
                                message: e.target.value,
                              })
                            }
                            placeholder={`Hi there! 👋\n\nWe have an exciting announcement for you...\n\nUse promo code OBISCO10 for 10% off your next order!\n\nShop now at obisco.store 🛒`}
                            rows={8}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white resize-none"
                          />
                        </div>

                        {/* Preview */}
                        {broadcastForm.message && (
                          <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                              📧 Preview
                            </p>
                            <p className="text-sm font-bold text-gray-800 mb-2">
                              {broadcastForm.subject || "No subject"}
                            </p>
                            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                              {broadcastForm.message}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleSendBroadcast}
                          disabled={sendingBroadcast}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
                        >
                          {sendingBroadcast ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending to all customers...
                            </>
                          ) : (
                            "📢 Send to All Customers"
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Result */}
                    {broadcastResult && (
                      <div
                        className={`rounded-2xl p-4 border mb-6 ${
                          broadcastResult.sent > 0
                            ? "bg-green-50 border-green-100"
                            : "bg-red-50 border-red-100"
                        }`}
                      >
                        <p
                          className={`font-black text-lg mb-2 ${
                            broadcastResult.sent > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {broadcastResult.sent > 0
                            ? "✅ Broadcast Sent!"
                            : "❌ Broadcast Failed"}
                        </p>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-black text-green-600">
                              {broadcastResult.sent || 0}
                            </p>
                            <p className="text-xs text-gray-500">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-black text-red-500">
                              {broadcastResult.failed || 0}
                            </p>
                            <p className="text-xs text-gray-500">Failed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-700">
                              {broadcastResult.total || 0}
                            </p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {broadcastResult.message}
                        </p>
                      </div>
                    )}

                    {/* Tips */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <p className="font-bold text-gray-700 text-sm mb-3">
                        💡 Broadcast Tips
                      </p>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500">
                          ✅ Use for flash sales, new arrivals and promo codes
                        </p>
                        <p className="text-xs text-gray-500">
                          ✅ Keep subject short and exciting with emojis
                        </p>
                        <p className="text-xs text-gray-500">
                          ✅ Always include a clear call to action
                        </p>
                        <p className="text-xs text-gray-500">
                          ⚠️ Don't send more than 1-2 emails per week
                        </p>
                        <p className="text-xs text-gray-500">
                          ⚠️ Make sure every message adds value to customers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CUSTOMERS TAB ── */}
              {activeTab === "customers" && (
                <div className="p-4 sm:p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-blue-50 text-blue-600 rounded-xl p-4 text-center">
                      <p className="text-2xl font-black">{customers.length}</p>
                      <p className="text-xs font-semibold mt-1">
                        Total Customers
                      </p>
                    </div>
                    <div className="bg-green-50 text-green-600 rounded-xl p-4 text-center">
                      <p className="text-2xl font-black">
                        {
                          customers.filter((c) => {
                            const date = new Date(c.createdAt);
                            const now = new Date();
                            return (
                              date.getMonth() === now.getMonth() &&
                              date.getFullYear() === now.getFullYear()
                            );
                          }).length
                        }
                      </p>
                      <p className="text-xs font-semibold mt-1">This Month</p>
                    </div>
                    <div className="bg-orange-50 text-orange-600 rounded-xl p-4 text-center">
                      <p className="text-2xl font-black">
                        {customers.filter((c) => c.isGoogleUser).length}
                      </p>
                      <p className="text-xs font-semibold mt-1">
                        Google Signups
                      </p>
                    </div>
                  </div>

                  {/* Search & Refresh */}
                  <div className="flex gap-3 mb-4">
                    <input
                      placeholder="Search by name or email..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={loadCustomers}
                      className="text-orange-500 text-sm font-semibold hover:underline shrink-0"
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {customersLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-3">👥</p>
                      <p className="text-gray-500">No customers yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-gray-400">
                        Showing{" "}
                        {
                          customers.filter(
                            (c) =>
                              c.fullName
                                ?.toLowerCase()
                                .includes(customerSearch.toLowerCase()) ||
                              c.email
                                ?.toLowerCase()
                                .includes(customerSearch.toLowerCase()),
                          ).length
                        }{" "}
                        of {customers.length} customers
                      </p>
                      {customers
                        .filter(
                          (c) =>
                            c.fullName
                              ?.toLowerCase()
                              .includes(customerSearch.toLowerCase()) ||
                            c.email
                              ?.toLowerCase()
                              .includes(customerSearch.toLowerCase()),
                        )
                        .map((customer) => (
                          <div
                            key={customer._id}
                            className="border rounded-xl p-4 hover:border-orange-200 transition bg-white"
                          >
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-orange-500 font-black text-sm">
                                  {customer.fullName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-gray-800 truncate">
                                    {customer.fullName}
                                  </p>
                                  {customer.isGoogleUser && (
                                    <span className="text-[10px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                                      Google
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate">
                                  {customer.email}
                                </p>
                                {customer.phone && (
                                  <p className="text-xs text-gray-400">
                                    {customer.phone}
                                  </p>
                                )}
                              </div>
                              {/* Date */}
                              <div className="text-right shrink-0">
                                <p className="text-xs text-gray-400">
                                  {new Date(
                                    customer.createdAt,
                                  ).toLocaleDateString("en-NG", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                                <p className="text-[10px] text-gray-300 mt-0.5">
                                  {new Date(
                                    customer.createdAt,
                                  ).toLocaleTimeString("en-NG", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

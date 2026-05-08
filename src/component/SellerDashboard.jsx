import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FaStore, FaBox, FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { MdInventory } from "react-icons/md";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://obisco-gadgets-backend.onrender.com";

const DEPARTMENTS = ["gadgets", "fashion", "lifestyle"];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

const emptyForm = {
  name: "",
  department: "gadgets",
  category: "",
  image: "",
  price: "$",
  amount: "",
  description: "",
  inStock: true,
};

const SellerDashboard = ({ onClose }) => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) setSeller(JSON.parse(stored));
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/seller/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "obisco_products");
      formData.append("cloud_name", "dy6jak5pf");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dy6jak5pf/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch {
      setError("Image upload failed. Check your connection.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.image || !form.amount) {
      return setError("Please fill in all required fields");
    }
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId
        ? `${API_BASE}/api/seller/products/${editingId}`
        : `${API_BASE}/api/seller/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(editingId ? "Product updated!" : "Product uploaded!");
        setShowForm(false);
        setForm(emptyForm);
        setEditingId(null);
        fetchProducts();
      } else {
        setError(data.message || "Failed to save product");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      department: product.department,
      category: product.category,
      image: product.image,
      price: product.price,
      amount: product.amount,
      description: product.description,
      inStock: product.inStock,
    });
    setEditingId(product._id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/seller/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccess("Product deleted!");
        fetchProducts();
      }
    } catch {
      setError("Failed to delete product");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("seller");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" />
      <div className="fixed inset-0 z-[70] flex flex-col bg-white">
        {/* Header */}
        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <FaStore size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {seller?.businessName || "Seller Dashboard"}
              </p>
              <p className="text-orange-100 text-xs">{seller?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
            >
              <FaSignOutAlt size={12} /> Sign Out
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-orange-50 shrink-0">
          {[
            {
              id: "products",
              label: "📦 My Products",
              icon: <FaBox size={14} />,
            },
            { id: "stats", label: "📊 Stats", icon: <MdInventory size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-500 bg-white"
                  : "border-transparent text-gray-500 hover:text-orange-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
              ✅ {success}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div>
              {/* Upload Button */}
              {!showForm && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    setForm(emptyForm);
                    setEditingId(null);
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full mb-4 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  <AiOutlinePlus size={18} /> Upload New Product
                </button>
              )}

              {/* Product Form */}
              {showForm && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {editingId ? "✏️ Edit Product" : "📦 Upload New Product"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <AiOutlineClose size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Product Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g iPhone 15 Pro Max"
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Department *
                        </label>
                        <select
                          name="department"
                          value={form.department}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white capitalize"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Category *
                        </label>
                        <input
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="e.g Phones"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Product Image *
                      </label>
                      <div
                        onClick={() =>
                          document.getElementById("product-image-input").click()
                        }
                        className="w-full border-2 border-dashed border-orange-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition bg-white"
                      >
                        {form.image ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={form.image}
                              alt="preview"
                              className="h-24 w-24 object-cover rounded-xl border"
                            />
                            <p className="text-xs text-orange-500 font-semibold">
                              Tap to change image
                            </p>
                          </div>
                        ) : uploadingImage ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-orange-500 font-semibold">
                              Uploading image...
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <span className="text-3xl">📸</span>
                            <p className="text-sm font-bold text-gray-600">
                              Tap to select image
                            </p>
                            <p className="text-xs text-gray-400">
                              From your gallery or camera
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        id="product-image-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Price Range *
                        </label>
                        <select
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        >
                          {PRICE_RANGES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Amount (₦) *
                        </label>
                        <input
                          name="amount"
                          type="number"
                          value={form.amount}
                          onChange={handleChange}
                          placeholder="e.g 50000"
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        rows={3}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={form.inStock}
                        onChange={handleChange}
                        id="inStock"
                        className="w-4 h-4 accent-orange-500"
                      />
                      <label
                        htmlFor="inStock"
                        className="text-sm text-gray-700 font-medium"
                      >
                        In Stock
                      </label>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm(emptyForm);
                        }}
                        className="flex-1 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full text-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 rounded-full text-sm transition flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                            Saving...
                          </>
                        ) : editingId ? (
                          "✅ Update Product"
                        ) : (
                          "🚀 Upload Product"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products List */}
              {loading ? (
                <div className="text-center py-10 text-orange-500 font-medium">
                  ⏳ Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="text-gray-500 font-medium">No products yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload your first product above!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl shrink-0 border"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/64")
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-orange-500 text-xs font-semibold">
                          ₦{Number(product.amount).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                            {product.department}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${product.inStock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-500 text-xs font-bold px-3 py-1.5 rounded-full transition"
                        >
                          <FaEdit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full transition"
                        >
                          <FaTrash size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-orange-500">
                    {products.length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Total Products
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-green-500">
                    {products.filter((p) => p.inStock).length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    In Stock
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3">
                  📋 Business Info
                </h3>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Business:</span>{" "}
                    {seller?.businessName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Category:</span>{" "}
                    {seller?.businessCategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Email:</span>{" "}
                    {seller?.email}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-yellow-700 mb-1">
                  📊 More Stats Coming Soon
                </p>
                <p className="text-xs text-yellow-600">
                  Order statistics and earnings will be available soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;

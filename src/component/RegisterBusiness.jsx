import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaStore, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail, MdPhone, MdBusiness } from "react-icons/md";

const RegisterBusiness = ({ registerBizOpen, setRegisterBizOpen }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    businessType: "",
    category: "",
    phone: "",
    whatsapp: "",
    email: "",
    location: "",
    state: "",
    description: "",
    instagram: "",
    experience: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setRegisterBizOpen(false);
    setStep(1);
    setSubmitted(false);
    setForm({
      ownerName: "",
      businessName: "",
      businessType: "",
      category: "",
      phone: "",
      whatsapp: "",
      email: "",
      location: "",
      state: "",
      description: "",
      instagram: "",
      experience: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !form.ownerName ||
      !form.businessName ||
      !form.phone ||
      !form.email ||
      !form.category
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        "https://obisco-gadgets-backend.onrender.com/api/business/register-business",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (data.message === "Application submitted successfully!") {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!registerBizOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[500px] bg-white z-[70] rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <FaStore size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Register Your Business
              </p>
              <p className="text-orange-100 text-xs">Join OBISCO Marketplace</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-orange-200 transition"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        {!submitted && (
          <div className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-50 shrink-0">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-8 h-0.5 ${step > s ? "bg-orange-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500 ml-2">
              {step === 1
                ? "Personal Info"
                : step === 2
                  ? "Business Info"
                  : "Final Details"}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Success Screen */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Application Submitted!
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Your business registration has been sent to OBISCO via Email.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Our team will review your application and get back to you within
                24-48 hours.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 w-full text-left mb-6">
                <p className="text-xs font-bold text-orange-600 mb-2">
                  📋 What Happens Next?
                </p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">
                    ✅ We review your application
                  </p>
                  <p className="text-xs text-gray-600">
                    📞 We contact you within 24-48hrs
                  </p>
                  <p className="text-xs text-gray-600">
                    🏪 Your business goes live on OBISCO
                  </p>
                  <p className="text-xs text-gray-600">
                    🚀 Start receiving customers!
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Step 1 — Personal Info */}
              {step === 1 && (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    Tell us about yourself
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Full Name *
                    </label>
                    <input
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      WhatsApp Number *
                    </label>
                    <input
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      type="email"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        City/Area *
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        State *
                      </label>
                      <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 — Business Info */}
              {step === 2 && (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    Tell us about your business
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Business Name *
                    </label>
                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Business Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">Select category</option>
                      <option value="Fashion - Men's Wear">
                        Fashion — Men's Wear
                      </option>
                      <option value="Fashion - Women's Wear">
                        Fashion — Women's Wear
                      </option>
                      <option value="Fashion - Native Wear">
                        Fashion — Native Wear
                      </option>
                      <option value="Fashion - Children's Wear">
                        Fashion — Children's Wear
                      </option>
                      <option value="Fashion - Shoes & Footwear">
                        Fashion — Shoes & Footwear
                      </option>
                      <option value="Gadgets - Phones">Gadgets — Phones</option>
                      <option value="Gadgets - Laptops">
                        Gadgets — Laptops
                      </option>
                      <option value="Gadgets - Accessories">
                        Gadgets — Accessories
                      </option>
                      <option value="Lifestyle - Perfumes">
                        Lifestyle — Perfumes
                      </option>
                      <option value="Lifestyle - Watches">
                        Lifestyle — Watches
                      </option>
                      <option value="Lifestyle - Jewelry">
                        Lifestyle — Jewelry
                      </option>
                      <option value="Food & Drinks">Food & Drinks</option>
                      <option value="Beauty & Skincare">
                        Beauty & Skincare
                      </option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="Physical Store">Physical Store</option>
                      <option value="Online Only">Online Only</option>
                      <option value="Both Online & Physical">
                        Both Online & Physical
                      </option>
                      <option value="Home Based">Home Based</option>
                      <option value="Manufacturer/Producer">
                        Manufacturer/Producer
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Business Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Tell us what your business is about, what you sell and what makes you unique..."
                      rows={3}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                </>
              )}

              {/* Step 3 — Final Details */}
              {step === 3 && (
                <>
                  <p className="text-xs text-gray-400 mb-1">Almost done!</p>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Social Media Handle
                    </label>
                    <input
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      placeholder="@username (Instagram, TikTok, Facebook)"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Years of Experience
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">Select experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>

                  {/* Summary */}
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2">
                    <p className="text-xs font-bold text-orange-600 mb-3">
                      📋 Application Summary
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Name:</span>{" "}
                        {form.ownerName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Business:</span>{" "}
                        {form.businessName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {form.category}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Phone:</span>{" "}
                        {form.phone}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Email:</span>{" "}
                        {form.email}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Location:</span>{" "}
                        {form.location}, {form.state}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <p className="text-xs text-green-700">
                      ✅ By submitting you agree to OBISCO's marketplace terms.
                      Our team will contact you within 24-48 hours to complete
                      your onboarding.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        {!submitted && (
          <div className="px-5 py-4 border-t bg-gray-50 shrink-0 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-orange-500 text-orange-500 font-bold py-2.5 rounded-full transition hover:bg-orange-50 text-sm"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-full transition text-sm"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 rounded-full transition text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "🚀 Submit Application"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterBusiness;

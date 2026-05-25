import { useState, useEffect } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://obisco-gadgets-backend.onrender.com";

const NETWORKS = [
  { id: "mtn", name: "MTN", bg: "bg-yellow-400", text: "text-black" },
  { id: "airtel", name: "Airtel", bg: "bg-red-500", text: "text-white" },
  { id: "glo", name: "Glo", bg: "bg-green-500", text: "text-white" },
  { id: "etisalat", name: "9mobile", bg: "bg-green-800", text: "text-white" },
];

const DATA_NETWORKS = [
  { id: "mtn-data", name: "MTN", bg: "bg-yellow-400", text: "text-black" },
  { id: "airtel-data", name: "Airtel", bg: "bg-red-500", text: "text-white" },
  { id: "glo-data", name: "Glo", bg: "bg-green-500", text: "text-white" },
  { id: "etisalat-data", name: "9mobile", bg: "bg-green-800", text: "text-white" },
];

const DISCOS = [
  { id: "ikeja-electric", name: "Ikeja Electric" },
  { id: "eko-electric", name: "Eko Electric" },
  { id: "kano-electric", name: "Kano Electric" },
  { id: "phed", name: "PHED (Port Harcourt)" },
  { id: "eedc", name: "EEDC (Enugu)" },
  { id: "ibedc", name: "IBEDC (Ibadan)" },
  { id: "kedco", name: "KEDCO (Kaduna)" },
  { id: "abuja-electric", name: "Abuja Electric" },
];

const CABLE_PROVIDERS = [
  { id: "dstv", name: "DSTV" },
  { id: "gotv", name: "GOtv" },
  { id: "startimes", name: "StarTimes" },
];

const HOT_PLAN_CODES = [
  // ── MTN Hot Plans ──
  "mtn-5.5gb-2-1500",    // 5.5GB 2 Days - ₦1,500
  "mtn-1gb-350",          // 1GB 1 Day - ₦500
  "mtn-11gb-3500",        // 11GB 7 Days - ₦3,500
  "mtn-20-5000",          // 20GB Weekly - ₦5,000
  "mtn-230mb-200",        // 230MB 1 Day - ₦200
  "mtn-7gb-3000",         // 6GB 7 Days - ₦2,500
  "mtn-3.5gb-1-1000",     // 3.5GB 1 Day - ₦1,000
  "mtn-4gb-2-1200",       // 4GB 2 Days - ₦1,200
  "mtn-7gb-1800",         // 7GB 2 Days - ₦1,800
  "mtn-3.2gb-1000",       // 3.2GB 2 Days - ₦1,000

  // ── Airtel Hot Plans ──
  "airt-1500-2",          // 5GB Binge 2 Days - ₦1,500
  "airt-200",             // 230MB Daily - ₦200
  "airt-1000-2",          // 3.2GB Binge 2 Days - ₦1,000
  "airt-3000-7",          // 10GB Weekly 7 Days - ₦3,000
  "airt-5000-7",          // 18GB Weekly 7 Days - ₦5,000
  "airt-750-2",           // 2GB Binge 2 Days - ₦750
  "airt-800-7",           // 1GB Weekly 7 Days - ₦800
  "airt-300-1",           // 300MB Daily - ₦300
  "airt-2500-7",          // 6GB Weekly 7 Days - ₦2,500
  "airt-350-500",         // 500MB 2 Days - ₦350

  // ── Glo Hot Plans ──
  "glo-350-special-1day", // 1GB 1 Day - ₦350
  "glo-1000mb-300-oneoff",// 1GB 1 Day - ₦300
  "glo-500mb-200-oneoff", // 500MB 1 Day - ₦200
  "glo-600-special-2days",// 1.55GB 2 Days - ₦600
  "glo-1000-special-2days",// 3.1GB 2 Days - ₦1,000
  "glo-special-1500",     // 4GB 7 Days - ₦1,500
  "glo-2000-7days",       // 6.5GB 7 Days - ₦2,000
  "glo-5000-7days",       // 22GB 7 Days - ₦5,000
  "glo-youtube-250",      // 1GB 1 Day Youtube - ₦250
  "glo-youtube-600",      // 3GB 2 Days Youtube - ₦600
  "glo-dg-295",           // 1GB 3 Days - ₦295
  "glo-dg-890",           // 3GB 3 Days - ₦890

  // ── 9mobile Hot Plans ──
  "eti-150",              // 150MB + 100MB Night 1 Day - ₦150
  "eti-500",              // 650MB 3 Days - ₦500
  "eti-1000",             // 2GB 30 Days - ₦1,000
  "eti-1200",             // 2.3GB 30 Days - ₦1,200
  "eti-2000",             // 4.5GB 30 Days - ₦2,000
  "eti-3000",             // 6.2GB 30 Days - ₦3,000
  "t2-250mb-200",         // 250MB 7 Days - ₦200
]

const groupPlans = (plans) => {
  const groups = {
    Hot: plans.filter((p) => HOT_PLAN_CODES.includes(p.variation_code)),
    Daily: [],
    Weekly: [],
    Monthly: [],
    Other: [],
  };
  plans.forEach((plan) => {
    const name = plan.name.toLowerCase();
    if (name.includes("day") && !name.includes("30") && !name.includes("month")) {
      groups.Daily.push(plan);
    } else if (name.includes("week") || name.includes("7 day") || name.includes("7days")) {
      groups.Weekly.push(plan);
    } else if (name.includes("month") || name.includes("30") || name.includes("monthly")) {
      groups.Monthly.push(plan);
    } else {
      groups.Other.push(plan);
    }
  });
  return groups;
};

export default function VTUPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("airtime");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [vtuPaymentMethod, setVtuPaymentMethod] = useState("paystack");
  const [walletBalance, setWalletBalance] = useState(0);

  const [customerEmail, setCustomerEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(0);

  const [airtimeNetwork, setAirtimeNetwork] = useState("");
  const [airtimePhone, setAirtimePhone] = useState("");
  const [airtimeAmount, setAirtimeAmount] = useState("");

  const [dataNetwork, setDataNetwork] = useState("");
  const [dataPhone, setDataPhone] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [showPlanSheet, setShowPlanSheet] = useState(false);
  const [planFilter, setPlanFilter] = useState("Hot");

  const [disco, setDisco] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [elecAmount, setElecAmount] = useState("");
  const [elecPhone, setElecPhone] = useState("");
  const [meterName, setMeterName] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [cableProvider, setCableProvider] = useState("");
  const [smartCard, setSmartCard] = useState("");
  const [cablePlans, setCablePlans] = useState([]);
  const [selectedCablePlan, setSelectedCablePlan] = useState("");
  const [cablePhone, setCablePhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [loadingCablePlans, setLoadingCablePlans] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    setResult(null);
    setError("");
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setWalletBalance(data.balance || 0))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (dataNetwork) {
      setLoadingPlans(true);
      setDataPlans([]);
      setSelectedPlan(null);
      fetch(`${API_BASE}/api/vtu/variations/${dataNetwork}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.content?.variations) setDataPlans(data.content.variations);
        })
        .catch(() => setError("Could not load data plans"))
        .finally(() => setLoadingPlans(false));
    }
  }, [dataNetwork]);

  useEffect(() => {
    if (cableProvider) {
      setLoadingCablePlans(true);
      setCablePlans([]);
      setSelectedCablePlan("");
      fetch(`${API_BASE}/api/vtu/variations/${cableProvider}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.content?.variations) setCablePlans(data.content.variations);
        })
        .catch(() => setError("Could not load cable plans"))
        .finally(() => setLoadingCablePlans(false));
    }
  }, [cableProvider]);

  const getUserEmail = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.email || "";
  };

  const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

  const initiatePaystackPayment = (amount, email, onSuccess) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100,
      currency: "NGN",
      ref: `vtu_${Date.now()}`,
      callback: function (response) { onSuccess(response); },
      onClose: function () {
        setLoading(false);
        setError("Payment cancelled.");
      },
    });
    handler.openIframe();
  };

  const verifyMeter = async () => {
    if (!disco || !meterNumber) return;
    setVerifying(true);
    setMeterName("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/vtu/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billersCode: meterNumber, serviceID: disco, type: meterType }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setMeterName(data.content.Customer_Name);
      } else {
        setError("Meter number not found.");
      }
    } catch { setError("Verification failed."); }
    finally { setVerifying(false); }
  };

  const verifySmartCard = async () => {
    if (!cableProvider || !smartCard) return;
    setVerifying(true);
    setCardName("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/vtu/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billersCode: smartCard, serviceID: cableProvider }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setCardName(data.content.Customer_Name);
      } else {
        setError("Smart card not found.");
      }
    } catch { setError("Verification failed."); }
    finally { setVerifying(false); }
  };

  const handleAirtime = async () => {
    if (!airtimeNetwork) return setError("Please select a network");
    if (!airtimePhone || airtimePhone.length < 11) return setError("Enter a valid 11-digit phone number");
    if (!airtimeAmount || Number(airtimeAmount) < 50) return setError("Minimum airtime is ₦50");
    const amount = Number(airtimeAmount);
    const user = getUser();
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/airtime`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ network: airtimeNetwork, phone: airtimePhone, amount, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ₦${amount.toLocaleString()} airtime sent to ${airtimePhone} successfully!`, data });
          setWalletBalance((prev) => prev - amount);
          setAirtimePhone(""); setAirtimeAmount(""); setAirtimeNetwork("");
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("airtime"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/airtime`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ network: airtimeNetwork, phone: airtimePhone, amount }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ₦${amount.toLocaleString()} airtime sent to ${airtimePhone} successfully!`, data });
          setAirtimePhone(""); setAirtimeAmount(""); setAirtimeNetwork("");
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleData = async () => {
    if (!dataNetwork) return setError("Please select a network");
    if (!dataPhone || dataPhone.length < 11) return setError("Enter a valid 11-digit phone number");
    if (!selectedPlan) return setError("Please select a data plan");
    const amount = Number(selectedPlan.variation_amount);
    const user = getUser();
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ network: dataNetwork, phone: dataPhone, variationCode: selectedPlan.variation_code, amount, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${selectedPlan.name} data sent to ${dataPhone} successfully!`, data });
          setWalletBalance((prev) => prev - amount);
          setDataPhone(""); setDataNetwork(""); setSelectedPlan(null);
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("data"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ network: dataNetwork, phone: dataPhone, variationCode: selectedPlan.variation_code, amount: selectedPlan.variation_amount }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${selectedPlan.name} data sent to ${dataPhone} successfully!`, data });
          setDataPhone(""); setDataNetwork(""); setSelectedPlan(null);
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleElectricity = async () => {
    if (!disco) return setError("Please select a disco");
    if (!meterNumber) return setError("Please enter your meter number");
    if (!meterName) return setError("Please verify your meter number first");
    if (!elecAmount || Number(elecAmount) < 500) return setError("Minimum electricity payment is ₦500");
    if (!elecPhone || elecPhone.length < 11) return setError("Enter a valid 11-digit phone number");
    const amount = Number(elecAmount);
    const user = getUser();
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disco, meterNumber, meterType, amount, phone: elecPhone, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          const token = data.content?.transactions?.token || "";
          setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}`, data });
          setWalletBalance((prev) => prev - amount);
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("electricity"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disco, meterNumber, meterType, amount: elecAmount, phone: elecPhone }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          const token = data.content?.transactions?.token || "";
          setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}`, data });
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleCable = async () => {
    if (!cableProvider) return setError("Please select a provider");
    if (!smartCard) return setError("Please enter your smart card number");
    if (!cardName) return setError("Please verify your smart card number first");
    if (!selectedCablePlan) return setError("Please select a bouquet");
    if (!cablePhone || cablePhone.length < 11) return setError("Enter a valid 11-digit phone number");
    const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
    const amount = Number(plan?.variation_amount);
    const user = getUser();
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/cable`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount, phone: cablePhone, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${plan?.name} subscription activated successfully!`, data });
          setWalletBalance((prev) => prev - amount);
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("cable"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/cable`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount: plan?.variation_amount, phone: cablePhone }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${plan?.name} subscription activated successfully!`, data });
        } else { setError(data.response_description || "Transaction failed. Contact support."); }
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleEmailSubmit = () => {
    if (!customerEmail || !customerEmail.includes("@")) return setError("Please enter a valid email address");
    setShowEmailInput(false);
    setLoading(true);
    setError("");
    initiatePaystackPayment(pendingAmount, customerEmail, async () => {
      if (pendingAction === "airtime") {
        const res = await fetch(`${API_BASE}/api/vtu/airtime`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ network: airtimeNetwork, phone: airtimePhone, amount: airtimeAmount }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { setResult({ success: true, message: `✅ ₦${Number(airtimeAmount).toLocaleString()} airtime sent to ${airtimePhone}!`, data }); setAirtimePhone(""); setAirtimeAmount(""); setAirtimeNetwork(""); }
        else { setError(data.response_description || "Transaction failed."); }
      }
      if (pendingAction === "data" && selectedPlan) {
        const res = await fetch(`${API_BASE}/api/vtu/data`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ network: dataNetwork, phone: dataPhone, variationCode: selectedPlan.variation_code, amount: selectedPlan.variation_amount }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { setResult({ success: true, message: `✅ ${selectedPlan.name} data sent to ${dataPhone}!`, data }); setDataPhone(""); setDataNetwork(""); setSelectedPlan(null); }
        else { setError(data.response_description || "Transaction failed."); }
      }
      if (pendingAction === "electricity") {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disco, meterNumber, meterType, amount: elecAmount, phone: elecPhone }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { const token = data.content?.transactions?.token || ""; setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}`, data }); }
        else { setError(data.response_description || "Transaction failed."); }
      }
      if (pendingAction === "cable") {
        const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
        const res = await fetch(`${API_BASE}/api/vtu/cable`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount: plan?.variation_amount, phone: cablePhone }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { setResult({ success: true, message: `✅ ${plan?.name} subscription activated!`, data }); }
        else { setError(data.response_description || "Transaction failed."); }
      }
      setLoading(false);
    });
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  const tabs = [
    { id: "airtime", label: "📱 Airtime" },
    { id: "data", label: "🌐 Data" },
    { id: "electricity", label: "⚡ Light" },
    { id: "cable", label: "📺 Cable" },
  ];

  const inputClass = "w-full border border-gray-300 rounded-xl p-3 text-sm font-normal text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
  const selectClass = "w-full border border-gray-300 rounded-xl p-3 text-sm font-normal text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white appearance-none cursor-pointer";

  const PaymentToggle = ({ amount }) => (
    <div className="space-y-2">
      <p className="text-sm font-bold text-gray-700">💳 Payment Method</p>
      <div className="flex gap-2">
        <button onClick={() => setVtuPaymentMethod("paystack")} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition flex flex-col items-center gap-0.5 ${vtuPaymentMethod === "paystack" ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300 bg-white"}`}>
          <span>💳 Card</span>
          <span className={`text-xs font-normal ${vtuPaymentMethod === "paystack" ? "text-orange-100" : "text-gray-400"}`}>Paystack</span>
        </button>
        <button onClick={() => setVtuPaymentMethod("wallet")} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition flex flex-col items-center gap-0.5 ${vtuPaymentMethod === "wallet" ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300 bg-white"}`}>
          <span>💰 Wallet</span>
          <span className={`text-xs font-normal ${vtuPaymentMethod === "wallet" ? "text-orange-100" : "text-gray-500 font-semibold"}`}>₦{walletBalance.toLocaleString()}</span>
        </button>
      </div>
      {vtuPaymentMethod === "wallet" && amount > 0 && (
        <div className={`rounded-xl p-2.5 border text-xs font-medium ${walletBalance >= amount ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
          {walletBalance >= amount ? `✅ Sufficient balance for this transaction` : `❌ You need ₦${(amount - walletBalance).toLocaleString()} more — fund your wallet first`}
        </div>
      )}
    </div>
  );

  const PlanBottomSheet = () => {
    const grouped = groupPlans(dataPlans);
    const filters = ["Hot", "Daily", "Weekly", "Monthly", "Other"];
    const filteredPlans = planFilter === "Hot"
      ? grouped.Hot
      : grouped[planFilter] || [];

    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center" onClick={() => setShowPlanSheet(false)}>
        <div className="bg-white w-full sm:max-w-md rounded-t-2xl flex flex-col" style={{ maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="font-black text-gray-800 text-lg">Select Data Plan</h3>
              <p className="text-xs text-gray-400">{dataPlans.length} plans available</p>
            </div>
            <button onClick={() => setShowPlanSheet(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">✕</button>
          </div>

          <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0 border-b">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setPlanFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  planFilter === f
                    ? f === "Hot"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "Hot" ? "🔥 Hot" : f}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                {planFilter === "Hot" ? "No hot plans available for this network" : "No plans in this category"}
              </div>
            ) : (
              filteredPlans.map((plan) => {
                const isSelected = selectedPlan?.variation_code === plan.variation_code;
                const isHot = HOT_PLAN_CODES.includes(plan.variation_code);
                return (
                  <button
                    key={plan.variation_code}
                    onClick={() => { setSelectedPlan(plan); setShowPlanSheet(false); }}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${isSelected ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold leading-tight ${isSelected ? "text-orange-700" : "text-gray-800"}`}>{plan.name}</p>
                          {isHot && planFilter !== "Hot" && (
                            <span className="text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">🔥</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-base font-black ${isSelected ? "text-orange-600" : "text-gray-900"}`}>₦{Number(plan.variation_amount).toLocaleString()}</p>
                        {isSelected && <span className="text-xs text-orange-500 font-bold">✓ Selected</span>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
      {showPlanSheet && <PlanBottomSheet />}
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl" style={{ maxHeight: "92vh" }}>

        <div className="bg-orange-500 p-4 sm:rounded-t-2xl rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-xl">⚡ Pay Bills</h2>
            <p className="text-orange-100 text-xs">Airtime • Data • Electricity • Cable TV</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center font-bold text-lg transition">✕</button>
        </div>

        <div className="flex border-b bg-orange-50 flex-shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-b-2 border-orange-500 text-orange-500 bg-white" : "text-gray-500 hover:text-orange-400"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {showEmailInput && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-t-2xl sm:rounded-2xl">
            <div className="bg-white mx-4 p-6 rounded-2xl shadow-xl w-full max-w-sm">
              <h3 className="font-black text-gray-800 mb-2">Enter your email</h3>
              <p className="text-xs text-gray-500 mb-4">Required for payment receipt and confirmation.</p>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="yourname@gmail.com" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 mb-3" />
              <div className="flex gap-2">
                <button onClick={() => setShowEmailInput(false)} className="flex-1 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full text-sm">Cancel</button>
                <button onClick={handleEmailSubmit} className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-full text-sm hover:bg-orange-600">Continue</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {activeTab === "airtime" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Buy Airtime</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">Select Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {NETWORKS.map((n) => (
                    <button key={n.id} onClick={() => setAirtimeNetwork(n.id)} className={`p-2 rounded-xl border-2 text-center transition-all ${airtimeNetwork === n.id ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"}`}>
                      <div className={`w-9 h-9 rounded-full ${n.bg} mx-auto flex items-center justify-center`}><span className={`text-xs font-black ${n.text}`}>{n.name[0]}</span></div>
                      <div className="text-xs font-semibold mt-1 text-gray-700">{n.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                <input type="tel" value={airtimePhone} onChange={(e) => setAirtimePhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="08012345678" className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Amount (₦)</label>
                <input type="number" value={airtimeAmount} onChange={(e) => setAirtimeAmount(e.target.value)} placeholder="Minimum ₦50" className={inputClass} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map((a) => (
                    <button key={a} onClick={() => setAirtimeAmount(String(a))} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${airtimeAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"}`}>₦{a.toLocaleString()}</button>
                  ))}
                </div>
              </div>
              <PaymentToggle amount={Number(airtimeAmount) || 0} />
              <button onClick={handleAirtime} disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay & Get Airtime${airtimeAmount ? ` — ₦${Number(airtimeAmount).toLocaleString()}` : ""}`}
              </button>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Buy Data Bundle</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">Select Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {DATA_NETWORKS.map((n) => (
                    <button key={n.id} onClick={() => { setDataNetwork(n.id); setSelectedPlan(null); setPlanFilter("Hot"); }} className={`p-2 rounded-xl border-2 text-center transition-all ${dataNetwork === n.id ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"}`}>
                      <div className={`w-9 h-9 rounded-full ${n.bg} mx-auto flex items-center justify-center`}><span className={`text-xs font-black ${n.text}`}>{n.name[0]}</span></div>
                      <div className="text-xs font-semibold mt-1 text-gray-700">{n.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                <input type="tel" value={dataPhone} onChange={(e) => setDataPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="08012345678" className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Data Plan</label>
                {!dataNetwork ? (
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">Select a network first</div>
                ) : loadingPlans ? (
                  <div className="p-4 border rounded-xl text-center text-orange-500 text-sm font-medium">⏳ Loading plans...</div>
                ) : (
                  <button
                    onClick={() => setShowPlanSheet(true)}
                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${selectedPlan ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300 bg-gray-50"}`}
                  >
                    {selectedPlan ? (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-orange-700 leading-tight">{selectedPlan.name}</p>
                          <p className="text-xs text-orange-400 mt-0.5">Tap to change plan</p>
                        </div>
                        <p className="text-base font-black text-orange-600">₦{Number(selectedPlan.variation_amount).toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Tap to select a plan</p>
                        <span className="text-orange-500 text-lg">›</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
              <PaymentToggle amount={Number(selectedPlan?.variation_amount) || 0} />
              <button onClick={handleData} disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay & Get Data${selectedPlan ? ` — ₦${Number(selectedPlan.variation_amount).toLocaleString()}` : ""}`}
              </button>
            </div>
          )}

          {activeTab === "electricity" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Pay Electricity Bill</h3>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Select Disco</label>
                <div className="relative">
                  <select value={disco} onChange={(e) => { setDisco(e.target.value); setMeterName(""); }} className={selectClass}>
                    <option value="">-- Select your electricity provider --</option>
                    {DISCOS.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">Meter Type</label>
                <div className="flex gap-3">
                  {["prepaid", "postpaid"].map((type) => (
                    <button key={type} onClick={() => setMeterType(type)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${meterType === type ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Meter Number</label>
                <div className="flex gap-2">
                  <input type="text" value={meterNumber} onChange={(e) => { setMeterNumber(e.target.value); setMeterName(""); }} placeholder="Enter meter number" className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500" />
                  <button onClick={verifyMeter} disabled={verifying || !disco || !meterNumber} className="bg-orange-500 text-white px-4 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors whitespace-nowrap">{verifying ? "..." : "Verify"}</button>
                </div>
                {meterName && <div className="mt-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">✅ {meterName}</div>}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Amount (₦)</label>
                <input type="number" value={elecAmount} onChange={(e) => setElecAmount(e.target.value)} placeholder="Minimum ₦500" className={inputClass} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[500, 1000, 2000, 5000, 10000, 20000].map((a) => (
                    <button key={a} onClick={() => setElecAmount(String(a))} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${elecAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"}`}>₦{a.toLocaleString()}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                <input type="tel" value={elecPhone} onChange={(e) => setElecPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="08012345678" className={inputClass} />
              </div>
              <PaymentToggle amount={Number(elecAmount) || 0} />
              <button onClick={handleElectricity} disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay & Get Electricity${elecAmount ? ` — ₦${Number(elecAmount).toLocaleString()}` : ""}`}
              </button>
            </div>
          )}

          {activeTab === "cable" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Pay Cable TV</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">Select Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {CABLE_PROVIDERS.map((p) => (
                    <button key={p.id} onClick={() => { setCableProvider(p.id); setCardName(""); setSmartCard(""); }} className={`p-3 rounded-xl border-2 text-center transition-all font-bold text-sm ${cableProvider === p.id ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md" : "border-gray-200 text-gray-700 hover:border-orange-300"}`}>{p.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Smart Card / IUC Number</label>
                <div className="flex gap-2">
                  <input type="text" value={smartCard} onChange={(e) => { setSmartCard(e.target.value); setCardName(""); }} placeholder="Enter smart card number" className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500" />
                  <button onClick={verifySmartCard} disabled={verifying || !cableProvider || !smartCard} className="bg-orange-500 text-white px-4 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors whitespace-nowrap">{verifying ? "..." : "Verify"}</button>
                </div>
                {cardName && <div className="mt-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">✅ {cardName}</div>}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Select Bouquet</label>
                {loadingCablePlans ? (
                  <div className="text-center py-6 text-orange-500 text-sm font-medium">⏳ Loading plans...</div>
                ) : cablePlans.length > 0 ? (
                  <div className="relative">
                    <select value={selectedCablePlan} onChange={(e) => setSelectedCablePlan(e.target.value)} className={selectClass}>
                      <option value="">-- Select a bouquet --</option>
                      {cablePlans.map((plan) => (<option key={plan.variation_code} value={plan.variation_code}>{plan.name} — ₦{Number(plan.variation_amount).toLocaleString()}</option>))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                  </div>
                ) : cableProvider ? (
                  <div className="text-center py-4 text-gray-400 text-sm">No plans available</div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">Select a provider first</div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                <input type="tel" value={cablePhone} onChange={(e) => setCablePhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="" className={inputClass} />
              </div>
              <PaymentToggle amount={Number(cablePlans.find(p => p.variation_code === selectedCablePlan)?.variation_amount) || 0} />
              <button onClick={handleCable} disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay & Activate Cable TV`}
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-start gap-2">
              <span>❌</span><span>{error}</span>
            </div>
          )}

          {result?.success && (
            <div className="p-4 bg-orange-50 border border-orange-300 rounded-xl space-y-2">
              <p className="font-bold text-orange-700 text-sm">{result.message}</p>
              <p className="text-xs text-gray-500">Transaction ID: {result.data?.content?.transactions?.transactionId || "N/A"}</p>
              <button onClick={() => setResult(null)} className="w-full mt-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">Make Another Payment</button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 pb-2">Powered by VTpass • <span className="text-orange-500 font-semibold">OBISCO STORE</span></p>
        </div>
      </div>
    </div>
  );
}
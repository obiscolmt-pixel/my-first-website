import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ElectricityReceipt from "./ElectricityReceipt";

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
  { id: "portharcourt-electric", name: "PHED (Port Harcourt)" },
  { id: "enugu-electric", name: "EEDC (Enugu)" },
  { id: "ibadan-electric", name: "IBEDC (Ibadan)" },
  { id: "kaduna-electric", name: "KEDCO (Kaduna)" },
  { id: "abuja-electric", name: "Abuja Electric" },
];

const CABLE_PROVIDERS = [
  { id: "dstv", name: "DSTV", icon: "📺" },
  { id: "gotv", name: "GOtv", icon: "📡" },
  { id: "startimes", name: "StarTimes", icon: "⭐" },
];

const HOT_PLAN_CODES = [
  "mtn-5.5gb-2-1500", "mtn-1gb-350", "mtn-11gb-3500", "mtn-20-5000",
  "mtn-230mb-200", "mtn-7gb-3000", "mtn-3.5gb-1-1000", "mtn-4gb-2-1200",
  "mtn-7gb-1800", "mtn-3.2gb-1000",
  "airt-1500-2", "airt-200", "airt-1000-2", "airt-3000-7", "airt-5000-7",
  "airt-750-2", "airt-800-7", "airt-300-1", "airt-2500-7", "airt-350-500",
  "glo-350-special-1day", "glo-1000mb-300-oneoff", "glo-500mb-200-oneoff",
  "glo-600-special-2days", "glo-1000-special-2days", "glo-special-1500",
  "glo-2000-7days", "glo-5000-7days", "glo-youtube-250", "glo-youtube-600",
  "glo-dg-295", "glo-dg-890",
  "eti-150", "eti-500", "eti-1000", "eti-1200", "eti-2000", "eti-3000", "t2-250mb-200",
];

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const detectNetwork = (phone) => {
  const num = phone.replace(/\D/g, "");
  if (num.length < 4) return null;
  const prefix4 = num.substring(0, 4);
  const mtn = ["0703","0706","0803","0806","0810","0813","0814","0816","0903","0906","0913","0916","0704"];
  const airtel = ["0701","0708","0802","0808","0812","0901","0902","0904","0907","0911","0912"];
  const glo = ["0705","0805","0807","0811","0815","0905","0915"];
  const mobile9 = ["0809","0817","0818","0909","0908"];
  if (mtn.includes(prefix4)) return "mtn";
  if (airtel.includes(prefix4)) return "airtel";
  if (glo.includes(prefix4)) return "glo";
  if (mobile9.includes(prefix4)) return "etisalat";
  return null;
};

const detectDataNetwork = (phone) => {
  const network = detectNetwork(phone);
  if (!network) return null;
  const map = { mtn: "mtn-data", airtel: "airtel-data", glo: "glo-data", etisalat: "etisalat-data" };
  return map[network] || null;
};

const getSaved = (type) => {
  try {
    return JSON.parse(localStorage.getItem(`obisco_beneficiaries_${type}`) || "[]");
  } catch { return []; }
};

const getValidSaved = (type) => {
  const all = getSaved(type);
  return all.filter((b) => b.savedAt > Date.now() - THIRTY_DAYS);
};

const saveBeneficiary = (type, phone, network) => {
  const existing = getSaved(type);
  const filtered = existing.filter((b) => b.phone !== phone);
  const updated = [{ phone, network, savedAt: Date.now() }, ...filtered].slice(0, 5);
  localStorage.setItem(`obisco_beneficiaries_${type}`, JSON.stringify(updated));
};

const getElecBeneficiaries = () => {
  try {
    return JSON.parse(localStorage.getItem('obisco_elec_beneficiaries') || '[]');
  } catch { return []; }
};

const saveElecBeneficiary = (meterNumber, disco, meterType, meterName) => {
  const existing = getElecBeneficiaries();
  const filtered = existing.filter(b => b.meterNumber !== meterNumber);
  const updated = [{ meterNumber, disco, meterType, meterName, savedAt: Date.now() }, ...filtered].slice(0, 5);
  localStorage.setItem('obisco_elec_beneficiaries', JSON.stringify(updated));
};

const discoLabel = (id) => {
  const map = {
    'ikeja-electric': 'Ikeja Electric',
    'eko-electric': 'Eko Electric',
    'kano-electric': 'Kano Electric',
    'portharcourt-electric': 'PHED',
    'enugu-electric': 'EEDC',
    'ibadan-electric': 'IBEDC',
    'kaduna-electric': 'KEDCO',
    'abuja-electric': 'Abuja Electric',
  };
  return map[id] || id;
};

const networkLabel = (id) => {
  const map = {
    mtn: "MTN", airtel: "Airtel", glo: "Glo", etisalat: "9mobile",
    "mtn-data": "MTN", "airtel-data": "Airtel", "glo-data": "Glo", "etisalat-data": "9mobile",
  };
  return map[id] || id;
};

const networkBg = (id) => {
  if (id?.includes("mtn")) return "bg-yellow-400";
  if (id?.includes("airtel")) return "bg-red-500";
  if (id?.includes("glo")) return "bg-green-500";
  if (id?.includes("etisalat")) return "bg-green-800";
  return "bg-gray-400";
};

const networkText = (id) => {
  if (id?.includes("mtn")) return "text-black";
  return "text-white";
};

const groupPlans = (plans) => {
  const groups = { Hot: plans.filter((p) => HOT_PLAN_CODES.includes(p.variation_code)), Daily: [], Weekly: [], Monthly: [], Other: [] };
  plans.forEach((plan) => {
    const name = plan.name.toLowerCase();
    if (name.includes("day") && !name.includes("30") && !name.includes("month")) groups.Daily.push(plan);
    else if (name.includes("week") || name.includes("7 day") || name.includes("7days")) groups.Weekly.push(plan);
    else if (name.includes("month") || name.includes("30") || name.includes("monthly")) groups.Monthly.push(plan);
    else groups.Other.push(plan);
  });
  return groups;
};

const SERVICES = [
  { id: "airtime", label: "Airtime", icon: "📱", desc: "Top up any network", color: "bg-orange-50 border-orange-200" },
  { id: "data", label: "Data", icon: "🌐", desc: "Buy data bundles", color: "bg-blue-50 border-blue-200" },
  { id: "electricity", label: "Electricity", icon: "⚡", desc: "Pay light bill", color: "bg-yellow-50 border-yellow-200" },
  { id: "cable", label: "Cable TV", icon: "📺", desc: "DSTV, GOtv, StarTimes", color: "bg-purple-50 border-purple-200" },
];

const BeneficiaryList = ({ type, currentPhone, onSelect, onChange }) => {
  const [saved, setSaved] = useState(() => getValidSaved(type));
  const [showDropdown, setShowDropdown] = useState(false);
  const refreshSaved = () => setSaved(getValidSaved(type));

  return (
    <div className="relative">
      <div className={`flex items-center border-2 rounded-2xl bg-gray-50 overflow-hidden transition-all ${showDropdown ? "border-orange-500" : "border-gray-200"}`}>
        <input type="tel" value={currentPhone} onChange={(e) => { onChange(e.target.value); setShowDropdown(false); }} placeholder="" className="flex-1 p-4 text-sm text-gray-700 bg-transparent focus:outline-none" />
        {saved.length > 1 && (
          <button onClick={() => { refreshSaved(); setShowDropdown((d) => !d); }} className="px-4 py-4 text-gray-400 hover:text-orange-500 transition border-l border-gray-200 flex items-center gap-1">
            <span className="text-xs text-gray-400 hidden sm:block">Recent</span>
            <span className={`text-lg transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}>▾</span>
          </button>
        )}
      </div>
      {showDropdown && saved.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <p className="text-xs font-bold text-gray-400 px-4 pt-3 pb-2 uppercase tracking-widest">Recent Numbers</p>
          {saved.map((b, index) => (
            <div key={b.phone} className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition cursor-pointer ${index !== saved.length - 1 ? "border-b border-gray-100" : ""}`} onClick={() => { onSelect(b); setShowDropdown(false); }}>
              <div className={`w-9 h-9 rounded-full ${networkBg(b.network)} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-xs font-black ${networkText(b.network)}`}>{networkLabel(b.network)[0]}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{b.phone}</p>
                <p className="text-xs text-gray-400">{networkLabel(b.network)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function VTUPage({ onClose }) {
  const [screen, setScreen] = useState("home");
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
  const [detectedAirtimeNetwork, setDetectedAirtimeNetwork] = useState(null);

  const [dataNetwork, setDataNetwork] = useState("");
  const [dataPhone, setDataPhone] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planFilter, setPlanFilter] = useState("Hot");
  const [detectedDataNetwork, setDetectedDataNetwork] = useState(null);

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
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => { setResult(null); setError(""); }, [screen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/api/wallet`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).then((d) => setWalletBalance(d.balance || 0)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (screen === "airtime") {
      const valid = getValidSaved("airtime");
      if (valid.length > 0) { setAirtimePhone(valid[0].phone); setAirtimeNetwork(valid[0].network); setDetectedAirtimeNetwork(valid[0].network); }
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "data") {
      const valid = getValidSaved("data");
      if (valid.length > 0) { setDataPhone(valid[0].phone); setDataNetwork(valid[0].network); setDetectedDataNetwork(valid[0].network); }
    }
  }, [screen]);

  useEffect(() => {
    if (dataNetwork) {
      setLoadingPlans(true); setDataPlans([]); setSelectedPlan(null);
      fetch(`${API_BASE}/api/vtu/variations/${dataNetwork}`)
        .then((r) => r.json()).then((d) => { if (d.content?.variations) setDataPlans(d.content.variations); })
        .catch(() => setError("Could not load data plans")).finally(() => setLoadingPlans(false));
    }
  }, [dataNetwork]);

  useEffect(() => {
    if (cableProvider) {
      setLoadingCablePlans(true); setCablePlans([]); setSelectedCablePlan("");
      fetch(`${API_BASE}/api/vtu/variations/${cableProvider}`)
        .then((r) => r.json()).then((d) => { if (d.content?.variations) setCablePlans(d.content.variations); })
        .catch(() => setError("Could not load cable plans")).finally(() => setLoadingCablePlans(false));
    }
  }, [cableProvider]);

  const handleAirtimePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 11);
    setAirtimePhone(cleaned);
    const detected = detectNetwork(cleaned);
    setDetectedAirtimeNetwork(detected);
    if (detected && cleaned.length >= 4) setAirtimeNetwork(detected);
  };

  const handleDataPhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 11);
    setDataPhone(cleaned);
    const detected = detectDataNetwork(cleaned);
    setDetectedDataNetwork(detected);
    if (detected && cleaned.length >= 4) setDataNetwork(detected);
  };

  const getUserEmail = () => JSON.parse(localStorage.getItem("user") || "{}")?.email || "";
  const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

  const initiatePaystackPayment = (amount, email, onSuccess) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email, amount: amount * 100, currency: "NGN", ref: `vtu_${Date.now()}`,
      callback: (r) => { onSuccess(r); },
      onClose: () => { setLoading(false); setError("Payment cancelled."); },
    });
    handler.openIframe();
  };

  const verifyMeter = async () => {
    if (!disco || !meterNumber || verifying) return;
    setVerifying(true); setMeterName(""); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/vtu/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billersCode: meterNumber, serviceID: disco, type: meterType }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setMeterName(data.content.Customer_Name);
      } else if (data.code === "012") {
        setError("Please wait a moment and try again.");
      } else if (data.content?.error) {
        setError(data.content.error);
      } else {
        setError("Meter number not found.");
      }
    } catch { setError("Verification failed."); }
    finally { setVerifying(false); }
  };

  const verifySmartCard = async () => {
    if (!cableProvider || !smartCard) return;
    setVerifying(true); setCardName(""); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/vtu/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billersCode: smartCard, serviceID: cableProvider }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) setCardName(data.content.Customer_Name);
      else setError("Smart card not found.");
    } catch { setError("Verification failed."); }
    finally { setVerifying(false); }
  };

  const handleAirtime = async () => {
    if (!airtimeNetwork) return setError("Please select a network");
    if (!airtimePhone || airtimePhone.length < 11) return setError("Enter a valid 11-digit phone number");
    if (!airtimeAmount || Number(airtimeAmount) < 50) return setError("Minimum airtime is ₦50");
    const amount = Number(airtimeAmount);
    const user = getUser();
    const doRequest = async () => {
      const res = await fetch(`${API_BASE}/api/vtu/airtime`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network: airtimeNetwork, phone: airtimePhone, amount, ...(vtuPaymentMethod === "wallet" ? { userId: user._id || user.id, paymentMethod: "wallet" } : {}) }),
      });
      return res.json();
    };
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const data = await doRequest();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          saveBeneficiary("airtime", airtimePhone, airtimeNetwork);
          setResult({ success: true, message: `✅ ₦${amount.toLocaleString()} airtime sent to ${airtimePhone} successfully!`, data });
          setWalletBalance((prev) => prev - amount);
          setAirtimePhone(""); setAirtimeAmount(""); setAirtimeNetwork(""); setDetectedAirtimeNetwork(null);
        } else setError(data.response_description || "Transaction failed.");
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("airtime"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const data = await doRequest();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          saveBeneficiary("airtime", airtimePhone, airtimeNetwork);
          setResult({ success: true, message: `✅ ₦${amount.toLocaleString()} airtime sent to ${airtimePhone} successfully!`, data });
          setAirtimePhone(""); setAirtimeAmount(""); setAirtimeNetwork(""); setDetectedAirtimeNetwork(null);
        } else setError(data.response_description || "Transaction failed.");
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
    const doRequest = async () => {
      const res = await fetch(`${API_BASE}/api/vtu/data`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network: dataNetwork, phone: dataPhone, variationCode: selectedPlan.variation_code, amount, ...(vtuPaymentMethod === "wallet" ? { userId: user._id || user.id, paymentMethod: "wallet" } : {}) }),
      });
      return res.json();
    };
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const data = await doRequest();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          saveBeneficiary("data", dataPhone, dataNetwork);
          setResult({ success: true, message: `✅ ${selectedPlan.name} sent to ${dataPhone} successfully!`, data });
          setWalletBalance((prev) => prev - amount);
          setDataPhone(""); setDataNetwork(""); setSelectedPlan(null); setDetectedDataNetwork(null);
        } else setError(data.response_description || "Transaction failed.");
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
      return;
    }
    const email = getUserEmail();
    if (!email) { setShowEmailInput(true); setPendingAction("data"); setPendingAmount(amount); return; }
    setLoading(true); setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const data = await doRequest();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          saveBeneficiary("data", dataPhone, dataNetwork);
          setResult({ success: true, message: `✅ ${selectedPlan.name} sent to ${dataPhone} successfully!`, data });
          setDataPhone(""); setDataNetwork(""); setSelectedPlan(null); setDetectedDataNetwork(null);
        } else setError(data.response_description || "Transaction failed.");
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
      if (walletBalance < amount) return setError(`Insufficient balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disco, meterNumber, meterType, amount, phone: elecPhone, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          const token = data.token || data.content?.transactions?.token || "";
          const units = data.units || "";
          saveElecBeneficiary(meterNumber, disco, meterType, meterName);
          setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}${units ? ` (${units})` : ""}`, data });
          setWalletBalance((prev) => prev - amount);
        } else setError(data.response_description || "Transaction failed.");
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
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disco, meterNumber, meterType, amount: elecAmount, phone: elecPhone }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          const token = data.token || data.content?.transactions?.token || "";
          const units = data.units || "";
          saveElecBeneficiary(meterNumber, disco, meterType, meterName);
          setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}${units ? ` (${units})` : ""}`, data });
        } else setError(data.response_description || "Transaction failed.");
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleCable = async () => {
    if (!cableProvider) return setError("Please select a provider");
    if (!smartCard) return setError("Please enter your smart card number");
    if (!cardName) return setError("Please verify your smart card first");
    if (!selectedCablePlan) return setError("Please select a bouquet");
    if (!cablePhone || cablePhone.length < 11) return setError("Enter a valid 11-digit phone number");
    const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
    const amount = Number(plan?.variation_amount);
    const user = getUser();
    if (vtuPaymentMethod === "wallet") {
      if (!user?._id && !user?.id) return setError("Please log in to pay with wallet");
      if (walletBalance < amount) return setError(`Insufficient balance. You have ₦${walletBalance.toLocaleString()}`);
      setLoading(true); setError("");
      try {
        const res = await fetch(`${API_BASE}/api/vtu/cable`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount, phone: cablePhone, userId: user._id || user.id, paymentMethod: "wallet" }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${plan?.name} activated successfully!`, data });
          setWalletBalance((prev) => prev - amount);
        } else setError(data.response_description || "Transaction failed.");
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
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount: plan?.variation_amount, phone: cablePhone }),
        });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          setResult({ success: true, message: `✅ ${plan?.name} activated successfully!`, data });
        } else setError(data.response_description || "Transaction failed.");
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    });
  };

  const handleEmailSubmit = () => {
    if (!customerEmail || !customerEmail.includes("@")) return setError("Please enter a valid email");
    setShowEmailInput(false); setLoading(true); setError("");
    initiatePaystackPayment(pendingAmount, customerEmail, async () => {
      if (pendingAction === "airtime") {
        const res = await fetch(`${API_BASE}/api/vtu/airtime`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ network: airtimeNetwork, phone: airtimePhone, amount: airtimeAmount }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { saveBeneficiary("airtime", airtimePhone, airtimeNetwork); setResult({ success: true, message: `✅ ₦${Number(airtimeAmount).toLocaleString()} airtime sent!`, data }); }
        else setError(data.response_description || "Transaction failed.");
      }
      if (pendingAction === "data" && selectedPlan) {
        const res = await fetch(`${API_BASE}/api/vtu/data`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ network: dataNetwork, phone: dataPhone, variationCode: selectedPlan.variation_code, amount: selectedPlan.variation_amount }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { saveBeneficiary("data", dataPhone, dataNetwork); setResult({ success: true, message: `✅ ${selectedPlan.name} sent!`, data }); }
        else setError(data.response_description || "Transaction failed.");
      }
      if (pendingAction === "electricity") {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disco, meterNumber, meterType, amount: elecAmount, phone: elecPhone }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") {
          const token = data.token || data.content?.transactions?.token || "";
          const units = data.units || "";
          saveElecBeneficiary(meterNumber, disco, meterType, meterName);
          setResult({ success: true, message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}${units ? ` (${units})` : ""}`, data });
        } else setError(data.response_description || "Transaction failed.");
      }
      if (pendingAction === "cable") {
        const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
        const res = await fetch(`${API_BASE}/api/vtu/cable`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: cableProvider, smartCardNumber: smartCard, variationCode: selectedCablePlan, amount: plan?.variation_amount, phone: cablePhone }) });
        const data = await res.json();
        if (data.code === "000" || data.response_description === "TRANSACTION SUCCESSFUL") { setResult({ success: true, message: `✅ ${plan?.name} activated!`, data }); }
        else setError(data.response_description || "Transaction failed.");
      }
      setLoading(false);
    });
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  const inputClass = "w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-gray-50";
  const selectClass = "w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 focus:outline-none focus:border-orange-500 bg-gray-50 appearance-none cursor-pointer";

  const PaymentToggle = ({ amount }) => (
    <div className="space-y-3">
      <p className="text-sm font-bold text-gray-700">Payment Method</p>
      <div className="flex gap-3">
        <button onClick={() => setVtuPaymentMethod("paystack")} className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition flex flex-col items-center gap-1 ${vtuPaymentMethod === "paystack" ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 bg-white"}`}>
          <span>💳 Card</span>
          <span className={`text-xs font-normal ${vtuPaymentMethod === "paystack" ? "text-orange-100" : "text-gray-400"}`}>Paystack</span>
        </button>
        <button onClick={() => setVtuPaymentMethod("wallet")} className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition flex flex-col items-center gap-1 ${vtuPaymentMethod === "wallet" ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 bg-white"}`}>
          <span>💰 Wallet</span>
          <span className={`text-xs font-normal ${vtuPaymentMethod === "wallet" ? "text-orange-100" : "text-gray-500"}`}>₦{walletBalance.toLocaleString()}</span>
        </button>
      </div>
      {vtuPaymentMethod === "wallet" && amount > 0 && (
        <div className={`rounded-2xl p-3 text-xs font-medium ${walletBalance >= amount ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {walletBalance >= amount ? `✅ Sufficient balance` : `❌ You need ₦${(amount - walletBalance).toLocaleString()} more`}
        </div>
      )}
    </div>
  );

  const SuccessCard = ({ message, transactionId, data }) => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✅</div>
      <h2 className="text-xl font-black text-gray-800 mb-3">Payment Successful!</h2>
      <p className="text-gray-600 text-sm mb-2 leading-relaxed">{message}</p>
      {transactionId && <p className="text-xs text-gray-400 mb-6">Transaction ID: {transactionId}</p>}
      {data?.token && (
        <PDFDownloadLink document={<ElectricityReceipt data={data} />} fileName={`electricity_receipt_${Date.now()}.pdf`} style={{ width: "100%", marginBottom: "12px" }}>
          {({ loading }) => (
            <button className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-900 transition">
              {loading ? "⏳ Preparing receipt..." : "📄 Download Receipt"}
            </button>
          )}
        </PDFDownloadLink>
      )}
      <button onClick={() => { setResult(null); setScreen("home"); }} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-orange-600 transition mb-3">Make Another Payment</button>
      <button onClick={onClose} className="w-full border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition">Back to Store</button>
    </div>
  );

  const PageHeader = ({ title, onBack }) => (
    <div className="flex items-center gap-4 p-5 border-b bg-white sticky top-0 z-10 flex-shrink-0">
      <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-500 transition">
        <span style={{ fontSize: 32, lineHeight: 1, fontWeight: 300 }}>‹</span>
      </button>
      <h1 className="text-lg font-black text-gray-800">{title}</h1>
    </div>
  );

  const EmailModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="font-black text-gray-800 mb-1 text-lg">Enter your email</h3>
        <p className="text-xs text-gray-500 mb-4">Required for payment receipt.</p>
        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="yourname@gmail.com" className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 mb-4 bg-gray-50" />
        <div className="flex gap-3">
          <button onClick={() => setShowEmailInput(false)} className="flex-1 border border-gray-200 text-gray-500 font-bold py-3 rounded-2xl text-sm">Cancel</button>
          <button onClick={handleEmailSubmit} className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-2xl text-sm hover:bg-orange-600">Continue</button>
        </div>
      </div>
    </div>
  );

  const NetworkDetectedBadge = ({ networkId }) => {
    if (!networkId) return null;
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
        <div className={`w-5 h-5 rounded-full ${networkBg(networkId)} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-xs font-black ${networkText(networkId)}`}>{networkLabel(networkId)[0]}</span>
        </div>
        <p className="text-xs text-green-700 font-bold">✓ {networkLabel(networkId)} detected automatically</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-[90] flex flex-col overflow-hidden">
      {showEmailInput && <EmailModal />}

      {/* ── HOME ── */}
      {screen === "home" && (
        <div className="flex flex-col h-full">
          <div className="bg-orange-500 px-5 pt-12 pb-8 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white hover:text-orange-200 transition">
                <span style={{ fontSize: 32, lineHeight: 1, fontWeight: 300 }}>‹</span>
              </button>
              <div className="text-center">
                <h1 className="text-white font-black text-xl">Pay Bills</h1>
                <p className="text-orange-100 text-xs">Select a service</p>
              </div>
              <div className="w-10" />
            </div>
            <div className="bg-white/20 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-orange-100 text-xs">Wallet Balance</p>
                <p className="text-white font-black text-2xl">₦{walletBalance.toLocaleString()}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Services</p>
            <div className="grid grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <button key={service.id} onClick={() => setScreen(service.id)} className={`p-5 rounded-3xl border-2 text-left transition-all hover:shadow-md active:scale-95 ${service.color}`}>
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <p className="font-black text-gray-800 text-base">{service.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{service.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-300 mt-8">Powered by VTpass • <span className="text-orange-400 font-semibold">OBISCO Store</span></p>
          </div>
        </div>
      )}

      {/* ── AIRTIME ── */}
      {screen === "airtime" && (
        <div className="flex flex-col h-full">
          <PageHeader title="📱 Buy Airtime" onBack={() => setScreen("home")} />
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {result?.success ? (
              <SuccessCard message={result.message} transactionId={result.data?.content?.transactions?.transactionId} data={result.data} />
            ) : (
              <>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                  <BeneficiaryList type="airtime" currentPhone={airtimePhone} onChange={handleAirtimePhoneChange} onSelect={(b) => { setAirtimePhone(b.phone); setAirtimeNetwork(b.network); setDetectedAirtimeNetwork(b.network); }} />
                  <NetworkDetectedBadge networkId={detectedAirtimeNetwork} />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Network {detectedAirtimeNetwork && <span className="text-orange-500 font-normal text-xs ml-1">(auto-selected)</span>}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {NETWORKS.map((n) => (
                      <button key={n.id} onClick={() => { setAirtimeNetwork(n.id); setDetectedAirtimeNetwork(null); }} className={`p-3 rounded-2xl border-2 text-center transition-all ${airtimeNetwork === n.id ? "border-orange-500 shadow-md bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-300"}`}>
                        <div className={`w-10 h-10 rounded-full ${n.bg} mx-auto flex items-center justify-center mb-1`}>
                          <span className={`text-xs font-black ${n.text}`}>{n.name[0]}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-700">{n.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Amount (₦)</label>
                  <input type="number" value={airtimeAmount} onChange={(e) => setAirtimeAmount(e.target.value)} placeholder="Minimum ₦50" className={inputClass} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((a) => (
                      <button key={a} onClick={() => setAirtimeAmount(String(a))} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${airtimeAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400"}`}>₦{a.toLocaleString()}</button>
                    ))}
                  </div>
                </div>
                <PaymentToggle amount={Number(airtimeAmount) || 0} />
                {error && <div className="p-4 bg-red-50 rounded-2xl text-sm text-red-600 font-medium">❌ {error}</div>}
                <button onClick={handleAirtime} disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 disabled:opacity-50 transition text-sm">
                  {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay${airtimeAmount ? ` ₦${Number(airtimeAmount).toLocaleString()}` : ""}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── DATA ── */}
      {screen === "data" && (
        <div className="flex flex-col h-full">
          <PageHeader title="🌐 Buy Data" onBack={() => setScreen("home")} />
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {result?.success ? (
              <SuccessCard message={result.message} transactionId={result.data?.content?.transactions?.transactionId} data={result.data} />
            ) : (
              <>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                  <BeneficiaryList type="data" currentPhone={dataPhone} onChange={handleDataPhoneChange} onSelect={(b) => { setDataPhone(b.phone); setDataNetwork(b.network); setDetectedDataNetwork(b.network); setSelectedPlan(null); setPlanFilter("Hot"); }} />
                  <NetworkDetectedBadge networkId={detectedDataNetwork} />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Network {detectedDataNetwork && <span className="text-orange-500 font-normal text-xs ml-1">(auto-selected)</span>}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {DATA_NETWORKS.map((n) => (
                      <button key={n.id} onClick={() => { setDataNetwork(n.id); setSelectedPlan(null); setPlanFilter("Hot"); setDetectedDataNetwork(null); }} className={`p-3 rounded-2xl border-2 text-center transition-all ${dataNetwork === n.id ? "border-orange-500 shadow-md bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-300"}`}>
                        <div className={`w-10 h-10 rounded-full ${n.bg} mx-auto flex items-center justify-center mb-1`}>
                          <span className={`text-xs font-black ${n.text}`}>{n.name[0]}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-700">{n.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {dataNetwork && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-3 block">Select Plan</label>
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
                      {["Hot", "Daily", "Weekly", "Monthly", "Other"].map((f) => (
                        <button key={f} onClick={() => { setPlanFilter(f); setSelectedPlan(null); }} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${planFilter === f ? (f === "Hot" ? "bg-red-500 text-white" : "bg-orange-500 text-white") : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {f === "Hot" ? "🔥 Hot" : f}
                        </button>
                      ))}
                    </div>
                    {loadingPlans ? (
                      <div className="py-10 text-center text-orange-500 text-sm font-bold">⏳ Loading plans...</div>
                    ) : (() => {
                      const grouped = groupPlans(dataPlans);
                      const filteredPlans = planFilter === "Hot" ? grouped.Hot : grouped[planFilter] || [];
                      if (filteredPlans.length === 0) return <div className="py-10 text-center text-gray-400 text-sm">{planFilter === "Hot" ? "No hot plans for this network" : "No plans in this category"}</div>;
                      return (
                        <div className="grid grid-cols-3 gap-3">
                          {filteredPlans.map((plan) => {
                            const isSelected = selectedPlan?.variation_code === plan.variation_code;
                            const sizeMatch = plan.name.match(/(\d+\.?\d*\s?(?:GB|MB|TB))/i);
                            const durationMatch = plan.name.match(/(\d+\s?(?:day|days|week|weeks|month|months))/i);
                            const size = sizeMatch ? sizeMatch[1].replace(" ", "") : plan.name.split(" ")[0];
                            const duration = durationMatch ? durationMatch[1] : "";
                            return (
                              <button key={plan.variation_code} onClick={() => setSelectedPlan(isSelected ? null : plan)} className={`p-3 rounded-2xl border-2 text-center transition-all relative ${isSelected ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}>
                                {isSelected && <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-xs font-black">✓</span></div>}
                                <p className={`text-base leading-tight mb-1 ${isSelected ? "text-orange-600" : "text-gray-800"}`}>
                                  <span className="font-black">{size.replace(/[a-zA-Z]+/, "")}</span>
                                  <span className="font-normal text-sm">{size.replace(/[0-9.]+/, "")}</span>
                                </p>
                                {duration && <p className={`text-xs mb-2 leading-tight ${isSelected ? "text-orange-400" : "text-gray-400"}`}>{duration}</p>}
                                <p className={`text-sm font-normal ${isSelected ? "text-orange-500" : "text-gray-500"}`}>₦{Number(plan.variation_amount).toLocaleString()}</p>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {!dataNetwork && <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-sm">Select a network to see plans</div>}
                {selectedPlan && (
                  <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black text-orange-700 leading-tight">{selectedPlan.name}</p>
                      <p className="text-xs text-orange-400 mt-0.5">Selected plan</p>
                    </div>
                    <p className="text-lg font-black text-orange-600">₦{Number(selectedPlan.variation_amount).toLocaleString()}</p>
                  </div>
                )}
                <PaymentToggle amount={Number(selectedPlan?.variation_amount) || 0} />
                {error && <div className="p-4 bg-red-50 rounded-2xl text-sm text-red-600 font-medium">❌ {error}</div>}
                <button onClick={handleData} disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 disabled:opacity-50 transition text-sm">
                  {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay${selectedPlan ? ` ₦${Number(selectedPlan.variation_amount).toLocaleString()}` : ""}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── ELECTRICITY ── */}
      {screen === "electricity" && (
        <div className="flex flex-col h-full">
          <PageHeader title="⚡ Pay Electricity" onBack={() => setScreen("home")} />
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {result?.success ? (
              <SuccessCard message={result.message} transactionId={result.data?.content?.transactions?.transactionId} data={result.data} />
            ) : (
              <>
                {getElecBeneficiaries().length > 0 && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Saved Meters</label>
                    <div className="flex flex-col gap-2">
                      {getElecBeneficiaries().map(b => (
                        <button key={b.meterNumber} onClick={() => { setDisco(b.disco); setMeterNumber(b.meterNumber); setMeterType(b.meterType); setMeterName(b.meterName); }}
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-orange-500 transition text-left">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{b.meterName}</p>
                            <p className="text-xs text-gray-400">{b.meterNumber} • {discoLabel(b.disco)} • {b.meterType}</p>
                          </div>
                          <span className="text-orange-500 text-xs font-bold">Use →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Electricity Provider</label>
                  <div className="relative">
                    <select value={disco} onChange={(e) => { setDisco(e.target.value); setMeterName(""); }} className={selectClass}>
                      <option value="">Select your disco</option>
                      {DISCOS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Meter Type</label>
                  <div className="flex gap-3">
                    {["prepaid", "postpaid"].map((type) => (
                      <button key={type} onClick={() => setMeterType(type)} className={`flex-1 py-3 rounded-2xl border-2 text-sm font-bold capitalize transition-all ${meterType === type ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-600"}`}>{type}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Meter Number</label>
                  <div className="flex gap-3">
                    <input type="text" value={meterNumber} onChange={(e) => { setMeterNumber(e.target.value); setMeterName(""); }} placeholder="Enter meter number" className="flex-1 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 bg-gray-50" />
                    <button onClick={verifyMeter} disabled={verifying || !disco || !meterNumber} className="bg-orange-500 text-white px-5 rounded-2xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition whitespace-nowrap">
                      {verifying ? "..." : "Verify"}
                    </button>
                  </div>
                  {meterName && <div className="mt-3 p-3 bg-green-50 rounded-2xl text-sm text-green-700 font-bold">✅ {meterName}</div>}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Amount (₦)</label>
                  <input type="number" value={elecAmount} onChange={(e) => setElecAmount(e.target.value)} placeholder="Minimum ₦500" className={inputClass} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[500, 1000, 2000, 5000, 10000, 20000].map((a) => (
                      <button key={a} onClick={() => setElecAmount(String(a))} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${elecAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400"}`}>₦{a.toLocaleString()}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                  <input type="tel" value={elecPhone} onChange={(e) => setElecPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="" className={inputClass} />
                </div>
                <PaymentToggle amount={Number(elecAmount) || 0} />
                {error && <div className="p-4 bg-red-50 rounded-2xl text-sm text-red-600 font-medium">❌ {error}</div>}
                <button onClick={handleElectricity} disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 disabled:opacity-50 transition text-sm">
                  {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay${elecAmount ? ` ₦${Number(elecAmount).toLocaleString()}` : ""}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CABLE ── */}
      {screen === "cable" && (
        <div className="flex flex-col h-full">
          <PageHeader title="📺 Cable TV" onBack={() => setScreen("home")} />
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {result?.success ? (
              <SuccessCard message={result.message} transactionId={result.data?.content?.transactions?.transactionId} data={result.data} />
            ) : (
              <>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">Select Provider</label>
                  <div className="grid grid-cols-3 gap-3">
                    {CABLE_PROVIDERS.map((p) => (
                      <button key={p.id} onClick={() => { setCableProvider(p.id); setCardName(""); setSmartCard(""); }} className={`p-4 rounded-2xl border-2 text-center transition-all ${cableProvider === p.id ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 bg-gray-50 hover:border-orange-300"}`}>
                        <div className="text-3xl mb-2">{p.icon}</div>
                        <p className="font-black text-sm text-gray-800">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Smart Card / IUC Number</label>
                  <div className="flex gap-3">
                    <input type="text" value={smartCard} onChange={(e) => { setSmartCard(e.target.value); setCardName(""); }} placeholder="Enter smart card number" className="flex-1 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 bg-gray-50" />
                    <button onClick={verifySmartCard} disabled={verifying || !cableProvider || !smartCard} className="bg-orange-500 text-white px-5 rounded-2xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition whitespace-nowrap">
                      {verifying ? "..." : "Verify"}
                    </button>
                  </div>
                  {cardName && <div className="mt-3 p-3 bg-green-50 rounded-2xl text-sm text-green-700 font-bold">✅ {cardName}</div>}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Select Bouquet</label>
                  {loadingCablePlans ? <div className="p-5 text-center text-orange-500 text-sm font-bold">⏳ Loading plans...</div>
                  : cablePlans.length > 0 ? (
                    <div className="relative">
                      <select value={selectedCablePlan} onChange={(e) => setSelectedCablePlan(e.target.value)} className={selectClass}>
                        <option value="">Select a bouquet</option>
                        {cablePlans.map((plan) => <option key={plan.variation_code} value={plan.variation_code}>{plan.name} — ₦{Number(plan.variation_amount).toLocaleString()}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                    </div>
                  ) : cableProvider ? <div className="p-5 text-center text-gray-400 text-sm">No plans available</div>
                  : <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-sm">Select a provider first</div>}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                  <input type="tel" value={cablePhone} onChange={(e) => setCablePhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="" className={inputClass} />
                </div>
                <PaymentToggle amount={Number(cablePlans.find((p) => p.variation_code === selectedCablePlan)?.variation_amount) || 0} />
                {error && <div className="p-4 bg-red-50 rounded-2xl text-sm text-red-600 font-medium">❌ {error}</div>}
                <button onClick={handleCable} disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 disabled:opacity-50 transition text-sm">
                  {loading ? "⏳ Processing..." : `${vtuPaymentMethod === "wallet" ? "💰" : "💳"} Pay & Activate`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
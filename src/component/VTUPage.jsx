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
  {
    id: "etisalat-data",
    name: "9mobile",
    bg: "bg-green-800",
    text: "text-white",
  },
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

export default function VTUPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("airtime");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Customer email for Paystack
  const [customerEmail, setCustomerEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(0);

  // Airtime
  const [airtimeNetwork, setAirtimeNetwork] = useState("");
  const [airtimePhone, setAirtimePhone] = useState("");
  const [airtimeAmount, setAirtimeAmount] = useState("");

  // Data
  const [dataNetwork, setDataNetwork] = useState("");
  const [dataPhone, setDataPhone] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Electricity
  const [disco, setDisco] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [elecAmount, setElecAmount] = useState("");
  const [elecPhone, setElecPhone] = useState("");
  const [meterName, setMeterName] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Cable
  const [cableProvider, setCableProvider] = useState("");
  const [smartCard, setSmartCard] = useState("");
  const [cablePlans, setCablePlans] = useState([]);
  const [selectedCablePlan, setSelectedCablePlan] = useState("");
  const [cablePhone, setCablePhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [loadingCablePlans, setLoadingCablePlans] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setResult(null);
    setError("");
  }, [activeTab]);

  useEffect(() => {
    if (dataNetwork) {
      setLoadingPlans(true);
      setDataPlans([]);
      setSelectedPlan("");
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

  // ── PAYSTACK PAYMENT ──
  const initiatePaystackPayment = (amount, email, onSuccess) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // kobo
      currency: "NGN",
      ref: `vtu_${Date.now()}`,
      callback: function (response) {
        onSuccess(response);
      },
      onClose: function () {
        setLoading(false);
        setError("Payment cancelled.");
      },
    });
    handler.openIframe();
  };

  const getUserEmail = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.email || "";
  };

  // ── PAYSTACK → VTU HANDLERS ──
  const handleAirtime = () => {
    if (!airtimeNetwork) return setError("Please select a network");
    if (!airtimePhone || airtimePhone.length < 11)
      return setError("Enter a valid 11-digit phone number");
    if (!airtimeAmount || Number(airtimeAmount) < 50)
      return setError("Minimum airtime is ₦50");

    const email = getUserEmail();
    if (!email) {
      setShowEmailInput(true);
      setPendingAction("airtime");
      setPendingAmount(Number(airtimeAmount));
      return;
    }

    setLoading(true);
    setError("");
    initiatePaystackPayment(Number(airtimeAmount), email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/airtime`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            network: airtimeNetwork,
            phone: airtimePhone,
            amount: airtimeAmount,
          }),
        });
        const data = await res.json();
        if (
          data.code === "000" ||
          data.response_description === "TRANSACTION SUCCESSFUL"
        ) {
          setResult({
            success: true,
            message: `✅ ₦${Number(airtimeAmount).toLocaleString()} airtime sent to ${airtimePhone} successfully!`,
            data,
          });
          setAirtimePhone("");
          setAirtimeAmount("");
          setAirtimeNetwork("");
        } else {
          setError(
            data.response_description || "Transaction failed. Contact support.",
          );
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleData = () => {
    if (!dataNetwork) return setError("Please select a network");
    if (!dataPhone || dataPhone.length < 11)
      return setError("Enter a valid 11-digit phone number");
    if (!selectedPlan) return setError("Please select a data plan");

    const plan = dataPlans.find((p) => p.variation_code === selectedPlan);
    const amount = Number(plan?.variation_amount);
    const email = getUserEmail();

    if (!email) {
      setShowEmailInput(true);
      setPendingAction("data");
      setPendingAmount(amount);
      return;
    }

    setLoading(true);
    setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            network: dataNetwork,
            phone: dataPhone,
            variationCode: selectedPlan,
            amount: plan?.variation_amount,
          }),
        });
        const data = await res.json();
        if (
          data.code === "000" ||
          data.response_description === "TRANSACTION SUCCESSFUL"
        ) {
          setResult({
            success: true,
            message: `✅ ${plan?.name} data sent to ${dataPhone} successfully!`,
            data,
          });
          setDataPhone("");
          setDataNetwork("");
          setSelectedPlan("");
        } else {
          setError(
            data.response_description || "Transaction failed. Contact support.",
          );
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleElectricity = () => {
    if (!disco) return setError("Please select a disco");
    if (!meterNumber) return setError("Please enter your meter number");
    if (!meterName) return setError("Please verify your meter number first");
    if (!elecAmount || Number(elecAmount) < 500)
      return setError("Minimum electricity payment is ₦500");
    if (!elecPhone || elecPhone.length < 11)
      return setError("Enter a valid 11-digit phone number");

    const amount = Number(elecAmount);
    const email = getUserEmail();

    if (!email) {
      setShowEmailInput(true);
      setPendingAction("electricity");
      setPendingAmount(amount);
      return;
    }

    setLoading(true);
    setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/electricity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disco,
            meterNumber,
            meterType,
            amount: elecAmount,
            phone: elecPhone,
          }),
        });
        const data = await res.json();
        if (
          data.code === "000" ||
          data.response_description === "TRANSACTION SUCCESSFUL"
        ) {
          const token = data.content?.transactions?.token || "";
          setResult({
            success: true,
            message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}`,
            data,
          });
        } else {
          setError(
            data.response_description || "Transaction failed. Contact support.",
          );
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleCable = () => {
    if (!cableProvider) return setError("Please select a provider");
    if (!smartCard) return setError("Please enter your smart card number");
    if (!cardName)
      return setError("Please verify your smart card number first");
    if (!selectedCablePlan) return setError("Please select a bouquet");
    if (!cablePhone || cablePhone.length < 11)
      return setError("Enter a valid 11-digit phone number");

    const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
    const amount = Number(plan?.variation_amount);
    const email = getUserEmail();

    if (!email) {
      setShowEmailInput(true);
      setPendingAction("cable");
      setPendingAmount(amount);
      return;
    }

    setLoading(true);
    setError("");
    initiatePaystackPayment(amount, email, async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vtu/cable`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: cableProvider,
            smartCardNumber: smartCard,
            variationCode: selectedCablePlan,
            amount: plan?.variation_amount,
            phone: cablePhone,
          }),
        });
        const data = await res.json();
        if (
          data.code === "000" ||
          data.response_description === "TRANSACTION SUCCESSFUL"
        ) {
          setResult({
            success: true,
            message: `✅ ${plan?.name} subscription activated successfully!`,
            data,
          });
        } else {
          setError(
            data.response_description || "Transaction failed. Contact support.",
          );
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  // Handle email submit for guests
  const handleEmailSubmit = () => {
    if (!customerEmail || !customerEmail.includes("@")) {
      return setError("Please enter a valid email address");
    }
    setShowEmailInput(false);
    setLoading(true);
    setError("");
    initiatePaystackPayment(pendingAmount, customerEmail, async (response) => {
      if (pendingAction === "airtime") await handleAirtimeAfterPayment();
      if (pendingAction === "data") await handleDataAfterPayment();
      if (pendingAction === "electricity")
        await handleElectricityAfterPayment();
      if (pendingAction === "cable") await handleCableAfterPayment();
    });
  };

  const handleAirtimeAfterPayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vtu/airtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: airtimeNetwork,
          phone: airtimePhone,
          amount: airtimeAmount,
        }),
      });
      const data = await res.json();
      if (
        data.code === "000" ||
        data.response_description === "TRANSACTION SUCCESSFUL"
      ) {
        setResult({
          success: true,
          message: `✅ ₦${Number(airtimeAmount).toLocaleString()} airtime sent to ${airtimePhone}!`,
          data,
        });
        setAirtimePhone("");
        setAirtimeAmount("");
        setAirtimeNetwork("");
      } else {
        setError(
          data.response_description || "Transaction failed. Contact support.",
        );
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataAfterPayment = async () => {
    const plan = dataPlans.find((p) => p.variation_code === selectedPlan);
    try {
      const res = await fetch(`${API_BASE}/api/vtu/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: dataNetwork,
          phone: dataPhone,
          variationCode: selectedPlan,
          amount: plan?.variation_amount,
        }),
      });
      const data = await res.json();
      if (
        data.code === "000" ||
        data.response_description === "TRANSACTION SUCCESSFUL"
      ) {
        setResult({
          success: true,
          message: `✅ ${plan?.name} data sent to ${dataPhone}!`,
          data,
        });
        setDataPhone("");
        setDataNetwork("");
        setSelectedPlan("");
      } else {
        setError(
          data.response_description || "Transaction failed. Contact support.",
        );
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleElectricityAfterPayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vtu/electricity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disco,
          meterNumber,
          meterType,
          amount: elecAmount,
          phone: elecPhone,
        }),
      });
      const data = await res.json();
      if (
        data.code === "000" ||
        data.response_description === "TRANSACTION SUCCESSFUL"
      ) {
        const token = data.content?.transactions?.token || "";
        setResult({
          success: true,
          message: `✅ Electricity payment successful!${token ? ` Token: ${token}` : ""}`,
          data,
        });
      } else {
        setError(
          data.response_description || "Transaction failed. Contact support.",
        );
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCableAfterPayment = async () => {
    const plan = cablePlans.find((p) => p.variation_code === selectedCablePlan);
    try {
      const res = await fetch(`${API_BASE}/api/vtu/cable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: cableProvider,
          smartCardNumber: smartCard,
          variationCode: selectedCablePlan,
          amount: plan?.variation_amount,
          phone: cablePhone,
        }),
      });
      const data = await res.json();
      if (
        data.code === "000" ||
        data.response_description === "TRANSACTION SUCCESSFUL"
      ) {
        setResult({
          success: true,
          message: `✅ ${plan?.name} subscription activated!`,
          data,
        });
      } else {
        setError(
          data.response_description || "Transaction failed. Contact support.",
        );
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify({
          billersCode: meterNumber,
          serviceID: disco,
          type: meterType,
        }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setMeterName(data.content.Customer_Name);
      } else {
        setError("Meter number not found.");
      }
    } catch {
      setError("Verification failed.");
    } finally {
      setVerifying(false);
    }
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
        body: JSON.stringify({
          billersCode: smartCard,
          serviceID: cableProvider,
        }),
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setCardName(data.content.Customer_Name);
      } else {
        setError("Smart card not found.");
      }
    } catch {
      setError("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  const tabs = [
    { id: "airtime", label: "📱 Airtime" },
    { id: "data", label: "🌐 Data" },
    { id: "electricity", label: "⚡ Light" },
    { id: "cable", label: "📺 Cable" },
  ];

  const inputClass =
    "w-full border border-gray-300 rounded-xl p-3 text-sm font-normal text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
  const selectClass =
    "w-full border border-gray-300 rounded-xl p-3 text-sm font-normal text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="bg-orange-500 p-4 sm:rounded-t-2xl rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-xl">⚡ Pay Bills</h2>
            <p className="text-orange-100 text-xs">
              Airtime • Data • Electricity • Cable TV
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center font-bold text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-orange-50 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-b-2 border-orange-500 text-orange-500 bg-white" : "text-gray-500 hover:text-orange-400"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Email Modal for guests */}
        {showEmailInput && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-t-2xl sm:rounded-2xl">
            <div className="bg-white mx-4 p-6 rounded-2xl shadow-xl w-full max-w-sm">
              <h3 className="font-black text-gray-800 mb-2">
                Enter your email
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Required for payment receipt and confirmation.
              </p>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmailInput(false)}
                  className="flex-1 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailSubmit}
                  className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-full text-sm hover:bg-orange-600"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* COMING SOON BANNER - Remove when VTpass wallet is funded */}
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-center">
            <p className="text-2xl mb-1">🔧</p>
            <p className="font-black text-yellow-800 text-sm">
              Service Coming Soon!
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              We're finalizing our payment setup. Bill payments will be
              available very soon. Check back shortly!
            </p>
          </div>

          {/* AIRTIME */}
          {activeTab === "airtime" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Buy Airtime</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Select Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setAirtimeNetwork(n.id)}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${airtimeNetwork === n.id ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${n.bg} mx-auto flex items-center justify-center`}
                      >
                        <span className={`text-xs font-black ${n.text}`}>
                          {n.name[0]}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1 text-gray-700">
                        {n.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={airtimePhone}
                  onChange={(e) =>
                    setAirtimePhone(
                      e.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  placeholder="08012345678"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={airtimeAmount}
                  onChange={(e) => setAirtimeAmount(e.target.value)}
                  placeholder="Minimum ₦50"
                  className={inputClass}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAirtimeAmount(String(a))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${airtimeAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"}`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAirtime}
                disabled={true}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
              >
                {loading
                  ? "⏳ Processing..."
                  : `💳 Pay & Get Airtime${airtimeAmount ? ` — ₦${Number(airtimeAmount).toLocaleString()}` : ""}`}
              </button>
            </div>
          )}

          {/* DATA */}
          {activeTab === "data" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Buy Data Bundle</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Select Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DATA_NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setDataNetwork(n.id)}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${dataNetwork === n.id ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${n.bg} mx-auto flex items-center justify-center`}
                      >
                        <span className={`text-xs font-black ${n.text}`}>
                          {n.name[0]}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1 text-gray-700">
                        {n.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={dataPhone}
                  onChange={(e) =>
                    setDataPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="08012345678"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Select Plan
                </label>
                {loadingPlans ? (
                  <div className="text-center py-6 text-orange-500 text-sm font-medium">
                    ⏳ Loading plans...
                  </div>
                ) : dataPlans.length > 0 ? (
                  <div className="relative">
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">-- Select a plan --</option>
                      {dataPlans.map((plan) => (
                        <option
                          key={plan.variation_code}
                          value={plan.variation_code}
                        >
                          {plan.name} — ₦
                          {Number(plan.variation_amount).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                ) : dataNetwork ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No plans available
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Select a network first
                  </div>
                )}
              </div>
              <button
                onClick={handleData}
                disabled={true}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "⏳ Processing..." : "💳 Pay & Get Data"}
              </button>
            </div>
          )}

          {/* ELECTRICITY */}
          {activeTab === "electricity" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Pay Electricity Bill</h3>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Select Disco
                </label>
                <div className="relative">
                  <select
                    value={disco}
                    onChange={(e) => {
                      setDisco(e.target.value);
                      setMeterName("");
                    }}
                    className={selectClass}
                  >
                    <option value="">
                      -- Select your electricity provider --
                    </option>
                    {DISCOS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Meter Type
                </label>
                <div className="flex gap-3">
                  {["prepaid", "postpaid"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMeterType(type)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${meterType === type ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Meter Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={meterNumber}
                    onChange={(e) => {
                      setMeterNumber(e.target.value);
                      setMeterName("");
                    }}
                    placeholder="Enter meter number"
                    className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={verifyMeter}
                    disabled={verifying || !disco || !meterNumber}
                    className="bg-orange-500 text-white px-4 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors whitespace-nowrap"
                  >
                    {verifying ? "..." : "Verify"}
                  </button>
                </div>
                {meterName && (
                  <div className="mt-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">
                    ✅ {meterName}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={elecAmount}
                  onChange={(e) => setElecAmount(e.target.value)}
                  placeholder="Minimum ₦500"
                  className={inputClass}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[500, 1000, 2000, 5000, 10000, 20000].map((a) => (
                    <button
                      key={a}
                      onClick={() => setElecAmount(String(a))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${elecAmount === String(a) ? "bg-orange-500 text-white border-orange-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"}`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={elecPhone}
                  onChange={(e) =>
                    setElecPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="08012345678"
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleElectricity}
                disabled={true}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
              >
                {loading
                  ? "⏳ Processing..."
                  : `💳 Pay & Get Electricity${elecAmount ? ` — ₦${Number(elecAmount).toLocaleString()}` : ""}`}
              </button>
            </div>
          )}

          {/* CABLE */}
          {activeTab === "cable" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Pay Cable TV</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Select Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CABLE_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCableProvider(p.id);
                        setCardName("");
                        setSmartCard("");
                      }}
                      className={`p-3 rounded-xl border-2 text-center transition-all font-bold text-sm ${cableProvider === p.id ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md" : "border-gray-200 text-gray-700 hover:border-orange-300"}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Smart Card / IUC Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={smartCard}
                    onChange={(e) => {
                      setSmartCard(e.target.value);
                      setCardName("");
                    }}
                    placeholder="Enter smart card number"
                    className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={verifySmartCard}
                    disabled={verifying || !cableProvider || !smartCard}
                    className="bg-orange-500 text-white px-4 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors whitespace-nowrap"
                  >
                    {verifying ? "..." : "Verify"}
                  </button>
                </div>
                {cardName && (
                  <div className="mt-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">
                    ✅ {cardName}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Select Bouquet
                </label>
                {loadingCablePlans ? (
                  <div className="text-center py-6 text-orange-500 text-sm font-medium">
                    ⏳ Loading plans...
                  </div>
                ) : cablePlans.length > 0 ? (
                  <div className="relative">
                    <select
                      value={selectedCablePlan}
                      onChange={(e) => setSelectedCablePlan(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">-- Select a bouquet --</option>
                      {cablePlans.map((plan) => (
                        <option
                          key={plan.variation_code}
                          value={plan.variation_code}
                        >
                          {plan.name} — ₦
                          {Number(plan.variation_amount).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                ) : cableProvider ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No plans available
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Select a provider first
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={cablePhone}
                  onChange={(e) =>
                    setCablePhone(
                      e.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  placeholder="08012345678"
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleCable}
                disabled={true}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "⏳ Processing..." : "💳 Pay & Activate Cable TV"}
              </button>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-start gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}
          {result?.success && (
            <div className="p-4 bg-orange-50 border border-orange-300 rounded-xl space-y-2">
              <p className="font-bold text-orange-700 text-sm">
                {result.message}
              </p>
              <p className="text-xs text-gray-500">
                Transaction ID:{" "}
                {result.data?.content?.transactions?.transactionId || "N/A"}
              </p>
              <button
                onClick={() => setResult(null)}
                className="w-full mt-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Make Another Payment
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 pb-2">
            Powered by VTpass •{" "}
            <span className="text-orange-500 font-semibold">OBISCO Store</span>
          </p>
        </div>
      </div>
    </div>
  );
}

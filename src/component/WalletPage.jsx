import { useState, useEffect } from 'react'
import { getWallet, fundWallet } from '../api/api.js'

export default function WalletPage({ onClose }) {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [fundAmount, setFundAmount] = useState('')
  const [funding, setFunding] = useState(false)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    setLoading(true)
    try {
      const data = await getWallet()
      setWallet({ balance: data.balance })
      setTransactions(data.transactions || [])
    } catch {
      setError('Could not load wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFundWallet = async () => {
    const amount = Number(fundAmount)
    if (!amount || amount < 100) return setError('Minimum funding amount is ₦100')
    if (!user?.email) return setError('Please log in to fund your wallet')

    setFunding(true)
    setError('')

    try {
      const data = await fundWallet({ amount, email: user.email })

      if (!data?.data?.authorization_url) {
        setError('Could not initialize payment. Please try again.')
        setFunding(false)
        return
      }

      // Open Paystack via popup
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amount * 100,
        currency: 'NGN',
        ref: data.data.reference,
        callback: async function () {
          // Webhook will credit the wallet — just refresh after a short delay
          setTimeout(async () => {
            await fetchWallet()
            setFundAmount('')
            setFunding(false)
          }, 3000)
        },
        onClose: function () {
          setFunding(false)
        },
      })
      handler.openIframe()
    } catch {
      setError('Payment initialization failed. Please try again.')
      setFunding(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="bg-orange-500 p-4 sm:rounded-t-2xl rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-xl">💰 My Wallet</h2>
            <p className="text-orange-100 text-xs">Fund • Pay Orders • Pay Bills</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center font-bold text-lg transition"
          >✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading wallet...</p>
            </div>
          ) : (
            <>
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
                <p className="text-orange-100 text-xs font-medium uppercase tracking-widest mb-1">Available Balance</p>
                <p className="text-4xl font-black mb-1">
                  ₦{(wallet?.balance || 0).toLocaleString()}
                </p>
                <p className="text-orange-200 text-xs">{user?.email || ''}</p>
              </div>

              {/* Fund Wallet */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <p className="font-bold text-gray-800 mb-3 text-sm">➕ Add Money</p>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => { setFundAmount(e.target.value); setError('') }}
                  placeholder="Enter amount (min ₦100)"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 mb-3"
                />
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setFundAmount(String(a)); setError('') }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        fundAmount === String(a)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500'
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleFundWallet}
                  disabled={funding || !fundAmount}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {funding ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                  ) : (
                    `💳 Fund Wallet${fundAmount ? ` — ₦${Number(fundAmount).toLocaleString()}` : ''}`
                  )}
                </button>
              </div>

              {/* How to use */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="font-bold text-blue-800 text-sm mb-2">💡 How to use your wallet</p>
                <ul className="space-y-1.5">
                  {[
                    'Fund your wallet using your card via Paystack',
                    'Select "Pay with Wallet" at checkout',
                    'Use wallet balance to pay for airtime, data & bills',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                      <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-start gap-2">
                  <span>❌</span><span>{error}</span>
                </div>
              )}

              {/* Transaction History */}
              <div>
                <p className="font-bold text-gray-800 text-sm mb-3">
                  🧾 Transaction History
                  {transactions.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">({transactions.length})</span>
                  )}
                </p>

                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm">No transactions yet</p>
                    <p className="text-xs mt-1">Fund your wallet to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${
                            tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {tx.type === 'credit' ? '⬆️' : '⬇️'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 leading-tight">{tx.description}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                            {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                          </p>
                          <p className={`text-xs font-medium ${
                            tx.status === 'success' ? 'text-green-400' :
                            tx.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                          }`}>{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 pb-2">
                Secured by Paystack • <span className="text-orange-500 font-semibold">OBISCO Store</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from "react"
import { useAuth } from "../../Context/useAuth"
import { portfolioDepositAPI, portfolioGetAPI, portfolioSellAPI, portfolioWithdrawAPI } from "../../Services/PortfolioService"
import { getProfileAPI } from "../../Services/AuthService"
import type { PortfolioGet } from "../../Models/Portfolio"
import { companyLogos } from "../../Components/Table/TestData"
import { toast } from "react-toastify"
import PurchasePortfolio from "../../Components/Portfolio/PurchasePortfolio/PurchasePortfolio"
import marketTerrain from "../../assets/generated/market-terrain.jpg"

const WalletPage = () => {
    const { user, updateWalletBalance } = useAuth()
    const [depositAmount, setDepositAmount] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>([])
    const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false)
    const [selectedSellStock, setSelectedSellStock] = useState<{ symbol: string; price: number; maxQuantity: number } | null>(null)
    const [liveBalance, setLiveBalance] = useState<number>(0)

    const getWalletPortfolio = () => {
        portfolioGetAPI()
            .then((res) => {
                if (res?.data) setPortfolioValues(res.data)
            })
            .catch((e) => console.error(e))
    }

    const refreshWalletBalance = async () => {
        const res = await getProfileAPI()
        if (res?.data?.walletBalance !== undefined) {
            setLiveBalance(res.data.walletBalance)
        }
    }

    useEffect(() => {
        if (!user) return

        const loadWalletData = async () => {
            getWalletPortfolio()
            await refreshWalletBalance()
        }
        loadWalletData()
    }, [user])

    const handleDepositSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const amount = parseFloat(depositAmount)

        if (isNaN(amount) || amount <= 0) {
            toast.warning("Please enter a valid amount greater than 0")
            return
        }

        setIsSubmitting(true)
        portfolioDepositAPI(amount)
            .then((res) => {
                if (res && res.data?.newBalance !== undefined) {
                    setLiveBalance(res.data.newBalance)
                    updateWalletBalance(res.data.newBalance)
                    toast.success(`$${amount.toLocaleString()} deposited successfully!`)
                    setDepositAmount("")
                    refreshWalletBalance()
                }
            })
            .catch((e) => {
                console.error(e)
                toast.error("Deposit failed. Please try again.")
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const triggerTableSell = (item: PortfolioGet) => {
        setSelectedSellStock({
            symbol: item.symbol,
            price: item.purchase || 0,
            maxQuantity: item.quantity || 0
        })
        setIsSellModalOpen(true)
    }

    const triggerUsdSell = () => {
        if (liveBalance <= 0) {
            toast.warning("You do not have any USD balance to sell!")
            return
        }
        setSelectedSellStock({
            symbol: "USD",
            price: 1.00,
            maxQuantity: liveBalance
        })
        setIsSellModalOpen(true)
    }

    const handleConfirmTableSell = (quantity: number) => {
        if (!selectedSellStock) return

        if (selectedSellStock.symbol === "USD") {
            portfolioWithdrawAPI(quantity)
                .then((res) => {
                    if (res && res.status >= 200 && res.status < 300) {
                        toast.success(`$${quantity.toLocaleString()} successfully withdrawn from wallet balance!`)
                        if (res.data?.newBalance !== undefined) {
                            setLiveBalance(res.data.newBalance)
                            updateWalletBalance(res.data.newBalance)
                        }
                        setIsSellModalOpen(false)
                        setSelectedSellStock(null)
                    }
                })
                .catch((e) => {
                    console.error(e)
                    toast.error("Withdrawal failed. Please try again.")
                })
            return
        }

        portfolioSellAPI(selectedSellStock.symbol, quantity)
            .then((res) => {
                if (res && res.status >= 200 && res.status < 300) {
                    toast.success("Asset converted to cash successfully!")
                    if (res.data?.newBalance !== undefined) {
                        setLiveBalance(res.data.newBalance)
                        updateWalletBalance(res.data.newBalance)
                    }
                    setIsSellModalOpen(false)
                    setSelectedSellStock(null)
                    getWalletPortfolio()
                    refreshWalletBalance()
                }
            })
            .catch((e) => {
                console.error(e)
                toast.error("Sale order execution failed.")
            })
    }

    const calculateStocksValue = () => {
        if (!portfolioValues) return 0
        return portfolioValues.reduce((total, item) => {
            const livePrice = item.purchase || 0
            const quantity = item.quantity || 0
            return total + livePrice * quantity
        }, 0)
    }

    const stocksValue = calculateStocksValue()
    const estimatedTotalValue = liveBalance + stocksValue

    return (
        <div className="w-full min-h-screen bg-abyss font-sans pb-16 text-foam text-left">
            <div className="w-full max-w-6xl mx-auto px-6 pt-10 flex flex-col space-y-8">
                <div className="border-b border-white/8 pb-5">
                    <h1 className="text-3xl font-bold tracking-[-0.02em] text-foam font-display">Wallet Overview</h1>
                    <p className="text-xs text-mist mt-1.5">Manage your funds and monitor estimated asset distribution.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel-hot rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                        {}
                        <img
                            src={marketTerrain}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/80 to-abyss/30 pointer-events-none"></div>

                        <div className="relative z-10">
                            <span className="text-[10px] font-bold text-mist uppercase tracking-[0.16em] font-mono">Est. Total Value</span>
                            <div className="flex items-baseline space-x-2 mt-3">
                                <h2 className="text-5xl font-mono font-bold text-foam tracking-[-0.03em]">${estimatedTotalValue.toFixed(2)}</h2>
                                <span className="text-sm font-bold text-mist font-mono">USD</span>
                            </div>
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-mist uppercase tracking-[0.14em]">Cash Balance (Wallet)</span>
                                <span className="text-lg font-mono font-bold text-pulse mt-1.5">${liveBalance.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-mist uppercase tracking-[0.14em]">Stocks Value (Portfolio)</span>
                                <span className="text-lg font-mono font-bold text-pulse-dim mt-1.5">${stocksValue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-depth border border-white/8 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-foam tracking-[0.1em] uppercase mb-1.5 font-display">Deposit Cash</h3>
                            <p className="text-[11px] text-mist mb-4 leading-relaxed">Add instant simulator credits into your trading account.</p>
                        </div>
                        <form onSubmit={handleDepositSubmit} className="flex flex-col space-y-4 w-full">
                            <div>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 font-mono text-sm font-bold text-mist">$</span>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="any"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full pl-8 pr-16 py-3 bg-black/50 border border-white/10 focus:border-pulse/70 rounded-xl focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,87,26,0.12)] text-foam font-bold text-lg font-mono transition-all"
                                    />
                                    <span className="absolute right-4 font-sans text-xs font-bold text-pulse bg-pulse/10 px-2 py-0.5 rounded border border-pulse/20">USD</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !depositAmount}
                                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.12em] transition-all duration-200 ${isSubmitting || !depositAmount
                                    ? "bg-depth-2 text-mist/60 cursor-not-allowed border border-white/6"
                                    : "glow-action bg-gradient-to-r from-pulse to-[#ff8a3d] text-white active:scale-[0.97] cursor-pointer"
                                    }`}
                            >
                                {isSubmitting ? "Processing..." : "Confirm Deposit"}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="bg-depth border border-white/8 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/8 bg-black/25">
                        <h3 className="text-[11px] font-bold text-mist uppercase tracking-[0.16em] font-mono">My Assets (Asset View)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="border-b border-white/6 text-[11px] font-bold text-mist uppercase tracking-wider font-mono">
                                    <th className="py-4 px-6">Asset Name</th>
                                    <th className="py-4 px-6 text-right">Market Price</th>
                                    <th className="py-4 px-6 text-right">Holdings Allocation</th>
                                    <th className="py-4 px-6 text-center w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/6 text-sm font-medium">
                                <tr className="hover:bg-white/4 transition-colors">
                                    <td className="py-4 px-6 flex items-center space-x-4">
                                        {companyLogos["USD"] ? (
                                            <div className="w-10 h-10 rounded-xl bg-depth-2 border border-white/8 p-2 flex items-center justify-center shrink-0 shadow-sm">
                                                {companyLogos["USD"]()}
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-pulse/10 text-pulse font-bold text-xs flex items-center justify-center border border-pulse/20 font-mono shadow-sm">
                                                USD
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-foam font-bold">United States Dollar</span>
                                            <span className="text-xs text-mist font-mono font-bold tracking-wide">CASH</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right font-mono text-mist font-semibold">$1.00</td>
                                    <td className="py-4 px-6 text-right flex flex-col items-end justify-center">
                                        <span className="text-foam font-mono font-bold">${liveBalance.toFixed(2)}</span>
                                        <span className="text-xs text-mist font-mono mt-0.5">
                                            {estimatedTotalValue > 0 ? ((liveBalance / estimatedTotalValue) * 100).toFixed(1) : 0}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={triggerUsdSell}
                                            className="px-3 py-1.5 bg-loss/10 hover:bg-loss border border-loss/25 text-loss hover:text-abyss font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                                        >
                                            Sell
                                        </button>
                                    </td>
                                </tr>
                                {portfolioValues && portfolioValues.map((item) => {
                                    const livePrice = item.purchase || 0
                                    const symbolUpper = item.symbol.toUpperCase()
                                    const quantity = item.quantity || 0
                                    const currentStockValue = livePrice * quantity

                                    return (
                                        <tr key={item.id} className="hover:bg-white/4 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-4">
                                                    {companyLogos[symbolUpper] ? (
                                                        <div className="w-10 h-10 rounded-xl bg-depth-2 border border-white/8 p-2 flex items-center justify-center shrink-0 shadow-sm">
                                                            {companyLogos[symbolUpper]()}
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-pulse-dim/10 text-pulse-dim font-bold text-xs flex items-center justify-center border border-pulse-dim/20 font-mono shrink-0 shadow-sm">
                                                            {symbolUpper}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-foam font-bold">{item.companyName}</span>
                                                        <span className="text-xs text-mist font-mono font-bold tracking-wide">{symbolUpper}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right font-mono text-mist font-semibold">${livePrice.toFixed(2)}</td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end justify-center">
                                                    <span className="text-foam font-mono font-bold">${currentStockValue.toFixed(2)}</span>
                                                    <span className="text-xs text-mist font-mono mt-0.5">
                                                        {estimatedTotalValue > 0 ? ((currentStockValue / estimatedTotalValue) * 100).toFixed(1) : 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => triggerTableSell(item)}
                                                    className="px-3 py-1.5 bg-loss/10 hover:bg-loss border border-loss/25 text-loss hover:text-abyss font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                                                >
                                                    Sell
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedSellStock && (
                <PurchasePortfolio
                    isOpen={isSellModalOpen}
                    onClose={() => {
                        setIsSellModalOpen(false)
                        setSelectedSellStock(null)
                    }}
                    onConfirm={handleConfirmTableSell}
                    stockSymbol={selectedSellStock.symbol}
                    stockPrice={selectedSellStock.price}
                    walletBalance={liveBalance}
                    mode="SELL"
                    maxOwnedQuantity={selectedSellStock?.maxQuantity || 0}
                />
            )}
        </div>
    )
}

export default WalletPage
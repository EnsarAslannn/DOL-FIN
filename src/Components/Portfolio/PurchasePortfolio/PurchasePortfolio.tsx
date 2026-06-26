import React, { useState } from "react"
import { portfolioDepositAPI } from "../../../Services/PortfolioService"
import { useAuth } from "../../../Context/useAuth"
import { toast } from "react-toastify"

interface PurchasePortfolioProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (quantity: number) => void
    stockSymbol: string
    stockPrice: number
    walletBalance: number
    mode?: "BUY" | "SELL"
    maxOwnedQuantity?: number
}

const PurchasePortfolio: React.FC<PurchasePortfolioProps> = ({
    isOpen,
    onClose,
    onConfirm,
    stockSymbol,
    stockPrice,
    walletBalance,
    mode = "BUY",
    maxOwnedQuantity = 0
}) => {
    const { updateWalletBalance } = useAuth()
    const [quantity, setQuantity] = useState<number>(1)
    const [isDepositing, setIsDepositing] = useState<boolean>(false)

    if (!isOpen) return null

    const totalValue = stockPrice * quantity
    const isInsufficientFunds = mode === "BUY" && totalValue > walletBalance
    const isInsufficientShares = mode === "SELL" && quantity > maxOwnedQuantity

    const handleConfirm = () => {
        if (quantity <= 0) return
        if (mode === "BUY" && isInsufficientFunds) return
        if (mode === "SELL" && isInsufficientShares) return

        onConfirm(quantity)
        setQuantity(1)
    }

    const handleQuickDeposit = () => {
        setIsDepositing(true)
        portfolioDepositAPI(5000)
            .then((res) => {
                if (res && res.data?.newBalance !== undefined) {
                    updateWalletBalance(res.data.newBalance)
                    toast.success("$5,000 deposited successfully!")
                }
            })
            .catch((e) => {
                console.error(e)
                toast.warning("Could not deposit funds!")
            })
            .finally(() => {
                setIsDepositing(false)
            })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 mx-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold tracking-wide">
                        {mode === "BUY" ? "Buy" : "Sell"} <span className={mode === "BUY" ? "text-lightGreen" : "text-rose-400"}>{stockSymbol}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors text-lg font-semibold"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-2 mb-6 p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Wallet Balance:</span>
                        <span className="font-semibold text-slate-200">
                            ${walletBalance.toFixed(2)}
                        </span>
                    </div>
                    {mode === "SELL" && (
                        <div className="flex justify-between">
                            <span className="text-slate-400">Available Shares:</span>
                            <span className="font-semibold text-rose-400 font-mono">
                                {maxOwnedQuantity} Units
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-slate-400">Market Price:</span>
                        <span className="font-semibold text-slate-200">
                            ${stockPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Quantity (Shares)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max={mode === "SELL" ? maxOwnedQuantity : undefined}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Math.max(1, parseInt(e.target.value) || 0))
                        }
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-lightGreen text-slate-100 font-semibold text-lg transition-colors"
                    />
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-800">
                    <span className="text-sm font-medium text-slate-400">
                        {mode === "BUY" ? "Total Cost:" : "Total Revenue:"}
                    </span>
                    <span
                        className={`text-xl font-extrabold ${mode === "BUY" ? (isInsufficientFunds ? "text-red-500" : "text-lightGreen") : (isInsufficientShares ? "text-red-500" : "text-rose-400")}`}
                    >
                        ${totalValue.toFixed(2)}
                    </span>
                </div>

                {isInsufficientFunds && (
                    <div className="flex flex-col items-center justify-center bg-red-950/20 border border-red-900/30 rounded-xl p-3 mb-4 space-y-2">
                        <p className="text-red-500 text-xs font-medium text-center">
                            ⚠️ Insufficient funds to complete this transaction.
                        </p>
                        <button
                            onClick={handleQuickDeposit}
                            disabled={isDepositing}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
                        >
                            {isDepositing ? "Depositing..." : "Instant Deposit $5,000"}
                        </button>
                    </div>
                )}

                {isInsufficientShares && (
                    <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 mb-4">
                        <p className="text-red-500 text-xs font-medium text-center">
                            ⚠️ You cannot sell more shares than you currently own.
                        </p>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={quantity <= 0 || isInsufficientFunds || isInsufficientShares}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${quantity <= 0 || isInsufficientFunds || isInsufficientShares
                                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                : mode === "BUY"
                                    ? "bg-lightGreen hover:bg-green-600 text-slate-950 shadow-lg shadow-green-900/20"
                                    : "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                            }`}
                    >
                        {mode === "BUY" ? "Confirm Buy" : "Confirm Sell"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PurchasePortfolio

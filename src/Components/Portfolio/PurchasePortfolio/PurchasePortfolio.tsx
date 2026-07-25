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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/70 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 mx-4 rounded-2xl bg-depth border border-ridge/50 shadow-2xl text-foam transform transition-all font-sans">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold tracking-wide font-display">
                        {mode === "BUY" ? "Buy" : "Sell"} <span className={mode === "BUY" ? "text-gain" : "text-loss"}>{stockSymbol}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-mist hover:text-foam transition-colors text-lg font-semibold"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-2 mb-6 p-3 rounded-lg bg-abyss border border-ridge/40 text-sm">
                    <div className="flex justify-between">
                        <span className="text-mist">Wallet Balance:</span>
                        <span className="font-semibold text-foam font-mono">
                            ${walletBalance.toFixed(2)}
                        </span>
                    </div>
                    {mode === "SELL" && (
                        <div className="flex justify-between">
                            <span className="text-mist">Available Shares:</span>
                            <span className="font-semibold text-loss font-mono">
                                {maxOwnedQuantity} Units
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-mist">Market Price:</span>
                        <span className="font-semibold text-foam font-mono">
                            ${stockPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-mist mb-2">
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
                        className="w-full px-4 py-3 bg-abyss border border-ridge/50 rounded-xl focus:outline-none focus:border-pulse text-foam font-semibold text-lg font-mono transition-colors"
                    />
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-ridge/40">
                    <span className="text-sm font-medium text-mist">
                        {mode === "BUY" ? "Total Cost:" : "Total Revenue:"}
                    </span>
                    <span
                        className={`text-xl font-bold font-mono ${mode === "BUY" ? (isInsufficientFunds ? "text-loss" : "text-gain") : (isInsufficientShares ? "text-loss" : "text-loss")}`}
                    >
                        ${totalValue.toFixed(2)}
                    </span>
                </div>

                {isInsufficientFunds && (
                    <div className="flex flex-col items-center justify-center bg-loss/10 border border-loss/20 rounded-xl p-3 mb-4 space-y-2">
                        <p className="text-loss text-xs font-medium text-center">
                            ⚠️ Insufficient funds to complete this transaction.
                        </p>
                        <button
                            onClick={handleQuickDeposit}
                            disabled={isDepositing}
                            className="text-xs text-pulse hover:text-pulse-dim font-bold underline transition-colors"
                        >
                            {isDepositing ? "Depositing..." : "Instant Deposit $5,000"}
                        </button>
                    </div>
                )}

                {isInsufficientShares && (
                    <div className="bg-loss/10 border border-loss/20 rounded-xl p-3 mb-4">
                        <p className="text-loss text-xs font-medium text-center">
                            ⚠️ You cannot sell more shares than you currently own.
                        </p>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-depth-2 hover:bg-ridge/40 active:bg-ridge/60 text-mist rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={quantity <= 0 || isInsufficientFunds || isInsufficientShares}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${quantity <= 0 || isInsufficientFunds || isInsufficientShares
                                ? "bg-depth-2 text-mist/50 cursor-not-allowed"
                                : mode === "BUY"
                                    ? "bg-gain hover:bg-gain/85 text-abyss shadow-lg shadow-gain/20"
                                    : "bg-loss hover:bg-loss/85 text-abyss shadow-lg shadow-loss/20"
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

import React, { useState } from "react"
import { portfolioDepositAPI } from "../../../Services/PortfolioService"
import { useAuth } from "../../../Context/useAuth"
import { toast } from "react-toastify"
import { fieldClass, labelClass, ctaBaseClass, ctaDisabledClass, ctaFillClass } from "../../../Helpers/formStyles"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx-canvas/60 px-4">
            <div className="w-full max-w-md rounded-card border border-slate-border/45 bg-graphite-card p-card font-sans text-ivory-text shadow-subtle animate-fadeIn">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-heading-sm font-normal text-ivory-text">
                        {mode === "BUY" ? "Buy" : "Sell"}{" "}
                        <span className="font-mono">{stockSymbol}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-pill border border-slate-border/45 text-ash-text transition-colors hover:border-slate-border hover:text-ivory-text"
                    >
                        <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mb-6 space-y-2 rounded-card border border-slate-border/45 bg-obsidian-button p-4 text-body">
                    <div className="flex justify-between">
                        <span className="text-ash-text">Wallet Balance:</span>
                        <span className="font-mono text-ivory-text">
                            ${walletBalance.toFixed(2)}
                        </span>
                    </div>
                    {mode === "SELL" && (
                        <div className="flex justify-between">
                            <span className="text-ash-text">Available Shares:</span>
                            <span className="font-mono text-ivory-text">
                                {maxOwnedQuantity} Units
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-ash-text">Market Price:</span>
                        <span className="font-mono text-ivory-text">
                            ${stockPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="purchase-quantity" className={labelClass}>
                        Quantity (Shares)
                    </label>
                    <input
                        id="purchase-quantity"
                        type="number"
                        min="1"
                        max={mode === "SELL" ? maxOwnedQuantity : undefined}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Math.max(1, parseInt(e.target.value) || 0))
                        }
                        className={`${fieldClass} font-mono`}
                    />
                </div>

                <div className="mb-6 flex items-center justify-between border-t border-slate-border/45 pt-4">
                    <span className="text-body font-normal text-ash-text">
                        {mode === "BUY" ? "Total Cost:" : "Total Revenue:"}
                    </span>
                    <span
                        className={`font-mono text-heading-sm font-normal ${
                            isInsufficientFunds || isInsufficientShares
                                ? "text-loss"
                                : "text-ivory-text"
                        }`}
                    >
                        ${totalValue.toFixed(2)}
                    </span>
                </div>

                {isInsufficientFunds && (
                    <div className="mb-4 flex flex-col items-center justify-center space-y-2 rounded-card border border-slate-border/45 bg-obsidian-button p-4">
                        <p className="text-center text-body font-normal text-loss">
                            Insufficient funds to complete this transaction.
                        </p>
                        <button
                            onClick={handleQuickDeposit}
                            disabled={isDepositing}
                            className="cursor-pointer text-body font-normal text-ivory-text underline underline-offset-4 transition-opacity hover:opacity-70"
                        >
                            {isDepositing ? "Depositing..." : "Instant Deposit $5,000"}
                        </button>
                    </div>
                )}

                {isInsufficientShares && (
                    <div className="mb-4 rounded-card border border-slate-border/45 bg-obsidian-button p-4">
                        <p className="text-center text-body font-normal text-loss">
                            You cannot sell more shares than you currently own.
                        </p>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer rounded-pill border border-slate-border/45 bg-graphite-card px-6 py-cta text-body font-normal text-ivory-text transition-colors hover:border-slate-border"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={quantity <= 0 || isInsufficientFunds || isInsufficientShares}
                        className={`flex-1 px-6 py-cta text-body ${ctaBaseClass} ${
                            quantity <= 0 || isInsufficientFunds || isInsufficientShares
                                ? ctaDisabledClass
                                : ctaFillClass
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

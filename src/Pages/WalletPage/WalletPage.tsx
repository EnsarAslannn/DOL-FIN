import React, { useState, useEffect } from "react"
import { useAuth } from "../../Context/useAuth"
import { portfolioDepositAPI, portfolioGetAPI, portfolioSellAPI, portfolioWithdrawAPI } from "../../Services/PortfolioService"
import { getProfileAPI } from "../../Services/AuthService"
import type { PortfolioGet } from "../../Models/Portfolio"
import { companyLogos } from "../../Components/Table/TestData"
import { toast } from "react-toastify"
import PurchasePortfolio from "../../Components/Portfolio/PurchasePortfolio/PurchasePortfolio"
import marketTerrain from "../../assets/extra/capital-stack.webp"
import { fieldClass, ctaBaseClass, ctaDisabledClass, ctaFillClass } from "../../Helpers/formStyles"
import { containerClass, navClearanceClass } from "../../Helpers/layout"

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
        <div className="w-full min-h-screen bg-onyx-canvas font-sans pb-section text-ivory-text text-left">
            <div className={`flex flex-col space-y-8 ${navClearanceClass} ${containerClass}`}>
                <div className="border-b border-slate-border/45 pb-5">
                    <h1 className="text-heading md:text-heading-lg font-normal text-ivory-text">Wallet Overview</h1>
                    <p className="mt-3 text-body-lg font-normal text-ash-text">Manage your funds and monitor estimated asset distribution.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* The page's single dark surface — a contained product crop
                        under a scrim, giving the spec's dark/light contrast. */}
                    <div className="lg:col-span-2 relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-card bg-graphite-card p-7">
                        <img
                            src={marketTerrain}
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-onyx-canvas/70" />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-onyx-canvas via-onyx-canvas/80 to-transparent" />

                        <div className="relative z-10">
                            <span className="font-mono text-caption font-normal uppercase tracking-label-lg text-ivory-text/75">Est. Total Value</span>
                            <div className="mt-3 flex items-baseline space-x-2">
                                <h2 className="font-mono text-heading-lg font-normal text-ivory-text">${estimatedTotalValue.toFixed(2)}</h2>
                                <span className="font-mono text-body font-normal text-ivory-text/75">USD</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-mist-border/20 pt-6">
                            <div className="flex flex-col">
                                <span className="font-mono text-caption font-normal uppercase tracking-label text-ivory-text/75">Cash Balance (Wallet)</span>
                                <span className="mt-2 font-mono text-subheading font-normal text-ivory-text">${liveBalance.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-caption font-normal uppercase tracking-label text-ivory-text/75">Stocks Value (Portfolio)</span>
                                <span className="mt-2 font-mono text-subheading font-normal text-ivory-text">${stocksValue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-card border border-slate-border/45 bg-graphite-card p-card">
                        <div>
                            <h3 className="mb-2 text-subheading font-normal text-ivory-text">Deposit Cash</h3>
                            <p className="mb-4 text-body font-normal text-ash-text">Add instant simulator credits into your trading account.</p>
                        </div>
                        <form onSubmit={handleDepositSubmit} className="flex flex-col space-y-4 w-full">
                            <div>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 font-mono text-body font-normal text-ash-text">$</span>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="any"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className={`${fieldClass} pl-8 pr-16 font-mono`}
                                    />
                                    <span className="absolute right-4 rounded-smallcard border border-slate-border/45 bg-obsidian-button px-2 py-1 font-mono text-caption font-normal text-ash-text">USD</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !depositAmount}
                                className={`w-full py-cta text-body ${ctaBaseClass} ${isSubmitting || !depositAmount
                                    ? ctaDisabledClass
                                    : ctaFillClass
                                    }`}
                            >
                                {isSubmitting ? "Processing..." : "Confirm Deposit"}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="bg-graphite-card border border-slate-border/45 rounded-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-border/45 bg-obsidian-button">
                        <h3 className="font-mono text-caption font-bold uppercase tracking-label-lg text-ash-text">My Assets (Asset View)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="border-b border-slate-border/45 font-mono text-caption font-bold uppercase tracking-label-lg text-ash-text">
                                    <th className="py-4 px-6">Asset Name</th>
                                    <th className="py-4 px-6 text-right">Market Price</th>
                                    <th className="py-4 px-6 text-right">Holdings Allocation</th>
                                    <th className="py-4 px-6 text-center w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-border/45 text-body font-normal">
                                <tr className="hover:bg-obsidian-button transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            {companyLogos["USD"] ? (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-graphite-card p-2">
                                                    {companyLogos["USD"]()}
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-obsidian-button font-mono text-caption font-bold text-ivory-text">
                                                    USD
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-body font-normal text-ivory-text">United States Dollar</span>
                                                <span className="font-mono text-caption font-normal tracking-wide text-ash-text">CASH</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-body font-normal text-ash-text">$1.00</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end justify-center">
                                            <span className="font-mono text-body font-normal text-ivory-text">${liveBalance.toFixed(2)}</span>
                                            <span className="mt-1 font-mono text-caption font-normal text-ash-text">
                                                {estimatedTotalValue > 0 ? ((liveBalance / estimatedTotalValue) * 100).toFixed(1) : 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={triggerUsdSell}
                                            className="cursor-pointer rounded-pill border border-slate-border/45 px-4 py-2 text-body font-normal text-ash-text transition-colors hover:border-loss hover:text-loss"
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
                                        <tr key={item.id} className="hover:bg-obsidian-button transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-4">
                                                    {companyLogos[symbolUpper] ? (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-graphite-card p-2">
                                                            {companyLogos[symbolUpper]()}
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-obsidian-button font-mono text-caption font-bold text-ivory-text">
                                                            {symbolUpper}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-body font-normal text-ivory-text">{item.companyName}</span>
                                                        <span className="font-mono text-caption font-normal tracking-wide text-ash-text">{symbolUpper}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-body font-normal text-ash-text">${livePrice.toFixed(2)}</td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end justify-center">
                                                    <span className="font-mono text-body font-normal text-ivory-text">${currentStockValue.toFixed(2)}</span>
                                                    <span className="mt-1 font-mono text-caption font-normal text-ash-text">
                                                        {estimatedTotalValue > 0 ? ((currentStockValue / estimatedTotalValue) * 100).toFixed(1) : 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => triggerTableSell(item)}
                                                    className="cursor-pointer rounded-pill border border-slate-border/45 px-4 py-2 text-body font-normal text-ash-text transition-colors hover:border-loss hover:text-loss"
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
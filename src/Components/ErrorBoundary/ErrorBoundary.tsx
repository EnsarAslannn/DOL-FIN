import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Unhandled render error caught by ErrorBoundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full min-h-screen bg-abyss font-sans flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-depth border border-white/8 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center space-y-4">
                        <h1 className="text-xl font-bold text-foam">Something went wrong</h1>
                        <p className="text-sm text-mist">
                            An unexpected error occurred while rendering this page. Please refresh to continue.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-pulse hover:bg-pulse-dim text-abyss shadow-lg shadow-pulse/10 transition-all active:scale-[0.97]"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

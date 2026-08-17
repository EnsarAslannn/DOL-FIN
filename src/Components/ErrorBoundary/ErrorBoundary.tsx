import { Component, type ErrorInfo, type ReactNode } from "react"
import { ctaCompactClass } from "../../Helpers/formStyles"

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
                <div className="w-full min-h-screen bg-onyx-canvas font-sans flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-graphite-card border border-slate-border/45 rounded-card p-card text-center flex flex-col items-center space-y-4">
                        <h1 className="text-heading-sm font-normal text-ivory-text">Something went wrong</h1>
                        <p className="text-body font-normal text-ash-text">
                            An unexpected error occurred while rendering this page. Please refresh to continue.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className={ctaCompactClass}
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

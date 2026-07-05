import { Component, type ErrorInfo, type ReactNode } from 'react'
import { observability } from '@shared/observability'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    observability.trackError(error, { componentStack: info.componentStack ?? '' })
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center"
        >
          <p className="text-sm font-semibold text-content-primary">Something went wrong</p>
          <p className="text-xs text-content-secondary max-w-xs">
            An unexpected error occurred. Please refresh the page to try again.
          </p>
          <button
            type="button"
            onClick={() => { window.location.reload() }}
            className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

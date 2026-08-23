import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('LabTrack crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-4">
          <div className="card max-w-md w-full p-8 text-center">
            <p className="tag bg-danger/10 text-danger inline-block mb-4">Something broke</p>
            <h1 className="font-display text-xl font-semibold text-ink mb-2">
              The app hit an unexpected error
            </h1>
            <p className="text-sm text-ink/60 mb-6">
              Open your browser console (F12) to see the exact error message, or reload the page.
            </p>
            <pre className="text-xs text-left bg-ink/5 rounded-lg p-3 overflow-auto mb-6 text-ink/70">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

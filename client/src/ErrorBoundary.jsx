import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F5] text-slate-800 text-center">
          <div className="max-w-md p-8 bg-white rounded-3xl shadow-lg border border-sand-200 space-y-4">
            <h2 className="text-xl font-sora font-bold text-forest-900">Something went wrong</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered an issue rendering this view. You can refresh the page to reload the offline application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-forest-800 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer hover:bg-forest-900"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

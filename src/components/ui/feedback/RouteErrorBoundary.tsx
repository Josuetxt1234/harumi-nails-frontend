import { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '../../../i18n';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: RouteErrorBoundaryProps) {
    if (
      this.props.resetKey !== prevProps.resetKey &&
      this.state.hasError
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route render error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-border bg-white p-10 text-center">
          <h2 className="font-outfit text-xl font-bold text-slate-heading">
            {i18n.t('common:screen_error_title')}
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-body">
            {i18n.t('common:screen_error_body')}
          </p>
          {import.meta.env.DEV && this.state.error ? (
            <p className="mt-3 max-w-lg break-words text-xs text-red-500">
              {this.state.error.message}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
            >
              {i18n.t('common:retry')}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              {i18n.t('common:reload')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<object>, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <p>We're sorry — an unexpected error occurred. Refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;

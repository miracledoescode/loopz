import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    // If a fatal error occurs before the app mounts, drop the splash screen lock
    // so the user can actually see the error screen underneath.
    import('expo-splash-screen').then(SplashScreen => {
      SplashScreen.hideAsync().catch(() => {});
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          title="Something Went Wrong"
          message="An unexpected error occurred in the application interface."
          details={this.state.error?.message || this.state.error?.stack}
          onRetry={this.handleReset}
          retryLabel="Reload Screen"
          showBypass={false}
        />
      );
    }

    return this.props.children;
  }
}

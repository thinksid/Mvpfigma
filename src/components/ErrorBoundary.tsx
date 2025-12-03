import React, { Component, ReactNode } from 'react';
import { Button } from './ui/button-simple';
import { Card } from './ui/card';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 ========== ERROR BOUNDARY CAUGHT ERROR ==========');
    console.error('Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('====================================================');
    
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ========== ERROR BOUNDARY COMPONENT DID CATCH ==========');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('============================================================');
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    console.log('🔄 Reloading page after error...');
    window.location.reload();
  };

  handleGoHome = () => {
    console.log('🏠 Navigating to home after error...');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-3xl text-[#1c1c60] mb-4">
                Oops! Something Went Wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. This has been logged and we'll look into it.
              </p>

              {/* Error Details (for debugging) */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-red-900 mb-2">Error Details:</p>
                <p className="text-sm text-red-800 font-mono mb-2">
                  {this.state.error?.name}: {this.state.error?.message}
                </p>
                {this.state.error?.stack && (
                  <details className="text-xs text-red-700 mt-2">
                    <summary className="cursor-pointer font-semibold">Stack Trace</summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={this.handleReload}
                  className="bg-[#5b81ff] hover:bg-[#4a6fd9] text-white"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                If this problem persists, please contact{' '}
                <a 
                  href="mailto:hello@thinksid.co" 
                  className="text-[#5b81ff] hover:underline"
                >
                  hello@thinksid.co
                </a>
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

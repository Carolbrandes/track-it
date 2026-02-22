'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('ErrorBoundary caught:', error, errorInfo);
        }
    }

    private readonly handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    gap: '1rem',
                    minHeight: '200px',
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
                        An unexpected error occurred. Please try again.
                    </p>
                    {process.env.NODE_ENV !== 'production' && this.state.error && (
                        <pre style={{
                            background: '#f5f5f5',
                            padding: '1rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            maxWidth: '100%',
                            overflow: 'auto',
                        }}>
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        onClick={this.handleRetry}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

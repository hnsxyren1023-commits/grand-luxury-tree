import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black">
                    <div className="max-w-md p-8 text-center">
                        <h1 className="text-3xl font-bold text-[#FFD700] mb-4" style={{ fontFamily: '"Times New Roman", serif' }}>
                            ⚠️ 发生错误
                        </h1>
                        <p className="text-[#aaa] mb-2 text-sm">
                            应用程序遇到了一个错误。请尝试刷新页面。
                        </p>
                        {this.state.error && (
                            <div className="mt-4 p-4 bg-[rgba(255,0,85,0.1)] border border-[rgba(255,0,85,0.3)] rounded text-left">
                                <p className="text-xs text-[#ff0055] font-mono break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={this.handleReload}
                            className="mt-6 px-6 py-3 bg-[rgba(255,215,0,0.15)] border border-[#FFD700] text-[#FFD700] rounded hover:bg-[rgba(255,215,0,0.25)] transition-all"
                        >
                            🔄 刷新页面
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

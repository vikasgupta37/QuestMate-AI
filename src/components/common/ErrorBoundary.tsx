import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

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
    console.error('QuestMate ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-red-500/30 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-wide text-white">
                Quest Interrupted
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                An unexpected tactical glitch occurred. Your player memory and quest state have been preserved.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl border border-red-500/20 text-left overflow-auto max-h-24">
                <p className="text-[11px] font-mono text-red-300">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-600/20 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resume Quest
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Hub
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

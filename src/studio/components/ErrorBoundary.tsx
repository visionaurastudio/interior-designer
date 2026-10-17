import { Component, type ReactNode } from 'react';

interface Props { fallback: (message: string) => ReactNode; children: ReactNode }
interface State { error: string | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(e: unknown): State {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}

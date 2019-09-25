import React from 'react';

export interface ErrorBoundaryProps {
  children?: NonNullable<React.ReactNode>;
}

export interface ErrorBoundaryState {
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  componentDidCatch(error: Error) {
    this.setState({
      error,
    });
  }

  render() {
    const { error } = this.state;

    if (error) {
      throw error;
    }

    return this.props.children;
  }
}

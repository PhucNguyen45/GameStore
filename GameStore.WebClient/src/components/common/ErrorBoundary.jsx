// GameStore.WebClient/src/components/common/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--bg-primary)",
            color: "#fff",
            textAlign: "center",
            padding: 20,
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#888", marginBottom: 8, maxWidth: 400 }}>
            An unexpected error occurred. Please try reloading the page.
          </p>
          {this.state.error?.message && (
            <details
              style={{ color: "#e94560", marginBottom: 20, fontSize: 13 }}
            >
              <summary>Error details</summary>
              {this.state.error.message}
            </details>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={this.handleReload}
              className="btn-primary"
              style={{ padding: "10px 20px" }}
            >
              Reload Page
            </button>
            <button
              onClick={this.handleGoHome}
              className="btn-outline"
              style={{ padding: "10px 20px" }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

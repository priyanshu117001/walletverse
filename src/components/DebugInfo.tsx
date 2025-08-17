import { useState } from "react";

export default function DebugInfo() {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "0.5rem",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          border: "none",
          cursor: "pointer",
        }}
        title="Debug Info"
      >
        🐛
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "0.5rem",
        padding: "1rem",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        maxWidth: "20rem",
        fontSize: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3
          style={{
            fontWeight: "600",
            fontSize: "0.875rem",
          }}
        >
          Debug Info
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <p style={{ margin: "0" }}>
          <strong>User Agent:</strong> {navigator.userAgent}
        </p>
        <p style={{ margin: "0" }}>
          <strong>URL:</strong> {window.location.href}
        </p>
        <p style={{ margin: "0" }}>
          <strong>Local Storage:</strong>{" "}
          {localStorage.getItem("token") ? "Token exists" : "No token"}
        </p>
      </div>
    </div>
  );
}

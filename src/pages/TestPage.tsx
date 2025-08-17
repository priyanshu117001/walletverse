export default function TestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#1e293b",
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        🎉 WalletVerse Test Page
      </h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#334155", marginBottom: "1rem" }}>
          ✅ Basic Functionality Test
        </h2>

        <p style={{ color: "#475569", marginBottom: "1rem" }}>
          If you can see this page with proper styling, your React app is
          working correctly!
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#eff6ff",
              borderRadius: "0.5rem",
              border: "1px solid #dbeafe",
            }}
          >
            <h3 style={{ color: "#1e40af", marginBottom: "0.5rem" }}>React</h3>
            <p style={{ color: "#1e40af", fontSize: "0.875rem" }}>✅ Working</p>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0fdf4",
              borderRadius: "0.5rem",
              border: "1px solid #bbf7d0",
            }}
          >
            <h3 style={{ color: "#166534", marginBottom: "0.5rem" }}>
              Routing
            </h3>
            <p style={{ color: "#166534", fontSize: "0.875rem" }}>✅ Working</p>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fef3c7",
              borderRadius: "0.5rem",
              border: "1px solid #fde68a",
            }}
          >
            <h3 style={{ color: "#92400e", marginBottom: "0.5rem" }}>
              Styling
            </h3>
            <p style={{ color: "#92400e", fontSize: "0.875rem" }}>✅ Working</p>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "0.5rem",
            border: "1px solid #cbd5e1",
          }}
        >
          <h3 style={{ color: "#334155", marginBottom: "0.5rem" }}>
            Next Steps:
          </h3>
          <ul style={{ color: "#475569", paddingLeft: "1.5rem" }}>
            <li>Check if Tailwind CSS is working</li>
            <li>Test navigation between pages</li>
            <li>Verify backend connection</li>
            <li>Test authentication flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

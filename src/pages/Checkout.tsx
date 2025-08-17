export default function Checkout() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "72rem",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1rem",
          color: "#1e293b",
        }}
      >
        Checkout
      </h1>
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          Checkout functionality will be implemented here.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                color: "#334155",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Shipping Information
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Enter your shipping details
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                color: "#334155",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Payment Method
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Select payment option
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

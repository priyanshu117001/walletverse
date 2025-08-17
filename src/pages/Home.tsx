export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
        padding: "2rem",
      }}
    >
      <div
        className="text-center max-w-4xl mx-auto px-6"
        style={{
          textAlign: "center",
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <h1
          className="text-6xl font-bold text-gray-900 mb-6"
          style={{
            fontSize: "3.75rem",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "1.5rem",
            lineHeight: "1",
          }}
        >
          Welcome to{" "}
          <span className="text-blue-600" style={{ color: "#2563eb" }}>
            WalletVerse
          </span>
        </h1>
        <p
          className="text-xl text-gray-600 mb-8"
          style={{
            fontSize: "1.25rem",
            color: "#4b5563",
            marginBottom: "2rem",
            lineHeight: "1.75",
          }}
        >
          Your one-stop destination for customizable wallets and accessories
        </p>
        <div
          className="flex gap-4 justify-center"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            className="btn btn-primary text-lg px-8 py-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              backgroundColor: "#0f172a",
              color: "white",
              fontWeight: "500",
              fontSize: "1.125rem",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Shop Now
          </button>
          <button
            className="btn btn-outline text-lg px-8 py-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              backgroundColor: "white",
              color: "#334155",
              fontWeight: "500",
              fontSize: "1.125rem",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

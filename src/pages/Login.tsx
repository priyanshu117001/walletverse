import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <form
        className="p-6 bg-white shadow-card rounded-lg w-96"
        style={{
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          width: "24rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
        }}
        onSubmit={handleSubmit}
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Login to WalletVerse
        </h1>

        {error && (
          <div
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #f87171",
              color: "#b91c1c",
              borderRadius: "0.25rem",
            }}
          >
            {error}
          </div>
        )}

        <div className="mb-4" style={{ marginBottom: "1rem" }}>
          <label
            className="label"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.25rem",
              color: "#334155",
            }}
          >
            Email
          </label>
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        <div className="mb-6" style={{ marginBottom: "1.5rem" }}>
          <label
            className="label"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.25rem",
              color: "#334155",
            }}
          >
            Password
          </label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: "#0f172a",
            color: "white",
            fontWeight: "500",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div
          className="mt-4 text-center text-sm text-slate-600"
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
            style={{
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

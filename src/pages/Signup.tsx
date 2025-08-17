import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <form
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
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Create Account
        </h1>

        {error && (
          <div
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

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.25rem",
              color: "#334155",
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div style={{ marginBottom: "1rem" }}>
          <label
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

        <div style={{ marginBottom: "1.5rem" }}>
          <label
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
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#475569",
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

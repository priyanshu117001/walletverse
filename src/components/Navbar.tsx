import { Link, useNavigate } from "react-router-dom";
import useAuth from "../store/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className="bg-white shadow-card"
      style={{
        backgroundColor: "white",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        padding: "1rem 0",
      }}
    >
      <div
        className="container-narrow flex items-center justify-between py-4"
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          className="font-bold text-xl"
          style={{
            fontWeight: "700",
            fontSize: "1.25rem",
            color: "#111827",
            textDecoration: "none",
          }}
        >
          WalletVerse
        </Link>
        <div
          className="flex gap-4"
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Link
            to="/shop"
            style={{
              color: "#374151",
              textDecoration: "none",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              transition: "all 0.2s",
            }}
          >
            Shop
          </Link>
          <Link
            to="/cart"
            style={{
              color: "#374151",
              textDecoration: "none",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              transition: "all 0.2s",
            }}
          >
            Cart
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    transition: "all 0.2s",
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                style={{
                  color: "#374151",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  transition: "all 0.2s",
                }}
              >
                Dashboard
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "white",
                  color: "#334155",
                  fontWeight: "500",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "#374151",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  transition: "all 0.2s",
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  color: "#374151",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  transition: "all 0.2s",
                }}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

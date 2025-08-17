import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugInfo from "./components/DebugInfo";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Customize from "./pages/Customize";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCustomizations from "./pages/admin/ManageCustomizations";
import ManageOrders from "./pages/admin/ManageOrders";

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        animation: "spin 1s linear infinite",
        borderRadius: "50%",
        height: "8rem",
        width: "8rem",
        borderBottom: "2px solid #2563eb",
      }}
    ></div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/customize/:productId" element={<Customize />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customizations"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageCustomizations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer
        style={{
          padding: "2rem 0",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#64748b",
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        © {new Date().getFullYear()} WalletVerse
      </footer>
      <DebugInfo />
    </div>
  );
}

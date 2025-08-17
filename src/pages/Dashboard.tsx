import useAuth from "../store/auth";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user)
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );

  if (user.role === "admin") {
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
          Admin Dashboard
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
          }}
        >
          Manage products, users, and system settings
        </p>
      </div>
    );
  }

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
        User Dashboard
      </h1>
      <p
        style={{
          color: "#6b7280",
          fontSize: "1rem",
        }}
      >
        View your orders, manage your cart, and track your customizations
      </p>
    </div>
  );
}

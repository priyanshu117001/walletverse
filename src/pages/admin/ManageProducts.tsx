export default function ManageProducts() {
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
        Manage Products
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
            marginBottom: "1rem",
          }}
        >
          Product management interface will be implemented here.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0fdf4",
              borderRadius: "0.5rem",
              border: "1px solid #bbf7d0",
            }}
          >
            <h3
              style={{
                color: "#166534",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Add Product
            </h3>
            <p
              style={{
                color: "#16a34a",
                fontSize: "0.875rem",
              }}
            >
              Create new products
            </p>
          </div>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fef3c7",
              borderRadius: "0.5rem",
              border: "1px solid #fde68a",
            }}
          >
            <h3
              style={{
                color: "#92400e",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Edit Products
            </h3>
            <p
              style={{
                color: "#ca8a04",
                fontSize: "0.875rem",
              }}
            >
              Modify existing products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

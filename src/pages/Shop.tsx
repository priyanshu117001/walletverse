import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stock: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");
        setProducts(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        // Fallback to sample products if API fails
        setProducts([
          {
            id: "1",
            name: "Classic Leather Wallet",
            description: "Premium leather wallet with multiple card slots",
            price: 49.99,
            category: "Leather",
            stock: 10,
          },
          {
            id: "2",
            name: "Modern Slim Wallet",
            description: "Ultra-thin wallet perfect for minimalists",
            price: 39.99,
            category: "Slim",
            stock: 0,
          },
          {
            id: "3",
            name: "Travel Wallet",
            description: "Spacious wallet with passport holder",
            price: 59.99,
            category: "Travel",
            stock: 5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "72rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "2rem",
            height: "2rem",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
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
        Shop Wallets
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div style={{ flex: "1" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#1f2937",
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "1rem",
                  lineHeight: "1.5",
                }}
              >
                {product.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#059669",
                  }}
                >
                  ${product.price}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {product.category}
                </span>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor:
                      product.stock === 0 ? "#fef2f2" : "#f0fdf4",
                    color: product.stock === 0 ? "#dc2626" : "#166534",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : `Stock: ${product.stock}`}
                </span>
              </div>
            </div>
            <Link
              to={product.stock === 0 ? "#" : `/customize/${product.id}`}
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem",
                backgroundColor: product.stock === 0 ? "#9ca3af" : "#0f172a",
                color: "white",
                textAlign: "center",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "500",
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                opacity: product.stock === 0 ? 0.6 : 1,
              }}
              onClick={(e) => {
                if (product.stock === 0) {
                  e.preventDefault();
                }
              }}
            >
              {product.stock === 0 ? "Out of Stock" : "Customize"}
            </Link>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            No products available at the moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../services/cartService";
import type { CartItem } from "../services/cartService";
import useAuth from "../store/auth";

interface CartItemWithProduct extends CartItem {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    category: string;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const cartData = await getCart();
        setCartItems(cartData.items || []);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch cart:", err);
        setError("Failed to load cart items. Please try again.");
        // Fallback to sample cart items for development
        setCartItems([
          {
            product_id: "1",
            quantity: 1,
            customization: {
              name_on_wallet: "John Doe",
              color: "Black",
              design: "Classic",
              leather_type: "Full-grain",
              charm: "Star",
              gift: true,
            },
            product: {
              id: "1",
              name: "Classic Leather Wallet",
              description: "Premium leather wallet with multiple card slots",
              price: 49.99,
              category: "Leather",
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

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
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading cart...</p>
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

  if (cartItems.length === 0) {
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
          Shopping Cart
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
            Your cart is empty. Start shopping to add items!
          </p>
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#0f172a",
                color: "white",
                fontWeight: "500",
                borderRadius: "0.75rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Go to Shop
            </Link>
          </div>
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
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {/* Cart Items */}
        {cartItems.map((item, index) => (
          <div
            key={`${item.product_id}-${index}`}
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                📷
              </div>

              {/* Product Details */}
              <div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#1f2937",
                  }}
                >
                  {item.product?.name || "Custom Wallet"}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.product?.description ||
                    "Personalized wallet with your customizations"}
                </p>

                {/* Customization Details */}
                {item.customization && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.customization.name_on_wallet && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        Name: {item.customization.name_on_wallet}
                      </span>
                    )}
                    {item.customization.color && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        Color: {item.customization.color}
                      </span>
                    )}
                    {item.customization.design && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        Design: {item.customization.design}
                      </span>
                    )}
                    {item.customization.leather_type && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        Leather: {item.customization.leather_type}
                      </span>
                    )}
                    {item.customization.charm && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        Charm: {item.customization.charm}
                      </span>
                    )}
                    {item.customization.gift && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#059669",
                          backgroundColor: "#d1fae5",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        🎁 Gift Item
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price and Quantity */}
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#059669",
                    marginBottom: "0.5rem",
                  }}
                >
                  ${item.product?.price || 49.99}
                </div>

                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  Qty: {item.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Cart Summary */}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#059669",
              }}
            >
              ${calculateTotal().toFixed(2)}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem 1rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                fontWeight: "500",
                borderRadius: "0.75rem",
                textDecoration: "none",
                transition: "all 0.2s",
                border: "1px solid #d1d5db",
              }}
            >
              Continue Shopping
            </Link>

            <Link
              to="/checkout"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem 1rem",
                backgroundColor: "#0f172a",
                color: "white",
                fontWeight: "500",
                borderRadius: "0.75rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

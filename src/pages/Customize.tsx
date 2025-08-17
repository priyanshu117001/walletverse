import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartService";
import useAuth from "../store/auth";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
}

interface CustomizationOption {
  id: string;
  category: string;
  name: string;
}

interface CustomizationForm {
  name_on_wallet: string;
  color: string;
  design: string;
  leather_type: string;
  charm: string;
  gift: boolean;
}

export default function Customize() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<{
    colors: CustomizationOption[];
    designs: CustomizationOption[];
    leathers: CustomizationOption[];
    charms: CustomizationOption[];
  }>({
    colors: [],
    designs: [],
    leathers: [],
    charms: [],
  });

  const [formData, setFormData] = useState<CustomizationForm>({
    name_on_wallet: "",
    color: "",
    design: "",
    leather_type: "",
    charm: "",
    gift: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await api.get(`/products/${productId}`);
        setProduct(productResponse.data);

        // Fetch customization options
        const customizationsResponse = await api.get("/customizations");
        const options = customizationsResponse.data;

        // Organize options by category
        setCustomizationOptions({
          colors: options.filter(
            (opt: CustomizationOption) => opt.category === "color"
          ),
          designs: options.filter(
            (opt: CustomizationOption) => opt.category === "design"
          ),
          leathers: options.filter(
            (opt: CustomizationOption) => opt.category === "leather"
          ),
          charms: options.filter(
            (opt: CustomizationOption) => opt.category === "charm"
          ),
        });

        // Set default values
        if (options.length > 0) {
          setFormData((prev) => ({
            ...prev,
            color:
              options.find(
                (opt: CustomizationOption) => opt.category === "color"
              )?.name || "",
            design:
              options.find(
                (opt: CustomizationOption) => opt.category === "design"
              )?.name || "",
            leather_type:
              options.find(
                (opt: CustomizationOption) => opt.category === "leather"
              )?.name || "",
            charm:
              options.find(
                (opt: CustomizationOption) => opt.category === "charm"
              )?.name || "",
          }));
        }
      } catch (err: unknown) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load product or customization options");

        // Fallback product data
        setProduct({
          id: productId,
          name: "Custom Wallet",
          description: "Your personalized wallet",
          price: 49.99,
          category: "Custom",
        });

        // Fallback customization options
        setCustomizationOptions({
          colors: [
            { id: "1", category: "color", name: "Black" },
            { id: "2", category: "color", name: "Brown" },
          ],
          designs: [
            { id: "3", category: "design", name: "Classic" },
            { id: "4", category: "design", name: "Modern" },
            { id: "5", category: "design", name: "Minimal" },
          ],
          leathers: [
            { id: "6", category: "leather", name: "Full-grain" },
            { id: "7", category: "leather", name: "Vegan" },
          ],
          charms: [
            { id: "8", category: "charm", name: "Star" },
            { id: "9", category: "charm", name: "Heart" },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleInputChange = (
    field: keyof CustomizationForm,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product || !user) return;

    try {
      setSubmitting(true);
      setError(null);

      // Add item to cart
      const cartItem = {
        product_id: product.id,
        quantity: 1,
        customization: formData,
      };

      await addToCart(cartItem);

      // Redirect to cart
      navigate("/cart");
    } catch (err: unknown) {
      console.error("Failed to add to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>
          Loading customization options...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          padding: "2rem",
          maxWidth: "72rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#dc2626" }}>Product not found</p>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* Product Preview */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
              color: "#1e293b",
            }}
          >
            {product.name}
          </h2>

          {product.image_url && (
            <div
              style={{
                width: "100%",
                height: "300px",
                backgroundColor: "#f3f4f6",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
              }}
            >
              📷 Product Image
            </div>
          )}

          <p
            style={{
              color: "#6b7280",
              marginBottom: "1rem",
              lineHeight: "1.6",
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
                fontSize: "0.875rem",
                color: "#6b7280",
                backgroundColor: "#f3f4f6",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
              }}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Customization Form */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#1e293b",
            }}
          >
            Customize Your Wallet
          </h2>

          {error && (
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
          )}

          <form onSubmit={handleSubmit}>
            {/* Name on Wallet */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Name on Wallet
              </label>
              <input
                type="text"
                value={formData.name_on_wallet}
                onChange={(e) =>
                  handleInputChange("name_on_wallet", e.target.value)
                }
                placeholder="Enter your name or initials"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Color Selection */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Color
              </label>
              <select
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Select a color</option>
                {customizationOptions.colors.map((color) => (
                  <option key={color.id} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Design Selection */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Design Style
              </label>
              <select
                value={formData.design}
                onChange={(e) => handleInputChange("design", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Select a design</option>
                {customizationOptions.designs.map((design) => (
                  <option key={design.id} value={design.name}>
                    {design.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Leather Type */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Leather Type
              </label>
              <select
                value={formData.leather_type}
                onChange={(e) =>
                  handleInputChange("leather_type", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Select leather type</option>
                {customizationOptions.leathers.map((leather) => (
                  <option key={leather.id} value={leather.name}>
                    {leather.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Charm Selection */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Charm
              </label>
              <select
                value={formData.charm}
                onChange={(e) => handleInputChange("charm", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Select a charm</option>
                {customizationOptions.charms.map((charm) => (
                  <option key={charm.id} value={charm.name}>
                    {charm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gift Toggle */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.gift}
                  onChange={(e) => handleInputChange("gift", e.target.checked)}
                  style={{
                    marginRight: "0.5rem",
                    width: "1rem",
                    height: "1rem",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  This is a gift
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: submitting ? "#9ca3af" : "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {submitting ? "Adding to Cart..." : "Add to Cart"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

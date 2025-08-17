import { useState, useEffect } from "react";
import useAuth from "../../store/auth";
import {
  getUsers,
  getProducts,
  getCustomizations,
  getOrders,
  createProduct,
  createCustomization,
  deleteProduct,
  updateProduct,
  deleteUser,
  updateOrderStatus,
  deleteCustomization,
  type User,
  type Product,
  type Customization,
  type Order,
} from "../../services/adminService";

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    low_stock_products: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding/editing
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [newCustomization, setNewCustomization] = useState({
    category: "",
    name: "",
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingProductData, setEditingProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel using the admin service
      const [usersData, productsData, customizationsData, ordersData] =
        await Promise.all([
          getUsers(),
          getProducts(),
          getCustomizations(),
          getOrders(),
        ]);

      setUsers(usersData);
      setProducts(productsData);
      setCustomizations(customizationsData);
      setOrders(ordersData);

      // Calculate stats
      const totalRevenue = ordersData.reduce(
        (sum, order) =>
          order.status === "delivered" ? sum + order.total_amount : sum,
        0
      );

      const pendingOrders = ordersData.filter(
        (order) => order.status === "pending"
      ).length;

      const lowStockProducts = productsData.filter(
        (product) => product.stock < 3
      ).length;

      setStats({
        total_users: usersData.length,
        total_products: productsData.length,
        total_orders: ordersData.length,
        total_revenue: totalRevenue,
        pending_orders: pendingOrders,
        low_stock_products: lowStockProducts,
      });
    } catch (err: unknown) {
      console.error("Failed to fetch dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
      };

      const createdProduct = await createProduct(productData);
      setProducts([...products, createdProduct]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to add product:", err);
      setError("Failed to add product. Please try again.");
    }
  };

  const handleAddCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCustomization = await createCustomization(newCustomization);
      setCustomizations([...customizations, createdCustomization]);
      setNewCustomization({ category: "", name: "" });
    } catch (err: unknown) {
      console.error("Failed to add customization:", err);
      setError("Failed to add customization. Please try again.");
    }
  };

  const handleDeleteCustomization = async (customizationId: string) => {
    try {
      await deleteCustomization(customizationId);
      setCustomizations(customizations.filter((c) => c.id !== customizationId));
    } catch (err: unknown) {
      console.error("Failed to delete customization:", err);
      setError("Failed to delete customization. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await updateProduct(productId, { stock: newStock });
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, stock: newStock } : p
        )
      );

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to update stock:", err);
      setError("Failed to update stock. Please try again.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setEditingProductData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updates = {
        name: editingProductData.name,
        description: editingProductData.description,
        price: parseFloat(editingProductData.price),
        category: editingProductData.category,
        stock: parseInt(editingProductData.stock),
      };

      await updateProduct(editingProduct, updates);
      setProducts(
        products.map((p) =>
          p.id === editingProduct ? { ...p, ...updates } : p
        )
      );

      setEditingProduct(null);
      setEditingProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to update product:", err);
      setError("Failed to update product. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditingProductData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleOrderStatusUpdate = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus as Order["status"]);
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o
        )
      );

      // Refresh stats
      fetchDashboardData();
    } catch (err: unknown) {
      console.error("Failed to update order status:", err);
      setError("Failed to update order status. Please try again.");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#dc2626" }}>Access Denied</h1>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
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
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "120rem", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: "#1e293b",
        }}
      >
        Admin Dashboard
      </h1>

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
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "1rem",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {["overview", "users", "products", "customizations", "orders"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: activeTab === tab ? "#0f172a" : "transparent",
                color: activeTab === tab ? "white" : "#6b7280",
                border: "none",
                borderRadius: "0.5rem 0.5rem 0 0",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Users
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#1f2937" }}
            >
              {stats.total_users}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Products
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#1f2937" }}
            >
              {stats.total_products}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Orders
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#1f2937" }}
            >
              {stats.total_orders}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Revenue
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#059669" }}
            >
              ${stats.total_revenue.toFixed(2)}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Pending Orders
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}
            >
              {stats.pending_orders}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Low Stock Products
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "700", color: "#dc2626" }}
            >
              {stats.low_stock_products}
            </p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            User Management
          </h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Total Spent
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Orders
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {user.email}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          backgroundColor:
                            user.role === "admin" ? "#fef3c7" : "#dbeafe",
                          color: user.role === "admin" ? "#92400e" : "#1e40af",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      ${user.total_spent.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {user.order_count}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === "admin"}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor:
                            user.role === "admin" ? "not-allowed" : "pointer",
                          opacity: user.role === "admin" ? 0.5 : 1,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Product Management
          </h2>

          {/* Add Product Form */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Add New Product</h3>
            <form
              onSubmit={handleAddProduct}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
                step="0.01"
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Add Product
              </button>
            </form>
          </div>

          {/* Edit Product Form */}
          {editingProduct && (
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #0ea5e9",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#0c4a6e" }}>
                Edit Product
              </h3>
              <form
                onSubmit={handleUpdateProduct}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Product Name"
                  value={editingProductData.name}
                  onChange={(e) =>
                    setEditingProductData({
                      ...editingProductData,
                      name: e.target.value,
                    })
                  }
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editingProductData.description}
                  onChange={(e) =>
                    setEditingProductData({
                      ...editingProductData,
                      description: e.target.value,
                    })
                  }
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editingProductData.price}
                  onChange={(e) =>
                    setEditingProductData({
                      ...editingProductData,
                      price: e.target.value,
                    })
                  }
                  required
                  step="0.01"
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editingProductData.category}
                  onChange={(e) =>
                    setEditingProductData({
                      ...editingProductData,
                      category: e.target.value,
                    })
                  }
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={editingProductData.stock}
                  onChange={(e) =>
                    setEditingProductData({
                      ...editingProductData,
                      stock: e.target.value,
                    })
                  }
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Stock
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {product.name}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {product.category}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      ${product.price}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          defaultValue={product.stock}
                          onBlur={(e) => {
                            handleUpdateStock(
                              product.id,
                              parseInt(e.target.value)
                            );
                            setEditingProduct(null);
                          }}
                          style={{
                            width: "80px",
                            padding: "0.25rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.25rem",
                          }}
                        />
                      ) : (
                        <span
                          onClick={() => setEditingProduct(product.id)}
                          style={{
                            cursor: "pointer",
                            color: product.stock < 10 ? "#dc2626" : "inherit",
                            fontWeight: product.stock < 10 ? "600" : "normal",
                          }}
                        >
                          {product.stock === 0 ? (
                            <span
                              style={{ color: "#dc2626", fontWeight: "600" }}
                            >
                              Out of Stock
                            </span>
                          ) : (
                            product.stock
                          )}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {editingProduct === product.id ? (
                          <>
                            <button
                              onClick={handleUpdateProduct}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#059669",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditProduct(product)}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customizations Tab */}
      {activeTab === "customizations" && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Customization Management
          </h2>

          {/* Add Customization Form */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Add New Customization Option
            </h3>
            <form
              onSubmit={handleAddCustomization}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: "1rem",
                alignItems: "end",
              }}
            >
              <select
                value={newCustomization.category}
                onChange={(e) =>
                  setNewCustomization({
                    ...newCustomization,
                    category: e.target.value,
                  })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              >
                <option value="">Select Category</option>
                <option value="color">Color</option>
                <option value="design">Design</option>
                <option value="leather">Leather</option>
                <option value="charm">Charm</option>
              </select>
              <input
                type="text"
                placeholder="Option Name"
                value={newCustomization.name}
                onChange={(e) =>
                  setNewCustomization({
                    ...newCustomization,
                    name: e.target.value,
                  })
                }
                required
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </form>
          </div>

          {/* Categorized Customizations */}
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Colors Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#92400e",
                    margin: 0,
                  }}
                >
                  🎨 Colors
                </h3>
              </div>
              <div style={{ padding: "1rem" }}>
                {customizations.filter((c) => c.category === "color").length >
                0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {customizations
                      .filter((c) => c.category === "color")
                      .map((customization) => (
                        <div
                          key={customization.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                              borderRadius: "2rem",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              border: "1px solid #fbbf24",
                            }}
                          >
                            {customization.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteCustomization(customization.id)
                            }
                            style={{
                              padding: "0.25rem 0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                            title="Delete customization"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No color options available
                  </p>
                )}
              </div>
            </div>

            {/* Designs Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#dbeafe",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1e40af",
                    margin: 0,
                  }}
                >
                  ✨ Designs
                </h3>
              </div>
              <div style={{ padding: "1rem" }}>
                {customizations.filter((c) => c.category === "design").length >
                0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {customizations
                      .filter((c) => c.category === "design")
                      .map((customization) => (
                        <div
                          key={customization.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#dbeafe",
                              color: "#1e40af",
                              borderRadius: "2rem",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              border: "1px solid #60a5fa",
                            }}
                          >
                            {customization.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteCustomization(customization.id)
                            }
                            style={{
                              padding: "0.25rem 0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                            title="Delete customization"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No design options available
                  </p>
                )}
              </div>
            </div>

            {/* Leather Types Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f3e8ff",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#7c3aed",
                    margin: 0,
                  }}
                >
                  🧵 Leather Types
                </h3>
              </div>
              <div style={{ padding: "1rem" }}>
                {customizations.filter((c) => c.category === "leather").length >
                0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {customizations
                      .filter((c) => c.category === "leather")
                      .map((customization) => (
                        <div
                          key={customization.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#f3e8ff",
                              color: "#7c3aed",
                              borderRadius: "2rem",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              border: "1px solid #a78bfa",
                            }}
                          >
                            {customization.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteCustomization(customization.id)
                            }
                            style={{
                              padding: "0.25rem 0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                            title="Delete customization"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No leather type options available
                  </p>
                )}
              </div>
            </div>

            {/* Charms Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#dc2626",
                    margin: 0,
                  }}
                >
                  💎 Charms
                </h3>
              </div>
              <div style={{ padding: "1rem" }}>
                {customizations.filter((c) => c.category === "charm").length >
                0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {customizations
                      .filter((c) => c.category === "charm")
                      .map((customization) => (
                        <div
                          key={customization.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              borderRadius: "2rem",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              border: "1px solid #fca5a5",
                            }}
                          >
                            {customization.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteCustomization(customization.id)
                            }
                            style={{
                              padding: "0.25rem 0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                            title="Delete customization"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No charm options available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Order Management
          </h2>

          {/* Order Filters */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Order Status Overview</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              {["pending", "paid", "delivered", "cancelled"].map((status) => {
                const count = orders.filter(
                  (order) => order.status === status
                ).length;
                const color =
                  status === "pending"
                    ? "#f59e0b"
                    : status === "paid"
                    ? "#059669"
                    : status === "delivered"
                    ? "#2563eb"
                    : "#dc2626";
                return (
                  <div key={status} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "700", color }}>
                      {count}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      #{order.id}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {order.user_email}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusUpdate(order.id, e.target.value)
                        }
                        style={{
                          padding: "0.25rem 0.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.25rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      ${order.total_amount}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <button
                        onClick={() => {
                          /* View order details */
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

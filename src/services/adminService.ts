import api from "./api";

export interface User {
  id: string;
  email: string;
  role: string;
  total_spent: number;
  order_count: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
}

export interface Customization {
  id: string;
  category: string;
  name: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  status: "pending" | "paid" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    customization: {
      name_on_wallet?: string;
      color?: string;
      design?: string;
      leather_type?: string;
      charm?: string;
      gift?: boolean;
    };
  }>;
}

// User Management
export async function getUsers(): Promise<User[]> {
  const response = await api.get("/users");
  return response.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}

// Product Management
export async function getProducts(): Promise<Product[]> {
  const response = await api.get("/products");
  return response.data;
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await api.post("/products", product);
  return response.data;
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<Product> {
  const response = await api.put(`/products/${productId}`, updates);
  return response.data;
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/products/${productId}`);
}

// Customization Management
export async function getCustomizations(): Promise<Customization[]> {
  const response = await api.get("/customizations");
  return response.data;
}

export async function createCustomization(
  customization: Omit<Customization, "id">
): Promise<Customization> {
  const response = await api.post("/customizations", customization);
  return response.data;
}

export async function deleteCustomization(
  customizationId: string
): Promise<void> {
  await api.delete(`/customizations/${customizationId}`);
}

// Order Management
export async function getOrders(): Promise<Order[]> {
  const response = await api.get("/orders");
  return response.data;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order> {
  const response = await api.put(`/orders/${orderId}`, { status });
  return response.data;
}

// Analytics
export async function getDashboardStats(): Promise<{
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
}> {
  const [users, products, orders] = await Promise.all([
    getUsers(),
    getProducts(),
    getOrders(),
  ]);

  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total_amount, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const lowStockProducts = products.filter(
    (product) => product.stock < 10
  ).length;

  return {
    total_users: users.length,
    total_products: products.length,
    total_orders: orders.length,
    total_revenue: totalRevenue,
    pending_orders: pendingOrders,
    low_stock_products: lowStockProducts,
  };
}

import api from "./api";

export interface CartItem {
  product_id: string;
  quantity: number;
  customization: {
    name_on_wallet?: string;
    color?: string;
    design?: string;
    leather_type?: string;
    charm?: string;
    gift?: boolean;
  };
}

export async function addToCart(item: CartItem) {
  const response = await api.post("/cart", item);
  return response.data;
}

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

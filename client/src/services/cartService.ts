import type { Product } from "../types/product";

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const CART_KEY = "cart";
const CART_UPDATED_EVENT = "cart-updated";

function normalizeProductId(id: number | string) {
  return Number(id);
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCart(): CartItem[] {
  const rawCart = localStorage.getItem(CART_KEY);

  if (!rawCart) {
    return [];
  }

  try {
    const cart = JSON.parse(rawCart) as CartItem[];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdated();
}

export function addToCart(product: Product) {
  const productId = normalizeProductId(product.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return;
  }

  const stock = typeof product.stock === "number" ? product.stock : 0;
  const cart = getCart();
  const existingItem = cart.find((item) => item.product_id === productId);

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + 1, stock);
  } else {
    cart.push({
      product_id: productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock,
    });
  }

  saveCart(cart);
}

export function updateCartItemQuantity(productId: number, quantity: number) {
  const cart = getCart()
    .map((item) =>
      item.product_id === productId
        ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(cart);
}

export function removeCartItem(productId: number) {
  saveCart(getCart().filter((item) => item.product_id !== productId));
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export { CART_UPDATED_EVENT };

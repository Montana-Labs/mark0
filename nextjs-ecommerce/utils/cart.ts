import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = "mark0-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter((item) => item.product.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

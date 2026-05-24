import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCartCount } from "../services/cartService";

export function useCartCount(): number {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCartCount = () => setCartCount(getCartCount());
    refreshCartCount();
    window.addEventListener(CART_UPDATED_EVENT, refreshCartCount);
    return () => window.removeEventListener(CART_UPDATED_EVENT, refreshCartCount);
  }, []);

  return cartCount;
}

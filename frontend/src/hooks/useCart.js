import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useRef } from "react";

export const useCart = () => {
  const cart = useCartStore();
  const user = useAuthStore((s) => s.user);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadUserCart = async () => {
      if (loadingRef.current) return; // Prevent concurrent loads
      loadingRef.current = true;

      try {
        await cart.loadCart(user?.id);
      } finally {
        loadingRef.current = false;
      }
    };

    loadUserCart();
  }, [user?.id]); // Only depend on user.id

  return cart;
};

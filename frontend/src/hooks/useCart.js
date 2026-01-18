import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export const useCart = () => {
  const cart = useCartStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    cart.loadCart(user?._id);
  }, [user?._id]);

  return cart;
};

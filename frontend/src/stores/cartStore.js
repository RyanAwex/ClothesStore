import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
  cartItems: [],

  loadCart: (userId) => {
    const key = userId ? `cart-${userId}` : "cart-guest";
    const stored = localStorage.getItem(key);
    if (stored) {
      set(JSON.parse(stored));
    } else {
      set({ cartItems: [] });
    }
  },

  saveCart: () => {
    const state = get();
    const user = useAuthStore.getState().user;
    const key = user ? `cart-${user._id}` : "cart-guest";
    localStorage.setItem(key, JSON.stringify(state));
  },

  addToCart: (product, variantIndex, size, quantity = 1) => {
    const pid = product._id || product.id;
    const cartItem = {
      id: `${pid}-${variantIndex}-${size}`,
      productId: pid,
      name: product.name,
      price: parseFloat(product.price),
      variant: product.variants[variantIndex],
      size,
      quantity,
    };

    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === cartItem.id,
      );
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      } else {
        return { cartItems: [...state.cartItems, cartItem] };
      }
    });
    get().saveCart();
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== itemId),
    }));
    get().saveCart();
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    }));
    get().saveCart();
  },

  clearCart: () => {
    set({ cartItems: [] });
    get().saveCart();
  },

  getCartTotal: () => {
    return get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  },
}));

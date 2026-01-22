import { create } from "zustand";
import { useAuthStore } from "./authStore";
import supabase from "../utils/supabase";

export const useCartStore = create((set, get) => ({
  cartItems: [],

  loadCart: async (userId) => {
    if (!userId) {
      // For guest users, still use localStorage
      const stored = localStorage.getItem("cart-guest");
      if (stored) {
        set(JSON.parse(stored));
      } else {
        set({ cartItems: [] });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          product_id,
          quantity,
          products (
            id,
            name,
            price,
            variants,
            sizes
          )
        `,
        )
        .eq("user_id", userId);

      if (error) throw error;

      // Transform the data to match our cart item format
      const cartItems = (data || []).map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || "Unknown Product",
        price: parseFloat(item.products?.price || 0),
        variant: item.products?.variants?.[0] || null, // For now, take first variant
        size: item.products?.sizes?.[0] || null, // For now, take first size
        quantity: item.quantity,
      }));

      set({ cartItems });
    } catch (error) {
      console.error("Error loading cart from Supabase:", error);
      // Fallback to localStorage if Supabase fails
      const stored = localStorage.getItem(`cart-${userId}`);
      if (stored) {
        set(JSON.parse(stored));
      } else {
        set({ cartItems: [] });
      }
    }
  },

  saveCart: async () => {
    const state = get();
    const user = useAuthStore.getState().user;

    if (!user) {
      // For guest users, still use localStorage
      localStorage.setItem("cart-guest", JSON.stringify(state));
      return;
    }

    try {
      // First, clear existing cart items for this user
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      // Then insert all current cart items
      if (state.cartItems.length > 0) {
        const cartData = state.cartItems.map((item) => ({
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
        }));

        const { error } = await supabase.from("cart_items").insert(cartData);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving cart to Supabase:", error);
      // Fallback to localStorage
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(state));
    }
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

import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Item {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  tableNo: number | null; // ✅ tableNo is now number (not string)
  setTableNo: (tableNo: number) => void; // ✅ accepts number
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  tableNo: null,

  setTableNo: (tableNo) => set({ tableNo }),

  addToCart: (item) => {
    const existing = get().cart.find((i) => i.id === item.id);
    if (existing) {
      set((state) => ({
        cart: state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      set((state) => ({
        cart: [...state.cart, { ...item, quantity: 1 }],
      }));
    }
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  increaseQty: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },

  decreaseQty: (id) => {
    set((state) => {
      const item = state.cart.find((i) => i.id === id);
      if (!item) return {};
      if (item.quantity === 1) {
        return {
          cart: state.cart.filter((i) => i.id !== id),
        };
      }
      return {
        cart: state.cart.map((i) =>
          i.id === id ? { ...i, quantity: item.quantity - 1 } : i
        ),
      };
    });
  },

  clearCart: () => set({ cart: [] }),

  getItemQuantity: (id) => {
    const item = get().cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  },
}));

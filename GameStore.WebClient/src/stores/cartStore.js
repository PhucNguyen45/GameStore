import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  addItem: (game) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === game.id);
      return exists
        ? {
            items: state.items.map((i) =>
              i.id === game.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          }
        : { items: [...state.items, { ...game, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce(
      (s, i) => s + (i.discountPrice || i.price) * i.quantity,
      0,
    ),
  count: () => get().items.length,
}));

export default useCartStore;

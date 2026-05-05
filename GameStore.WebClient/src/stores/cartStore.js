// GameStore.WebClient/src/stores/cartStore.js
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  addItem: (game) =>
    set((state) => {
      // Nếu đã có trong cart thì không thêm nữa
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
  // Tổng tiền = tổng giá từng game (mỗi game 1 lần)
  total: () =>
    get().items.reduce(
      (s, i) => s + (i.discountPrice || i.price) * i.quantity,
      0,
    ),
  count: () => get().items.length,
}));

export default useCartStore;

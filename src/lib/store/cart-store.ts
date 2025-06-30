import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  image: string
  estimatedDelivery: string
}

interface CartStore {
  items: CartItem[]
  promoCode: string
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setPromoCode: (code: string) => void
  applyPromoCode: () => void
  getSubTotal: () => number
  getTotal: () => number
  getItemCount: () => number
  toggleSelectItem: (itemId: string, selected: boolean) => void
  selectAll: (selected: boolean) => void
  selectedItems: string[]
  removeSelectedItems: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      discount: 0,
      selectedItems: [],

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (itemId) => {
        const { items, selectedItems } = get()
        set({
          items: items.filter((i) => i.id !== itemId),
          selectedItems: selectedItems.filter((id) => id !== itemId),
        })
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get()
        if (quantity < 1) quantity = 1
        set({
          items: items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => {
        set({ items: [], selectedItems: [] })
      },

      setPromoCode: (code) => {
        set({ promoCode: code })
      },

      applyPromoCode: () => {
        const { promoCode } = get()
        // This is where you would validate the promo code with your backend
        // For now, let's just apply a 10% discount for any code
        if (promoCode.trim()) {
          set({ discount: 0.1 }) // 10% discount
        } else {
          set({ discount: 0 })
        }
      },

      getSubTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotal: () => {
        const { getSubTotal, discount } = get()
        const subTotal = getSubTotal()
        return subTotal - subTotal * discount
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      toggleSelectItem: (itemId, selected) => {
        const { selectedItems } = get()
        if (selected) {
          set({ selectedItems: [...selectedItems, itemId] })
        } else {
          set({ selectedItems: selectedItems.filter((id) => id !== itemId) })
        }
      },

      selectAll: (selected) => {
        const { items } = get()
        if (selected) {
          set({ selectedItems: items.map((item) => item.id) })
        } else {
          set({ selectedItems: [] })
        }
      },

      removeSelectedItems: () => {
        const { items, selectedItems } = get()
        set({
          items: items.filter((item) => !selectedItems.includes(item.id)),
          selectedItems: [],
        })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

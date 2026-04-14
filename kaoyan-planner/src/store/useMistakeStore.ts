import dayjs from "dayjs"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface MistakeItem {
  id: string
  subject: string
  tags: string[]
  description: string
  source: string
  createdAt: string
  reviewCount: number
  mastered: boolean
}

interface MistakeState {
  items: MistakeItem[]
  addMistake: (payload: Omit<MistakeItem, "id" | "createdAt" | "reviewCount" | "mastered">) => void
  toggleMastered: (id: string) => void
  addReviewCount: (id: string) => void
  removeMistake: (id: string) => void
}

const STORAGE_KEY = "kaoyan-mistakes"

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set) => ({
      items: [],
      addMistake: (payload) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              ...payload,
              id: crypto.randomUUID(),
              createdAt: dayjs().format("YYYY-MM-DD"),
              reviewCount: 0,
              mastered: false,
            },
          ],
        })),
      toggleMastered: (id) =>
        set((s) => ({
          items: s.items.map((m) => (m.id === id ? { ...m, mastered: !m.mastered } : m)),
        })),
      addReviewCount: (id) =>
        set((s) => ({
          items: s.items.map((m) =>
            m.id === id ? { ...m, reviewCount: m.reviewCount + 1 } : m,
          ),
        })),
      removeMistake: (id) =>
        set((s) => ({
          items: s.items.filter((m) => m.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

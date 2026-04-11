import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/** 默认初试日（可在设置页修改） */
export const DEFAULT_EXAM_DATE = "2026-12-19"

const STORAGE_KEY = "kaoyan-settings"

interface SettingsState {
  examDate: string
  setExamDate: (examDate: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      examDate: DEFAULT_EXAM_DATE,
      setExamDate: (examDate) => set({ examDate }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ examDate: s.examDate }),
    },
  ),
)

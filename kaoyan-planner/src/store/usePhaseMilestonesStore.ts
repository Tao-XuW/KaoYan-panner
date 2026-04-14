import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { PHASES } from "../data/planOverviewData"

const STORAGE_KEY = "kaoyan-phase-milestones"

function buildInitialChecked(): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const p of PHASES) {
    for (const id of p.milestoneIds) {
      out[id] = false
    }
  }
  return out
}

interface PhaseMilestonesState {
  /** milestoneId -> 是否完成 */
  checked: Record<string, boolean>
  /** phaseId-week -> 周学习状态 */
  weekStatus: Record<string, "todo" | "reviewing" | "done">
  /** chapterKey -> 章节学习状态 */
  chapterStatus: Record<string, "todo" | "reviewing" | "done">
  toggleMilestone: (id: string) => void
  setWeekStatus: (id: string, status: "todo" | "reviewing" | "done") => void
  setChapterStatus: (
    id: string,
    status: "todo" | "reviewing" | "done",
  ) => void
}

export const usePhaseMilestonesStore = create<PhaseMilestonesState>()(
  persist(
    (set) => ({
      checked: buildInitialChecked(),
      weekStatus: {},
      chapterStatus: {},
      toggleMilestone: (id: string) =>
        set((s) => ({
          checked: { ...s.checked, [id]: !(s.checked[id] ?? false) },
        })),
      setWeekStatus: (id, status) =>
        set((s) => ({
          weekStatus: { ...s.weekStatus, [id]: status },
        })),
      setChapterStatus: (id, status) =>
        set((s) => ({
          chapterStatus: { ...s.chapterStatus, [id]: status },
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        checked: s.checked,
        weekStatus: s.weekStatus,
        chapterStatus: s.chapterStatus,
      }),
    },
  ),
)

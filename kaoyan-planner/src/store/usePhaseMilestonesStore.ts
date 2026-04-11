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
  toggleMilestone: (id: string) => void
}

export const usePhaseMilestonesStore = create<PhaseMilestonesState>()(
  persist(
    (set) => ({
      checked: buildInitialChecked(),
      toggleMilestone: (id: string) =>
        set((s) => ({
          checked: { ...s.checked, [id]: !(s.checked[id] ?? false) },
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ checked: s.checked }),
    },
  ),
)

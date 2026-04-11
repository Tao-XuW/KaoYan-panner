import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  getDailyTemplateForPhase,
  getTemplateByDate,
} from "../data/scheduleTemplates"
import { useSettingsStore } from "./useSettingsStore"
import type { DailySchedule, SlotStatus, TimeSlotTask } from "../types"
import type { Phase } from "../types"

const STORAGE_KEY = "kaoyan-schedule"

function isSlotEnded(dateStr: string, endTime: string): boolean {
  const parts = dateStr.split("-").map((p) => Number.parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return false
  }
  const [y, m, d] = parts
  const [hh, mm] = endTime.split(":").map((p) => Number.parseInt(p, 10))
  const end = new Date(y, m - 1, d, hh, mm)
  return Date.now() > end.getTime()
}

/** 根据达标项与是否已过时段结束时间，计算时段状态（休息段固定为未开始） */
export function computeSlotStatus(
  slot: TimeSlotTask,
  date: string,
): SlotStatus {
  if (slot.isRestPeriod) {
    return "not_started"
  }

  const { criteria } = slot
  const total = criteria.length
  if (total === 0) {
    return "not_started"
  }

  const checked = criteria.filter((c) => c.checked).length
  if (checked === total) {
    return "completed"
  }

  const ratio = checked / total
  if (ratio >= 0.5) {
    return "partial"
  }

  if (ratio < 0.5 && isSlotEnded(date, slot.endTime)) {
    return "failed"
  }

  return "not_started"
}

function recalculateDailyMetrics(slots: TimeSlotTask[]): Pick<
  DailySchedule,
  "completionRate" | "totalCriteria" | "checkedCriteria"
> {
  let totalCriteria = 0
  let checkedCriteria = 0
  for (const slot of slots) {
    if (slot.isRestPeriod) {
      continue
    }
    for (const c of slot.criteria) {
      totalCriteria += 1
      if (c.checked) {
        checkedCriteria += 1
      }
    }
  }

  const completionRate =
    totalCriteria === 0
      ? 0
      : Math.round((checkedCriteria / totalCriteria) * 1000) / 10

  return { totalCriteria, checkedCriteria, completionRate }
}

/** 按达标项推导各时段状态；跳过 / 进行中 由用户手动标记，默认不覆盖（除非在 forceSlotIds 中） */
function reconcileSlots(
  date: string,
  slots: TimeSlotTask[],
  forceSlotIds: ReadonlySet<string>,
): TimeSlotTask[] {
  return slots.map((slot) => {
    if (slot.isRestPeriod) {
      return { ...slot, status: "not_started" as const }
    }
    if (
      !forceSlotIds.has(slot.id) &&
      (slot.status === "skipped" || slot.status === "in_progress")
    ) {
      return slot
    }
    return { ...slot, status: computeSlotStatus(slot, date) }
  })
}

function reconcileSchedule(
  date: string,
  schedule: DailySchedule,
  forceSlotIds: ReadonlySet<string> = new Set(),
): DailySchedule {
  const slots = reconcileSlots(date, schedule.slots, forceSlotIds)
  const metrics = recalculateDailyMetrics(slots)
  return { ...schedule, slots, ...metrics }
}

function buildInitialDailySchedule(date: string, phase: Phase): DailySchedule {
  const rawSlots = getDailyTemplateForPhase(phase)
  return reconcileSchedule(date, {
    date,
    phase,
    slots: rawSlots,
    completionRate: 0,
    totalCriteria: 0,
    checkedCriteria: 0,
  })
}

function schedulesEqual(a: TimeSlotTask[], b: TimeSlotTask[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].status !== b[i].status) {
      return false
    }
    const ac = a[i].criteria
    const bc = b[i].criteria
    if (ac.length !== bc.length) {
      return false
    }
    for (let j = 0; j < ac.length; j++) {
      if (ac[j].checked !== bc[j].checked || ac[j].id !== bc[j].id) {
        return false
      }
    }
  }
  return true
}

interface ScheduleStoreState {
  schedulesByDate: Record<string, DailySchedule>
}

interface ScheduleStoreActions {
  getScheduleByDate: (date: string) => DailySchedule
  toggleCriterion: (
    date: string,
    slotId: string,
    criterionId: string,
  ) => void
  updateSlotStatus: (
    date: string,
    slotId: string,
    status: SlotStatus,
  ) => void
  updateSlotNotes: (date: string, slotId: string, notes: string) => void
}

type ScheduleStore = ScheduleStoreState & ScheduleStoreActions

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedulesByDate: {},

      getScheduleByDate: (date: string) => {
        const key = normalizeDateKey(date)
        const existing = get().schedulesByDate[key]
        if (!existing) {
          const phase = phaseForDateKey(key)
          const created = buildInitialDailySchedule(key, phase)
          set((s) => ({
            schedulesByDate: { ...s.schedulesByDate, [key]: created },
          }))
          return created
        }

        const refreshed = reconcileSchedule(key, existing)
        if (
          !schedulesEqual(refreshed.slots, existing.slots) ||
          refreshed.completionRate !== existing.completionRate ||
          refreshed.checkedCriteria !== existing.checkedCriteria
        ) {
          set((s) => ({
            schedulesByDate: { ...s.schedulesByDate, [key]: refreshed },
          }))
        }
        return refreshed
      },

      toggleCriterion: (date, slotId, criterionId) => {
        const key = normalizeDateKey(date)
        set((state) => {
          let schedule = state.schedulesByDate[key]
          if (!schedule) {
            const phase = phaseForDateKey(key)
            schedule = buildInitialDailySchedule(key, phase)
          }

          const slots = schedule.slots.map((slot) => {
            if (slot.id !== slotId) {
              return slot
            }
            const criteria = slot.criteria.map((c) =>
              c.id === criterionId ? { ...c, checked: !c.checked } : c,
            )
            return { ...slot, criteria }
          })

          const next: DailySchedule = { ...schedule, slots }
          const recalculated = reconcileSchedule(key, next, new Set([slotId]))
          return {
            schedulesByDate: {
              ...state.schedulesByDate,
              [key]: recalculated,
            },
          }
        })
      },

      updateSlotStatus: (date, slotId, status) => {
        const key = normalizeDateKey(date)
        set((state) => {
          let schedule = state.schedulesByDate[key]
          if (!schedule) {
            const phase = phaseForDateKey(key)
            schedule = buildInitialDailySchedule(key, phase)
          }

          const slots = schedule.slots.map((slot) =>
            slot.id === slotId ? { ...slot, status } : slot,
          )
          const metrics = recalculateDailyMetrics(slots)
          return {
            schedulesByDate: {
              ...state.schedulesByDate,
              [key]: { ...schedule, slots, ...metrics },
            },
          }
        })
      },

      updateSlotNotes: (date, slotId, notes) => {
        const key = normalizeDateKey(date)
        set((state) => {
          let schedule = state.schedulesByDate[key]
          if (!schedule) {
            const phase = phaseForDateKey(key)
            schedule = buildInitialDailySchedule(key, phase)
          }

          const slots = schedule.slots.map((slot) =>
            slot.id === slotId ? { ...slot, notes } : slot,
          )
          return {
            schedulesByDate: {
              ...state.schedulesByDate,
              [key]: { ...schedule, slots },
            },
          }
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ schedulesByDate: state.schedulesByDate }),
    },
  ),
)

function normalizeDateKey(date: string): string {
  return date.trim().slice(0, 10)
}

function phaseForDateKey(key: string) {
  const exam =
    useSettingsStore.getState().examDate?.trim().slice(0, 10) ?? undefined
  return getTemplateByDate(key, exam)
}

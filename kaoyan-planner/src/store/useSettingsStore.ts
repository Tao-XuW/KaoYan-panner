import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const DEFAULT_EXAM_DATE = "2026-12-19"
export const DEFAULT_PREP_START_DATE = "2026-08-01"
export const DEFAULT_DAILY_STUDY_HOURS = 5
export const DEFAULT_TARGET_SCORE_408 = 120
export const DEFAULT_REMINDER_TIME = "07:30"

const STORAGE_KEY = "kaoyan-settings"

export interface SettingsPersisted {
  examDate: string
  prepStartDate: string
  dailyStudyHoursGoal: number
  targetScore408: number
  reminderDailyEnabled: boolean
  reminderTime: string
  slotEndReminderEnabled: boolean
  lowCompletionAlertEnabled: boolean
}

interface SettingsState extends SettingsPersisted {
  setExamDate: (examDate: string) => void
  setPrepStartDate: (prepStartDate: string) => void
  setDailyStudyHoursGoal: (hours: number) => void
  setTargetScore408: (score: number) => void
  setReminderDailyEnabled: (enabled: boolean) => void
  setReminderTime: (time: string) => void
  setSlotEndReminderEnabled: (enabled: boolean) => void
  setLowCompletionAlertEnabled: (enabled: boolean) => void
}

const initialPersisted: SettingsPersisted = {
  examDate: DEFAULT_EXAM_DATE,
  prepStartDate: DEFAULT_PREP_START_DATE,
  dailyStudyHoursGoal: DEFAULT_DAILY_STUDY_HOURS,
  targetScore408: DEFAULT_TARGET_SCORE_408,
  reminderDailyEnabled: true,
  reminderTime: DEFAULT_REMINDER_TIME,
  slotEndReminderEnabled: true,
  lowCompletionAlertEnabled: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialPersisted,
      setExamDate: (examDate) => set({ examDate }),
      setPrepStartDate: (prepStartDate) => set({ prepStartDate }),
      setDailyStudyHoursGoal: (dailyStudyHoursGoal) =>
        set({
          dailyStudyHoursGoal: Math.min(10, Math.max(2, Math.round(dailyStudyHoursGoal))),
        }),
      setTargetScore408: (targetScore408) =>
        set({
          targetScore408: Math.min(150, Math.max(0, Math.round(targetScore408))),
        }),
      setReminderDailyEnabled: (reminderDailyEnabled) =>
        set({ reminderDailyEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setSlotEndReminderEnabled: (slotEndReminderEnabled) =>
        set({ slotEndReminderEnabled }),
      setLowCompletionAlertEnabled: (lowCompletionAlertEnabled) =>
        set({ lowCompletionAlertEnabled }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        examDate: s.examDate,
        prepStartDate: s.prepStartDate,
        dailyStudyHoursGoal: s.dailyStudyHoursGoal,
        targetScore408: s.targetScore408,
        reminderDailyEnabled: s.reminderDailyEnabled,
        reminderTime: s.reminderTime,
        slotEndReminderEnabled: s.slotEndReminderEnabled,
        lowCompletionAlertEnabled: s.lowCompletionAlertEnabled,
      }),
    },
  ),
)

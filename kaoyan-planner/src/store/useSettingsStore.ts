import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const DEFAULT_EXAM_DATE = "2026-12-19"
export const DEFAULT_PREP_START_DATE = "2026-08-01"
export const DEFAULT_DAILY_STUDY_HOURS = 5
export const DEFAULT_TARGET_SCORE_POLITICS = 60
export const DEFAULT_TARGET_SCORE_ENGLISH = 60
export const DEFAULT_TARGET_SCORE_MATH = 90
export const DEFAULT_TARGET_SCORE_408 = 120
export const DEFAULT_REMINDER_TIME = "07:30"
export const DEFAULT_THEME_MODE = "system"

const STORAGE_KEY = "kaoyan-settings"

export type ThemeMode = "system" | "light" | "dark"

export interface SettingsPersisted {
  examDate: string
  prepStartDate: string
  dailyStudyHoursGoal: number
  targetScorePolitics: number
  targetScoreEnglish: number
  targetScoreMath: number
  targetScore408: number
  themeMode: ThemeMode
  reminderDailyEnabled: boolean
  reminderTime: string
  slotEndReminderEnabled: boolean
  lowCompletionAlertEnabled: boolean
}

interface SettingsState extends SettingsPersisted {
  setExamDate: (examDate: string) => void
  setPrepStartDate: (prepStartDate: string) => void
  setDailyStudyHoursGoal: (hours: number) => void
  setTargetScorePolitics: (score: number) => void
  setTargetScoreEnglish: (score: number) => void
  setTargetScoreMath: (score: number) => void
  setTargetScore408: (score: number) => void
  setThemeMode: (mode: ThemeMode) => void
  setReminderDailyEnabled: (enabled: boolean) => void
  setReminderTime: (time: string) => void
  setSlotEndReminderEnabled: (enabled: boolean) => void
  setLowCompletionAlertEnabled: (enabled: boolean) => void
}

const initialPersisted: SettingsPersisted = {
  examDate: DEFAULT_EXAM_DATE,
  prepStartDate: DEFAULT_PREP_START_DATE,
  dailyStudyHoursGoal: DEFAULT_DAILY_STUDY_HOURS,
  targetScorePolitics: DEFAULT_TARGET_SCORE_POLITICS,
  targetScoreEnglish: DEFAULT_TARGET_SCORE_ENGLISH,
  targetScoreMath: DEFAULT_TARGET_SCORE_MATH,
  targetScore408: DEFAULT_TARGET_SCORE_408,
  themeMode: DEFAULT_THEME_MODE,
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
      setTargetScorePolitics: (targetScorePolitics) =>
        set({
          targetScorePolitics: Math.min(100, Math.max(0, Math.round(targetScorePolitics))),
        }),
      setTargetScoreEnglish: (targetScoreEnglish) =>
        set({
          targetScoreEnglish: Math.min(100, Math.max(0, Math.round(targetScoreEnglish))),
        }),
      setTargetScoreMath: (targetScoreMath) =>
        set({
          targetScoreMath: Math.min(150, Math.max(0, Math.round(targetScoreMath))),
        }),
      setTargetScore408: (targetScore408) =>
        set({
          targetScore408: Math.min(150, Math.max(0, Math.round(targetScore408))),
        }),
      setThemeMode: (themeMode) => set({ themeMode }),
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
        targetScorePolitics: s.targetScorePolitics,
        targetScoreEnglish: s.targetScoreEnglish,
        targetScoreMath: s.targetScoreMath,
        targetScore408: s.targetScore408,
        themeMode: s.themeMode,
        reminderDailyEnabled: s.reminderDailyEnabled,
        reminderTime: s.reminderTime,
        slotEndReminderEnabled: s.slotEndReminderEnabled,
        lowCompletionAlertEnabled: s.lowCompletionAlertEnabled,
      }),
    },
  ),
)

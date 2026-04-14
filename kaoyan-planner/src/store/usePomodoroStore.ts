import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface PomodoroSession {
  id: string
  date: string
  seconds: number
  createdAt: string
}

interface PomodoroState {
  focusMinutes: number
  breakMinutes: number
  sessions: PomodoroSession[]
  isRunning: boolean
  isBreak: boolean
  leftSeconds: number
  lastTickAt: number | null
  setFocusMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
  addSession: (seconds: number, dateKey?: string) => void
  removeSession: (id: string) => void
  toggleRunning: () => void
  tickTimer: () => void
  resetTimer: () => void
  endTimerWithConfirm: () => void
}

const STORAGE_KEY = "kaoyan-pomodoro"

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      focusMinutes: 25,
      breakMinutes: 5,
      sessions: [],
      isRunning: false,
      isBreak: false,
      leftSeconds: 25 * 60,
      lastTickAt: null,
      setFocusMinutes: (focusMinutes) =>
        set((s) => {
          const next = Math.min(90, Math.max(10, Math.round(focusMinutes)))
          return {
            focusMinutes: next,
            leftSeconds:
              !s.isRunning && !s.isBreak ? next * 60 : s.leftSeconds,
          }
        }),
      setBreakMinutes: (breakMinutes) =>
        set((s) => {
          const next = Math.min(30, Math.max(3, Math.round(breakMinutes)))
          return {
            breakMinutes: next,
            leftSeconds:
              !s.isRunning && s.isBreak ? next * 60 : s.leftSeconds,
          }
        }),
      addSession: (seconds, dateKey) =>
        set((s) => ({
          sessions: [
            ...s.sessions,
            {
              id: crypto.randomUUID(),
              date: dateKey ?? new Date().toISOString().slice(0, 10),
              seconds: Math.max(0, Math.round(seconds)),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeSession: (id) =>
        set((s) => ({
          sessions: s.sessions.filter((x) => x.id !== id),
        })),
      toggleRunning: () =>
        set((s) => ({
          isRunning: !s.isRunning,
          lastTickAt: !s.isRunning ? Date.now() : s.lastTickAt,
        })),
      tickTimer: () =>
        set((s) => {
          if (!s.isRunning || !s.lastTickAt) {
            return s
          }
          const now = Date.now()
          let elapsed = Math.floor((now - s.lastTickAt) / 1000)
          if (elapsed <= 0) {
            return s
          }

          let isBreak = s.isBreak
          let leftSeconds = s.leftSeconds
          const sessions = [...s.sessions]

          while (elapsed > 0) {
            if (elapsed < leftSeconds) {
              leftSeconds -= elapsed
              elapsed = 0
              break
            }

            elapsed -= leftSeconds
            const phaseSeconds = isBreak ? s.breakMinutes * 60 : s.focusMinutes * 60
            if (!isBreak && phaseSeconds > 0) {
              sessions.push({
                id: crypto.randomUUID(),
                date: new Date().toISOString().slice(0, 10),
                seconds: phaseSeconds,
                createdAt: new Date().toISOString(),
              })
            }
            isBreak = !isBreak
            leftSeconds = (isBreak ? s.breakMinutes : s.focusMinutes) * 60
          }

          return {
            ...s,
            sessions,
            isBreak,
            leftSeconds,
            lastTickAt: now,
          }
        }),
      resetTimer: () =>
        set((s) => ({
          isRunning: false,
          isBreak: false,
          leftSeconds: s.focusMinutes * 60,
          lastTickAt: null,
        })),
      endTimerWithConfirm: () =>
        set((s) => {
          const phaseTotal = (s.isBreak ? s.breakMinutes : s.focusMinutes) * 60
          const elapsed = Math.max(0, phaseTotal - s.leftSeconds)
          const sessions =
            !s.isBreak && elapsed > 0
              ? [
                  ...s.sessions,
                  {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString().slice(0, 10),
                    seconds: elapsed,
                    createdAt: new Date().toISOString(),
                  },
                ]
              : s.sessions
          return {
            ...s,
            sessions,
            isRunning: false,
            isBreak: false,
            leftSeconds: s.focusMinutes * 60,
            lastTickAt: null,
          }
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        focusMinutes: s.focusMinutes,
        breakMinutes: s.breakMinutes,
        sessions: s.sessions,
        isRunning: s.isRunning,
        isBreak: s.isBreak,
        leftSeconds: s.leftSeconds,
        lastTickAt: s.lastTickAt,
      }),
    },
  ),
)

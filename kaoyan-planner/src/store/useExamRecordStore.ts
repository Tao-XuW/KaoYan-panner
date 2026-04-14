import dayjs from "dayjs"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface ExamRecord {
  id: string
  date: string
  year: number
  politics: number | null
  english: number | null
  math: number | null
  cs408: number | null
  notes?: string
}

export type ExamSubjectKey = "politics" | "english" | "math" | "cs408"

interface ExamRecordState {
  records: ExamRecord[]
  addRecord: (payload: Omit<ExamRecord, "id">) => void
  updateRecord: (id: string, patch: Partial<Omit<ExamRecord, "id">>) => void
  removeRecord: (id: string) => void
  setSubjectScore: (
    year: number,
    subject: ExamSubjectKey,
    score: number,
    date?: string,
  ) => void
}

const STORAGE_KEY = "kaoyan-exam-records"

export const useExamRecordStore = create<ExamRecordState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (payload) =>
        set((s) => ({
          records: [
            ...s.records,
            { ...payload, id: crypto.randomUUID(), date: dayjs(payload.date).format("YYYY-MM-DD") },
          ],
        })),
      updateRecord: (id, patch) =>
        set((s) => ({
          records: s.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeRecord: (id) =>
        set((s) => ({
          records: s.records.filter((r) => r.id !== id),
        })),
      setSubjectScore: (year, subject, score, date) =>
        set((s) => {
          const clamped =
            subject === "politics" || subject === "english"
              ? Math.min(100, Math.max(0, Math.round(score)))
              : Math.min(150, Math.max(0, Math.round(score)))
          let idx = -1
          for (let i = s.records.length - 1; i >= 0; i--) {
            if (s.records[i].year === year) {
              idx = i
              break
            }
          }
          const dateKey = dayjs(date ?? new Date()).format("YYYY-MM-DD")
          if (idx === -1) {
            return {
              records: [
                ...s.records,
                {
                  id: crypto.randomUUID(),
                  date: dateKey,
                  year,
                  politics: subject === "politics" ? clamped : null,
                  english: subject === "english" ? clamped : null,
                  math: subject === "math" ? clamped : null,
                  cs408: subject === "cs408" ? clamped : null,
                },
              ],
            }
          }
          return {
            records: s.records.map((r, i) =>
              i === idx ? { ...r, [subject]: clamped, date: dateKey } : r,
            ),
          }
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ records: s.records }),
    },
  ),
)

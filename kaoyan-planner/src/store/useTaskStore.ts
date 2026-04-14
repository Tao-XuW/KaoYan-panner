import dayjs from "dayjs"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type TaskStatus = "todo" | "doing" | "done"

export interface DailyTaskItem {
  id: string
  date: string
  title: string
  subject: string
  estimatedMinutes: number
  status: TaskStatus
  notes?: string
}

interface TaskState {
  tasks: DailyTaskItem[]
  addTask: (input: Omit<DailyTaskItem, "id">) => void
  updateTask: (id: string, patch: Partial<Omit<DailyTaskItem, "id" | "date">>) => void
  deleteTask: (id: string) => void
  tasksByDate: (date: string) => DailyTaskItem[]
}

const STORAGE_KEY = "kaoyan-tasks"

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (input) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            {
              ...input,
              id: crypto.randomUUID(),
            },
          ],
        })),
      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
        })),
      tasksByDate: (date) => {
        const key = dayjs(date).format("YYYY-MM-DD")
        return get().tasks.filter((t) => t.date === key)
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ tasks: s.tasks }),
    },
  ),
)

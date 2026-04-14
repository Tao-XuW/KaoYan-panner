import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Layout } from "./components/Layout"
import DailyTasksPage from "./pages/DailyTasks"
import DailySchedulePage from "./pages/DailySchedule"
import Dashboard from "./pages/Dashboard"
import MistakesPage from "./pages/Mistakes"
import PlanOverviewPage from "./pages/PlanOverview"
import SettingsPage from "./pages/Settings"
import StatisticsPage from "./pages/Statistics"
import { useScheduleStore } from "./store/useScheduleStore"
import { useSettingsStore } from "./store/useSettingsStore"

function ThemeSync() {
  const themeMode = useSettingsStore((s) => s.themeMode)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const shouldDark = themeMode === "dark" || (themeMode === "system" && mq.matches)
      document.documentElement.classList.toggle("dark", shouldDark)
    }
    apply()
    mq.addEventListener("change", apply)
    return () => {
      mq.removeEventListener("change", apply)
    }
  }, [themeMode])

  return null
}

function ReminderEffects() {
  const getScheduleByDate = useScheduleStore((s) => s.getScheduleByDate)
  const reminderDailyEnabled = useSettingsStore((s) => s.reminderDailyEnabled)
  const reminderTime = useSettingsStore((s) => s.reminderTime)
  const slotEndReminderEnabled = useSettingsStore((s) => s.slotEndReminderEnabled)

  useEffect(() => {
    const sent = new Set<string>()
    const tick = () => {
      const now = new Date()
      const dateKey = now.toISOString().slice(0, 10)
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

      if (reminderDailyEnabled && hhmm === reminderTime && !sent.has(`daily-${dateKey}`)) {
        sent.add(`daily-${dateKey}`)
        if (window.Notification && Notification.permission === "granted") {
          new Notification("今日学习提醒", { body: "开始今天的备考任务吧！" })
        }
      }

      if (slotEndReminderEnabled) {
        const schedule = getScheduleByDate(dateKey)
        const nowMin = now.getHours() * 60 + now.getMinutes()
        for (const slot of schedule.slots) {
          if (slot.isRestPeriod) {
            continue
          }
          const [eh, em] = slot.endTime.split(":").map((v) => Number.parseInt(v, 10))
          const remain = eh * 60 + em - nowMin
          const key = `slot-${dateKey}-${slot.id}`
          if (remain === 10 && !sent.has(key)) {
            sent.add(key)
            if (window.Notification && Notification.permission === "granted") {
              new Notification("时段即将结束", {
                body: `${slot.subject}「${slot.title}」还剩 10 分钟`,
              })
            }
          }
        }
      }
    }
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined)
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [getScheduleByDate, reminderDailyEnabled, reminderTime, slotEndReminderEnabled])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <ReminderEffects />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<DailyTasksPage />} />
          <Route path="schedule" element={<DailySchedulePage />} />
          <Route path="plan" element={<PlanOverviewPage />} />
          <Route path="stats" element={<StatisticsPage />} />
          <Route path="mistakes" element={<MistakesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

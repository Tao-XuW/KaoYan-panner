import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Layout } from "./components/Layout"
import DailySchedulePage from "./pages/DailySchedule"
import Dashboard from "./pages/Dashboard"
import PlanOverviewPage from "./pages/PlanOverview"
import SettingsPage from "./pages/Settings"
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

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<DailySchedulePage />} />
          <Route path="plan" element={<PlanOverviewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Layout } from "./components/Layout"
import DailySchedulePage from "./pages/DailySchedule"
import Dashboard from "./pages/Dashboard"
import PlanOverviewPage from "./pages/PlanOverview"
import SettingsPage from "./pages/Settings"

export default function App() {
  return (
    <BrowserRouter>
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

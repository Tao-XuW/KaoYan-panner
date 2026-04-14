import { NavLink, Outlet } from "react-router-dom"
import { BarChart3, BookOpen, CalendarClock, CircleAlert, Home, ListChecks, Settings } from "lucide-react"

const tabs = [
  { to: "/", label: "首页", icon: Home, end: true },
  { to: "/tasks", label: "计时", icon: ListChecks, end: false },
  { to: "/schedule", label: "时间表", icon: CalendarClock, end: false },
  { to: "/plan", label: "计划", icon: BookOpen, end: false },
  { to: "/stats", label: "统计", icon: BarChart3, end: false },
  { to: "/mistakes", label: "错题", icon: CircleAlert, end: false },
  { to: "/settings", label: "设置", icon: Settings, end: false },
] as const

export function Layout() {
  return (
    <div className="min-h-svh w-full bg-[#F8FAFC] text-left text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </div>
      <nav
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-slate-200/60 bg-white/65 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl backdrop-saturate-150 dark:border-slate-700/80 dark:bg-slate-900/70"
        aria-label="主导航"
      >
        <div className="mx-auto flex w-full max-w-[480px] items-stretch justify-around px-1 pt-1.5">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`
              }
            >
              <Icon className="size-6 shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

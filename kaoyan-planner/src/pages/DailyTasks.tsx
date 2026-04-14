import { useEffect, useMemo } from "react"
import dayjs from "dayjs"
import { Pause, Play, Trash2 } from "lucide-react"

import { usePomodoroStore } from "../store/usePomodoroStore"

export default function DailyTasksPage() {
  const focusMinutes = usePomodoroStore((s) => s.focusMinutes)
  const breakMinutes = usePomodoroStore((s) => s.breakMinutes)
  const setFocusMinutes = usePomodoroStore((s) => s.setFocusMinutes)
  const setBreakMinutes = usePomodoroStore((s) => s.setBreakMinutes)
  const sessions = usePomodoroStore((s) => s.sessions)
  const removeSession = usePomodoroStore((s) => s.removeSession)
  const isRunning = usePomodoroStore((s) => s.isRunning)
  const isBreak = usePomodoroStore((s) => s.isBreak)
  const leftSeconds = usePomodoroStore((s) => s.leftSeconds)
  const toggleRunning = usePomodoroStore((s) => s.toggleRunning)
  const tickTimer = usePomodoroStore((s) => s.tickTimer)
  const endTimerWithConfirm = usePomodoroStore((s) => s.endTimerWithConfirm)

  const today = dayjs().format("YYYY-MM-DD")

  useEffect(() => {
    tickTimer()
    const id = window.setInterval(tickTimer, 1000)
    return () => window.clearInterval(id)
  }, [tickTimer])

  const todaySessions = useMemo(
    () => sessions.filter((s) => s.date === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [sessions, today],
  )

  const totalFocusSecondsToday = useMemo(
    () => todaySessions.reduce((acc, s) => acc + s.seconds, 0),
    [todaySessions],
  )

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-[100px] pt-4">
      <h1 className="mb-4 text-xl font-bold">计时栏目</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold">番茄钟</h2>
        <p className="mt-1 text-xs text-slate-500">
          {isBreak ? "休息中" : "专注中"} · 今日累计专注{" "}
          {Math.round((totalFocusSecondsToday / 3600) * 10) / 10} 小时
        </p>
        <p className="mt-3 text-center text-4xl font-bold tabular-nums">
          {String(Math.floor(leftSeconds / 60)).padStart(2, "0")}:
          {String(leftSeconds % 60).padStart(2, "0")}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={toggleRunning}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isRunning ? "暂停" : "开始"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("确认结束本次计时吗？")) {
                return
              }
              endTimerWithConfirm()
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            结束
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <label className="space-y-1">
            <span className="block text-xs text-slate-500">专注分钟</span>
            <input
              type="number"
              min={10}
              max={90}
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number.parseInt(e.target.value, 10) || 25)}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs text-slate-500">休息分钟</span>
            <input
              type="number"
              min={3}
              max={30}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number.parseInt(e.target.value, 10) || 5)}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold">今日计时记录（{todaySessions.length} 次）</h2>
        <ul className="mt-3 space-y-2">
          {todaySessions.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-700"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {dayjs(s.createdAt).format("HH:mm")} 完成一次专注
                  </p>
                  <p className="text-xs text-slate-500">
                    用时 {Math.round((s.seconds / 60) * 10) / 10} 分钟
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSession(s.id)}
                  className="inline-flex items-center gap-1 rounded border border-rose-300 px-2 py-1 text-xs text-rose-500"
                >
                  <Trash2 className="size-3.5" />
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import { Link } from "react-router-dom"
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts"
import { ChevronRight } from "lucide-react"

import { useScheduleStore } from "../store/useScheduleStore"
import { useSettingsStore } from "../store/useSettingsStore"
import {
  SUBJECT_RING_META,
  aggregateSubjectProgress,
  computeCheckInStreak,
  getWeekCalendarCells,
} from "../utils/scheduleStats"
import type { TimeSlotTask } from "../types"

dayjs.locale("zh-cn")

function parseDayBoundary(dateStr: string, time: string): number {
  const [h, m] = time.split(":").map((x) => Number.parseInt(x, 10))
  const [y, mo, d] = dateStr.split("-").map((x) => Number.parseInt(x, 10))
  return new Date(y, mo - 1, d, h, m).getTime()
}

function getCurrentSlot(
  slots: TimeSlotTask[],
  dateStr: string,
): TimeSlotTask | null {
  const today = dayjs().format("YYYY-MM-DD")
  if (dateStr !== today) {
    return null
  }
  const now = Date.now()
  for (const slot of slots) {
    const start = parseDayBoundary(dateStr, slot.startTime)
    const end = parseDayBoundary(dateStr, slot.endTime)
    if (now >= start && now < end) {
      return slot
    }
  }
  return null
}

function SubjectRadialRing({
  name,
  percent,
  color,
}: {
  name: string
  percent: number
  color: string
}) {
  const v = Math.min(100, Math.max(0, percent))
  const data = [{ name: "p", value: v, fill: color }]

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-[100px] w-full max-w-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
            barSize={9}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "#cbd5e1" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <span className="text-center text-[11px] font-medium text-slate-600 dark:text-slate-300">
        {name}
      </span>
      <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {v}%
      </span>
    </div>
  )
}

export default function Dashboard() {
  const [tick, setTick] = useState(0)
  const examDate = useSettingsStore((s) => s.examDate)
  const schedulesByDate = useScheduleStore((s) => s.schedulesByDate)
  const getScheduleByDate = useScheduleStore((s) => s.getScheduleByDate)

  const todayKey = dayjs().format("YYYY-MM-DD")

  useEffect(() => {
    getScheduleByDate(todayKey)
  }, [getScheduleByDate, todayKey])

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000)
    return () => window.clearInterval(t)
  }, [])

  const schedule = schedulesByDate[todayKey]

  const currentSlot = useMemo(() => {
    if (!schedule?.slots.length) {
      return null
    }
    return getCurrentSlot(schedule.slots, todayKey)
  }, [schedule, todayKey, tick])

  const slotProgress = useMemo(() => {
    if (!currentSlot?.criteria.length) {
      return { checked: 0, total: 0 }
    }
    const checked = currentSlot.criteria.filter((c) => c.checked).length
    return { checked, total: currentSlot.criteria.length }
  }, [currentSlot])

  const subjectStats = useMemo(
    () => aggregateSubjectProgress(schedulesByDate),
    [schedulesByDate],
  )

  const streak = useMemo(
    () => computeCheckInStreak(schedulesByDate),
    [schedulesByDate],
  )

  const weekCells = useMemo(
    () => getWeekCalendarCells(schedulesByDate),
    [schedulesByDate],
  )

  const daysLeft = useMemo(() => {
    const exam = dayjs(examDate).startOf("day")
    const today = dayjs().startOf("day")
    const d = exam.diff(today, "day")
    return Math.max(0, d)
  }, [examDate, tick])

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-24 pt-4">
      {/* 1. 倒计时 */}
      <section className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-6 text-white shadow-lg shadow-blue-600/30">
        <p className="text-center text-sm font-medium text-white/90">
          距离考研初试还有
        </p>
        <p className="mt-2 text-center">
          <span className="text-[3rem] font-extrabold tabular-nums tracking-tight text-white">
            {daysLeft}
          </span>
          <span className="ml-1 text-xl font-semibold">天</span>
        </p>
        <p className="mt-2 text-center text-xs text-white/75">
          考试日期：{examDate}（可在设置中修改）
        </p>
      </section>

      {/* 2. 当前时段 */}
      <section className="mb-5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md shadow-slate-200/50 dark:border-slate-600/80 dark:bg-[#1E293B] dark:shadow-none">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          当前时段
        </h2>
        {currentSlot ? (
          <>
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              {currentSlot.startTime} – {currentSlot.endTime}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                {currentSlot.icon}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {currentSlot.subject}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {currentSlot.title}
                </p>
              </div>
            </div>
            {!currentSlot.isRestPeriod && currentSlot.criteria.length > 0 ? (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                达标进度：{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {slotProgress.checked}/{slotProgress.total}
                </span>{" "}
                项达标
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                休息时段，无达标项
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            当前不在计划时段内，或今日尚未加载时间表。
          </p>
        )}
        <Link
          to="/schedule"
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          进入时间表
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </section>

      {/* 3. 四科进度环 */}
      <section className="mb-5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md shadow-slate-200/50 dark:border-slate-600/80 dark:bg-[#1E293B] dark:shadow-none">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          四科进度
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          基于历史所有天的达标项打钩统计
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SUBJECT_RING_META.map((meta) => (
            <SubjectRadialRing
              key={meta.id}
              name={meta.name}
              color={meta.color}
              percent={subjectStats[meta.id].percent}
            />
          ))}
        </div>
      </section>

      {/* 4. 本周打卡 */}
      <section className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md shadow-slate-200/50 dark:border-slate-600/80 dark:bg-[#1E293B] dark:shadow-none">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          本周打卡
        </h2>
        <div className="mt-4 flex justify-between gap-1">
          {weekCells.map((cell) => (
            <div
              key={cell.dateKey}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {cell.label}
              </span>
              <div
                className={`flex size-9 items-center justify-center rounded-lg border-2 transition-colors ${
                  cell.isToday
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50"
                    : "border-transparent bg-slate-50 dark:bg-slate-800/80"
                }`}
              >
                {cell.hasRecord ? (
                  <span className="size-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                ) : (
                  <span className="size-2.5 rounded-full border border-slate-200 bg-slate-50" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm font-medium text-slate-700 dark:text-slate-200">
          🔥 连续打卡 {streak} 天
        </p>
      </section>
    </div>
  )
}

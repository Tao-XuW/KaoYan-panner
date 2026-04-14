import { useEffect, useMemo, useRef, useState } from "react"
import dayjs from "dayjs"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useScheduleStore } from "../store/useScheduleStore"
import { useExamRecordStore, type ExamSubjectKey } from "../store/useExamRecordStore"
import { useMistakeStore } from "../store/useMistakeStore"
import { usePomodoroStore } from "../store/usePomodoroStore"
import { computeStudyHoursFromSchedule } from "../utils/scheduleStats"

const HISTORY_START_DATE = "2026-04-01"

export default function StatisticsPage() {
  const schedules = useScheduleStore((s) => s.schedulesByDate)
  const records = useExamRecordStore((s) => s.records)
  const setSubjectScore = useExamRecordStore((s) => s.setSubjectScore)
  const removeRecord = useExamRecordStore((s) => s.removeRecord)
  const mistakes = useMistakeStore((s) => s.items)
  const pomodoroSessions = usePomodoroStore((s) => s.sessions)

  const [year, setYear] = useState(2026)
  const [scoreSubject, setScoreSubject] = useState<ExamSubjectKey>("politics")
  const [scoreValue, setScoreValue] = useState(0)

  const historyDurationData = useMemo(() => {
    const timerByDate = new Map<string, number>()
    for (const s of pomodoroSessions) {
      timerByDate.set(s.date, (timerByDate.get(s.date) ?? 0) + s.seconds / 3600)
    }
    const out: { date: string; 学习时长: number }[] = []
    const start = dayjs(HISTORY_START_DATE).startOf("day")
    const today = dayjs().startOf("day")
    const totalDays = Math.max(0, today.diff(start, "day"))
    for (let i = 0; i <= totalDays; i++) {
      const d = start.add(i, "day").format("YYYY-MM-DD")
      const sch = schedules[d]
      const scheduleHours = sch ? computeStudyHoursFromSchedule(sch) : 0
      const timerHours = timerByDate.get(d) ?? 0
      out.push({
        date: dayjs(d).format("MM-DD"),
        学习时长: Math.round((scheduleHours + timerHours) * 10) / 10,
      })
    }
    return out
  }, [schedules, pomodoroSessions])

  const totalStudyHours = useMemo(
    () =>
      Math.round(
        historyDurationData.reduce((acc, item) => acc + item.学习时长, 0) * 10,
      ) / 10,
    [historyDurationData],
  )

  const historyChartWidth = useMemo(
    () => Math.max(640, historyDurationData.length * 28),
    [historyDurationData.length],
  )
  const historyMaxHours = useMemo(() => {
    const max = historyDurationData.reduce((acc, x) => Math.max(acc, x.学习时长), 0)
    const rounded = Math.ceil(max * 2) / 2
    return Math.max(1, rounded)
  }, [historyDurationData])
  const historyYAxisTicks = useMemo(() => {
    const ticks: number[] = []
    for (let v = 0; v <= historyMaxHours + 0.0001; v += 0.5) {
      ticks.push(Math.round(v * 10) / 10)
    }
    return ticks
  }, [historyMaxHours])
  const historyScrollRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
  })

  useEffect(() => {
    const el = historyScrollRef.current
    if (!el) {
      return
    }
    el.scrollLeft = el.scrollWidth
  }, [historyChartWidth])

  const onPointerDown = (clientX: number) => {
    const el = historyScrollRef.current
    if (!el) {
      return
    }
    dragRef.current.active = true
    dragRef.current.startX = clientX
    dragRef.current.startScrollLeft = el.scrollLeft
  }

  const onPointerMove = (clientX: number) => {
    const el = historyScrollRef.current
    if (!el || !dragRef.current.active) {
      return
    }
    const dx = clientX - dragRef.current.startX
    el.scrollLeft = dragRef.current.startScrollLeft - dx
  }

  const onPointerUp = () => {
    dragRef.current.active = false
  }

  const mistakePie = useMemo(() => {
    const acc = new Map<string, number>()
    for (const m of mistakes) {
      acc.set(m.subject, (acc.get(m.subject) ?? 0) + 1)
    }
    return Array.from(acc.entries()).map(([name, value]) => ({ name, value }))
  }, [mistakes])

  const scoreTrend = useMemo(() => {
    const byYear = new Map<
      number,
      { year: string; 政治: number; 英语二: number; 数学二: number; 专业课408: number; 总分: number }
    >()
    for (const r of records) {
      byYear.set(r.year, {
        year: String(r.year),
        政治: r.politics,
        英语二: r.english,
        数学二: r.math,
        专业课408: r.cs408,
        总分:
          (r.politics ?? 0) +
          (r.english ?? 0) +
          (r.math ?? 0) +
          (r.cs408 ?? 0),
      })
    }
    return Array.from(byYear.values()).sort((a, b) => Number(a.year) - Number(b.year))
  }, [records])

  const scoreCharts = [
    { key: "政治", color: "#DC2626" },
    { key: "英语二", color: "#8B5CF6" },
    { key: "数学二", color: "#F59E0B" },
    { key: "专业课408", color: "#2563EB" },
    { key: "总分", color: "#16A34A" },
  ] as const

  useEffect(() => {
    const existing = records
      .filter((r) => r.year === year)
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    if (!existing) {
      setScoreValue(0)
      return
    }
    setScoreValue(existing[scoreSubject] ?? 0)
  }, [records, year, scoreSubject])

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-[100px] pt-4">
      <h1 className="mb-4 text-xl font-bold">统计分析</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">历史学习时长（4/1 至今）</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="size-2 rounded-full bg-emerald-600" />
              学习时长
            </span>
            <span className="text-xs font-medium tabular-nums text-blue-600 dark:text-blue-400">
              累计 {totalStudyHours} 小时
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          左右滑动可查看更早日期学习时长
        </p>
        <div className="mt-3">
          <div
            ref={historyScrollRef}
            className="min-w-0 cursor-grab overflow-x-auto select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onMouseDown={(e) => onPointerDown(e.clientX)}
            onMouseMove={(e) => onPointerMove(e.clientX)}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={(e) => onPointerDown(e.touches[0]?.clientX ?? 0)}
            onTouchMove={(e) => onPointerMove(e.touches[0]?.clientX ?? 0)}
            onTouchEnd={onPointerUp}
          >
            <div style={{ width: historyChartWidth, height: 240 }}>
              <LineChart width={historyChartWidth} height={240} data={historyDurationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={Math.ceil(historyDurationData.length / 14)} />
                <YAxis hide domain={[0, historyMaxHours]} ticks={historyYAxisTicks} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="学习时长"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold">错题科目分布</h2>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={mistakePie} dataKey="value" nameKey="name" outerRadius={80} fill="#8B5CF6" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold">真题得分管理</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <label className="space-y-1">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">年份</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value) || 2026)}
              className="w-full rounded border px-2 py-1 text-xs dark:bg-slate-900"
            />
          </label>
          <label className="space-y-1">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">科目</span>
            <select
              value={scoreSubject}
              onChange={(e) =>
                setScoreSubject(e.target.value as ExamSubjectKey)
              }
              className="w-full rounded border px-2 py-1 text-xs dark:bg-slate-900"
            >
              <option value="politics">政治</option>
              <option value="english">英语二</option>
              <option value="math">数学二</option>
              <option value="cs408">408专业课</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">分数</span>
            <input
              type="number"
              value={scoreValue}
              onChange={(e) => setScoreValue(Number(e.target.value) || 0)}
              className="w-full rounded border px-2 py-1 text-xs dark:bg-slate-900"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => setSubjectScore(year, scoreSubject, scoreValue)}
          className="mt-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          保存该科分数
        </button>
        <div className="mt-3 space-y-3">
          {scoreCharts.map((chart) => (
            <div
              key={chart.key}
              className="rounded-xl border border-slate-100 p-2.5 dark:border-slate-700"
            >
              <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {chart.key}
              </p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={chart.key}
                      stroke={chart.color}
                      strokeWidth={chart.key === "总分" ? 3 : 2}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-3 space-y-2">
          {records
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((r) => {
              const total =
                (r.politics ?? 0) +
                (r.english ?? 0) +
                (r.math ?? 0) +
                (r.cs408 ?? 0)
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs dark:border-slate-700"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {r.year} 真题 · 总分 {total}
                    </p>
                    <p className="truncate text-slate-500 dark:text-slate-400">
                      政{r.politics ?? "--"} / 英{r.english ?? "--"} / 数
                      {r.math ?? "--"} / 408 {r.cs408 ?? "--"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRecord(r.id)}
                    className="shrink-0 rounded border border-rose-300 px-2 py-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    删除
                  </button>
                </li>
              )
            })}
        </ul>
      </section>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import { useSearchParams } from "react-router-dom"

dayjs.locale("zh-cn")
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

import { CompletionCelebration } from "../components/CompletionCelebration"
import { TimeSlotCard } from "../components/TimeSlotCard"
import { Phase } from "../types"
import type { SlotStatus, TimeSlotTask } from "../types"
import { useScheduleStore } from "../store/useScheduleStore"
import { computeStudyHoursFromSchedule } from "../utils/scheduleStats"

const PHASE_LABEL: Record<Phase, string> = {
  [Phase.Foundation]: "阶段一：强化基础",
  [Phase.Enhancement]: "阶段二：强化提升",
  [Phase.PastExams]: "阶段三：真题冲刺",
  [Phase.FinalSprint]: "阶段四：考前冲刺",
}

function parseDayBoundary(dateStr: string, time: string): number {
  const [h, m] = time.split(":").map((x) => Number.parseInt(x, 10))
  const [y, mo, d] = dateStr.split("-").map((x) => Number.parseInt(x, 10))
  return new Date(y, mo - 1, d, h, m).getTime()
}

/** 所选日期为今天时，返回系统时间所在的时段 id（左闭右开 [start, end)） */
function getCurrentSlotId(
  slots: TimeSlotTask[],
  dateStr: string,
): string | null {
  const today = dayjs().format("YYYY-MM-DD")
  if (dateStr !== today) {
    return null
  }
  const now = Date.now()
  for (const slot of slots) {
    const start = parseDayBoundary(dateStr, slot.startTime)
    const end = parseDayBoundary(dateStr, slot.endTime)
    if (now >= start && now < end) {
      return slot.id
    }
  }
  return null
}

function CompletionRing({
  percent,
  size = 112,
  stroke = 10,
}: {
  percent: number
  size?: number
  stroke?: number
}) {
  const p = Math.min(100, Math.max(0, percent))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (p / 100) * c

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0 -rotate-90"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-slate-200 dark:stroke-slate-600"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-blue-500 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:stroke-blue-400"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

function bottomEncourageMessage(rate: number): string {
  if (rate >= 90) {
    return "🎉 今日学习非常棒！"
  }
  if (rate >= 70) {
    return "💪 继续加油！"
  }
  return "⚠️ 今天需要加把劲"
}

export default function DailySchedulePage() {
  const [searchParams] = useSearchParams()
  const initDate = searchParams.get("date") ?? dayjs().format("YYYY-MM-DD")
  const [selectedDate, setSelectedDate] = useState(() => initDate)
  const [timeTick, setTimeTick] = useState(0)
  const [celebrateOpen, setCelebrateOpen] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const slotRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const prevRateRef = useRef(-1)

  const dateKey = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate],
  )

  const getScheduleByDate = useScheduleStore((s) => s.getScheduleByDate)
  const toggleCriterion = useScheduleStore((s) => s.toggleCriterion)
  const updateSlotStatus = useScheduleStore((s) => s.updateSlotStatus)
  const updateSlotNotes = useScheduleStore((s) => s.updateSlotNotes)
  const schedule = useScheduleStore((s) => s.schedulesByDate[dateKey])

  useEffect(() => {
    getScheduleByDate(dateKey)
  }, [dateKey, getScheduleByDate])

  useEffect(() => {
    const t = window.setInterval(() => setTimeTick((n) => n + 1), 30_000)
    return () => window.clearInterval(t)
  }, [])

  const rate = schedule?.completionRate ?? 0

  useEffect(() => {
    prevRateRef.current = -1
    setCelebrateOpen(false)
  }, [dateKey])

  useEffect(() => {
    if (rate >= 90 && prevRateRef.current < 90) {
      setCelebrateOpen(true)
    }
    prevRateRef.current = rate
  }, [rate])

  const dismissCelebrate = useCallback(() => {
    setCelebrateOpen(false)
  }, [])

  const currentSlotId = useMemo(() => {
    if (!schedule?.slots.length) {
      return null
    }
    return getCurrentSlotId(schedule.slots, dateKey)
  }, [schedule?.slots, dateKey, schedule, timeTick])

  useEffect(() => {
    if (!currentSlotId || !schedule) {
      return
    }
    const el = slotRefs.current.get(currentSlotId)
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      })
    }
  }, [currentSlotId, dateKey])

  const displayRate = Math.round(rate)
  const checked = schedule?.checkedCriteria ?? 0
  const total = schedule?.totalCriteria ?? 0
  const phase = schedule?.phase
  const studyHours = useMemo(
    () => computeStudyHoursFromSchedule(schedule),
    [schedule],
  )

  const setSlotRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      slotRefs.current.set(id, el)
    } else {
      slotRefs.current.delete(id)
    }
  }, [])

  const goPrevDay = () => {
    setSelectedDate((d) => dayjs(d).subtract(1, "day").format("YYYY-MM-DD"))
  }
  const goNextDay = () => {
    setSelectedDate((d) => dayjs(d).add(1, "day").format("YYYY-MM-DD"))
  }

  const openPicker = () => {
    const el = dateInputRef.current
    if (!el) {
      return
    }
    if (typeof el.showPicker === "function") {
      el.showPicker()
    } else {
      el.click()
    }
  }

  const dateTitle = dayjs(dateKey).format("YYYY年M月D日 dddd")

  if (!schedule) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500 dark:text-slate-400">
        加载中…
      </div>
    )
  }

  return (
    <div className="min-h-svh w-full bg-[#F8FAFC] pb-40 text-left text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
      <CompletionCelebration
        show={celebrateOpen && rate >= 90}
        onDismiss={dismissCelebrate}
      />
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95">
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrevDay}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="上一天"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={openPicker}
                className="flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Calendar className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="min-w-0 truncate text-base font-semibold tabular-nums">
                  {dateTitle}
                </span>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={dateKey}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="sr-only"
                aria-label="选择日期"
              />
              <button
                type="button"
                onClick={goNextDay}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="下一天"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            {phase ? (
              <span className="inline-flex max-w-[min(100%,11rem)] shrink-0 items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/80 dark:text-blue-200">
                {PHASE_LABEL[phase]}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="relative">
              <CompletionRing percent={rate} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {displayRate}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  今日完成率
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {checked}/{total} 项达标
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                已完成 / 总计达标要求
              </p>
              <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                累计学习 {studyHours} 小时
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[480px] px-4 py-6">
        <div className="relative pl-2">
          <div
            className="absolute bottom-4 left-[11px] top-4 w-0.5 bg-slate-200 dark:bg-slate-600"
            aria-hidden
          />
          <ul className="relative z-10 flex flex-col gap-4">
            {schedule.slots.map((slot) => (
              <li
                key={slot.id}
                ref={(el) => setSlotRef(slot.id, el)}
                className="pl-5"
              >
                <TimeSlotCard
                  slot={slot}
                  scheduleDate={dateKey}
                  isCurrentSlot={currentSlotId === slot.id}
                  onToggleCriterion={(criterionId) =>
                    toggleCriterion(dateKey, slot.id, criterionId)
                  }
                  onStatusChange={(status: SlotStatus) =>
                    updateSlotStatus(dateKey, slot.id, status)
                  }
                  onNotesChange={(notes) =>
                    updateSlotNotes(dateKey, slot.id, notes)
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-2">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
              style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-200">
            {bottomEncourageMessage(rate)}
          </p>
        </div>
      </div>
    </div>
  )
}

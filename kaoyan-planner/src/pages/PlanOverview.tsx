import { Fragment, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  MapPin,
} from "lucide-react"

import {
  PHASES,
  REFERENCE_BOOKS,
  SUBJECT_TAG,
  type PhaseDef,
  type SubjectTagKey,
  buildTimelineEvents,
} from "../data/planOverviewData"
import { useSettingsStore } from "../store/useSettingsStore"
import { usePhaseMilestonesStore } from "../store/usePhaseMilestonesStore"
import {
  daysRemainingInPhase,
  getCurrentPhaseOrNull,
  getPrepContext,
  isPhaseCompleted,
  isPhaseCurrent,
  phaseDateLabel,
  weekIndexInPhase,
  type PrepMode,
} from "../utils/planPhaseContext"

const cardCls =
  "rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50 dark:border-slate-600/80 dark:bg-[#1E293B] dark:shadow-none"

function SubjectWeekLine({ row }: { row: PhaseDef["weeks"][number] }) {
  const keys: SubjectTagKey[] = ["ds", "co", "os", "cn"]
  return (
    <li className="border-b border-slate-100 py-2.5 text-[11px] leading-relaxed last:border-b-0 dark:border-slate-600/80">
      <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <span className="shrink-0 font-bold tabular-nums text-slate-700 dark:text-slate-200">
          W{row.week}
        </span>
        <span className="text-slate-300 dark:text-slate-600" aria-hidden>
          |
        </span>
        {keys.map((k) => {
          const t = SUBJECT_TAG[k]
          return (
            <span
              key={k}
              className="inline-flex min-w-0 max-w-full items-baseline gap-0.5"
            >
              <span aria-hidden>{t.emoji}</span>
              <span className="font-semibold" style={{ color: t.color }}>
                {t.label}:
              </span>
              <span className="text-slate-700 dark:text-slate-200">{row[k]}</span>
            </span>
          )
        })}
      </p>
    </li>
  )
}

function PhaseStepper({
  phases,
  mode,
  today,
  onSelectPhase,
}: {
  phases: PhaseDef[]
  mode: PrepMode
  today: string
  onSelectPhase: (index: number) => void
}) {
  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-[520px] items-start px-1">
        {phases.map((phase, i) => {
          const completed =
            mode === "after" || (mode === "during" && isPhaseCompleted(today, phase))
          const current = mode === "during" && isPhaseCurrent(today, phase, mode)

          const dotDone = mode === "after" || completed
          const dotCurrent = current && mode === "during"

          return (
            <Fragment key={phase.id}>
              <div className="flex min-w-[72px] flex-1 flex-col items-center">
                <button
                  type="button"
                  onClick={() => onSelectPhase(i)}
                  className="flex w-full flex-col items-center gap-1.5 rounded-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="relative flex h-9 w-9 items-center justify-center">
                    {dotDone ? (
                      <CheckCircle
                        className="size-9 text-emerald-500"
                        strokeWidth={2}
                        aria-hidden
                      />
                    ) : dotCurrent ? (
                      <span className="relative flex size-9 items-center justify-center">
                        <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/40" />
                        <span className="relative size-8 rounded-full bg-blue-600 shadow-md shadow-blue-600/40" />
                      </span>
                    ) : (
                      <Circle
                        className="size-8 text-slate-300 dark:text-slate-500"
                        strokeWidth={2}
                        aria-hidden
                      />
                    )}
                  </div>
                  <span className="max-w-[100px] text-[11px] font-semibold leading-tight text-slate-800 dark:text-slate-100">
                    {phase.name}
                  </span>
                  <span className="max-w-[110px] text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                    {phaseDateLabel(phase.start, phase.end)}
                  </span>
                </button>
              </div>
              {i < phases.length - 1 ? (
                <SegmentLine mode={mode} today={today} leftPhase={phase} />
              ) : null}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

function SegmentLine({
  mode,
  today,
  leftPhase,
}: {
  mode: PrepMode
  today: string
  leftPhase: PhaseDef
}) {
  let bg = "bg-slate-200 dark:bg-slate-600"
  if (mode === "after") {
    bg = "bg-emerald-500"
  } else if (mode === "during") {
    if (isPhaseCompleted(today, leftPhase)) {
      bg = "bg-emerald-500"
    } else if (isPhaseCurrent(today, leftPhase, mode)) {
      bg = "bg-blue-500"
    }
  }
  return (
    <div className="mt-[18px] flex min-w-[10px] flex-1 items-center self-start px-0.5">
      <div className={`h-0.5 w-full rounded-full ${bg}`} />
    </div>
  )
}

function CurrentPhaseBanner({
  ctx,
  phase,
}: {
  ctx: ReturnType<typeof getPrepContext>
  phase: PhaseDef | null
}) {
  if (ctx.mode === "before") {
    const start = dayjs(PHASES[0]!.start)
    const days = start.diff(dayjs(ctx.today), "day")
    return (
      <section className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-6 text-white shadow-lg shadow-blue-600/30">
        <p className="flex items-center gap-2 text-sm font-medium text-white/95">
          <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
          当前阶段：备考尚未开始
        </p>
        <p className="mt-2 text-xs text-white/80">
          距离 {start.format("YYYY年M月D日")} 还有{" "}
          <span className="font-semibold tabular-nums text-white">{days}</span>{" "}
          天
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/90">
          可先浏览下方四阶段计划，8 月 1 日起按计划执行。
        </p>
      </section>
    )
  }

  if (ctx.mode === "after") {
    return (
      <section className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-6 text-white shadow-lg shadow-blue-600/30">
        <p className="flex items-center gap-2 text-sm font-medium text-white/95">
          <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
          当前阶段：初试已结束
        </p>
        <p className="mt-2 text-sm text-white/85">辛苦了，祝上岸顺利！</p>
      </section>
    )
  }

  if (ctx.mode === "during" && !phase) {
    return (
      <section className="mb-4 overflow-hidden rounded-2xl border border-amber-200/90 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100">
        当前日期未匹配到任一阶段，请检查设置中的<strong>考试日期</strong>是否与阶段划分一致。
      </section>
    )
  }

  if (!phase) {
    return null
  }

  const w = weekIndexInPhase(ctx.today, phase)
  const left = daysRemainingInPhase(ctx.today, phase)

  return (
    <section className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-6 text-white shadow-lg shadow-blue-600/30">
      <p className="flex items-center gap-2 text-sm font-medium text-white/95">
        <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
        当前阶段：{phase.name}
      </p>
      <p className="mt-2 text-xs text-white/85">
        第{" "}
        <span className="font-semibold tabular-nums text-white">{w}</span> 周 /
        共 {phase.totalWeeks} 周 — 剩余{" "}
        <span className="font-semibold tabular-nums text-white">{left}</span>{" "}
        天
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/95">
        {phase.goalOneLiner}
      </p>
    </section>
  )
}

function PhaseDetailCard({
  phase,
  expanded,
  onToggle,
}: {
  phase: PhaseDef
  expanded: boolean
  onToggle: () => void
}) {
  const checked = usePhaseMilestonesStore((s) => s.checked)
  const toggleMilestone = usePhaseMilestonesStore((s) => s.toggleMilestone)

  return (
    <section
      id={`plan-phase-card-${phase.index}`}
      className={`${cardCls} scroll-mt-6 overflow-hidden`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 p-4 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500">
            {phase.numeral}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {phase.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {phaseDateLabel(phase.start, phase.end)}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="size-5 shrink-0 text-slate-400" aria-hidden />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-slate-400" aria-hidden />
        )}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-slate-100 px-4 pb-4 pt-0 dark:border-slate-600/80">
            <h4 className="mb-2 mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Calendar className="size-3.5" aria-hidden />
              每周计划
            </h4>
            <ul className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 dark:border-slate-600/60 dark:bg-slate-800/40">
              {phase.weeks.map((row) => (
                <SubjectWeekLine key={row.week} row={row} />
              ))}
            </ul>

            <h4 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              本阶段关键目标
            </h4>
            <ul className="space-y-2">
              {phase.milestoneIds.map((id, idx) => (
                <li key={id}>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-800 transition hover:border-blue-200 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-blue-500/50">
                    <input
                      type="checkbox"
                      checked={checked[id] ?? false}
                      onChange={() => toggleMilestone(id)}
                      className="slot-criterion-checkbox mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{phase.milestoneLabels[idx]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineSection({
  today,
  examDate,
}: {
  today: string
  examDate: string
}) {
  const events = useMemo(() => buildTimelineEvents(examDate), [examDate])

  const nearestId = useMemo(() => {
    const t = dayjs(today).startOf("day")
    let best = events[0]!.id
    let bestDiff = Infinity
    for (const e of events) {
      const d = Math.abs(dayjs(e.sortDate).startOf("day").diff(t, "day"))
      if (d < bestDiff) {
        bestDiff = d
        best = e.id
      }
    }
    return best
  }, [events, today])

  return (
    <section className={`${cardCls} p-4`}>
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
        <Calendar className="size-4 text-blue-600 dark:text-blue-400" aria-hidden />
        关键时间节点
      </h2>
      <ul className="relative mt-4 space-y-0 pl-2">
        <div
          className="absolute bottom-2 left-[7px] top-2 w-px bg-slate-200 dark:bg-slate-600"
          aria-hidden
        />
        {events.map((e) => {
          const evDay = dayjs(e.sortDate).startOf("day")
          const t = dayjs(today).startOf("day")
          const isPast = evDay.isBefore(t, "day")
          const isFuture = evDay.isAfter(t, "day")
          const isNearest = e.id === nearestId
          const icon = e.isExam ? "🎯" : "📌"
          return (
            <li
              key={e.id}
              className={`relative flex gap-3 pb-5 pl-5 last:pb-0 ${
                isNearest
                  ? "-mx-1 rounded-lg border border-blue-300 bg-blue-50/80 px-2 py-1 dark:border-blue-500/50 dark:bg-blue-950/40"
                  : ""
              }`}
            >
              <span
                className={`absolute left-0 top-1.5 size-2 rounded-full ring-2 ring-white dark:ring-[#1E293B] ${
                  isPast
                    ? "bg-slate-300"
                    : isFuture
                      ? "bg-blue-500"
                      : "bg-amber-500"
                }`}
              />
              <span className="text-sm" aria-hidden>
                {icon}
              </span>
              <span
                className={`text-sm leading-snug ${
                  isPast
                    ? "text-slate-400 dark:text-slate-500"
                    : "font-medium text-blue-800 dark:text-blue-200"
                }`}
              >
                {e.label}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function PlanOverviewPage() {
  const examDate = useSettingsStore((s) => s.examDate)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const today = useMemo(
    () => dayjs().format("YYYY-MM-DD"),
    [tick],
  )

  const ctx = useMemo(
    () => getPrepContext(today, examDate),
    [today, examDate],
  )

  const currentPhase = getCurrentPhaseOrNull(ctx)

  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setExpanded({ [ctx.defaultExpandedPhaseIndex]: true })
  }, [ctx.defaultExpandedPhaseIndex, examDate])

  const scrollToPhase = (index: number) => {
    document
      .getElementById(`plan-phase-card-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-[100px] pt-4">
      <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        备考计划
      </h1>

      <section className={`${cardCls} mb-4 p-4`}>
        <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          阶段进度
        </h2>
        <PhaseStepper
          phases={ctx.phases}
          mode={ctx.mode}
          today={ctx.today}
          onSelectPhase={scrollToPhase}
        />
      </section>

      <CurrentPhaseBanner ctx={ctx} phase={currentPhase} />

      <div className="flex flex-col gap-4">
        {ctx.phases.map((phase) => (
          <PhaseDetailCard
            key={phase.id}
            phase={phase}
            expanded={expanded[phase.index] ?? false}
            onToggle={() =>
              setExpanded((prev) => ({
                ...prev,
                [phase.index]: !prev[phase.index],
              }))
            }
          />
        ))}

        <section className={`${cardCls} p-4`}>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" aria-hidden />
            参考书目
          </h2>
          <ul className="mt-3 space-y-2.5">
            {REFERENCE_BOOKS.map((b) => (
              <li
                key={b.key}
                className="rounded-lg border border-slate-100 bg-slate-50/80 py-2 pl-3 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-100"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: SUBJECT_TAG[b.key].color,
                }}
              >
                <span aria-hidden>{SUBJECT_TAG[b.key].emoji} </span>
                {b.line}
              </li>
            ))}
          </ul>
        </section>

        <TimelineSection today={today} examDate={examDate} />
      </div>
    </div>
  )
}

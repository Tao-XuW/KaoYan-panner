import { Fragment, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Circle,
  MapPin,
} from "lucide-react"

import {
  CS408_CHAPTERS,
  CS408_SUB_TAG,
  MAIN_WEEK_TAG,
  PHASES,
  REFERENCE_CS408,
  REFERENCE_MAIN,
  type MainWeekTagKey,
  type PhaseDef,
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

function SubjectWeekLine({
  row,
  phaseIndex,
}: {
  row: PhaseDef["weeks"][number]
  phaseIndex: number
}) {
  const weekStatus = usePhaseMilestonesStore((s) => s.weekStatus)
  const setWeekStatus = usePhaseMilestonesStore((s) => s.setWeekStatus)
  const statusId = `phase-${phaseIndex}-week-${row.week}`
  const status = weekStatus[statusId] ?? "todo"
  const progress = status === "done" ? 100 : status === "reviewing" ? 60 : 0
  const keys: MainWeekTagKey[] = ["math", "cs408", "english", "politics"]
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
          const t = MAIN_WEEK_TAG[k]
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
      <div className="mt-2 flex items-center gap-2">
        <select
          value={status}
          onChange={(e) =>
            setWeekStatus(
              statusId,
              e.target.value as "todo" | "reviewing" | "done",
            )
          }
          className="w-24 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11px] text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="todo">待学</option>
          <option value="reviewing">复习中</option>
          <option value="done">已学完</option>
        </select>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-10 text-right tabular-nums text-slate-500 dark:text-slate-400">
          {progress}%
        </span>
      </div>
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
                      <span className="inline-flex size-8 rounded-full bg-blue-600 shadow-md shadow-blue-600/35" />
                    ) : dotCurrent ? (
                      <span className="relative flex size-9 items-center justify-center">
                        <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/40" />
                        <span className="relative size-8 rounded-full bg-blue-500 shadow-[0_0_0_5px_rgba(59,130,246,0.25)]" />
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
  const chapterStatus = usePhaseMilestonesStore((s) => s.chapterStatus)
  const setChapterStatus = usePhaseMilestonesStore((s) => s.setChapterStatus)
  const [chaptersOpen, setChaptersOpen] = useState(false)

  const chapterProgressBySubject = useMemo(() => {
    const toPercent = (vals: ("todo" | "reviewing" | "done")[]) => {
      if (!vals.length) {
        return 0
      }
      const sum = vals.reduce((acc, v) => {
        if (v === "done") {
          return acc + 1
        }
        if (v === "reviewing") {
          return acc + 0.6
        }
        return acc
      }, 0)
      return Math.round((sum / vals.length) * 100)
    }

    const ds = CS408_CHAPTERS.ds.map(
      (_, idx) =>
        chapterStatus[`phase-${phase.index}-cs408-ds-${idx}`] ?? "todo",
    )
    const co = CS408_CHAPTERS.co.map(
      (_, idx) =>
        chapterStatus[`phase-${phase.index}-cs408-co-${idx}`] ?? "todo",
    )
    const os = CS408_CHAPTERS.os.map(
      (_, idx) =>
        chapterStatus[`phase-${phase.index}-cs408-os-${idx}`] ?? "todo",
    )
    const cn = CS408_CHAPTERS.cn.map(
      (_, idx) =>
        chapterStatus[`phase-${phase.index}-cs408-cn-${idx}`] ?? "todo",
    )

    return {
      ds: toPercent(ds),
      co: toPercent(co),
      os: toPercent(os),
      cn: toPercent(cn),
    }
  }, [chapterStatus, phase.index])

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
                <SubjectWeekLine
                  key={row.week}
                  row={row}
                  phaseIndex={phase.index}
                />
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-600/60 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => setChaptersOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  408 章节进度追踪
                </h4>
                {chaptersOpen ? (
                  <ChevronUp className="size-4 text-slate-400" />
                ) : (
                  <ChevronDown className="size-4 text-slate-400" />
                )}
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: chaptersOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="mt-3 space-y-3">
                    {(
                      [
                        ["ds", "数据结构"],
                        ["co", "计组"],
                        ["os", "操作系统"],
                        ["cn", "计网"],
                      ] as const
                    ).map(([key, label]) => {
                      const chapters = CS408_CHAPTERS[key]
                      const subjectProgress = chapterProgressBySubject[key]
                      return (
                        <div
                          key={key}
                          className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-600 dark:bg-slate-800/60"
                        >
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {label}
                            </span>
                            <span className="tabular-nums text-slate-500 dark:text-slate-400">
                              {subjectProgress}%
                            </span>
                          </div>
                          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${subjectProgress}%` }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            {chapters.map((chapter, idx) => {
                              const chapterId = `phase-${phase.index}-cs408-${key}-${idx}`
                              const status = chapterStatus[chapterId] ?? "todo"
                              return (
                                <div
                                  key={chapterId}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span className="min-w-0 truncate text-[11px] text-slate-600 dark:text-slate-300">
                                    {chapter}
                                  </span>
                                  <select
                                    value={status}
                                    onChange={(e) =>
                                      setChapterStatus(
                                        chapterId,
                                        e.target.value as
                                          | "todo"
                                          | "reviewing"
                                          | "done",
                                      )
                                    }
                                    className="w-20 shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-700 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200"
                                  >
                                    <option value="todo">待学</option>
                                    <option value="reviewing">复习中</option>
                                    <option value="done">已学</option>
                                  </select>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

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
  const bookChapterProgress = usePhaseMilestonesStore((s) => s.bookChapterProgress)
  const setBookChapterProgress = usePhaseMilestonesStore(
    (s) => s.setBookChapterProgress,
  )
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
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            公共课与 408 总览
          </p>
          <ul className="mt-3 space-y-2.5">
            {REFERENCE_MAIN.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-100"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: MAIN_WEEK_TAG[b.key].color,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span aria-hidden>{MAIN_WEEK_TAG[b.key].emoji} </span>
                    {b.line}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                      第
                      {Math.min(
                        b.totalChapters,
                        Math.max(0, bookChapterProgress[b.id] ?? 0),
                      )}
                      章 / 共{b.totalChapters}章
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={b.totalChapters}
                      value={Math.min(
                        b.totalChapters,
                        Math.max(0, bookChapterProgress[b.id] ?? 0),
                      )}
                      onChange={(e) =>
                        setBookChapterProgress(
                          b.id,
                          Math.min(
                            b.totalChapters,
                            Math.max(0, Number.parseInt(e.target.value, 10) || 0),
                          ),
                        )
                      }
                      className="mt-1 w-16 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-center text-[11px] tabular-nums text-slate-700 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            408 专业课（细分）
          </p>
          <ul className="mt-2 space-y-2">
            {REFERENCE_CS408.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-[13px] text-slate-800 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-100"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: CS408_SUB_TAG[b.key].color,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span aria-hidden>{CS408_SUB_TAG[b.key].emoji} </span>
                    {b.line}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                      第
                      {Math.min(
                        b.totalChapters,
                        Math.max(0, bookChapterProgress[b.id] ?? 0),
                      )}
                      章 / 共{b.totalChapters}章
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={b.totalChapters}
                      value={Math.min(
                        b.totalChapters,
                        Math.max(0, bookChapterProgress[b.id] ?? 0),
                      )}
                      onChange={(e) =>
                        setBookChapterProgress(
                          b.id,
                          Math.min(
                            b.totalChapters,
                            Math.max(0, Number.parseInt(e.target.value, 10) || 0),
                          ),
                        )
                      }
                      className="mt-1 w-16 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-center text-[11px] tabular-nums text-slate-700 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <TimelineSection today={today} examDate={examDate} />
      </div>
    </div>
  )
}

import dayjs from "dayjs"

import {
  PHASES,
  type PhaseDef,
  phase4EndForExam,
} from "../data/planOverviewData"

export type PrepMode = "before" | "during" | "after"

export interface PrepContext {
  mode: PrepMode
  /** 备考期内当前所处阶段 0–3；备考前/后均为 null */
  currentPhaseIndex: 0 | 1 | 2 | 3 | null
  /** 用于默认展开卡片：备考前 0、期内 current、考后 3 */
  defaultExpandedPhaseIndex: 0 | 1 | 2 | 3
  today: string
  examDate: string
  phases: PhaseDef[]
}

function resolvePhases(examDate: string): PhaseDef[] {
  const end4 = phase4EndForExam(examDate)
  return PHASES.map((p, i) =>
    i === 3 ? { ...p, end: end4 } : p,
  ) as PhaseDef[]
}

/** 判断今天相对考试日：早于备考、备考中、已考完（考试日当日仍算备考中） */
export function getPrepContext(
  todayInput: string,
  examDate: string,
): PrepContext {
  const today = dayjs(todayInput).startOf("day")
  const exam = dayjs(examDate).startOf("day")
  const prepStart = dayjs(PHASES[0].start).startOf("day")

  const phases = resolvePhases(examDate)

  if (today.isAfter(exam, "day")) {
    return {
      mode: "after",
      currentPhaseIndex: null,
      defaultExpandedPhaseIndex: 3,
      today: today.format("YYYY-MM-DD"),
      examDate: exam.format("YYYY-MM-DD"),
      phases,
    }
  }

  if (today.isBefore(prepStart, "day")) {
    return {
      mode: "before",
      currentPhaseIndex: null,
      defaultExpandedPhaseIndex: 0,
      today: today.format("YYYY-MM-DD"),
      examDate: exam.format("YYYY-MM-DD"),
      phases,
    }
  }

  let currentPhaseIndex: 0 | 1 | 2 | 3 | null = null
  for (const p of phases) {
    const start = dayjs(p.start).startOf("day")
    const end = dayjs(p.end).startOf("day")
    if (
      (today.isAfter(start, "day") || today.isSame(start, "day")) &&
      (today.isBefore(end, "day") || today.isSame(end, "day"))
    ) {
      currentPhaseIndex = p.index
      break
    }
  }

  const resolvedIndex: 0 | 1 | 2 | 3 = currentPhaseIndex ?? 0

  return {
    mode: "during",
    currentPhaseIndex,
    defaultExpandedPhaseIndex: resolvedIndex,
    today: today.format("YYYY-MM-DD"),
    examDate: exam.format("YYYY-MM-DD"),
    phases,
  }
}

/** 与 CurrentPhaseBanner 共用：备考期内当前阶段对象 */
export function getCurrentPhaseOrNull(
  ctx: PrepContext,
): PhaseDef | null {
  if (ctx.mode !== "during" || ctx.currentPhaseIndex === null) {
    return null
  }
  return ctx.phases[ctx.currentPhaseIndex] ?? null
}

export function phaseDateLabel(start: string, end: string): string {
  const a = dayjs(start)
  const b = dayjs(end)
  return `${a.format("M月D日")} — ${b.format("M月D日")}`
}

/** 当前阶段内第几周（1..totalWeeks），备考期外返回 1 */
export function weekIndexInPhase(
  todayInput: string,
  phase: PhaseDef,
): number {
  const t = dayjs(todayInput).startOf("day")
  const start = dayjs(phase.start).startOf("day")
  const days = Math.max(0, t.diff(start, "day"))
  const w = Math.floor(days / 7) + 1
  return Math.min(phase.totalWeeks, Math.max(1, w))
}

export function daysRemainingInPhase(
  todayInput: string,
  phase: PhaseDef,
): number {
  const t = dayjs(todayInput).startOf("day")
  const end = dayjs(phase.end).startOf("day")
  return Math.max(0, end.diff(t, "day") + 1)
}

/** Stepper：某阶段是否已全部结束 */
export function isPhaseCompleted(
  todayInput: string,
  phase: PhaseDef,
): boolean {
  const t = dayjs(todayInput).startOf("day")
  const end = dayjs(phase.end).startOf("day")
  return t.isAfter(end, "day")
}

/** Stepper：阶段是否尚未开始 */
export function isPhaseNotStarted(
  todayInput: string,
  phase: PhaseDef,
): boolean {
  const t = dayjs(todayInput).startOf("day")
  const start = dayjs(phase.start).startOf("day")
  return t.isBefore(start, "day")
}

export function isPhaseCurrent(
  todayInput: string,
  phase: PhaseDef,
  mode: PrepMode,
): boolean {
  if (mode !== "during") {
    return false
  }
  const t = dayjs(todayInput).startOf("day")
  const start = dayjs(phase.start).startOf("day")
  const end = dayjs(phase.end).startOf("day")
  return (
    (t.isAfter(start, "day") || t.isSame(start, "day")) &&
    (t.isBefore(end, "day") || t.isSame(end, "day"))
  )
}

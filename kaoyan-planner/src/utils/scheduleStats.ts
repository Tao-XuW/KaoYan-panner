import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"

import type { DailySchedule } from "../types"

import { mapSlotSubjectToMainRingId, type MainRingId } from "./subjectTheme"

dayjs.extend(isoWeek)

export const SUBJECT_RING_META = [
  {
    id: "politics" as const,
    name: "政治",
    color: "#DC2626",
  },
  {
    id: "english" as const,
    name: "英语二",
    color: "#8B5CF6",
  },
  {
    id: "math" as const,
    name: "数学二",
    color: "#F59E0B",
  },
  {
    id: "cs408" as const,
    name: "408专业课",
    color: "#2563EB",
  },
]

export type SubjectRingId = MainRingId

/** 历史所有天中，各科达标项打钩占比（仅统计四大科目时段） */
export function aggregateSubjectProgress(
  schedulesByDate: Record<string, DailySchedule>,
): Record<
  SubjectRingId,
  { checked: number; total: number; percent: number }
> {
  const acc = {
    politics: { checked: 0, total: 0 },
    english: { checked: 0, total: 0 },
    math: { checked: 0, total: 0 },
    cs408: { checked: 0, total: 0 },
  }

  for (const sch of Object.values(schedulesByDate)) {
    for (const slot of sch.slots) {
      if (slot.isRestPeriod) {
        continue
      }
      const key = mapSlotSubjectToMainRingId(slot.subject)
      if (!key) {
        continue
      }
      for (const c of slot.criteria) {
        acc[key].total += 1
        if (c.checked) {
          acc[key].checked += 1
        }
      }
    }
  }

  const out = {} as Record<
    SubjectRingId,
    { checked: number; total: number; percent: number }
  >
  for (const id of Object.keys(acc) as SubjectRingId[]) {
    const { checked, total } = acc[id]
    const percent =
      total === 0 ? 0 : Math.round((checked / total) * 1000) / 10
    out[id] = { checked, total, percent }
  }
  return out
}

function hasCheckIn(
  schedulesByDate: Record<string, DailySchedule>,
  dateKey: string,
): boolean {
  const sch = schedulesByDate[dateKey]
  return Boolean(sch && sch.checkedCriteria > 0)
}

/** 连续打卡：从「今天若已打卡则含今天，否则从昨天起」向前统计 */
export function computeCheckInStreak(
  schedulesByDate: Record<string, DailySchedule>,
): number {
  let d = dayjs().startOf("day")
  if (!hasCheckIn(schedulesByDate, d.format("YYYY-MM-DD"))) {
    d = d.subtract(1, "day")
  }
  let count = 0
  const min = dayjs("2020-01-01")
  while (d.isAfter(min) || d.isSame(min, "day")) {
    if (!hasCheckIn(schedulesByDate, d.format("YYYY-MM-DD"))) {
      break
    }
    count += 1
    d = d.subtract(1, "day")
  }
  return count
}

export type WeekDayCell = {
  dateKey: string
  label: string
  isToday: boolean
  hasRecord: boolean
  status: "completed" | "failed" | "rest"
}

/** 本周（周一至周日）每日是否有打卡记录 */
const WEEKDAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

export function getWeekCalendarCells(
  schedulesByDate: Record<string, DailySchedule>,
  now: dayjs.Dayjs = dayjs(),
): WeekDayCell[] {
  const start = now.startOf("isoWeek")
  const cells: WeekDayCell[] = []
  for (let i = 0; i < 7; i++) {
    const d = start.add(i, "day")
    const dateKey = d.format("YYYY-MM-DD")
    cells.push({
      dateKey,
      label: WEEKDAY_LABELS[i] ?? d.format("M/D"),
      isToday: d.isSame(now, "day"),
      hasRecord: hasCheckIn(schedulesByDate, dateKey),
      status: resolveWeekDayStatus(schedulesByDate, dateKey, d, now),
    })
  }
  return cells
}

function resolveWeekDayStatus(
  schedulesByDate: Record<string, DailySchedule>,
  dateKey: string,
  day: dayjs.Dayjs,
  now: dayjs.Dayjs,
): "completed" | "failed" | "rest" {
  if (day.isAfter(now, "day")) {
    return "rest"
  }
  const sch = schedulesByDate[dateKey]
  if (!sch || sch.totalCriteria <= 0) {
    return "rest"
  }
  if (sch.checkedCriteria >= sch.totalCriteria) {
    return "completed"
  }
  return "failed"
}

function parseMinuteOfDay(time: string): number {
  const [h, m] = time.split(":").map((x) => Number.parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return 0
  }
  return h * 60 + m
}

function statusWeight(status: string): number {
  if (status === "completed") {
    return 1
  }
  if (status === "partial") {
    return 0.6
  }
  if (status === "in_progress") {
    return 0.35
  }
  return 0
}

/** 按时段完成度估算某日实际学习时长（小时） */
export function computeStudyHoursFromSchedule(
  schedule?: DailySchedule,
): number {
  if (!schedule) {
    return 0
  }
  let minutes = 0
  for (const slot of schedule.slots) {
    if (slot.isRestPeriod) {
      continue
    }
    const span = Math.max(0, parseMinuteOfDay(slot.endTime) - parseMinuteOfDay(slot.startTime))
    if (span <= 0) {
      continue
    }
    const total = slot.criteria.length
    const checked = slot.criteria.filter((c) => c.checked).length
    const ratio = total > 0 ? checked / total : statusWeight(slot.status)
    minutes += span * Math.min(1, Math.max(0, ratio))
  }
  return Math.round((minutes / 60) * 10) / 10
}

export type HistoryDayCell = {
  dateKey: string
  completionRate: number
  checkedCriteria: number
  totalCriteria: number
}

/** 最近 N 天（含今天）的历史完成数据，按日期倒序 */
export function getRecentHistoryCells(
  schedulesByDate: Record<string, DailySchedule>,
  days = 7,
  now: dayjs.Dayjs = dayjs(),
): HistoryDayCell[] {
  const out: HistoryDayCell[] = []
  for (let i = 0; i < days; i++) {
    const d = now.subtract(i, "day")
    const dateKey = d.format("YYYY-MM-DD")
    const sch = schedulesByDate[dateKey]
    out.push({
      dateKey,
      completionRate: sch?.completionRate ?? 0,
      checkedCriteria: sch?.checkedCriteria ?? 0,
      totalCriteria: sch?.totalCriteria ?? 0,
    })
  }
  return out
}

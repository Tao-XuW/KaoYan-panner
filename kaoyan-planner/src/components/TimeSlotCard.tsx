import { useMemo, useState } from "react"
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
} from "lucide-react"

import type { SlotStatus, TimeSlotTask } from "../types"

export type TimeSlotCardProps = {
  slot: TimeSlotTask
  onToggleCriterion: (criterionId: string) => void
  onStatusChange: (status: SlotStatus) => void
  onNotesChange: (notes: string) => void
  isCurrentSlot: boolean
  /** 用于判断时段是否已过期（淡红提示）；不传则不做基于时间的过期判断 */
  scheduleDate?: string
}

function isSlotEnded(dateStr: string, endTime: string): boolean {
  const parts = dateStr.split("-").map((p) => Number.parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return false
  }
  const [y, m, d] = parts
  const [hh, mm] = endTime.split(":").map((p) => Number.parseInt(p, 10))
  const end = new Date(y, m - 1, d, hh, mm)
  return Date.now() > end.getTime()
}

function statusEmoji(status: SlotStatus): string {
  switch (status) {
    case "completed":
      return "✅"
    case "partial":
      return "🟡"
    case "failed":
      return "❌"
    case "not_started":
      return "⬜"
    case "in_progress":
      return "🔵"
    case "skipped":
      return "⏭️"
    default:
      return "⬜"
  }
}

const STATUS_OPTIONS: SlotStatus[] = [
  "not_started",
  "in_progress",
  "completed",
  "partial",
  "failed",
  "skipped",
]

export function TimeSlotCard({
  slot,
  onToggleCriterion,
  onStatusChange,
  onNotesChange,
  isCurrentSlot,
  scheduleDate,
}: TimeSlotCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)

  const { criteria } = slot
  const checkedCount = criteria.filter((c) => c.checked).length
  const totalCriteria = criteria.length
  const progress =
    totalCriteria === 0 ? 0 : Math.round((checkedCount / totalCriteria) * 100)

  const expiredIncomplete = useMemo(() => {
    if (slot.isRestPeriod || !scheduleDate) {
      return false
    }
    if (slot.status === "completed" || slot.status === "skipped") {
      return false
    }
    return isSlotEnded(scheduleDate, slot.endTime)
  }, [scheduleDate, slot])

  const allDone = slot.status === "completed"

  const surfaceClass = useMemo(() => {
    if (slot.isRestPeriod) {
      return "bg-slate-100/90 border-slate-200/80 dark:bg-slate-800/90 dark:border-slate-600/80"
    }
    if (allDone) {
      return "bg-emerald-50/90 border-emerald-200/70 dark:bg-emerald-950/40 dark:border-emerald-800/60"
    }
    if (expiredIncomplete) {
      return "bg-rose-50/90 border-rose-200/70 dark:bg-rose-950/35 dark:border-rose-900/50"
    }
    return "bg-white border-slate-200/80 dark:bg-[#1E293B] dark:border-slate-600/80"
  }, [allDone, expiredIncomplete, slot.isRestPeriod])

  const timeRange = `${slot.startTime}–${slot.endTime}`

  if (slot.isRestPeriod) {
    return (
      <div
        className={`flex min-h-[3.25rem] items-stretch gap-0 rounded-xl border ${surfaceClass} shadow-sm`}
      >
        <div className="flex w-[5.75rem] shrink-0 flex-col justify-center border-r-2 border-slate-200/90 px-2 py-2 text-right dark:border-slate-600/80">
          <div className="flex items-center justify-end gap-1 text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">
            <Clock className="size-3 shrink-0 text-slate-400" aria-hidden />
            <span>{timeRange}</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
          <span className="text-lg leading-none" aria-hidden>
            {slot.icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {slot.title}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border shadow-sm transition-colors ${surfaceClass} ${
        isCurrentSlot
          ? "border-l-4 border-l-blue-500 ring-1 ring-blue-200/60 dark:border-l-blue-400 dark:ring-blue-500/25"
          : "border-l border-l-transparent"
      }`}
    >
      {isCurrentSlot ? (
        <span
          className="absolute left-2 top-3 z-10 size-2.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.25)] animate-pulse dark:bg-blue-400"
          aria-hidden
        />
      ) : null}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={`flex w-full min-w-0 items-stretch gap-0 text-left ${isCurrentSlot ? "pl-7" : "pl-0"}`}
        aria-expanded={expanded}
      >
        <div className="flex w-[5.75rem] shrink-0 flex-col justify-center border-r-2 border-slate-200/90 px-2 py-3 text-right dark:border-slate-600/80">
          <div className="flex items-center justify-end gap-1 text-[11px] font-semibold tabular-nums leading-tight text-slate-700 dark:text-slate-200">
            <Clock className="size-3 shrink-0 text-slate-400" aria-hidden />
            <span>{slot.startTime}</span>
          </div>
          <div className="flex items-center justify-end py-0.5 text-slate-300 dark:text-slate-600">
            <Circle className="size-1.5 fill-current" aria-hidden />
          </div>
          <div className="text-[11px] font-medium tabular-nums leading-tight text-slate-500 dark:text-slate-400">
            {slot.endTime}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-3 pr-2">
          <span className="text-xl leading-none" aria-hidden>
            {slot.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {slot.subject}
              </span>
              <span
                className="text-base leading-none"
                title={slot.status}
                aria-label={`状态：${slot.status}`}
              >
                {statusEmoji(slot.status)}
              </span>
              {expiredIncomplete ? (
                <AlertCircle
                  className="size-4 shrink-0 text-rose-500 dark:text-rose-400"
                  aria-hidden
                />
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {slot.title}
            </p>
          </div>
          <div className="shrink-0 text-slate-400 dark:text-slate-500">
            {expanded ? (
              <ChevronUp className="size-5" aria-hidden />
            ) : (
              <ChevronDown className="size-5" aria-hidden />
            )}
          </div>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="space-y-4 border-t border-slate-200/80 px-3 pb-4 pt-2 pl-[calc(5.75rem+0.75rem)] sm:pl-[calc(5.75rem+1rem)] dark:border-slate-600/80">
            {slot.description ? (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {slot.description}
              </p>
            ) : null}

            <ul className="space-y-2">
              {criteria.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={c.checked}
                      onChange={() => onToggleCriterion(c.id)}
                      className="slot-criterion-checkbox mt-0.5 size-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-500 dark:text-emerald-500"
                    />
                    <span
                      className={`min-w-0 text-sm leading-snug ${
                        c.checked
                          ? "text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-500"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {c.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {totalCriteria > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    达标进度
                    {progress === 100 ? (
                      <Check
                        className="size-3.5 text-emerald-600 dark:text-emerald-400"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    ) : null}
                  </span>
                  <span className="tabular-nums">
                    {checkedCount}/{totalCriteria}（{progress}%）
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/80">
                  <div
                    className="h-full rounded-full bg-emerald-500/90 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-emerald-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                时段状态
              </label>
              <select
                value={slot.status}
                onChange={(e) =>
                  onStatusChange(e.target.value as SlotStatus)
                }
                className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 dark:border-slate-600/80 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setNotesOpen((n) => !n)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <span>备注</span>
                {notesOpen ? (
                  <ChevronUp className="size-4 shrink-0" aria-hidden />
                ) : (
                  <ChevronDown className="size-4 shrink-0" aria-hidden />
                )}
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                  notesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="border-t border-slate-200/80 px-3 pb-3 pt-1 dark:border-slate-600/80">
                    <textarea
                      value={slot.notes ?? ""}
                      onChange={(e) => onNotesChange(e.target.value)}
                      placeholder="记录本节执行情况、难点、心情…"
                      rows={3}
                      className="w-full resize-y rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

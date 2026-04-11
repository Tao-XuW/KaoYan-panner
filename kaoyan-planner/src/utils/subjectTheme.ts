import { MainSubject } from "../types"

/** 全局四科配色（与 PRD 一致） */
export const MAIN_SUBJECT_COLORS: Record<MainSubject, string> = {
  [MainSubject.Politics]: "#DC2626",
  [MainSubject.English]: "#8B5CF6",
  [MainSubject.Math]: "#F59E0B",
  [MainSubject.CS408]: "#2563EB",
}

export type MainRingId = "politics" | "english" | "math" | "cs408"

export const MAIN_SUBJECT_RING_META: {
  id: MainRingId
  name: string
  subject: MainSubject
  color: string
  emoji: string
}[] = [
  {
    id: "politics",
    name: "政治",
    subject: MainSubject.Politics,
    color: MAIN_SUBJECT_COLORS[MainSubject.Politics],
    emoji: "🔴",
  },
  {
    id: "english",
    name: "英语二",
    subject: MainSubject.English,
    color: MAIN_SUBJECT_COLORS[MainSubject.English],
    emoji: "📖",
  },
  {
    id: "math",
    name: "数学二",
    subject: MainSubject.Math,
    color: MAIN_SUBJECT_COLORS[MainSubject.Math],
    emoji: "📐",
  },
  {
    id: "cs408",
    name: "408专业课",
    subject: MainSubject.CS408,
    color: MAIN_SUBJECT_COLORS[MainSubject.CS408],
    emoji: "📘",
  },
]

/** 时间表 slot.subject → 进度环 id；综合/休息等不参与四科统计 */
export function mapSlotSubjectToMainRingId(
  subject: string,
): MainRingId | null {
  if (subject === MainSubject.Politics) {
    return "politics"
  }
  if (subject === MainSubject.English) {
    return "english"
  }
  if (subject === MainSubject.Math) {
    return "math"
  }
  if (subject === MainSubject.CS408) {
    return "cs408"
  }
  return null
}

/** 左侧强调条颜色（非休息、非综合） */
export function subjectAccentBorderColor(subject: string): string | undefined {
  const id = mapSlotSubjectToMainRingId(subject)
  if (!id) {
    return undefined
  }
  const meta = MAIN_SUBJECT_RING_META.find((m) => m.id === id)
  return meta?.color
}

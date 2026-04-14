/** 考研初试四大科目（政/英/数/408） */
export const MainSubject = {
  Politics: "政治",
  English: "英语二",
  Math: "数学二",
  CS408: "408专业课",
} as const

export type MainSubject = (typeof MainSubject)[keyof typeof MainSubject]

/** 408 四门子科目（王道细分） */
export const CS408Sub = {
  DataStructure: "数据结构",
  ComputerOrganization: "计组",
  OperatingSystem: "操作系统",
  ComputerNetwork: "计网",
} as const

export type CS408Sub = (typeof CS408Sub)[keyof typeof CS408Sub]

/** @deprecated 请优先使用 MainSubject / CS408Sub；保留别名供迁移期引用 */
export const Subject = {
  DataStructure: CS408Sub.DataStructure,
  ComputerOrganization: CS408Sub.ComputerOrganization,
  OperatingSystem: CS408Sub.OperatingSystem,
  ComputerNetwork: CS408Sub.ComputerNetwork,
} as const

export type Subject = (typeof Subject)[keyof typeof Subject]

export const Phase = {
  Foundation: "强化基础",
  Enhancement: "强化提升",
  PastExams: "真题冲刺",
  FinalSprint: "考前冲刺",
} as const

export type Phase = (typeof Phase)[keyof typeof Phase]

export type SlotStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "partial"
  | "failed"
  | "skipped"

export const SLOT_STATUS_LABEL: Record<SlotStatus, string> = {
  not_started: "未开始",
  in_progress: "进行中",
  completed: "已完成",
  partial: "部分完成",
  failed: "未完成",
  skipped: "已跳过",
}

export interface Criterion {
  id: string
  text: string
  checked: boolean
}

export interface TimeSlotTask {
  id: string
  startTime: string
  endTime: string
  /** 使用 MainSubject 四科字符串，或「综合」「休息」等非统计科目 */
  subject: string
  icon: string
  title: string
  description: string
  criteria: Criterion[]
  status: SlotStatus
  notes?: string
  isRestPeriod: boolean
}

export interface DailySchedule {
  date: string
  phase: Phase
  slots: TimeSlotTask[]
  completionRate: number
  totalCriteria: number
  checkedCriteria: number
}

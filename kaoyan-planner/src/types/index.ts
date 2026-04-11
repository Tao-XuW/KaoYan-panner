export const Subject = {
  DataStructure: "数据结构",
  ComputerOrganization: "计算机组成原理",
  OperatingSystem: "操作系统",
  ComputerNetwork: "计算机网络",
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

export interface Criterion {
  id: string
  text: string
  checked: boolean
}

export interface TimeSlotTask {
  id: string
  startTime: string
  endTime: string
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

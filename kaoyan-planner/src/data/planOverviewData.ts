/** 备考四阶段静态数据（与 PRD 一致） */

export const SUBJECT_TAG = {
  ds: { emoji: "📘", label: "DS", color: "#4F46E5" },
  co: { emoji: "📕", label: "CO", color: "#DC2626" },
  os: { emoji: "📗", label: "OS", color: "#16A34A" },
  cn: { emoji: "📙", label: "CN", color: "#F59E0B" },
} as const

export type SubjectTagKey = keyof typeof SUBJECT_TAG

export interface WeekRow {
  week: number
  ds: string
  co: string
  os: string
  cn: string
}

export interface PhaseDef {
  id: string
  index: 0 | 1 | 2 | 3
  numeral: string
  name: string
  shortName: string
  /** YYYY-MM-DD */
  start: string
  /** YYYY-MM-DD，阶段四在运行时用考试日覆盖 */
  end: string
  totalWeeks: number
  goalOneLiner: string
  weeks: WeekRow[]
  milestoneIds: readonly string[]
  milestoneLabels: readonly string[]
}

const PHASE1_WEEKS: WeekRow[] = [
  {
    week: 1,
    ds: "线性表（顺序表、链表、栈、队列）",
    co: "系统概述、数据表示",
    os: "进程管理（上）",
    cn: "概述、物理层",
  },
  {
    week: 2,
    ds: "串、数组、特殊矩阵压缩",
    co: "数据运算",
    os: "进程管理（下）、同步互斥",
    cn: "数据链路层",
  },
  {
    week: 3,
    ds: "树与二叉树",
    co: "存储系统",
    os: "内存管理（上）",
    cn: "网络层",
  },
  {
    week: 4,
    ds: "图",
    co: "指令系统",
    os: "内存管理（下）",
    cn: "传输层",
  },
  {
    week: 5,
    ds: "查找",
    co: "CPU",
    os: "文件系统",
    cn: "应用层",
  },
  {
    week: 6,
    ds: "排序",
    co: "总线与 I/O",
    os: "I/O 管理",
    cn: "全科回顾",
  },
  {
    week: 7,
    ds: "全科第一轮复习回顾",
    co: "王道章节测验",
    os: "错题整理",
    cn: "—",
  },
]

const PHASE2_WEEKS: WeekRow[] = [
  {
    week: 1,
    ds: "习题强化（线性表+树）",
    co: "习题（数据表示+运算）",
    os: "（配套）",
    cn: "（配套）",
  },
  {
    week: 2,
    ds: "习题（图+查找）",
    co: "习题（存储系统）",
    os: "（配套）",
    cn: "（配套）",
  },
  {
    week: 3,
    ds: "习题（排序综合）",
    co: "习题（CPU+流水线）",
    os: "（配套）",
    cn: "（配套）",
  },
  {
    week: 4,
    ds: "OS 习题强化（进程+内存）",
    co: "计网习题（链路层+网络层）",
    os: "进程+内存",
    cn: "链路+网络层",
  },
  {
    week: 5,
    ds: "（巩固数据结构）",
    co: "（巩固计组）",
    os: "OS 习题（文件+I/O）",
    cn: "计网习题（传输层+应用层）",
  },
  {
    week: 6,
    ds: "四科专题突破（Cache/PV/TCP/图）",
    co: "Cache、流水线",
    os: "PV 操作",
    cn: "TCP 与图综合",
  },
  {
    week: 7,
    ds: "全科二轮复习",
    co: "薄弱点补强",
    os: "错题二刷",
    cn: "错题二刷",
  },
]

const PHASE3_WEEKS: WeekRow[] = [
  {
    week: 1,
    ds: "做题+复盘",
    co: "做题+复盘",
    os: "做题+复盘",
    cn: "2019–2020 真题各一套",
  },
  {
    week: 2,
    ds: "做题+复盘",
    co: "做题+复盘",
    os: "做题+复盘",
    cn: "2021–2022 真题各一套",
  },
  {
    week: 3,
    ds: "做题+复盘",
    co: "做题+复盘",
    os: "做题+复盘",
    cn: "2023–2024 真题各一套",
  },
  {
    week: 4,
    ds: "全面复盘",
    co: "全面复盘",
    os: "全面复盘",
    cn: "2025 真题+模拟卷",
  },
  {
    week: 5,
    ds: "错题二刷",
    co: "薄弱科目专项",
    os: "错题二刷",
    cn: "薄弱补强",
  },
]

const PHASE4_WEEKS: WeekRow[] = [
  {
    week: 1,
    ds: "四科思维导图回顾",
    co: "四科思维导图回顾",
    os: "公式速记默写",
    cn: "错题三刷",
  },
  {
    week: 2,
    ds: "选择题保持手感",
    co: "选择题保持手感",
    os: "考前心态调整",
    cn: "考场准备",
  },
]

export const PHASES: readonly PhaseDef[] = [
  {
    id: "phase-1",
    index: 0,
    numeral: "一",
    name: "强化基础",
    shortName: "基础",
    start: "2026-08-01",
    end: "2026-09-15",
    totalWeeks: 7,
    goalOneLiner: "完成四科第一轮系统学习，构建完整知识框架",
    weeks: PHASE1_WEEKS,
    milestoneIds: [
      "m1-ds",
      "m1-co",
      "m1-os",
      "m1-cn",
      "m1-notes",
      "m1-quiz",
    ],
    milestoneLabels: [
      "数据结构一轮完成",
      "计组一轮完成",
      "操作系统一轮完成",
      "计算机网络一轮完成",
      "全科笔记整理完成",
      "第一次章节测验完成",
    ],
  },
  {
    id: "phase-2",
    index: 1,
    numeral: "二",
    name: "强化提升",
    shortName: "提升",
    start: "2026-09-16",
    end: "2026-10-31",
    totalWeeks: 7,
    goalOneLiner: "王道习题全刷，掌握各题型解题方法",
    weeks: PHASE2_WEEKS,
    milestoneIds: ["m2-all-ex", "m2-wrong", "m2-topic", "m2-round2"],
    milestoneLabels: [
      "王道习题全部刷完",
      "错题本建立完成",
      "专题突破完成",
      "二轮复习完成",
    ],
  },
  {
    id: "phase-3",
    index: 2,
    numeral: "三",
    name: "真题冲刺",
    shortName: "真题",
    start: "2026-11-01",
    end: "2026-12-05",
    totalWeeks: 5,
    goalOneLiner: "真题限时训练，查漏补缺，培养考试状态",
    weeks: PHASE3_WEEKS,
    milestoneIds: ["m3-papers", "m3-avg", "m3-review", "m3-weak"],
    milestoneLabels: [
      "7 年真题全部做完",
      "真题平均分≥100",
      "错题全部回顾",
      "薄弱点已补强",
    ],
  },
  {
    id: "phase-4",
    index: 3,
    numeral: "四",
    name: "考前冲刺",
    shortName: "冲刺",
    start: "2026-12-06",
    end: "2026-12-19",
    totalWeeks: 2,
    goalOneLiner: "回顾核心考点，稳定心态，保持手感",
    weeks: PHASE4_WEEKS,
    milestoneIds: ["m4-mind", "m4-formula", "m4-wrong3", "m4-ticket", "m4-kit"],
    milestoneLabels: [
      "思维导图全部完成",
      "公式速记无误",
      "错题三刷完成",
      "准考证已打印",
      "考试物品已准备",
    ],
  },
]

export function phase4EndForExam(examDate: string): string {
  return examDate.trim().slice(0, 10)
}

export const REFERENCE_BOOKS: { key: SubjectTagKey; line: string }[] = [
  { key: "ds", line: "数据结构：王道考研 + 严蔚敏《数据结构》" },
  { key: "co", line: "计算机组成原理：王道考研 + 唐朔飞《计算机组成原理》" },
  { key: "os", line: "操作系统：王道考研 + 汤小丹《计算机操作系统》" },
  { key: "cn", line: "计算机网络：王道考研 + 谢希仁《计算机网络》" },
]

export interface TimelineEvent {
  id: string
  label: string
  sortDate: string
  isExam?: boolean
}

export function buildTimelineEvents(examDate: string): TimelineEvent[] {
  const d = examDate.trim().slice(0, 10)
  return [
    { id: "t1", label: "8月1日 — 备考正式启动", sortDate: "2026-08-01" },
    { id: "t2", label: "9月 — 招生简章发布 / 大纲确认", sortDate: "2026-09-01" },
    { id: "t3", label: "10月10–13日 — 网上预报名", sortDate: "2026-10-10" },
    { id: "t4", label: "10月16–27日 — 正式网上报名", sortDate: "2026-10-16" },
    { id: "t5", label: "11月中旬 — 网上确认", sortDate: "2026-11-15" },
    { id: "t6", label: "12月中旬 — 打印准考证", sortDate: "2026-12-10" },
    {
      id: "t7",
      label: `初试（${d}，以设置为准）`,
      sortDate: d,
      isExam: true,
    },
  ]
}

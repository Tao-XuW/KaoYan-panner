/** 备考四阶段静态数据 — 全科（政/英/数/408） */

import { CS408Sub } from "../types"

/** 计划总览周行：四科并行描述 */
export const MAIN_WEEK_TAG = {
  politics: { emoji: "🔴", label: "政治", color: "#DC2626" },
  english: { emoji: "📖", label: "英语", color: "#8B5CF6" },
  math: { emoji: "📐", label: "数学", color: "#F59E0B" },
  cs408: { emoji: "📘", label: "408", color: "#2563EB" },
} as const

export type MainWeekTagKey = keyof typeof MAIN_WEEK_TAG

/** 408 内部四科展示（参考书等） */
export const CS408_SUB_TAG = {
  ds: { emoji: "📘", label: "DS", color: "#4F46E5" },
  co: { emoji: "📕", label: "CO", color: "#DC2626" },
  os: { emoji: "📗", label: "OS", color: "#16A34A" },
  cn: { emoji: "📙", label: "CN", color: "#F59E0B" },
} as const

export type CS408SubTagKey = keyof typeof CS408_SUB_TAG

export interface WeekRow {
  week: number
  politics: string
  english: string
  math: string
  cs408: string
}

export interface PhaseDef {
  id: string
  index: 0 | 1 | 2 | 3
  numeral: string
  name: string
  shortName: string
  start: string
  end: string
  totalWeeks: number
  goalOneLiner: string
  weeks: WeekRow[]
  milestoneIds: readonly string[]
  milestoneLabels: readonly string[]
}

const P1: WeekRow[] = [
  {
    week: 1,
    politics: "核心考案入门（可选）",
    english: "单词50–80+阅读精读入门",
    math: "高数极限与导数基础",
    cs408: "DS 线性表 + CO 数据表示",
  },
  {
    week: 2,
    politics: "马原基础课（唯物论）",
    english: "单词+05真题阅读1篇精读",
    math: "高数积分与中值定理",
    cs408: "串数组 + CO 运算 + OS 进程上 + CN 物理层",
  },
  {
    week: 3,
    politics: "史纲基础梳理",
    english: "阅读长难句+错题回顾",
    math: "高数定积分应用 + 线代起步",
    cs408: "树与二叉树 + 存储 + OS 内存上 + CN 网络层",
  },
  {
    week: 4,
    politics: "思修法基入门",
    english: "阅读精读+翻译句练习",
    math: "多元函数与二重积分",
    cs408: "图 + 指令 + OS 内存下 + CN 传输层",
  },
  {
    week: 5,
    politics: "毛中特框架了解",
    english: "阅读+新题型入门",
    math: "线代向量与方程组",
    cs408: "查找 + CPU + 文件 + CN 应用层",
  },
  {
    week: 6,
    politics: "当代时政入门",
    english: "作文句型积累",
    math: "线代特征值 + 高数级数",
    cs408: "排序 + I/O + OS 全科 + CN 回顾",
  },
  {
    week: 7,
    politics: "全册知识点过一遍",
    english: "05–15阅读错题回顾",
    math: "高数线代一轮收尾测验",
    cs408: "408 四科一轮回顾+章节测验",
  },
]

const P2: WeekRow[] = [
  {
    week: 1,
    politics: "1000题马原+史纲",
    english: "阅读二刷+单词巩固",
    math: "强化极限与导数专题",
    cs408: "DS+CO 王道习题强化",
  },
  {
    week: 2,
    politics: "1000题毛中特",
    english: "翻译专项",
    math: "积分与中值专题",
    cs408: "图+查找+CO 存储习题",
  },
  {
    week: 3,
    politics: "1000题思修+当代",
    english: "新题型+作文模板积累",
    math: "线代强化+概率（数二相关部分）",
    cs408: "排序综合+CPU流水线习题",
  },
  {
    week: 4,
    politics: "腿姐技巧课+错题",
    english: "作文周练2篇",
    math: "薄弱专题突破",
    cs408: "OS+CN 习题强化",
  },
  {
    week: 5,
    politics: "1000题二刷",
    english: "真题套卷计时（除作文）",
    math: "综合卷模拟",
    cs408: "408 四科综合卷",
  },
  {
    week: 6,
    politics: "错题本回顾",
    english: "作文模板定稿初稿",
    math: "Cache/线代大题专项",
    cs408: "PV/TCP/图 专题突破",
  },
  {
    week: 7,
    politics: "知识点框架复盘",
    english: "真题二刷错题",
    math: "全科二轮收尾",
    cs408: "408 二轮+错题二刷",
  },
]

const P3: WeekRow[] = [
  {
    week: 1,
    politics: "肖八选择题+背诵小册",
    english: "真题模拟+作文周练",
    math: "数学真题2019–2020",
    cs408: "2019–2020 408真题+复盘",
  },
  {
    week: 2,
    politics: "肖八二刷+时政",
    english: "作文模板背诵",
    math: "数学真题2021–2022",
    cs408: "2021–2022 408真题+复盘",
  },
  {
    week: 3,
    politics: "肖四选择题预热",
    english: "全真模拟1套",
    math: "数学真题2023–2024",
    cs408: "2023–2024 408真题+复盘",
  },
  {
    week: 4,
    politics: "肖四到货即背选择",
    english: "作文定稿",
    math: "2025数学真题+薄弱补弱",
    cs408: "2025 408+模拟卷",
  },
  {
    week: 5,
    politics: "肖四大题背诵启动",
    english: "保持阅读手感",
    math: "错题+公式默写",
    cs408: "错题二刷+专项补弱",
  },
]

const P4: WeekRow[] = [
  {
    week: 1,
    politics: "肖四大题核心背诵",
    english: "作文默写+阅读轻量",
    math: "公式本+错题三刷",
    cs408: "四科思维导图+选择题限时",
  },
  {
    week: 2,
    politics: "肖四+时政过最后一遍",
    english: "模板最终默写",
    math: "1–2道综合题手感",
    cs408: "错题浏览+心态调整",
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
    weeks: P1,
    milestoneIds: [
      "m1-math",
      "m1-en",
      "m1-ds",
      "m1-co",
      "m1-os",
      "m1-cn",
      "m1-notes",
      "m1-quiz",
    ],
    milestoneLabels: [
      "高数基础一轮完成",
      "英语真题05–15精读完成",
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
    goalOneLiner: "数学与408强化刷题，英语二刷与政治1000题同步推进",
    weeks: P2,
    milestoneIds: [
      "m2-408-ex",
      "m2-wrong",
      "m2-topic",
      "m2-round2",
      "m2-math-ex",
      "m2-en-2",
      "m2-pol-1000",
    ],
    milestoneLabels: [
      "王道408习题全部刷完",
      "错题本建立完成",
      "专题突破完成",
      "二轮复习完成",
      "数学强化题刷完",
      "英语真题二刷完成",
      "政治1000题完成",
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
    weeks: P3,
    milestoneIds: [
      "m3-408-7y",
      "m3-408-avg",
      "m3-408-review",
      "m3-408-weak",
      "m3-math-all",
      "m3-en-template",
      "m3-x8",
    ],
    milestoneLabels: [
      "7年408真题全部做完",
      "408真题平均分≥100",
      "408错题全部回顾",
      "薄弱点已补强",
      "数学真题做完",
      "英语作文模板定稿",
      "肖八做完",
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
    weeks: P4,
    milestoneIds: [
      "m4-mind",
      "m4-formula408",
      "m4-wrong3",
      "m4-ticket",
      "m4-kit",
      "m4-x4",
      "m4-math-formula",
      "m4-en-write",
    ],
    milestoneLabels: [
      "思维导图全部完成",
      "408公式速记无误",
      "408错题三刷完成",
      "准考证已打印",
      "考试物品已准备",
      "肖四背诵完成",
      "数学公式速记无误",
      "英语作文能默写",
    ],
  },
]

export function phase4EndForExam(examDate: string): string {
  return examDate.trim().slice(0, 10)
}

/** 考研公共课 + 408 总览 */
export const REFERENCE_MAIN: {
  key: MainWeekTagKey
  line: string
}[] = [
  { key: "politics", line: "政治：肖秀荣《精讲精练》+《1000题》+ 后期肖八肖四" },
  { key: "english", line: "英语二：张剑黄皮书真题 + 唐迟阅读 + 王江涛/潘赟作文" },
  { key: "math", line: "数学二：张宇/武忠祥基础+强化 +《660》《880》真题卷" },
  {
    key: "cs408",
    line: "408专业课：王道四册（数据结构/计组/操作系统/计网）为主",
  },
]

/** 408 细分教材 */
export const REFERENCE_CS408: { key: CS408SubTagKey; line: string }[] = [
  { key: "ds", line: `${CS408Sub.DataStructure}：王道 + 严蔚敏《数据结构》` },
  {
    key: "co",
    line: `${CS408Sub.ComputerOrganization}：王道 + 唐朔飞《计算机组成原理》`,
  },
  { key: "os", line: `${CS408Sub.OperatingSystem}：王道 + 汤小丹《操作系统》` },
  {
    key: "cn",
    line: `${CS408Sub.ComputerNetwork}：王道 + 谢希仁《计算机网络》`,
  },
]

export const CS408_CHAPTERS = {
  ds: [
    "绪论与算法复杂度",
    "线性表",
    "栈与队列",
    "串与数组",
    "树与二叉树",
    "图",
    "查找",
    "排序",
  ],
  co: [
    "计算机系统概述",
    "数据表示与运算",
    "存储系统",
    "指令系统",
    "中央处理器",
    "总线",
    "输入输出系统",
  ],
  os: [
    "操作系统概述",
    "进程与线程",
    "处理机调度",
    "同步与互斥",
    "死锁",
    "内存管理",
    "虚拟内存",
    "文件系统",
    "I/O 管理",
  ],
  cn: [
    "计算机网络体系结构",
    "物理层",
    "数据链路层",
    "网络层",
    "传输层",
    "应用层",
    "网络安全与管理",
  ],
} as const

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

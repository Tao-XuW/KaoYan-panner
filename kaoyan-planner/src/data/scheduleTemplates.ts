import type { Criterion, TimeSlotTask } from "../types"
import { Phase } from "../types"

const NOT_STARTED = "not_started" as const

function parseCheckboxTexts(lines: string[]): string[] {
  return lines.map((line) => line.replace(/^□\s*/, "").trim())
}

function makeCriteria(slotId: string, texts: string[]): Criterion[] {
  return parseCheckboxTexts(texts).map((text, i) => ({
    id: `${slotId}-c${i + 1}`,
    text,
    checked: false,
  }))
}

function restSlot(
  id: string,
  startTime: string,
  endTime: string,
  icon: string,
  title: string,
  description: string,
): TimeSlotTask {
  return {
    id,
    startTime,
    endTime,
    subject: "休息",
    icon,
    title,
    description,
    criteria: [],
    status: NOT_STARTED,
    isRestPeriod: true,
  }
}

function taskSlot(
  id: string,
  startTime: string,
  endTime: string,
  subject: string,
  icon: string,
  title: string,
  description: string,
  criteriaLines: string[],
): TimeSlotTask {
  return {
    id,
    startTime,
    endTime,
    subject,
    icon,
    title,
    description,
    criteria: makeCriteria(id, criteriaLines),
    status: NOT_STARTED,
    isRestPeriod: false,
  }
}

/** 阶段一：强化基础期 — 8月1日—9月15日 每日模板 */
export const foundationDailyTemplate: TimeSlotTask[] = [
  restSlot("f-01", "07:00", "07:30", "🌅", "晨起洗漱早餐", "休息时段，无达标要求"),
  taskSlot(
    "f-02",
    "07:30",
    "08:00",
    "英语",
    "📖",
    "英语晨背",
    "词汇与复习",
    ["完成50个单词打卡", "复习昨日生词"],
  ),
  taskSlot(
    "f-03",
    "08:00",
    "09:30",
    "数据结构",
    "📘",
    "数据结构（王道对应章节）",
    "第一轮系统学习",
    [
      "知识点笔记完成",
      "课后选择题正确率≥70%",
      "核心概念能脱稿复述",
    ],
  ),
  restSlot("f-04", "09:30", "09:45", "☕", "休息", "短休"),
  taskSlot(
    "f-05",
    "09:45",
    "11:15",
    "计算机组成原理",
    "📕",
    "计算机组成原理（王道对应章节）",
    "第一轮系统学习",
    [
      "知识点笔记完成",
      "课后选择题正确率≥70%",
      "计算公式能默写",
    ],
  ),
  taskSlot(
    "f-06",
    "11:15",
    "11:30",
    "综合",
    "📝",
    "上午回顾",
    "巩固上午两科",
    ["能列出上午两科各3个核心考点"],
  ),
  restSlot("f-07", "11:30", "13:30", "🍚", "午餐+午休", "休息时段"),
  taskSlot(
    "f-08",
    "13:30",
    "15:00",
    "操作系统",
    "📗",
    "操作系统（王道对应章节）",
    "第一轮系统学习",
    [
      "知识点笔记完成",
      "课后选择题正确率≥70%",
      "PV操作/算法能手写步骤",
    ],
  ),
  restSlot("f-09", "15:00", "15:15", "☕", "休息", "短休"),
  taskSlot(
    "f-10",
    "15:15",
    "16:00",
    "计算机网络",
    "📙",
    "计算机网络（王道对应章节）",
    "第一轮系统学习",
    ["知识点笔记完成", "协议名称/端口/功能能默写"],
  ),
  taskSlot(
    "f-11",
    "16:00",
    "17:30",
    "数学",
    "📐",
    "数学复习",
    "按计划推进",
    ["完成当日计划习题量", "错题记录并标注原因"],
  ),
  restSlot("f-12", "17:30", "18:30", "🍚", "晚餐+散步", "休息时段"),
  taskSlot(
    "f-13",
    "18:30",
    "20:00",
    "408综合",
    "📘📕",
    "专业课刷题",
    "四科巩固",
    [
      "数据结构习题≥10道",
      "计组习题≥8道",
      "错题录入错题本",
    ],
  ),
  restSlot("f-14", "20:00", "20:15", "☕", "休息", "短休"),
  taskSlot(
    "f-15",
    "20:15",
    "21:30",
    "英语",
    "📖",
    "英语阅读精读",
    "阅读与词汇",
    ["完成1篇阅读逐题分析", "生词摘录≥10个"],
  ),
  taskSlot(
    "f-16",
    "21:30",
    "22:00",
    "综合",
    "🌙",
    "每日复盘",
    "总结与计划",
    [
      "今日任务完成率≥80%",
      "明日计划已浏览",
      "错题本已更新",
    ],
  ),
]

/** 阶段二：强化提升期 — 9月16日—10月31日 每日模板（时间段与阶段一类似，刷题为主） */
export const enhancementDailyTemplate: TimeSlotTask[] = [
  restSlot("e-01", "07:00", "07:30", "🌅", "晨起洗漱早餐", "休息时段，无达标要求"),
  taskSlot(
    "e-02",
    "07:30",
    "08:00",
    "英语",
    "📖",
    "英语晨背",
    "词汇与复习",
    ["完成50个单词打卡", "复习昨日生词"],
  ),
  taskSlot(
    "e-03",
    "08:00",
    "09:30",
    "数据结构",
    "📘",
    "数据结构刷题",
    "王道习题为主",
    [
      "选择题≥15道正确率≥80%",
      "综合题≥2道",
      "错题标注知识点",
    ],
  ),
  restSlot("e-04", "09:30", "09:45", "☕", "休息", "短休"),
  taskSlot(
    "e-05",
    "09:45",
    "11:15",
    "计算机组成原理",
    "📕",
    "计算机组成原理刷题",
    "王道习题为主",
    [
      "选择题≥12道正确率≥75%",
      "计算题≥2道",
      "公式默写",
    ],
  ),
  taskSlot(
    "e-06",
    "11:15",
    "11:30",
    "综合",
    "📝",
    "上午回顾",
    "巩固上午两科",
    ["能列出上午两科各3个核心考点"],
  ),
  restSlot("e-07", "11:30", "13:30", "🍚", "午餐+午休", "休息时段"),
  taskSlot(
    "e-08",
    "13:30",
    "15:00",
    "操作系统",
    "📗",
    "操作系统刷题",
    "王道习题为主",
    [
      "选择题≥10道正确率≥80%",
      "PV大题≥1道",
      "页面置换手算≥1道",
    ],
  ),
  restSlot("e-09", "15:00", "15:15", "☕", "休息", "短休"),
  taskSlot(
    "e-10",
    "15:15",
    "16:00",
    "计算机网络",
    "📙",
    "计算机网络刷题",
    "王道习题为主",
    ["选择题≥8道正确率≥85%", "子网划分计算≥1道"],
  ),
  taskSlot(
    "e-11",
    "16:00",
    "17:30",
    "数学",
    "📐",
    "数学复习",
    "按计划推进",
    ["完成当日计划习题量", "错题记录并标注原因"],
  ),
  restSlot("e-12", "17:30", "18:30", "🍚", "晚餐+散步", "休息时段"),
  taskSlot(
    "e-13",
    "18:30",
    "20:00",
    "408综合",
    "🎯",
    "专题突破",
    "重难点专项",
    ["专题练习≥3道", "总结解题套路", "整理专题笔记"],
  ),
  restSlot("e-14", "20:00", "20:15", "☕", "休息", "短休"),
  taskSlot(
    "e-15",
    "20:15",
    "21:30",
    "英语",
    "📖",
    "英语阅读精读",
    "阅读与词汇",
    ["完成1篇阅读逐题分析", "生词摘录≥10个"],
  ),
  taskSlot(
    "e-16",
    "21:30",
    "22:00",
    "综合",
    "🌙",
    "每日复盘",
    "总结与计划",
    [
      "今日任务完成率≥80%",
      "明日计划已浏览",
      "错题本已更新",
    ],
  ),
]

/** 阶段三：真题冲刺期 — 11月1日—12月5日 每日模板 */
export const pastExamsDailyTemplate: TimeSlotTask[] = [
  restSlot("p-01", "07:00", "07:30", "🌅", "晨起洗漱早餐", "休息时段"),
  taskSlot(
    "p-02",
    "07:30",
    "08:00",
    "英语",
    "📖",
    "英语晨背",
    "保持语感",
    ["完成30个单词打卡", "复习昨日生词"],
  ),
  taskSlot(
    "p-03",
    "08:00",
    "09:00",
    "408综合",
    "📋",
    "昨日真题复盘",
    "错题与知识点回溯",
    [
      "每道错题完整解析",
      "对应知识点重读",
      "录入错题系统",
    ],
  ),
  restSlot("p-04", "09:00", "09:15", "☕", "休息", "短休"),
  taskSlot(
    "p-05",
    "09:15",
    "11:15",
    "408综合",
    "💪",
    "薄弱科目强化",
    "专项补强",
    [
      "专项习题≥5道",
      "重新整理笔记",
      "能自己讲清楚知识点",
    ],
  ),
  taskSlot(
    "p-06",
    "11:15",
    "11:30",
    "综合",
    "📝",
    "上午回顾",
    "查漏补缺",
    ["列出上午核心收获1条"],
  ),
  restSlot("p-07", "11:30", "13:30", "🍚", "午餐+午休", "休息时段"),
  restSlot("p-08", "13:30", "13:45", "☕", "休息", "模考前准备"),
  taskSlot(
    "p-09",
    "13:45",
    "16:45",
    "408综合",
    "📝",
    "真题模拟（180分钟）",
    "严格按考试时间",
    ["严格限时180min", "独立完成不翻书", "做完立即估分"],
  ),
  taskSlot(
    "p-10",
    "16:45",
    "17:30",
    "408综合",
    "📊",
    "模考复盘",
    "估分与错题整理",
    ["记录得分与失分点", "错题按科目归类", "标注待补知识点"],
  ),
  restSlot("p-11", "17:30", "18:30", "🍚", "晚餐+散步", "休息时段"),
  taskSlot(
    "p-12",
    "18:30",
    "20:00",
    "408综合",
    "📚",
    "错题巩固",
    "当日卷与错题",
    ["重做错题≥3道", "回归教材对应章节"],
  ),
  restSlot("p-13", "20:00", "20:15", "☕", "休息", "短休"),
  taskSlot(
    "p-14",
    "20:15",
    "21:00",
    "英语",
    "📖",
    "英语阅读",
    "保持手感",
    ["完成1篇阅读或翻译练习"],
  ),
  taskSlot(
    "p-15",
    "21:00",
    "21:45",
    "综合",
    "🌙",
    "每日复盘",
    "真题周计划对齐",
    ["今日学习时长与任务对齐周计划", "明日模考/复盘已安排"],
  ),
  restSlot("p-16", "21:45", "22:00", "🌙", "放松休息", "休息时段"),
]

/** 阶段四：考前冲刺期 — 12月6日—初试前 每日模板（晚上缩短，早睡） */
export const finalSprintDailyTemplate: TimeSlotTask[] = [
  restSlot("s-01", "07:00", "07:30", "🌅", "晨起洗漱早餐", "休息时段"),
  taskSlot(
    "s-02",
    "07:30",
    "08:00",
    "英语",
    "📖",
    "英语晨背（轻量）",
    "保持语感",
    ["复习核心词汇30个"],
  ),
  taskSlot(
    "s-03",
    "08:00",
    "09:30",
    "408综合",
    "🧠",
    "思维导图回顾（数据结构+计组）",
    "核心框架",
    ["每章列出3-5个核心考点"],
  ),
  restSlot("s-04", "09:30", "09:45", "☕", "休息", "短休"),
  taskSlot(
    "s-05",
    "09:45",
    "11:00",
    "408综合",
    "🧠",
    "思维导图回顾（操作系统+计网）",
    "核心框架",
    ["每章列出3-5个核心考点"],
  ),
  taskSlot(
    "s-06",
    "11:00",
    "11:30",
    "408综合",
    "📐",
    "公式速记默写",
    "高频公式",
    [
      "排序复杂度表正确",
      "Cache公式正确",
      "子网掩码公式正确",
    ],
  ),
  restSlot("s-07", "11:30", "13:30", "🍚", "午餐+午休", "休息时段"),
  taskSlot(
    "s-08",
    "13:30",
    "15:00",
    "408综合",
    "🔁",
    "错题三刷",
    "错题本",
    ["正确率≥90%", "仍错的题抄写解析"],
  ),
  restSlot("s-09", "15:00", "15:15", "☕", "休息", "短休"),
  taskSlot(
    "s-10",
    "15:15",
    "16:30",
    "408综合",
    "✅",
    "选择题保持手感",
    "限时训练",
    ["正确率≥75%(30/40)"],
  ),
  restSlot("s-11", "16:30", "17:30", "🍚", "晚餐+散步", "休息时段"),
  taskSlot(
    "s-12",
    "17:30",
    "19:00",
    "综合",
    "📋",
    "笔记浏览与心态调整",
    "轻量回顾",
    ["浏览考场清单与高频点", "不刷新题"],
  ),
  taskSlot(
    "s-13",
    "19:00",
    "20:30",
    "英语",
    "📖",
    "机动巩固（轻量）",
    "保持手感即可",
    ["可选1篇阅读或复习作文句型", "明日物品与路线确认"],
  ),
  restSlot("s-14", "20:30", "22:00", "🌙", "休息早睡", "20:30 后早睡，保证睡眠"),
]

/** 按阶段返回当日时间轴模板（深拷贝，可安全写入用户状态） */
export function getDailyTemplateForPhase(phase: Phase): TimeSlotTask[] {
  const map: Record<Phase, TimeSlotTask[]> = {
    [Phase.Foundation]: foundationDailyTemplate,
    [Phase.Enhancement]: enhancementDailyTemplate,
    [Phase.PastExams]: pastExamsDailyTemplate,
    [Phase.FinalSprint]: finalSprintDailyTemplate,
  }
  return structuredClone(map[phase])
}

/** 初试假定日期（PRD：12 月下旬，以当年公告为准） */
export const DEFAULT_EXAM_DATE = "2026-12-20"

function toDayNumber(date: string): number {
  const parts = date.trim().split("-").map((p) => Number.parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return Number.NaN
  }
  const [y, m, d] = parts
  return y * 10000 + m * 100 + d
}

/**
 * 根据日期（YYYY-MM-DD）返回所属备考阶段。
 * 边界：强化基础 2026-08-01～2026-09-15；强化提升 09-16～10-31；
 * 真题冲刺 11-01～12-05；考前冲刺 12-06～初试日（默认 2026-12-20）。
 */
export function getTemplateByDate(
  date: string,
  examDate: string = DEFAULT_EXAM_DATE,
): Phase {
  const day = toDayNumber(date)
  if (Number.isNaN(day)) {
    return Phase.Foundation
  }

  const exam = toDayNumber(examDate)
  const examEnd = Number.isNaN(exam) ? toDayNumber(DEFAULT_EXAM_DATE) : exam

  // 初试日之后：仍归为考前冲刺后的空窗，返回 FinalSprint 便于展示“考后”
  if (day > examEnd) {
    return Phase.FinalSprint
  }

  if (day >= 20261206 && day <= examEnd) {
    return Phase.FinalSprint
  }
  if (day >= 20261101 && day <= 20261205) {
    return Phase.PastExams
  }
  if (day >= 20260916 && day <= 20261031) {
    return Phase.Enhancement
  }
  if (day >= 20260801 && day <= 20260915) {
    return Phase.Foundation
  }

  // 备考开始前：默认强化基础（可按产品需求改为「未开始」状态）
  return Phase.Foundation
}

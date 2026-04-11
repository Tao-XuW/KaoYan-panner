import type { Criterion, TimeSlotTask } from "../types"
import { MainSubject } from "../types"
import { Phase } from "../types"

const NOT_STARTED = "not_started" as const

const P = MainSubject.Politics
const E = MainSubject.English
const M = MainSubject.Math
const C = MainSubject.CS408

function makeCriteria(slotId: string, texts: string[]): Criterion[] {
  return texts.map((text, i) => ({
    id: `${slotId}-c${i + 1}`,
    text: text.replace(/^□\s*/, "").trim(),
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

/** 阶段一：强化基础期 8/1—9/15 */
export const foundationDailyTemplate: TimeSlotTask[] = [
  restSlot("f-01", "07:00", "07:30", "🌅", "晨起", "洗漱早餐"),
  taskSlot(
    "f-02",
    "07:30",
    "08:00",
    E,
    "📖",
    "英语单词晨背",
    "墨墨/不背单词",
    ["完成当日单词打卡", "复习昨日标记生词"],
  ),
  taskSlot(
    "f-03",
    "08:00",
    "09:30",
    M,
    "📐",
    "数学二 · 高数基础",
    "张宇/汤家凤基础课 + 教材章节",
    ["看完当日视频课", "配套例题完成", "基础公式能默写"],
  ),
  restSlot("f-04", "09:30", "09:45", "☕", "休息", "短休"),
  taskSlot(
    "f-05",
    "09:45",
    "11:15",
    M,
    "📐",
    "数学二 · 习题练习",
    "660/880 对应章节",
    ["完成习题≥15道", "正确率≥60%", "错题标注并写原因"],
  ),
  taskSlot(
    "f-06",
    "11:15",
    "11:30",
    M,
    "📝",
    "上午数学回顾",
    "快速回顾",
    ["能复述今日数学核心公式/方法"],
  ),
  restSlot("f-07", "11:30", "13:30", "🍚", "午餐+午休", "午饭+午睡30–40分钟"),
  taskSlot(
    "f-08",
    "13:30",
    "15:00",
    C,
    "📘",
    "408 · 数据结构/计组",
    "王道章节（每天交替 DS 与 CO）",
    ["知识点笔记完成", "课后选择题正确率≥70%", "核心概念能复述"],
  ),
  restSlot("f-09", "15:00", "15:15", "☕", "休息", "短休"),
  taskSlot(
    "f-10",
    "15:15",
    "16:30",
    C,
    "📗",
    "408 · 操作系统/计网",
    "王道章节（每天交替 OS 与 CN）",
    ["知识点笔记完成", "课后选择题正确率≥70%"],
  ),
  restSlot("f-10b", "16:30", "16:45", "☕", "休息", "短休"),
  taskSlot(
    "f-11",
    "16:45",
    "18:00",
    C,
    "📘📗",
    "408 配套习题巩固",
    "今日两科408刷题",
    ["习题完成≥12道", "错题录入错题本"],
  ),
  restSlot("f-12", "18:00", "19:00", "🍚", "晚餐+散步", "晚饭+适量运动"),
  taskSlot(
    "f-13",
    "19:00",
    "20:00",
    E,
    "📖",
    "英语阅读精读",
    "05–15年真题精读",
    ["完成1篇精读并逐题分析", "生词摘录≥8个", "长难句分析≥2句"],
  ),
  restSlot("f-14", "20:00", "20:15", "☕", "休息", "短休"),
  taskSlot(
    "f-15",
    "20:15",
    "20:45",
    P,
    "🔴",
    "政治基础",
    "徐涛/腿姐核心考案（可选）",
    ["看完1节基础课视频 或 阅读核心考案10页"],
  ),
  taskSlot(
    "f-16",
    "20:45",
    "21:30",
    M,
    "📐",
    "数学错题复盘+预习",
    "当日数学收尾",
    ["错题重做1遍", "预习明日内容概要"],
  ),
  taskSlot(
    "f-17",
    "21:30",
    "22:00",
    "综合",
    "🌙",
    "每日复盘",
    "打卡与计划",
    ["今日完成率≥80%", "明日计划已浏览", "错题本已更新"],
  ),
  restSlot("f-18", "22:00", "22:30", "🧘", "放松", "洗漱就寝"),
]

/** 阶段二：强化提升期 9/16—10/31 */
export const enhancementDailyTemplate: TimeSlotTask[] = [
  restSlot("e-01", "07:00", "07:30", "🌅", "晨起", "洗漱早餐"),
  taskSlot(
    "e-02",
    "07:30",
    "08:00",
    E,
    "📖",
    "英语晨背",
    "单词+阅读技巧",
    ["单词打卡完成", "回顾昨日阅读错题"],
  ),
  taskSlot(
    "e-03",
    "08:00",
    "09:15",
    M,
    "📐",
    "数学强化刷题",
    "330/880 强化",
    ["完成今日强化题≥12道", "正确率≥65%", "总结题型方法"],
  ),
  restSlot("e-04", "09:15", "09:30", "☕", "休息", "短休"),
  taskSlot(
    "e-05",
    "09:30",
    "10:45",
    M,
    "📐",
    "数学专题突破",
    "极限/积分/线代重难点",
    ["专题题目≥8道", "错题整理并标注方法"],
  ),
  taskSlot(
    "e-06",
    "10:45",
    "11:00",
    M,
    "📝",
    "上午数学回顾",
    "小结",
    ["今日数学方法总结"],
  ),
  taskSlot(
    "e-07",
    "11:00",
    "11:30",
    P,
    "🔴",
    "政治刷题/技巧",
    "肖秀荣1000题 / 腿姐技巧课",
    ["完成1000题≥30道 或 看完1节技巧课+配套练习"],
  ),
  restSlot("e-08", "11:30", "13:30", "🍚", "午餐+午休", "午饭+午睡"),
  taskSlot(
    "e-09",
    "13:30",
    "15:00",
    C,
    "📘",
    "408 · DS+CO 习题强化",
    "王道",
    ["选择题≥15道 正确率≥80%", "综合题≥2道", "错题标注知识点"],
  ),
  restSlot("e-10", "15:00", "15:15", "☕", "休息", "短休"),
  taskSlot(
    "e-11",
    "15:15",
    "16:30",
    C,
    "📗",
    "408 · OS+CN 习题强化",
    "王道",
    ["选择题≥10道 正确率≥80%", "PV/子网计算≥1道"],
  ),
  restSlot("e-12", "16:30", "16:45", "☕", "休息", "短休"),
  taskSlot(
    "e-13",
    "16:45",
    "18:00",
    C,
    "🎯",
    "408 专题突破",
    "按周轮转",
    ["专题练习≥3道", "总结解题套路"],
  ),
  restSlot("e-14", "18:00", "19:00", "🍚", "晚餐+散步", "晚饭+运动"),
  taskSlot(
    "e-15",
    "19:00",
    "20:00",
    E,
    "📖",
    "英语阅读二刷",
    "翻译/新题型",
    ["完成1篇阅读或1篇翻译", "错题分析"],
  ),
  restSlot("e-16", "20:00", "20:15", "☕", "休息", "短休"),
  taskSlot(
    "e-17",
    "20:15",
    "20:45",
    P,
    "🔴",
    "政治刷题",
    "1000题+错题",
    ["完成≥20道", "错题知识点记录"],
  ),
  taskSlot(
    "e-18",
    "20:45",
    "21:30",
    "综合",
    "📐📘",
    "数学+408 错题复盘",
    "当日错题",
    ["所有错题重新理解并标注"],
  ),
  taskSlot(
    "e-19",
    "21:30",
    "22:00",
    "综合",
    "🌙",
    "每日复盘",
    "打卡",
    ["完成率≥85%", "错题本更新"],
  ),
]

/** 阶段三：真题冲刺期 11/1—12/5 */
export const pastExamsDailyTemplate: TimeSlotTask[] = [
  restSlot("p-01", "07:00", "07:30", "🌅", "晨起", "洗漱早餐"),
  taskSlot(
    "p-02",
    "07:30",
    "08:00",
    P,
    "🔴",
    "政治背诵",
    "肖八/肖四+时政",
    ["背诵≥30分钟", "肖八选择题≥1套"],
  ),
  taskSlot(
    "p-03",
    "08:00",
    "09:00",
    M,
    "📐",
    "数学真题/复盘",
    "限时或复盘日",
    ["真题日：限时做一套(2.5h)", "复盘日：逐题分析+错题回溯"],
  ),
  restSlot("p-04", "09:00", "09:15", "☕", "休息", "短休"),
  taskSlot(
    "p-05",
    "09:15",
    "11:15",
    M,
    "📐",
    "数学整块时间",
    "真题续做或薄弱专项",
    ["真题日：完成整套真题", "复盘日：专项练习≥10道"],
  ),
  taskSlot(
    "p-06",
    "11:15",
    "11:30",
    "综合",
    "📝",
    "速记",
    "数学/408 高频公式",
    ["默写5条公式无误"],
  ),
  restSlot("p-07", "11:30", "13:30", "🍚", "午餐+午休", "午饭+午睡"),
  restSlot("p-08", "13:30", "13:45", "🧘", "调整", "模考心态准备"),
  taskSlot(
    "p-09",
    "13:45",
    "16:45",
    C,
    "📘",
    "408 真题限时",
    "180分钟",
    ["严格限时180min", "独立完成不翻书", "做完立即估分"],
  ),
  taskSlot(
    "p-10",
    "16:45",
    "17:30",
    C,
    "📊",
    "408 真题复盘",
    "非真题日：专项补弱",
    ["按科目统计丢分", "错题归类"],
  ),
  restSlot("p-11", "17:30", "18:30", "🍚", "晚餐+散步", "晚饭+放松"),
  taskSlot(
    "p-12",
    "18:30",
    "19:30",
    E,
    "📖",
    "英语二真题",
    "阅读+翻译+作文",
    ["完成1项英语任务", "作文每周练写≥2篇"],
  ),
  restSlot("p-13", "19:30", "19:45", "☕", "休息", "短休"),
  taskSlot(
    "p-14",
    "19:45",
    "20:45",
    P,
    "🔴",
    "政治大题+选择",
    "肖四背诵",
    ["背诵≥1道大题答案", "选择题≥15道"],
  ),
  taskSlot(
    "p-15",
    "20:45",
    "21:30",
    "综合",
    "📐📘",
    "数学+408 错题",
    "全科错题",
    ["今日错题全部重新理解"],
  ),
  taskSlot(
    "p-16",
    "21:30",
    "22:00",
    "综合",
    "🌙",
    "每日复盘",
    "得分与计划",
    ["得分已录入", "完成率≥85%", "次日计划已写"],
  ),
]

/** 阶段四：考前冲刺 12/6—考前 */
export const finalSprintDailyTemplate: TimeSlotTask[] = [
  restSlot("s-01", "07:00", "07:30", "🌅", "晨起", "洗漱早餐"),
  taskSlot(
    "s-02",
    "07:30",
    "08:30",
    P,
    "🔴",
    "肖四大题背诵",
    "核心任务",
    ["背诵/复习≥2道大题", "关键词能默写"],
  ),
  taskSlot(
    "s-03",
    "08:30",
    "09:30",
    M,
    "📐",
    "数学公式+错题",
    "公式回顾+三刷",
    ["公式默写无误", "错题正确率≥90%"],
  ),
  restSlot("s-04", "09:30", "09:45", "☕", "休息", "短休"),
  taskSlot(
    "s-05",
    "09:45",
    "10:45",
    C,
    "📘",
    "408 思维导图",
    "数据结构+计组",
    ["每章列出3-5个核心考点", "标记不熟点"],
  ),
  taskSlot(
    "s-06",
    "10:45",
    "11:30",
    C,
    "📗",
    "408 思维导图",
    "操作系统+计网",
    ["核心公式/算法能默写"],
  ),
  restSlot("s-07", "11:30", "13:30", "🍚", "午餐+午休", "午饭+午睡"),
  taskSlot(
    "s-08",
    "13:30",
    "14:30",
    P,
    "🔴",
    "政治选择+时政",
    "肖四选择题回顾",
    ["选择题套卷正确率≥35/50", "时政知识点过一遍"],
  ),
  taskSlot(
    "s-09",
    "14:30",
    "15:30",
    C,
    "📘",
    "408 保持手感",
    "40题80分钟或错题",
    ["正确率≥75%", "不纠结难题"],
  ),
  restSlot("s-10", "15:30", "15:45", "☕", "休息", "短休"),
  taskSlot(
    "s-11",
    "15:45",
    "16:30",
    M,
    "📐",
    "数学综合题",
    "1–2道保持手感",
    ["计算准确", "步骤完整"],
  ),
  taskSlot(
    "s-12",
    "16:30",
    "17:30",
    E,
    "📖",
    "英语作文+阅读",
    "模板默写",
    ["大小作文各默写1遍", "核心词汇无遗漏"],
  ),
  restSlot("s-13", "17:30", "18:30", "🍚", "晚餐+散步", "晚饭+放松"),
  taskSlot(
    "s-14",
    "18:30",
    "19:30",
    P,
    "🔴",
    "政治大题最终背诵",
    "肖四",
    ["肖四全部大题能背出要点"],
  ),
  taskSlot(
    "s-15",
    "19:30",
    "20:00",
    E,
    "📖",
    "英语终稿检查",
    "翻译技巧",
    ["模板确认无误"],
  ),
  taskSlot(
    "s-16",
    "20:00",
    "20:30",
    "综合",
    "🌙",
    "复盘与物品检查",
    "早睡准备",
    ["心态平稳", "考试物品齐全", "次日计划浏览"],
  ),
  restSlot("s-17", "20:30", "22:00", "🧘", "早睡", "保证充足睡眠"),
]

export function getDailyTemplateForPhase(phase: Phase): TimeSlotTask[] {
  const map: Record<Phase, TimeSlotTask[]> = {
    [Phase.Foundation]: foundationDailyTemplate,
    [Phase.Enhancement]: enhancementDailyTemplate,
    [Phase.PastExams]: pastExamsDailyTemplate,
    [Phase.FinalSprint]: finalSprintDailyTemplate,
  }
  return structuredClone(map[phase])
}

export const DEFAULT_EXAM_DATE = "2026-12-19"

function toDayNumber(date: string): number {
  const parts = date.trim().split("-").map((p) => Number.parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return Number.NaN
  }
  const [y, m, d] = parts
  return y * 10000 + m * 100 + d
}

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

  return Phase.Foundation
}

import { useCallback, useId, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { type ThemeMode, useSettingsStore } from "../store/useSettingsStore"

/** 与 Zustand persist 的 name 一致，导出/导入/清空时用 */
const PERSIST_KEYS = [
  "kaoyan-settings",
  "kaoyan-schedule",
  "kaoyan-phase-milestones",
] as const

/** 初试总分 500 分科分布 */
const EXAM_SCORE_BARS = [
  { label: "政治", code: "101", score: 100, pctLabel: "20%", color: "#DC2626" },
  { label: "英语二", code: "204", score: 100, pctLabel: "20%", color: "#8B5CF6" },
  { label: "数学二", code: "302", score: 150, pctLabel: "30%", color: "#F59E0B" },
  {
    label: "408专业课",
    code: "22408",
    score: 150,
    pctLabel: "30%",
    color: "#2563EB",
  },
] as const

const TOTAL_EXAM = 500

const CS408_INNER_BARS = [
  { label: "数据结构", score: 45, pctLabel: "30%", color: "#4F46E5" },
  { label: "计算机组成原理", score: 45, pctLabel: "30%", color: "#DC2626" },
  { label: "操作系统", score: 35, pctLabel: "23.3%", color: "#16A34A" },
  { label: "计算机网络", score: 25, pctLabel: "16.7%", color: "#F59E0B" },
] as const

const TOTAL_408 = 150

const SUBJECT_TARGET_CONFIG = [
  { key: "politics", label: "政治", full: 100, nationalRef: "47+" },
  { key: "english", label: "英语二", full: 100, nationalRef: "47+" },
  { key: "math", label: "数学二", full: 150, nationalRef: "70+" },
  { key: "cs408", label: "408专业课", full: 150, nationalRef: "70+" },
] as const

function NjuptShieldEmblem() {
  return (
    <svg
      className="h-12 w-10 shrink-0"
      viewBox="0 0 80 96"
      aria-hidden
    >
      <path
        d="M40 6 L68 18 V52 C68 74 40 90 40 90 C40 90 12 74 12 52 V18 Z"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M28 34 H52 M28 34 V54 M40 30 V58 M52 34 V54"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M40 40 L34 46 M40 40 L46 46"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 48 Q32 42 40 44 Q48 42 58 48 Q52 56 40 54 Q28 56 22 48 Z"
        fill="none"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M40 58 L36 66 L44 66 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-blue-600 dark:bg-blue-500"
            : "bg-slate-300 dark:bg-slate-600"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span
          className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  )
}

const cardShell =
  "rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50 dark:border-slate-600/80 dark:bg-[#1E293B] dark:shadow-none"

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
]

export default function SettingsPage() {
  const [cs408Open, setCs408Open] = useState(false)
  const examDate = useSettingsStore((s) => s.examDate)
  const prepStartDate = useSettingsStore((s) => s.prepStartDate)
  const dailyStudyHoursGoal = useSettingsStore((s) => s.dailyStudyHoursGoal)
  const targetScorePolitics = useSettingsStore((s) => s.targetScorePolitics)
  const targetScoreEnglish = useSettingsStore((s) => s.targetScoreEnglish)
  const targetScoreMath = useSettingsStore((s) => s.targetScoreMath)
  const targetScore408 = useSettingsStore((s) => s.targetScore408)
  const themeMode = useSettingsStore((s) => s.themeMode)
  const reminderDailyEnabled = useSettingsStore((s) => s.reminderDailyEnabled)
  const reminderTime = useSettingsStore((s) => s.reminderTime)
  const slotEndReminderEnabled = useSettingsStore(
    (s) => s.slotEndReminderEnabled,
  )
  const lowCompletionAlertEnabled = useSettingsStore(
    (s) => s.lowCompletionAlertEnabled,
  )

  const setExamDate = useSettingsStore((s) => s.setExamDate)
  const setPrepStartDate = useSettingsStore((s) => s.setPrepStartDate)
  const setDailyStudyHoursGoal = useSettingsStore(
    (s) => s.setDailyStudyHoursGoal,
  )
  const setTargetScorePolitics = useSettingsStore((s) => s.setTargetScorePolitics)
  const setTargetScoreEnglish = useSettingsStore((s) => s.setTargetScoreEnglish)
  const setTargetScoreMath = useSettingsStore((s) => s.setTargetScoreMath)
  const setTargetScore408 = useSettingsStore((s) => s.setTargetScore408)
  const setThemeMode = useSettingsStore((s) => s.setThemeMode)
  const setReminderDailyEnabled = useSettingsStore(
    (s) => s.setReminderDailyEnabled,
  )
  const setReminderTime = useSettingsStore((s) => s.setReminderTime)
  const setSlotEndReminderEnabled = useSettingsStore(
    (s) => s.setSlotEndReminderEnabled,
  )
  const setLowCompletionAlertEnabled = useSettingsStore(
    (s) => s.setLowCompletionAlertEnabled,
  )

  const importInputRef = useRef<HTMLInputElement>(null)

  const exportData = useCallback(() => {
    const payload: Record<string, string | null> = {}
    for (const key of PERSIST_KEYS) {
      payload[key] = localStorage.getItem(key)
    }
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            keys: payload,
          },
          null,
          2,
        ),
      ],
      { type: "application/json;charset=utf-8" },
    )
    const a = document.createElement("a")
    const stamp = new Date().toISOString().slice(0, 10)
    a.href = URL.createObjectURL(blob)
    a.download = `kaoyan-planner-backup-${stamp}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [])

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const text = String(reader.result ?? "")
          const parsed = JSON.parse(text) as {
            keys?: Record<string, string | null>
          }
          if (!parsed.keys || typeof parsed.keys !== "object") {
            window.alert("文件格式不正确：缺少 keys 字段。")
            return
          }
          if (
            !window.confirm(
              "导入将覆盖当前所有学习数据与设置，且无法撤销。确定继续？",
            )
          ) {
            return
          }
          for (const key of PERSIST_KEYS) {
            const v = parsed.keys[key]
            if (v === null || v === undefined) {
              localStorage.removeItem(key)
            } else {
              localStorage.setItem(key, v)
            }
          }
          window.location.reload()
        } catch {
          window.alert("无法解析 JSON 文件。")
        }
      }
      reader.readAsText(file, "utf-8")
    },
    [],
  )

  const clearAll = useCallback(() => {
    if (
      !window.confirm(
        "将清除本应用在本设备上的全部本地数据（设置与时间表），不可恢复。确定吗？",
      )
    ) {
      return
    }
    if (!window.confirm("再次确认：真的要清空所有数据吗？")) {
      return
    }
    for (const key of PERSIST_KEYS) {
      localStorage.removeItem(key)
    }
    window.location.reload()
  }, [])

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-[100px] pt-6">
      <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        设置
      </h1>

      <div className="flex flex-col gap-4">
        {/* 卡片1：南邮特色 */}
        <section className={`overflow-hidden ${cardShell}`}>
          <div className="flex h-[120px] flex-col items-center justify-center bg-gradient-to-r from-[#1B3A8C] to-[#2563EB] px-3 py-2">
            <NjuptShieldEmblem />
            <p className="mt-0.5 text-center text-[20px] font-bold leading-none text-white">
              南京邮电大学
            </p>
            <p className="mt-1 text-center text-[11px] leading-tight text-white/70">
              Nanjing University of Posts and Telecommunications
            </p>
          </div>
          <div className="space-y-2.5 px-4 py-4 text-sm text-slate-800 dark:text-slate-100">
            <p>
              <span aria-hidden>📍 </span>
              目标专业：085404 计算机技术（专硕）
            </p>
            <p>
              <span aria-hidden>📝 </span>
              考试科目：101 政治 · 204 英语二 · 302 数学二 · 22408 专业课
            </p>
            <div>
              <p className="mb-2 flex items-center gap-1 text-sm">
                <span aria-hidden>📊 </span>
                各科目标分（含国家线参考）
              </p>
              <div className="space-y-2">
                {SUBJECT_TARGET_CONFIG.map((item) => {
                  const value =
                    item.key === "politics"
                      ? targetScorePolitics
                      : item.key === "english"
                        ? targetScoreEnglish
                        : item.key === "math"
                          ? targetScoreMath
                          : targetScore408
                  const onSet =
                    item.key === "politics"
                      ? setTargetScorePolitics
                      : item.key === "english"
                        ? setTargetScoreEnglish
                        : item.key === "math"
                          ? setTargetScoreMath
                          : setTargetScore408
                  return (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {item.label}（满分 {item.full}，国家线参考 {item.nationalRef}）
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={item.full}
                          value={value}
                          onChange={(e) => {
                            const n = Number.parseInt(e.target.value, 10)
                            if (Number.isNaN(n)) {
                              return
                            }
                            onSet(n)
                          }}
                          className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm tabular-nums text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">分</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              注：国家线参考值按近年工学/专硕常见区间，仅作提醒，请以当年官方线为准。
            </p>
            <p className="flex flex-wrap items-center gap-1">
              <span aria-hidden>🏫 </span>
              <span>研招网：</span>
              <a
                href="https://yzb.njupt.edu.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700 dark:text-blue-400"
              >
                https://yzb.njupt.edu.cn/
              </a>
            </p>
          </div>
          <p
            className="border-t border-slate-100 px-4 py-3 text-center text-[15px] text-[#1B3A8C] dark:text-blue-300"
            style={{
              fontFamily: '"Ma Shan Zheng", "KaiTi", "STKaiti", serif',
              letterSpacing: "4px",
            }}
          >
            厚德 · 弘毅 · 求是 · 笃行
          </p>
        </section>

        {/* 卡片2：考试设置 */}
        <section className={`${cardShell} p-4`}>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            考试设置
          </h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                考试日期
              </span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                修改后首页倒计时将同步更新
              </p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                备考开始日期
              </span>
              <input
                type="date"
                value={prepStartDate}
                onChange={(e) => setPrepStartDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
              />
            </label>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  每日学习目标时长
                </span>
                <span className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                  {dailyStudyHoursGoal} 小时
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                step={1}
                value={dailyStudyHoursGoal}
                onChange={(e) =>
                  setDailyStudyHoursGoal(Number.parseInt(e.target.value, 10))
                }
                className="mt-2 h-2 w-full cursor-pointer accent-blue-600"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>2h</span>
                <span>10h</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                主题模式
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setThemeMode(opt.value)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                      themeMode === opt.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 卡片3：全科分值 + 408 细分 */}
        <section className={`${cardShell} p-4`}>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            初试分值分布（500 分）
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            条宽按各科在总分中占比；配色与首页四科进度一致。
          </p>
          <ul className="mt-4 space-y-3">
            {EXAM_SCORE_BARS.map((row) => (
              <li key={row.code}>
                <div className="mb-1 flex justify-between gap-2 text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {row.label}{" "}
                    <span className="text-slate-500 dark:text-slate-400">
                      ({row.code}) {row.pctLabel}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-600 dark:text-slate-300">
                    {row.score} 分
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/80">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(row.score / TOTAL_EXAM) * 100}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setCs408Open((o) => !o)}
            className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-100"
          >
            <span>408 专业课内部子分值（150 分）</span>
            {cs408Open ? (
              <ChevronUp className="size-4 shrink-0 opacity-70" aria-hidden />
            ) : (
              <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
            )}
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: cs408Open ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              <ul className="mt-3 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-600/80">
                {CS408_INNER_BARS.map((row) => (
                  <li key={row.label}>
                    <div className="mb-1 flex justify-between gap-2 text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {row.label}{" "}
                        <span className="text-slate-500 dark:text-slate-400">
                          ({row.pctLabel})
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums text-slate-600 dark:text-slate-300">
                        {row.score} 分
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/80">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(row.score / TOTAL_408) * 100}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                408：选择题 80 分（40 题×2 分）+ 综合题 70 分 | 时长 180 分钟
              </p>
            </div>
          </div>
        </section>

        {/* 卡片4：提醒 */}
        <section className={`${cardShell} p-4`}>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            提醒设置
          </h2>
          <div className="mt-4 space-y-5">
            <ToggleRow
              label="每日学习提醒"
              checked={reminderDailyEnabled}
              onChange={setReminderDailyEnabled}
            />
            <label className={`block ${!reminderDailyEnabled ? "opacity-50" : ""}`}>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                提醒时间
              </span>
              <input
                type="time"
                value={reminderTime}
                disabled={!reminderDailyEnabled}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
              />
            </label>
            <ToggleRow
              label="时段切换提醒"
              description="时段结束前 10 分钟提醒"
              checked={slotEndReminderEnabled}
              onChange={setSlotEndReminderEnabled}
            />
            <ToggleRow
              label="连续低完成率预警"
              description="连续 3 天完成率低于 70% 时提醒"
              checked={lowCompletionAlertEnabled}
              onChange={setLowCompletionAlertEnabled}
            />
          </div>
        </section>

        {/* 卡片5：数据 */}
        <section className={`${cardShell} p-4`}>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            数据管理
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={exportData}
              className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80"
            >
              导出学习数据
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80"
            >
              导入学习数据
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ""
                if (f) {
                  importData(f)
                }
              }}
            />
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              清除所有数据
            </button>
          </div>
        </section>

        {/* 卡片6：关于 */}
        <section className={`${cardShell} p-4`}>
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
            关于
          </h2>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            考研计划表 <span className="text-slate-500">v1.0</span>
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            面向政/英/数/408 的考研初试备考管理与打卡工具
          </p>
          <p className="mt-6 text-center text-xs text-[#1B3A8C] dark:text-blue-300">
            祝你考研顺利，南邮见！🎓
          </p>
          <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-700/70">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              ⭐ Star 项目
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

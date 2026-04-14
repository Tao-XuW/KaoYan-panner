import { useMemo, useState } from "react"

import { useMistakeStore } from "../store/useMistakeStore"

export default function MistakesPage() {
  const [subject, setSubject] = useState("408")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [source, setSource] = useState("")
  const [filter, setFilter] = useState("全部")
  const [masteryFilter, setMasteryFilter] = useState<"全部" | "已掌握" | "未掌握">("全部")

  const items = useMistakeStore((s) => s.items)
  const addMistake = useMistakeStore((s) => s.addMistake)
  const toggleMastered = useMistakeStore((s) => s.toggleMastered)
  const addReviewCount = useMistakeStore((s) => s.addReviewCount)
  const removeMistake = useMistakeStore((s) => s.removeMistake)

  const list = useMemo(() => {
    return items.filter((m) => {
      const subjectPass = filter === "全部" || m.subject === filter
      const masteryPass =
        masteryFilter === "全部" ||
        (masteryFilter === "已掌握" && m.mastered) ||
        (masteryFilter === "未掌握" && !m.mastered)
      return subjectPass && masteryPass
    })
  }, [items, filter, masteryFilter])

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-[100px] pt-4">
      <h1 className="mb-4 text-xl font-bold">错题管理</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold">录入错题</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded border px-2 py-1.5 text-sm dark:bg-slate-900"
          >
            <option value="408">408</option>
            <option value="政治">政治</option>
            <option value="英语二">英语二</option>
            <option value="数学二">数学二</option>
          </select>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="来源" className="rounded border px-2 py-1.5 text-sm dark:bg-slate-900" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签(逗号分隔)" className="col-span-2 rounded border px-2 py-1.5 text-sm dark:bg-slate-900" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="错题描述" rows={3} className="col-span-2 rounded border px-2 py-1.5 text-sm dark:bg-slate-900" />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!description.trim()) {
              return
            }
            addMistake({
              subject: subject.trim() || "408",
              source: source.trim() || "未注明",
              tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
              description: description.trim(),
            })
            setDescription("")
          }}
          className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          添加错题
        </button>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">错题列表</h2>
          <div className="flex items-center gap-1.5">
            <select
              value={masteryFilter}
              onChange={(e) =>
                setMasteryFilter(e.target.value as "全部" | "已掌握" | "未掌握")
              }
              className="w-20 rounded border px-2 py-1 text-xs dark:bg-slate-900"
            >
              <option value="全部">全部</option>
              <option value="已掌握">已掌握</option>
              <option value="未掌握">未掌握</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-24 rounded border px-2 py-1 text-xs dark:bg-slate-900"
            >
              <option value="全部">全部</option>
              <option value="408">408</option>
              <option value="政治">政治</option>
              <option value="英语二">英语二</option>
              <option value="数学二">数学二</option>
            </select>
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {list.map((m) => (
            <li key={m.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-medium">{m.description}</p>
                <span
                  className={`mt-0.5 inline-block size-2.5 shrink-0 rounded-full ${
                    m.mastered ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  title={m.mastered ? "已掌握" : "未掌握"}
                  aria-label={m.mastered ? "已掌握" : "未掌握"}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {m.subject} · {m.source} · 复习 {m.reviewCount} 次
              </p>
              {m.tags.length > 0 ? (
                <p className="mt-1 text-xs text-slate-500">标签：{m.tags.join(" / ")}</p>
              ) : null}
              <div className="mt-2 flex gap-2 text-xs">
                <button type="button" onClick={() => addReviewCount(m.id)} className="rounded border px-2 py-1">
                  +1 复习
                </button>
                <button type="button" onClick={() => toggleMastered(m.id)} className="rounded border px-2 py-1">
                  {m.mastered ? "取消掌握" : "标记掌握"}
                </button>
                <button type="button" onClick={() => removeMistake(m.id)} className="rounded border border-rose-300 px-2 py-1 text-rose-500">
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

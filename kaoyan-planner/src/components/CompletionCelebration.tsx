import { useEffect, useMemo } from "react"

type CompletionCelebrationProps = {
  show: boolean
  onDismiss: () => void
}

/** 简易 CSS confetti + 底部祝贺条（完成率 ≥90%） */
export function CompletionCelebration({
  show,
  onDismiss,
}: CompletionCelebrationProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${5 + (i % 6) * 15 + (i % 3) * 3}%`,
        delay: `${(i % 5) * 0.08}s`,
        hue: (i * 47) % 360,
        rotate: `${(i * 23) % 360}deg`,
      })),
    [],
  )

  useEffect(() => {
    if (!show) {
      return
    }
    const t = window.setTimeout(() => onDismiss(), 5200)
    return () => window.clearTimeout(t)
  }, [show, onDismiss])

  if (!show) {
    return null
  }

  return (
    <div
      className="fixed bottom-[calc(8.25rem+env(safe-area-inset-bottom))] left-1/2 z-[45] w-[min(100vw,480px)] max-w-[480px] -translate-x-1/2 px-3"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-4 py-3 text-center shadow-lg shadow-amber-200/40 dark:border-amber-700/50 dark:from-amber-950/90 dark:via-slate-800 dark:to-amber-950/90 dark:shadow-amber-900/40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden"
          aria-hidden
        >
          {pieces.map((p) => (
            <span
              key={p.id}
              className="confetti-piece"
              style={{
                left: p.left,
                animationDelay: p.delay,
                backgroundColor: `hsl(${p.hue} 85% 55%)`,
                transform: `rotate(${p.rotate})`,
              }}
            />
          ))}
        </div>
        <p className="relative z-[1] text-base font-bold text-amber-900 dark:text-amber-100">
          🎉 今日学习非常棒！
        </p>
        <p className="relative z-[1] mt-1 text-xs text-amber-800/90 dark:text-amber-200/90">
          保持节奏，明天继续加油
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="relative z-[1] mt-2 text-xs font-medium text-amber-700 underline underline-offset-2 dark:text-amber-300"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

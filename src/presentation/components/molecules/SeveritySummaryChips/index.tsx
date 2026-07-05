import type { FC } from 'react'
import type { SeveritySummaryChipsProps } from './SeveritySummaryChips.types'

interface StatChipProps {
  count: number
  label: string
  countColor: string
  labelColor: string
  bgColor: string
  borderColor: string
}

const StatChip: FC<StatChipProps> = ({ count, label, countColor, labelColor, bgColor, borderColor }) => (
  <div
    className={`flex-1 flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 border ${bgColor} ${borderColor}`}
  >
    <span className={`text-lg font-bold leading-none ${countColor}`}>{count}</span>
    <span className={`text-xxs font-semibold uppercase tracking-wide ${labelColor}`}>{label}</span>
  </div>
)

export const SeveritySummaryChips: FC<SeveritySummaryChipsProps> = ({ issues }) => {
  const criticalCount = issues.filter((i) => i.severity === 'critical').length
  const majorCount = issues.filter((i) => i.severity === 'major').length
  const minorCount = issues.filter((i) => i.severity === 'minor').length

  return (
    <div className="flex gap-1.5">
      <StatChip
        count={criticalCount}
        label="Critical"
        countColor="text-critical"
        labelColor="text-critical-dark"
        bgColor="bg-critical-bg"
        borderColor="border-critical-border"
      />
      <StatChip
        count={majorCount}
        label="Major"
        countColor="text-major"
        labelColor="text-major-dark"
        bgColor="bg-major-bg"
        borderColor="border-major-border"
      />
      <StatChip
        count={minorCount}
        label="Minor"
        countColor="text-minor"
        labelColor="text-minor-label"
        bgColor="bg-surface-subtle"
        borderColor="border-surface-border-light"
      />
    </div>
  )
}

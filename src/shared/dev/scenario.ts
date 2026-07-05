import type { Issue } from '@domain/entities/issue.types'

const SCENARIOS = ['all', 'no-issues', 'minors-only', 'majors-only', 'criticals-only', 'can-submit'] as const
type Scenario = (typeof SCENARIOS)[number]

function getScenario(): Scenario {
  if (!import.meta.env.DEV) return 'all'
  const param = new URLSearchParams(window.location.search).get('scenario')
  if (param && (SCENARIOS as readonly string[]).includes(param)) return param as Scenario
  return 'all'
}

export function applyScenario(issues: Issue[]): Issue[] {
  switch (getScenario()) {
    case 'no-issues':      return []
    case 'minors-only':    return issues.filter((i) => i.severity === 'minor')
    case 'majors-only':    return issues.filter((i) => i.severity === 'major')
    case 'criticals-only': return issues.filter((i) => i.severity === 'critical')
    case 'can-submit':     return issues.filter((i) => i.severity === 'minor')
    default:               return issues
  }
}

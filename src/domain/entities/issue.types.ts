export type IssueSeverity = 'critical' | 'major' | 'minor'

export interface Issue {
  id: string
  title: string
  description: string
  severity: IssueSeverity
  page: number
}

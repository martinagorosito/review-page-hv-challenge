export interface SpanContext {
  traceId: string
  spanId: string
  name: string
  startTime: number
}

export interface ObservabilityService {
  trackEvent(name: string, properties?: Record<string, unknown>): void
  trackError(error: Error, context?: Record<string, unknown>): void
  trackMetric(name: string, value: number, tags?: Record<string, string>): void
  startSpan(name: string, context?: Record<string, unknown>): SpanContext
  endSpan(span: SpanContext, metadata?: Record<string, unknown>): void
  setUserContext(userId: string, attributes?: Record<string, unknown>): void
}

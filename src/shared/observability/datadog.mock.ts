// TODO [BLOCKER]: Replace with real @datadog/browser-rum + @datadog/browser-logs
// integration before production. Initialize with DD_APPLICATION_ID, DD_CLIENT_TOKEN.
// Required env vars: VITE_DD_APPLICATION_ID, VITE_DD_CLIENT_TOKEN, VITE_DD_SITE
import type { ObservabilityService, SpanContext } from './types'

const generateId = (): string => Math.random().toString(36).slice(2, 11)

const formatContext = (ctx?: Record<string, unknown>): string =>
  ctx ? ` | ctx: ${JSON.stringify(ctx)}` : ''

export const datadogMock: ObservabilityService = {
  trackEvent(name, properties) {
    console.warn(`[Datadog:event] ${name}${formatContext(properties)}`)
  },

  trackError(error, context) {
    console.error(`[Datadog:error] ${error.message}${formatContext(context)}`, error)
  },

  trackMetric(name, value, tags) {
    const tagStr = tags ? ` | tags: ${JSON.stringify(tags)}` : ''
    console.warn(`[Datadog:metric] ${name}=${String(value)}${tagStr}`)
  },

  startSpan(name, context) {
    const span: SpanContext = {
      traceId: generateId(),
      spanId: generateId(),
      name,
      startTime: performance.now(),
    }
    console.warn(`[Datadog:span:start] ${name}${formatContext(context)} | traceId=${span.traceId}`)
    return span
  },

  endSpan(span, metadata) {
    const duration = performance.now() - span.startTime
    console.warn(
      `[Datadog:span:end] ${span.name} | duration=${duration.toFixed(2)}ms${formatContext(metadata)}`,
    )
  },

  setUserContext(userId, attributes) {
    console.warn(`[Datadog:user] userId=${userId}${formatContext(attributes)}`)
  },
}

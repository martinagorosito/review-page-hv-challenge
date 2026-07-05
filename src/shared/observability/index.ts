// TODO [BLOCKER]: Swap mock for real Datadog SDK in production builds.
// Pattern: import real SDK conditionally based on VITE_ENV or use DI container.
import { datadogMock } from './datadog.mock'
import type { ObservabilityService } from './types'

export const observability: ObservabilityService = datadogMock

export type { ObservabilityService, SpanContext } from './types'

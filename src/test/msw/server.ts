import { setupServer } from 'msw/node'
import { reviewHandlers } from './handlers/reviews'

export const server = setupServer(...reviewHandlers)

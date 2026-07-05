import { http, HttpResponse } from 'msw'
import mockJson from '@infrastructure/api/reviewMockData.json'

export const reviewHandlers = [
  http.get('/api/reviews/:id', () => HttpResponse.json(mockJson)),
  http.post('/api/reviews/:id/submit', () => HttpResponse.json({ success: true })),
]

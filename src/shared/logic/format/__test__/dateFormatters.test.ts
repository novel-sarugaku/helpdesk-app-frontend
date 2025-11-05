import { describe, it, expect } from 'vitest'

import { formatCreatedAt } from '@/shared/logic/format/dateFormatters'

describe('formatCreatedAt', () => {
  it('「YYYY MM DD」の形に整形する', () => {
    expect(formatCreatedAt('2025-10-29T12:34:56Z')).toBe('2025 10 29')
    expect(formatCreatedAt('2025-01-05T00:00:00Z')).toBe('2025 01 05')
  })
})

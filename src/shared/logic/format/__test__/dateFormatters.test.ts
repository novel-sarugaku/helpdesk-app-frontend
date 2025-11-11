import { describe, it, expect } from 'vitest'

import {
  formatDateStringToYearMonthDay,
  formatDateStringToYearMonthDaySlash,
} from '@/shared/logic/format/dateFormatters'

describe('formatDateStringToYearMonthDay', () => {
  it('「YYYY MM DD」の形に整形する', () => {
    expect(formatDateStringToYearMonthDay('2025-10-29T12:34:56Z')).toBe('2025 10 29')
    expect(formatDateStringToYearMonthDay('2025-01-05T00:00:00Z')).toBe('2025 01 05')
  })
})

describe('formatDateStringToYearMonthDaySlash', () => {
  it('「YYYY / MM / DD」の形に整形する', () => {
    expect(formatDateStringToYearMonthDaySlash('2025-10-29T12:34:56Z')).toBe('2025 / 10 / 29')
    expect(formatDateStringToYearMonthDaySlash('2025-01-05T00:00:00Z')).toBe('2025 / 01 / 05')
  })
})

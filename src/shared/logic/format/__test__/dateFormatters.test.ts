import { describe, it, expect } from 'vitest'

import {
  formatDateStringToYearMonthDay,
  formatDateStringToYearMonthDaySlash,
  formatDateStringToYearMonthDayAndTime,
} from '@/shared/logic/format/dateFormatters'

describe('formatDateStringToYearMonthDay', () => {
  it('「YYYY MM DD」の形に整形する', () => {
    expect(formatDateStringToYearMonthDay('2025-10-29T12:34:56')).toBe('2025 10 29')
    expect(formatDateStringToYearMonthDay('2025-01-05T00:00:00')).toBe('2025 01 05')
  })
})

describe('formatDateStringToYearMonthDaySlash', () => {
  it('「YYYY / MM / DD」の形に整形する', () => {
    expect(formatDateStringToYearMonthDaySlash('2025-10-29T12:34:56')).toBe('2025 / 10 / 29')
    expect(formatDateStringToYearMonthDaySlash('2025-01-05T00:00:00')).toBe('2025 / 01 / 05')
  })
})

describe('formatDateStringToYearMonthDayAndTime', () => {
  it('「YYYY MM DD \n HH：MM：SS」の形に整形する', () => {
    expect(formatDateStringToYearMonthDayAndTime('2025-10-29T12:34:56')).toBe(
      '2025 10 29 \n 12：34：56',
    )
    expect(formatDateStringToYearMonthDayAndTime('2025-01-05T00:00:00')).toBe(
      '2025 01 05 \n 00：00：00',
    )
  })
})

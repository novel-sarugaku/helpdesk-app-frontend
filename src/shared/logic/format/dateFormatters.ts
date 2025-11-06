export const formatDateStringToYearMonthDay = (date: string): string => {
  const convertedCreatedAt = new Date(date)
  const year = String(convertedCreatedAt.getFullYear())
  // String().padStart(2, '0') → 文字列の長さが2文字になるように左側を0で埋める。例：'1' → '01', '10' → '10'
  const month = String(convertedCreatedAt.getMonth() + 1).padStart(2, '0')
  const day = String(convertedCreatedAt.getDate()).padStart(2, '0')
  return `${year} ${month} ${day}`
}

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

// strict thresholds
const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y', r: 1 },
  { l: 'yy', d: 'year' },
]

dayjs.extend(relativeTime, { thresholds })
dayjs.extend(updateLocale)

/**
 * Dividing the periodDuration (in seconds) by 60 (to convert seconds to minutes),
 * then by 60 again (to convert minutes to hours), and finally by 24
 * (to convert hours to days).
 * @param periodDuration
 */
export function secondsToDays(periodDuration: number) {
  return periodDuration ? periodDuration / 60 / 60 / 24 : 0
}

export function secondsToMinutes(periodDuration: number) {
  return periodDuration ? periodDuration / 60 : 0
}
/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const timeAgoFrom = (timestamp?: string | number) => {
  if (!timestamp) {
    return ''
  }
  const format = dayjs.unix(Number(timestamp)).fromNow(true)
  if (format !== null) return format
  return ''
}

/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const timeLeftTo = (timestamp?: string | number) => {
  if (!timestamp) {
    return ''
  }
  const format = dayjs().to(dayjs.unix(Number(timestamp)), true)
  if (format !== null) return format
  return ''
}

/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const timeLeftToShort = (timestamp?: string | number) => {
  if (!timestamp) {
    return ''
  }
  const format = dayjs().to(dayjs.unix(Number(timestamp)), true)
  if (format !== null) return format
  return ''
}

/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const formatTimestamp = (
  timestamp?: string | number,
  dateFormat = 'MMM DD, YYYY [at] hh:mm A',
) => {
  if (!timestamp) {
    return ''
  }
  const format = dayjs.unix(Number(timestamp)).format(dateFormat)
  if (format !== null) return format
  return ''
}

export const isBeforeToday = (timestamp?: string | number) => {
  if (!timestamp) {
    return false
  }
  // Check if now is after the give timestamp
  return dayjs().isAfter(dayjs.unix(Number(timestamp)))
}

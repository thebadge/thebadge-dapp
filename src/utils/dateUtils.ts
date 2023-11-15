import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

// strict thresholds
const thresholds = [
  { l: 's', r: 59, d: 'second' },
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

dayjs.updateLocale('en', {
  relativeTime: {
    s: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
})

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
  if (!timestamp || !Number(timestamp)) {
    return '-'
  }
  const format = dayjs.unix(Number(timestamp)).fromNow(true)
  if (format !== null) return format
  return '-'
}

/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const timeLeftTo = (timestamp?: string | number) => {
  if (!timestamp || !Number(timestamp)) {
    return '-'
  }
  const format = dayjs().to(dayjs.unix(Number(timestamp)), true)
  if (format !== null) return format
  return '-'
}

/**
 * By default expect Unix Timestamp (seconds)
 * @param timestamp
 */
export const timeLeftToShort = (timestamp?: string | number) => {
  if (!timestamp || !Number(timestamp)) {
    return '-'
  }
  const format = dayjs().to(dayjs.unix(Number(timestamp)), true)
  if (format !== null) return format
  return '-'
}

/**
 * By default, expect Unix Timestamp (seconds)
 * @param timestamp
 * @param dateFormat 'MMM DD, YYYY [at] hh:mm A'
 */
export const formatTimestamp = (
  timestamp?: string | number,
  dateFormat = 'MMM DD, YYYY [at] hh:mm A',
) => {
  if (!timestamp || !Number(timestamp)) {
    return '-'
  }
  const format = dayjs.unix(Number(timestamp)).format(dateFormat)
  if (format !== null) return format
  return '-'
}

export const isBeforeToday = (timestamp?: string | number) => {
  if (!timestamp || !Number(timestamp)) {
    return false
  }
  // Check if now is after the give timestamp
  return dayjs().isAfter(dayjs.unix(Number(timestamp)))
}

export const getExpirationYearAndMonth = (
  validUntil: number,
): {
  expirationYear?: number
  expirationMonth?: number
} => {
  if (validUntil == 0) {
    return {
      expirationYear: undefined,
      expirationMonth: undefined,
    }
  }
  // * 1000 is used to convert the Ethereum timestamp (in seconds) to JavaScript's expected milliseconds.
  // TODO MOVE LOGIC TO SUBGRAPH
  const date = new Date(validUntil * 1000)
  return {
    expirationYear: date.getFullYear(),
    expirationMonth: date.getMonth() + 1,
  }
}

export const getIssueYearAndMonth = (
  issuedAt: number,
): {
  issueYear: number
  issueMonth: number
} => {
  // * 1000 is used to convert the Ethereum timestamp (in seconds) to JavaScript's expected milliseconds.
  // TODO MOVE LOGIC TO SUBGRAPH
  const date = new Date(issuedAt * 1000)
  return {
    issueYear: date.getFullYear(),
    issueMonth: date.getMonth() + 1,
  }
}

import { useEffect, useState } from 'react'

import dayjs from 'dayjs'

import { timeAgoFrom } from '@/src/utils/dateUtils'

// Just some simple constants for readability
const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export default function TimeAgo({ timestamp }: { timestamp?: number }) {
  // timeNow is used as a helper to do the maths and to refresh the component, It could be used to
  // calculate the time ago, but dayjs already provide a "toNow" function that solves it
  const [timeNow, setTimeNow] = useState(dayjs())

  useEffect(() => {
    const tick = (): 0 | NodeJS.Timeout => {
      const now = timeNow.valueOf()
      if (!timestamp) {
        console.warn('TimeAgo - None timestamp provided')
        return 0
      }
      const then = dayjs.unix(timestamp).valueOf()
      if (!then) {
        console.warn('TimeAgo - Invalid timestamp provided')
        return 0
      }
      const seconds = Math.round(Math.abs(now - then) / 1000)

      const unboundPeriod =
        seconds < MINUTE
          ? 1000 //--> Less than a minute, refresh every sec
          : seconds < HOUR //--> Moran than a minute but less than an hour, refresh every min
          ? 1000 * MINUTE
          : seconds < DAY //--> Moran than an hour but less than a day, refresh every hour
          ? 1000 * HOUR
          : 1000 * WEEK

      const period = Math.min(unboundPeriod, MINUTE * 1000)

      if (period) {
        return setTimeout(() => {
          setTimeNow(dayjs())
        }, period)
      }

      return 0
    }
    const timeoutId = tick()
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timestamp, timeNow])

  return <span>&nbsp;{timeAgoFrom(timestamp)} ago</span>
}

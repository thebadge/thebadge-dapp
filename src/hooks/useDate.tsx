import { useTranslation } from 'next-export-i18n'

export interface TimeLeft {
  quantity: number
  unitText: string
}

export const useDate = () => {
  const { t } = useTranslation()

  const timestampToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000)
  }

  const getTimeLeft = (date: Date): TimeLeft => {
    const now = new Date().getTime()
    const timeLeft = date.getTime() - now

    // convert milliseconds to seconds / minutes / hours etc.
    const msPerSecond = 1000
    const msPerMinute = msPerSecond * 60
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24

    // calculate remaining time
    const days = Math.floor(timeLeft / msPerDay)
    const hours = Math.floor((timeLeft % msPerDay) / msPerHour)
    const minutes = Math.floor((timeLeft % msPerHour) / msPerMinute)
    const seconds = Math.floor((timeLeft % msPerMinute) / msPerSecond)

    if (days > 0) {
      return {
        quantity: days,
        unitText: t('date.timeLeft.days'),
      }
    } else if (hours > 0) {
      return {
        quantity: hours,
        unitText: t('date.timeLeft.hours'),
      }
    } else if (minutes > 0) {
      return {
        quantity: minutes,
        unitText: t('date.timeLeft.minutes'),
      }
    } else if (seconds > 0) {
      return {
        quantity: seconds,
        unitText: t('date.timeLeft.seconds'),
      }
    } else {
      return {
        quantity: 0,
        unitText: t('date.timeLeft.time'),
      }
    }
  }

  const getPendingTimeProgressPercentage = (
    dueDate: Date,
    pendingTimeDurationSeconds: number,
  ): number => {
    const now = new Date().getTime()
    const timeLeftInSeconds = (dueDate.getTime() - now) / 1000
    const secondsOfProgressDone = pendingTimeDurationSeconds - timeLeftInSeconds
    return Math.floor((100 / pendingTimeDurationSeconds) * secondsOfProgressDone)
  }

  return {
    timestampToDate,
    getTimeLeft,
    getPendingTimeProgressPercentage,
  }
}

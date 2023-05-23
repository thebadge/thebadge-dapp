import { useTranslation } from 'next-export-i18n'

export interface TimeLeft {
  quantity: number
  unitText: string
}

// convert milliseconds to seconds / minutes / hours etc.
export const MS_PER_SECOND = 1000
export const MS_PER_MINUTE = MS_PER_SECOND * 60
export const MS_PER_HOUR = MS_PER_MINUTE * 60
export const MS_PER_DAY = MS_PER_HOUR * 24

export const useDate = () => {
  const { t } = useTranslation()

  const timestampToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000)
  }

  const getTimeLeft = (date: Date): TimeLeft => {
    const now = new Date().getTime()
    const timeLeft = date.getTime() - now

    // calculate remaining time
    const days = Math.floor(timeLeft / MS_PER_DAY)
    const hours = Math.floor((timeLeft % MS_PER_DAY) / MS_PER_HOUR)
    const minutes = Math.floor((timeLeft % MS_PER_HOUR) / MS_PER_MINUTE)
    const seconds = Math.floor((timeLeft % MS_PER_MINUTE) / MS_PER_SECOND)

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
    const timeLeftInSeconds = (dueDate.getTime() - now) / MS_PER_SECOND
    const secondsOfProgressDone = pendingTimeDurationSeconds - timeLeftInSeconds
    return Math.floor((100 / pendingTimeDurationSeconds) * secondsOfProgressDone)
  }

  return {
    timestampToDate,
    getTimeLeft,
    getPendingTimeProgressPercentage,
  }
}

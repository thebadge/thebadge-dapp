export interface TimeLeft {
  quantity: number
  unitText: string
}

export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000)
}

export const getFormattedTimeLeft = (date: Date): TimeLeft => {
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
      unitText: 'days left',
    }
  } else if (hours > 0) {
    return {
      quantity: hours,
      unitText: 'hours left',
    }
  } else if (minutes > 0) {
    return {
      quantity: minutes,
      unitText: 'minutes left',
    }
  } else if (seconds > 0) {
    return {
      quantity: seconds,
      unitText: 'seconds left',
    }
  } else {
    return {
      quantity: 0,
      unitText: 'time left',
    }
  }
}

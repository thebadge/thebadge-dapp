import { TimeLeft, useDateHelpers } from '@/src/hooks/useDateHelpers'
import { BadgeStatus } from '@/types/generated/subgraph'

export type ReviewBadge = {
  status: BadgeStatus
  badgeKlerosMetaData: {
    reviewDueDate: number
  }
  badgeModel: {
    badgeModelKleros: {
      challengePeriodDuration: number
    }
  }
}

type BadgeReviewStatus = {
  status: BadgeStatus
  reviewTimeLeft: TimeLeft
  reviewProgressPercentage: number
  reviewTimeFinished: boolean
}

type UseBadgeReturn = {
  getBadgeReviewStatus: (badge: ReviewBadge) => BadgeReviewStatus
}

export default function useBadgeHelpers(): UseBadgeReturn {
  const { getPendingTimeProgressPercentage, getTimeLeft, timestampToDate } = useDateHelpers()

  function getBadgeReviewStatus(badge: ReviewBadge): BadgeReviewStatus {
    const dueDate: Date = timestampToDate(badge.badgeKlerosMetaData?.reviewDueDate)
    const pendingTimeDurationSeconds: number =
      badge.badgeModel.badgeModelKleros?.challengePeriodDuration
    const timeLeft: TimeLeft = getTimeLeft(dueDate)
    const progressPercentage = getPendingTimeProgressPercentage(dueDate, pendingTimeDurationSeconds)

    return {
      status: badge.status,
      reviewTimeLeft: timeLeft,
      reviewProgressPercentage: progressPercentage,
      reviewTimeFinished: progressPercentage >= 100,
    }
  }

  return {
    getBadgeReviewStatus,
  }
}

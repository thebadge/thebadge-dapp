import { TimeLeft, useDateHelpers } from '@/src/hooks/useDateHelpers'
import { BadgeStatus } from '@/types/generated/subgraph'

export type ReviewBadge = {
  status: BadgeStatus
  badgeKlerosMetaData: {
    reviewDueDate: number
  }
  badgeThirdPartyMetadata: {}
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
    if (badge.badgeKlerosMetaData) {
      const dueDate: Date = timestampToDate(badge.badgeKlerosMetaData?.reviewDueDate)
      const pendingTimeDurationSeconds: number =
        badge.badgeModel.badgeModelKleros?.challengePeriodDuration
      const timeLeft: TimeLeft = getTimeLeft(dueDate)
      const progressPercentage = getPendingTimeProgressPercentage(
        dueDate,
        pendingTimeDurationSeconds,
      )

      return {
        status: badge.status,
        reviewTimeLeft: timeLeft,
        reviewProgressPercentage: progressPercentage,
        reviewTimeFinished: progressPercentage >= 100,
      }
    }
    // TODO VERIFY
    const timeLeft: TimeLeft = getTimeLeft(new Date())
    return {
      status: badge.status,
      reviewTimeLeft: timeLeft,
      reviewProgressPercentage: 0,
      reviewTimeFinished: 0 >= 100,
    }
  }

  return {
    getBadgeReviewStatus,
  }
}

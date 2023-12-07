import _ from 'lodash'

import { Badge } from '@/types/generated/subgraph'

type BadgesByModelIdMapping = Record<string, Badge[]>

export const shuffleBadges = (badges: Badge[]): Badge[] => {
  // Group badges by badgeModel.id
  const badgeModelMap: BadgesByModelIdMapping = _.groupBy(badges, (badge) => badge.badgeModel.id)

  // Shuffle the keys (badgeModel.id values)
  const shuffledKeys = _.shuffle(Object.keys(badgeModelMap))

  // Shuffle each group of badges with the shuffled keys
  const shuffledGroups = _.mapValues(
    _.zipObject(shuffledKeys, Object.values(badgeModelMap)),
    (group) => _.shuffle(group),
  )

  // Concatenate the shuffled groups to create the final shuffled array
  return _.flatten(Object.values(shuffledGroups))
}

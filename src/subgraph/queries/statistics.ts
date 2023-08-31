import gql from 'graphql-tag'

export const PROTOCOL_STATISTICS = gql`
  query protocolStatistics {
    protocolStatistics {
      badgeCreatorsAmount
      badgeCuratorsAmount
      badgeModelsCreatedAmount
      badgesChallengedAmount
      badgesMintedAmount
      badgesOwnersAmount
    }
  }
`
export const CREATOR_STATISTICS = gql`
  query creatorStatistics($address: ID!) {
    creatorStatistic(id: $address) {
      allTimeBadgeMinters
      allTimeBadgeMintersAmount
      createdBadgeModelsAmount
      createdBadgeModelsMintedAmount
      mostPopularCreatedBadge
      id
      totalFeesEarned
    }
  }
`

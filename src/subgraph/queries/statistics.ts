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

export const CURATOR_STATISTICS = gql`
  query curatorStatistics($address: ID!) {
    curatorStatistic(id: $address) {
      challengesMadeAmount
      challengesMadeLostAmount
      challengesMadeRejectedAmount
      challengesMadeWonAmount
      id
    }
  }
`

export const USER_STATISTICS = gql`
  query userStatistics($address: ID!) {
    userStatistic(id: $address) {
      challengesReceivedAmount
      challengesReceivedLostAmount
      challengesReceivedRejectedAmount
      challengesReceivedWonAmount
      id
      mintedBadgesAmount
      timeOfLastChallengeReceived
    }
  }
`

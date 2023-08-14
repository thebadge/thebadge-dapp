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

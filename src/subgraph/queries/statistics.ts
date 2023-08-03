import gql from 'graphql-tag'

export const PROTOCOL_STATISTICS = gql`
  query protocolStatistic {
    protocolStatistic(id: "0x641ddcede396fa1c2b1af323523508d2f8fd6825") {
      badgeCreatorsAmount
      badgeCuratorsAmount
      badgeModelsCreatedAmount
      badgesChallengedAmount
      badgesMintedAmount
      badgesOwnersAmount
    }
  }
`

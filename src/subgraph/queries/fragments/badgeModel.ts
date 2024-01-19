import gql from 'graphql-tag'

gql`
  fragment BadgeModel on BadgeModel {
    id
    uri
    controllerType
    creatorFee
    validFor
    paused
    badgesMintedAmount
    contractAddress
    createdTxHash
    creator {
      ...User
    }
  }
`

gql`
  fragment BadgeModelKlerosMetadata on BadgeModelKlerosMetaData {
    admin
    arbitrator
    governor
    challengePeriodDuration
    id
    registrationUri
    removalUri
    submissionBaseDeposit
    tcrList
  }
`

gql`
  fragment BadgeModelThirdPartyMetaData on BadgeModelThirdPartyMetaData {
    id
    requirementsIPFSHash
  }
`

import gql from 'graphql-tag'

gql`
  fragment BadgeModel on BadgeModel {
    id
    uri
    controllerType
    validFor
    creatorFee
    paused
    badgesMintedAmount
    contractAddress
    creator {
      id
      metadataUri
    }
  }
`

gql`
  fragment BadgeModelKlerosMetadata on BadgeModelKlerosMetaData {
    id
    registrationUri
    removalUri
    tcrList
    submissionBaseDeposit
    challengePeriodDuration
  }
`

gql`
  fragment BadgeModelThirdPartyMetaData on BadgeModelThirdPartyMetaData {
    id
    requirementsIPFSHash
  }
`

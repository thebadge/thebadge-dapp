import gql from 'graphql-tag'

gql`
  fragment FullBadgeDetails on Badge {
    id
    status
    account {
      id
    }
    badgeModel {
      id
      uri
      controllerType
      creatorFee
      validFor
      badgesMintedAmount
      badgeModelKleros {
        registrationUri
        removalUri
        tcrList
        submissionBaseDeposit
        challengePeriodDuration
      }
    }
  }
`

/**
 * Small fragment to use on the explorer, to search and list all the badges in review,
 * Fetching an small amount of data speed up a little bit the time to render the list
 */

gql`
  fragment BadgeWithJustIds on Badge {
    id
    status
    uri
    account {
      id
    }
    badgeModel {
      id
      uri
      badgeModelKleros {
        registrationUri
      }
    }
  }
`

/**
 * Small fragment to use on the explorer, to search and list all the badges types,
 * Fetching an small amount of data speed up a little bit the time to render the list
 */

gql`
  fragment BadgeModel on BadgeModel {
    id
    uri
    controllerType
    validFor
    creatorFee
    paused
    badgesMintedAmount
    creator {
      id
      creatorUri
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
  fragment Request on KlerosBadgeRequest {
    id
    requestIndex
    submissionTime
    arbitrationParamsIndex
    type
    requestBadgeEvidenceUri
    removeOrChallengeEvidenceUri
    extraEvidenceUris
    challenger
  }
`

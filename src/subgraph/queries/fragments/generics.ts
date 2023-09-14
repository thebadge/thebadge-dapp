import gql from 'graphql-tag'

gql`
  fragment Request on KlerosBadgeRequest {
    id
    type
    createdAt
    requestIndex
    arbitrationParamsIndex
    requester
    challenger
    disputeID
    disputeOutcome
    evidences {
      ...Evidence
    }
  }
`

gql`
  fragment Evidence on Evidence {
    id
    sender
    timestamp
    uri
  }
`

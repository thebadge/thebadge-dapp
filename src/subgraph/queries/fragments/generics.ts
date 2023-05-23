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
    evidences {
      ...Evidence
    }
  }
`

gql`
  fragment Evidence on Evidence {
    id
    uri
    sender
  }
`
import gql from 'graphql-tag'

export const CREATORS = gql`
  query users {
    users(where: { isCreator: true }) {
      id
    }
  }
`

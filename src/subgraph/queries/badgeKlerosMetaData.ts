import gql from 'graphql-tag'

// TODO: hardcoded for kleros, fix it.
export const BADGES_METADATA_USER_CHALLENGED = gql`
  query badgesMetaDataUserChallenged($userAddress: Bytes!) {
    badgeKlerosMetaDatas(
      where: { requests_: { challenger: $userAddress }, badge_: { status: Challenged } }
    ) {
      ...BadgeKlerosMetadataWithBadge
    }
  }
`

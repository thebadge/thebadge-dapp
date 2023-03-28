import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import challengedLogo from '@/src/components/assets/challenged.webp'
import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { notify } from '@/src/components/toast/Toast'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { ToastStates } from '@/types/toast'

export default function BadgeOwnedPreview() {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()

  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  const ownerAddress = searchParams.get('ownerAddress')

  if (!typeId || !ownerAddress) {
    throw `No typeId/ownerAddress provided us URL query param`
  }

  const badgeId = `${ownerAddress}-${typeId}`

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeResponse = gql.useBadgeById({ id: badgeId })

  const badge = badgeResponse.data?.badge
  const badgeType = badge?.badgeType

  const res: any = useS3Metadata(badgeType?.metadataURL || '')
  const badgeMetadata = res.data.content

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
  }

  return (
    <>
      {/** TODO Temporary logic - Update to "Challenged" status **/}
      {badge?.status === 'Approved' && (
        <Box sx={{ position: 'absolute', right: 0, top: -10, width: '150px', cursor: 'pointer' }}>
          <Image alt="Challenged badge" src={challengedLogo} />
        </Box>
      )}
      <Box display="flex" flex={1} gap={4} justifyContent="space-between" my={4}>
        <Box display="flex">
          <BadgeTypeMetadata metadata={badgeType?.metadataURL} />
        </Box>
        <Stack gap={2} justifyContent="space-between">
          <Stack gap={3}>
            <Typography
              sx={{
                color: colors.green,
                textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
              }}
              variant="dAppTitle3"
            >
              {badgeMetadata.name}
            </Typography>
            <Typography sx={{ color: colors.green, fontWeight: 'bold' }} variant="caption">
              Badge type ID: {typeId}
            </Typography>
          </Stack>
          <Divider color={colors.white} />
          <Stack gap={4} minHeight="50%">
            <Typography variant="body2">
              {t('badge.viewBadge.issueBy', { issuer: 'TheBadge' })}
            </Typography>
            <Typography variant="dAppBody1">{badgeMetadata.description}</Typography>
          </Stack>
          <Divider color={colors.white} />
          <Typography
            sx={{
              color: colors.green,
            }}
            variant="body4"
          >
            {badgeType?.badgesMintedAmount}
            {t('badge.viewBadge.claims')}
          </Typography>
          <Box alignItems="center" display="flex" justifyContent="space-between">
            <Typography variant="body4">
              {t('badge.viewBadge.checkHowElse')}
              <LinkWithTranslation pathname="/badge/explorer">SEE ALL</LinkWithTranslation>
            </Typography>
            <IconButton aria-label="Share badge preview" component="label" onClick={handleShare}>
              <ShareOutlinedIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </>
  )
}

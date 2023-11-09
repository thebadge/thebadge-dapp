import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, IconButton, Stack, Typography, styled } from '@mui/material'
import { IconGithub, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { notify } from '@/src/components/toast/Toast'
import { APP_URL } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useIsThirdPartyBadge from '@/src/hooks/subgraph/useIsThirdPartyBadge'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeTitle from '@/src/pagePartials/badge/preview/addons/BadgeTitle'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import {
  generateBadgeExplorer,
  generateBadgePreviewUrl,
  generateProfileUrl,
} from '@/src/utils/navigation/generateUrl'
import { CreatorMetadata } from '@/types/badges/Creator'
import { TheBadge__factory } from '@/types/generated/typechain'
import { ToastStates } from '@/types/toast'

const Wrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(4),
  margin: theme.spacing(4, 0),

  [theme.breakpoints.up('sm')]: {
    width: '100%',
    padding: theme.spacing(0.5, 0, 1.5, 0),
    flex: 1,
    gap: theme.spacing(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}))

export default function BadgeOwnedPreview() {
  const { t } = useTranslation()

  const badgeId = useBadgeIdParam()
  const isMobile = useSizeSM()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const { web3Provider } = useWeb3Connection()
  const badgeById = useBadgeById(badgeId)
  const isThirdParty = useIsThirdPartyBadge(badgeId)
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const creatorAddress = isThirdParty ? badgeModel?.creator.id : null
  const badgeModelMetadata = badgeModel?.badgeModelMetadata
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(badgeModel?.uri || '')
  const creatorMetadata = resCreatorMetadata.data?.content
  let issuer = 'TheBadge'
  if (isThirdParty && creatorMetadata && creatorMetadata.name) {
    issuer = creatorMetadata.name
  }
  console.log('asd', issuer)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
  }

  async function handleImport() {
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await web3Provider?.send('wallet_watchAsset', {
        type: 'ERC1155',
        options: {
          address: theBadge.address,
          tokenId: badgeId,
        },
      } as unknown as any)

      if (wasAdded) {
        notify({ message: `Badge #${badgeId} added to metamask!`, type: ToastStates.success })
      } else {
        notify({
          message: `Badge ID #${badgeId} could not be added to metamask!`,
          type: ToastStates.info,
        })
      }
    } catch (error) {
      console.error(error)
      notify({
        message: `There was an error adding the badge #${badgeId} to metamask!`,
        type: ToastStates.infoFailed,
      })
    }
  }

  return (
    <Wrapper>
      {isMobile && <BadgeTitle />}

      {/* Badge Image */}
      <Stack alignItems="center">
        <BadgeModelPreview
          badgeUrl={APP_URL + generateBadgePreviewUrl(badgeId)}
          effects
          metadata={badgeModel?.uri}
        />
      </Stack>

      {/* Badge Metadata */}
      <Stack flex={2} gap={3}>
        {!isMobile && <BadgeTitle />}
        {!isMobile && <Divider color={colors.white} />}

        <Stack flex={1} gap={4} minHeight="50%">
          {/* Issued By and Share */}
          <Box alignItems="center" display="flex" justifyContent="space-between">
            <Typography variant="body2">
              {t('badge.viewBadge.issueBy')}
              {creatorAddress ? (
                <LinkWithTranslation
                  pathname={generateProfileUrl({ address: creatorAddress })}
                  queryParams={{ target: '_blank' }}
                >
                  {issuer}
                </LinkWithTranslation>
              ) : (
                issuer
              )}
            </Typography>
            <Box alignItems="center" display="flex" justifyContent="flex-end">
              <IconButton aria-label="Share badge preview" component="label" onClick={handleShare}>
                <ShareOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="Import badge to metamask"
                component="label"
                onClick={handleImport}
              >
                <IconGithub color={colors.white} />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="dAppBody1">{badgeModelMetadata?.description}</Typography>
        </Stack>
        <Divider color={colors.white} />

        {/* Number of claims and see all */}
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography
            sx={{
              color: colors.green,
            }}
            variant="body4"
          >
            {t('badge.viewBadge.claims', { amount: badgeModel?.badgesMintedAmount })}
          </Typography>

          <Typography variant="body4">
            {t('badge.viewBadge.checkHowElse')}
            <LinkWithTranslation pathname={generateBadgeExplorer()}>
              {t('badge.viewBadge.seeAll').toUpperCase()}
            </LinkWithTranslation>
          </Typography>
        </Box>
      </Stack>
    </Wrapper>
  )
}

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { notify } from '@/src/components/toast/Toast'
import { APP_URL } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useIsThirdPartyBadge from '@/src/hooks/subgraph/useIsThirdPartyBadge'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeTitle from '@/src/pagePartials/badge/preview/addons/BadgeTitle'
import {
  generateBadgeExplorer,
  generateBadgePreviewUrl,
  generateProfileUrl,
} from '@/src/utils/navigation/generateUrl'
import { CreatorMetadata } from '@/types/badges/Creator'
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

  const badgeById = useBadgeById(badgeId)
  const isThirdParty = useIsThirdPartyBadge(badgeId)

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const creatorAddress = isThirdParty ? badgeModel?.creator.id : null
  const badgeModelMetadata = badgeModel?.badgeModelMetadata
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(badgeModel?.uri || '')
  const creatorMetadata = resCreatorMetadata.data?.content
  const issuer = isThirdParty && creatorMetadata ? creatorMetadata.name : 'TheBadge'

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
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
                { issuer }
              )}
            </Typography>
            <IconButton aria-label="Share badge preview" component="label" onClick={handleShare}>
              <ShareOutlinedIcon />
            </IconButton>
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

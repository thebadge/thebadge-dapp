import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { notify } from '@/src/components/toast/Toast'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import ChallengedStatusLogo from '@/src/pagePartials/badge/preview/addons/ChallengedStatusLogo'
import { BadgeStatus } from '@/types/generated/subgraph'
import { ToastStates } from '@/types/toast'

export default function BadgeOwnedPreviewMobile() {
  const { t } = useTranslation()

  const badgeId = useBadgeIdParam()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeById = useBadgeById(badgeId)

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const badgeModelMetadata = badgeModel?.badgeModelMetadata

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
  }

  return (
    <>
      {badge?.status === BadgeStatus.Challenged && <ChallengedStatusLogo />}
      <Stack gap={4} my={4}>
        {/* Badge Title and ID */}
        <Stack gap={3}>
          <Typography
            sx={{
              color: colors.green,
              textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
            }}
            textAlign="center"
            variant="dAppTitle3"
          >
            {badgeModelMetadata?.name}
          </Typography>
          <Typography
            sx={{ color: colors.green, fontWeight: 'bold' }}
            textAlign="center"
            variant="caption"
          >
            {t('badge.viewBadge.id', { id: badgeId })}
          </Typography>
        </Stack>

        {/* Badge Image */}
        <Stack alignItems="center">
          <BadgeModelPreview effects metadata={badgeModel?.uri} />
        </Stack>

        <Stack flex={2} gap={2} justifyContent="space-between">
          <Stack gap={4} minHeight="50%">
            {/* Issued By and Share */}
            <Box alignItems="center" display="flex" justifyContent="space-between">
              <Typography variant="body2">
                {t('badge.viewBadge.issueBy', { issuer: 'TheBadge' })}
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
              <LinkWithTranslation pathname="/badge/explorer">
                {t('badge.viewBadge.seeAll').toUpperCase()}
              </LinkWithTranslation>
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

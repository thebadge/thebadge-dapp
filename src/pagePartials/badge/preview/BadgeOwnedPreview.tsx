import Image from 'next/image'

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import challengedLogo from '@/src/components/assets/challenged.webp'
import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { notify } from '@/src/components/toast/Toast'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { BadgeStatus } from '@/types/generated/subgraph'
import { ToastStates } from '@/types/toast'

export default function BadgeOwnedPreview() {
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
      {badge?.status === BadgeStatus.Challenged && (
        <Box sx={{ position: 'absolute', right: 0, top: -10, width: '150px', cursor: 'pointer' }}>
          <Image alt="Challenged badge" src={challengedLogo} />
        </Box>
      )}
      <Box display="flex" flex={1} gap={8} justifyContent="space-between" my={4}>
        <Box display="flex" flex={1}>
          <BadgeModelPreview effects metadata={badgeModel?.uri} />
        </Box>
        <Stack flex={2} gap={2} justifyContent="space-between">
          <Stack gap={3}>
            <Typography
              sx={{
                color: colors.green,
                textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
              }}
              variant="dAppTitle3"
            >
              {badgeModelMetadata?.name}
            </Typography>
            <Typography sx={{ color: colors.green, fontWeight: 'bold' }} variant="caption">
              Badge model ID: {badgeModel?.id}
            </Typography>
          </Stack>
          <Divider color={colors.white} />
          <Stack gap={4} minHeight="50%">
            <Typography variant="body2">
              {t('badge.viewBadge.issueBy', { issuer: 'TheBadge' })}
            </Typography>
            <Typography variant="dAppBody1">{badgeModelMetadata?.description}</Typography>
          </Stack>
          <Divider color={colors.white} />
          <Typography
            sx={{
              color: colors.green,
            }}
            variant="body4"
          >
            {badgeModel?.badgesMintedAmount}
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

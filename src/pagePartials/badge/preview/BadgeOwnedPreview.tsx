import Link from 'next/link'
import * as React from 'react'

import { LinkedIn } from '@mui/icons-material'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import { IconMetamask, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { notify } from '@/src/components/toast/Toast'
import { APP_URL, THE_BADGE_LINKEDIN_ID } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useAddTokenIntoWallet from '@/src/hooks/theBadge/useAddTokenIntoWallet'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeTitle from '@/src/pagePartials/badge/preview/addons/BadgeTitle'
import { getExpirationYearAndMonth, getIssueYearAndMonth } from '@/src/utils/dateUtils'
import {
  generateBadgeExplorer,
  generateBadgePreviewUrl,
  generateLinkedinOrganization,
  generateLinkedinUrl,
  generateProfileUrl,
} from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
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
  const theme = useTheme()

  const badgeId = useBadgeIdParam()
  const isMobile = useSizeSM()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const addTokenIntoWallet = useAddTokenIntoWallet()
  const badgeById = useBadgeById(badgeId)

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const creatorAddress = badgeModel?.creator.id || ''
  const creatorResponse = useUserById(creatorAddress)
  const creator = creatorResponse.data
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(creator?.metadataUri || '')
  const badgeModelMetadata = badgeModel?.badgeModelMetadata

  const creatorMetadata = resCreatorMetadata.data?.content
  let issuer = 'TheBadge'
  if (creatorMetadata && creatorMetadata.name) {
    issuer = creatorMetadata.name
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
  }

  function handleImport() {
    addTokenIntoWallet(badgeId)
  }

  async function handleImportLinkedin() {
    try {
      if (!badge || !badge.badgeMetadata) {
        throw new Error('The badge has no name!')
      }
      const { expirationMonth, expirationYear } = getExpirationYearAndMonth(badge.validUntil)
      // TODO replace createdAt with claimedAt in case of third party
      const { issueMonth, issueYear } = getIssueYearAndMonth(badge.createdAt)

      const thirdPartyOrganizationId = generateLinkedinOrganization(creatorMetadata?.linkedin || '')
      const linkedinUrl = generateLinkedinUrl({
        name: badge?.badgeMetadata.name,
        organizationName:
          badgeModel?.controllerType === BadgeModelControllerType.Community ? undefined : issuer,
        organizationId:
          badgeModel?.controllerType === BadgeModelControllerType.Community
            ? THE_BADGE_LINKEDIN_ID
            : thirdPartyOrganizationId,
        issueYear: String(issueYear),
        issueMonth: String(issueMonth),
        expirationYear: String(expirationYear),
        expirationMonth: String(expirationMonth),
        certUrl: APP_URL + generateBadgePreviewUrl(badgeId),
        certId: badgeId,
      })

      window.open(linkedinUrl)
    } catch (error) {
      console.error(error)
      notify({
        message: `There was an error adding the badge #${badgeId} to linkedin!...`,
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
                <Link href={generateProfileUrl({ address: creatorAddress })} target={'_blank'}>
                  <span style={{ textDecoration: 'underline' }}>{issuer}</span>
                </Link>
              ) : (
                issuer
              )}
            </Typography>
            <Box alignItems="center" display="flex" justifyContent="flex-end">
              <IconButton aria-label="Share badge preview" component="label" onClick={handleShare}>
                <ShareOutlinedIcon />
              </IconButton>
              <Tooltip arrow title={t('badge.viewBadge.importBadge')}>
                <IconButton
                  aria-label={t('badge.viewBadge.importBadge')}
                  component="label"
                  onClick={handleImport}
                >
                  <IconMetamask color={colors.white} />
                </IconButton>
              </Tooltip>
              <Tooltip arrow title={t('badge.viewBadge.importLinkedin')}>
                <IconButton
                  aria-label={t('badge.viewBadge.importLinkedin')}
                  component="label"
                  onClick={handleImportLinkedin}
                >
                  <LinkedIn
                    sx={{
                      width: theme.customSizes.icon,
                      height: theme.customSizes.icon,
                      fill: colors.white,
                    }}
                  />
                </IconButton>
              </Tooltip>
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
            <Link href={generateBadgeExplorer()}>
              <span style={{ textDecoration: 'underline', textTransform: 'uppercase' }}>
                {t('badge.viewBadge.seeAll')}
              </span>
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Wrapper>
  )
}

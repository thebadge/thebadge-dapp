import Image from 'next/image'
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
import { TwitterShareButton, XIcon } from 'react-share'

import { notify } from '@/src/components/toast/Toast'
import { THE_BADGE_LINKEDIN_ID } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useIsThirdPartyBadge from '@/src/hooks/subgraph/useIsThirdPartyBadge'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useAddTokenIntoWallet from '@/src/hooks/theBadge/useAddTokenIntoWallet'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import { BadgeView } from '@/src/pagePartials/badge/preview/BadgeView'
import BadgeTitle from '@/src/pagePartials/badge/preview/addons/BadgeTitle'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { handleShare } from '@/src/utils/badges/viewUtils'
import { getExpirationYearAndMonth, getIssueYearAndMonth } from '@/src/utils/dateUtils'
import {
  generateExplorer,
  generateLinkedinOrganization,
  generateLinkedinUrl,
  generateProfileUrl,
  generateTwitterText,
} from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { CreatorMetadata } from '@/types/badges/Creator'
import { ToastStates } from '@/types/toast'
import { WCAddress } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

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

  const { badgeId, contract } = useBadgeIdParam()
  const isMobile = useSizeSM()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeById = useBadgeById(badgeId, contract)
  const addTokenIntoWallet = useAddTokenIntoWallet()
  const isThirdPartyBadge = useIsThirdPartyBadge(badgeId, contract)

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const creatorAddress = badgeModel?.creator.id || '0x'
  const creatorResponse = useUserById(creatorAddress as WCAddress, contract)
  const creator = creatorResponse.data
  const { badgeOpenseaUrl, badgePreviewUrl, shortPreviewURl } = useBadgePreviewUrl(
    badgeId,
    badge?.contractAddress,
  )
  //  const creatorMetadata = useUserMetadata(creator?.id, creator?.metadataUri || '')
  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(
    `${badgeId}` || '',
    badge?.contractAddress,
  )
  const badgeModelName = badgeModel?.badgeModelMetadata?.name || ''
  const { readOnlyChainId } = useWeb3Connection()

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(creator?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  if (!badge || !badgeModel) {
    return null
  }

  const badgeModelMetadata = badgeModel?.badgeModelMetadata
  let issuer = 'TheBadge'
  if (creatorMetadata && creatorMetadata.name) {
    issuer = creatorMetadata.name
  }

  function handleImport() {
    addTokenIntoWallet(badgeId, badge?.badgeMetadata?.image.s3Url)
  }

  async function handleImportLinkedin() {
    try {
      if (!badge || !badge.badgeMetadata || !badgeModel) {
        throw new Error('The badge does not exists or there is an issue with the badgeModel!')
      }
      const { expirationMonth, expirationYear } = getExpirationYearAndMonth(badge.validUntil)

      const { issueMonth, issueYear } = isThirdPartyBadge
        ? getIssueYearAndMonth(badge.claimedAt)
        : getIssueYearAndMonth(badge.createdAt)

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
        certUrl: badgePreviewUrl,
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

  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  return (
    <Wrapper>
      {isMobile && <BadgeTitle />}

      {/* Badge Image */}
      <Stack alignItems="center">
        <BadgeView
          additionalData={{ ...values }}
          badgeUrl={badgePreviewUrl}
          modelId={badgeModel.id}
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
                <Link
                  href={generateProfileUrl({
                    address: creatorAddress,
                    connectedChainId: readOnlyChainId,
                  })}
                  target={'_blank'}
                >
                  <span style={{ textDecoration: 'underline' }}>{issuer}</span>
                </Link>
              ) : (
                issuer
              )}
            </Typography>
            <Box alignItems="center" display="flex" justifyContent="flex-end">
              <Tooltip arrow title={t('badge.viewBadge.shareBadge')}>
                <IconButton
                  aria-label="Share badge preview"
                  component="label"
                  onClick={() => handleShare()}
                >
                  <ShareOutlinedIcon />
                </IconButton>
              </Tooltip>
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
              <Tooltip arrow title={t('badge.viewBadge.shareTwitter')}>
                <TwitterShareButton
                  related={['@thebadgexyz']}
                  url={generateTwitterText(badgeModelName, shortPreviewURl)}
                >
                  <XIcon round size={32} />
                </TwitterShareButton>
              </Tooltip>
              {badgeOpenseaUrl ? (
                <Tooltip arrow title={t('badge.viewBadge.viewOpensea')}>
                  <IconButton
                    aria-label={t('badge.viewBadge.viewOpensea')}
                    component="label"
                    onClick={() => window.open(badgeOpenseaUrl)}
                  >
                    <Image
                      alt={t('badge.viewBadge.viewOpensea')}
                      height={theme.customSizes.icon}
                      src="https://opensea.io/static/images/favicon/favicon.ico"
                      width={theme.customSizes.icon}
                    />
                  </IconButton>
                </Tooltip>
              ) : null}
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
            <Link href={generateExplorer()}>
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

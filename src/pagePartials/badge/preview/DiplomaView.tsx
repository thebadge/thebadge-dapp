import React from 'react'

import { DiplomaPreview } from '@thebadge/ui-library'

import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import { getDiplomaConfigs } from '@/src/utils/badges/metadataHelpers'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import {
  DiplomaFooterConfig,
  DiplomaHeaderConfig,
  DiplomaIssuerConfig,
  DiplomaSignatureConfig,
} from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  modelId: string
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export default function DiplomaView({ additionalData, badgeUrl, modelId }: Props) {
  const isMobile = useSizeSM()
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const {
    achievementDate,
    achievementDescription,
    courseName,
    footerConfigs,
    headerConfigs,
    issuerConfigs,
    signerConfigs,
  } = getDiplomaConfigs(badgeModelMetadata?.attributes)

  const signerConfigsMetadata = useS3Metadata<{
    content: DiplomaSignatureConfig<BackendFileResponse>
  }>((signerConfigs?.value as string) || '')

  const footerConfigsMetadata = useS3Metadata<{ content: DiplomaFooterConfig }>(
    (footerConfigs?.value as string) || '',
  )
  const headerConfigsMetadata = useS3Metadata<{ content: DiplomaHeaderConfig }>(
    (headerConfigs?.value as string) || '',
  )
  const issuerConfigsMetadata = useS3Metadata<{
    content: DiplomaIssuerConfig<BackendFileResponse>
  }>((issuerConfigs?.value as string) || '')

  const issuerAvatarUrl = issuerConfigsMetadata.data?.content.issuerAvatar?.s3Url
  const issuerLabel = issuerConfigsMetadata.data?.content.issuedByLabel
  const issuerTitle = issuerConfigsMetadata.data?.content.issuerTitle
  const issuerDescription = issuerConfigsMetadata.data?.content.issuerDescription

  const signatureEnabled = signerConfigsMetadata.data?.content.signatureEnabled
  const signatureProps = signatureEnabled
    ? {
        signatureImageUrl: signerConfigsMetadata.data?.content.signatureImage?.s3Url,
        signerTitle: signerConfigsMetadata.data?.content.signerTitle,
        signerSubline: signerConfigsMetadata.data?.content.signerSubline,
      }
    : {}

  const footerEnabled = footerConfigsMetadata.data?.content.footerEnabled
  const footerText = footerConfigsMetadata.data?.content.footerText

  const headerLogoUrl = headerConfigsMetadata.data?.content.headerLogo?.s3Url

  return (
    <DiplomaPreview
      animationEffects={isMobile ? [] : ['wobble', 'grow', 'glare']}
      animationOnHover
      backgroundUrl={'https://dev-app.thebadge.xyz/shareable/diploma-background.png'}
      badgeUrl={badgeUrl}
      courseName={courseName?.value}
      date={achievementDate?.value}
      decorationBackgroundUrl={'https://dev-app.thebadge.xyz/shareable/diploma-decoration.png'}
      description={achievementDescription?.value}
      footerText={
        footerEnabled ? enrichTextWithValues(footerText, additionalData as EnrichTextValues) : ''
      }
      headerLogoUrl={headerLogoUrl}
      issuedByLabel={issuerLabel || 'Issued by'}
      issuerAvatarUrl={issuerAvatarUrl}
      issuerDescription={issuerDescription}
      issuerIsVerified={''}
      issuerTitle={issuerTitle}
      studentName={enrichTextWithValues('{{studentName}}', additionalData as EnrichTextValues)}
      sx={
        isMobile
          ? { scale: '0.5', transform: 'translate(-50%, -50%)', margin: '10px' }
          : { margin: '10px', maxWidth: '-webkit-fill-available' }
      }
      textContrastRight="dark"
      {...signatureProps}
    />
  )
}

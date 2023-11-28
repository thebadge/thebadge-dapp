import React from 'react'

import { DiplomaPreview } from '@thebadge/ui-library'

import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import {
  DiplomaFooterConfig,
  DiplomaIssuerConfig,
  DiplomaNFTAttributesType,
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

  const courseName = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.CourseName,
  )
  const achievementDescription = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.AchievementDescription,
  )
  const achievementDate = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.AchievementDate,
  )
  const issuerConfigs = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.IssuerConfigs,
  )
  const footerConfigs = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.FooterConfigs,
  )
  const signerConfigs = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.SignerConfigs,
  )

  const signerConfigsMetadata = useS3Metadata<{
    content: DiplomaSignatureConfig<BackendFileResponse>
  }>((signerConfigs?.value as string) || '')

  const footerConfigsMetadata = useS3Metadata<{ content: DiplomaFooterConfig }>(
    (footerConfigs?.value as string) || '',
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
      issuedByLabel={issuerLabel || 'Issued by'}
      issuerAvatarUrl={issuerAvatarUrl}
      issuerDescription={issuerDescription}
      issuerIsVerified={''}
      issuerTitle={issuerTitle}
      studentName={enrichTextWithValues('{{studentName}}', additionalData as EnrichTextValues)}
      sx={
        isMobile
          ? { scale: '0.5', transform: 'translate(-37.5%)', margin: '10px' }
          : { margin: '10px' }
      }
      textContrastRight="dark"
      {...signatureProps}
    />
  )
}

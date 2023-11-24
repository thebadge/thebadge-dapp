import React, { useCallback, useEffect, useRef } from 'react'

import { Box } from '@mui/material'
import { DiplomaPreview } from '@thebadge/ui-library'
import { UseFormSetValue } from 'react-hook-form'

import { APP_URL } from '@/src/constants/common'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'
import {
  DiplomaFooterConfig,
  DiplomaIssuerConfig,
  DiplomaNFTAttributesType,
  DiplomaSignatureConfig,
} from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  modelId: string
  setValue: UseFormSetValue<any>
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export default function DiplomaPreviewGenerator({ additionalData, modelId, setValue }: Props) {
  const diplomaPreviewRef = useRef<HTMLDivElement>()
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

  const generatePreviewImage = useCallback(
    async (badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>) => {
      const previewImage = await convertPreviewToImage(badgePreviewRef)
      setValue('previewImage', previewImage)
    },
    [setValue],
  )

  useEffect(() => {
    if (diplomaPreviewRef.current) {
      generatePreviewImage(diplomaPreviewRef)
    }
  }, [diplomaPreviewRef, generatePreviewImage])

  const issuerAvatarUrl = issuerConfigsMetadata.data?.content.issuerAvatar?.s3Url
  const issuerLabel = issuerConfigsMetadata.data?.content.issuedByLabel

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
    <>
      <Box ref={diplomaPreviewRef}>
        <DiplomaPreview
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          backgroundUrl={
            'https://images.unsplash.com/photo-1651527567593-32c04202ed85?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          badgeUrl={APP_URL}
          courseName={courseName?.value}
          date={achievementDate?.value}
          decorationBackgroundUrl={
            'https://images.unsplash.com/photo-1638272181967-7d3772a91265?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          description={achievementDescription?.value}
          footerText={footerEnabled ? footerText : ''}
          issuedByLabel={issuerLabel || 'Issued by'}
          issuerAvatarUrl={issuerAvatarUrl}
          issuerIsVerified={''}
          studentName={additionalData ? additionalData['studentName'] : '{{studentName}}'}
          {...signatureProps}
        />
      </Box>
    </>
  )
}

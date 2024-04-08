import React from 'react'

import { Box, alpha, styled } from '@mui/material'
import { DiplomaPreview } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'

import { APP_URL } from '@/src/constants/common'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import { useSizeSM } from '@/src/hooks/useSize'
import { CreateThirdPartyDiplomaModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function DiplomaCreationPreview() {
  const { address } = useWeb3Connection()
  const { watch } = useFormContext<CreateThirdPartyDiplomaModelSchemaType>()

  if (!address) {
    // TODO: Temporal error, I will remove it
    throw 'You may need to connect your wallet'
  }

  const isVerified = useIsUserVerified(address, 'kleros')

  // Diploma Badge Configs
  const courseName = watch('courseName') || 'Name of the course'
  const achievementDescription =
    watch('achievementDescription') || 'has successfully completed the course'
  const achievementDate = watch('achievementDate') || dayjs().format('MMMM D, YYYY')

  // Footer
  const footerEnabled = watch('footerEnabled')
  const footerText = watch('footerText')

  // Signature
  const signatureEnabled = watch('signatureEnabled')
  const signatureImageUrl = watch('signatureImage')?.base64File || ''
  const signerTitle = watch('signerTitle') || 'Max Mustermann'
  const signerSubline = watch('signerSubline') || 'CEO of TheGreatestCompany'

  // Issuer
  const issuedByLabel = watch('issuedByLabel') || 'Issued by'
  const issuerAvatar = watch('issuerAvatar')?.base64File
  const issuerTitle = watch('issuerTitle')
  const issuerDescription = watch('issuerDescription')

  // Header
  const headerLogo = watch('headerLogo')?.base64File

  const signatureProps = signatureEnabled
    ? {
        signatureImageUrl,
        signerTitle,
        signerSubline,
      }
    : {}

  const isMobile = useSizeSM()

  return (
    <BoxShadow sx={isMobile ? { display: 'block', maxHeight: '220px' } : {}}>
      <DiplomaPreview
        animationEffects={isMobile ? [] : ['wobble', 'grow', 'glare']}
        animationOnHover
        badgeUrl={APP_URL}
        courseName={courseName}
        date={achievementDate}
        description={achievementDescription}
        footerText={footerEnabled && footerText}
        headerLogoUrl={headerLogo}
        issuedByLabel={issuedByLabel}
        issuerAvatarUrl={issuerAvatar}
        issuerDescription={issuerDescription}
        issuerIsVerified={isVerified}
        issuerTitle={issuerTitle}
        studentName={'{{studentName}}'}
        sx={isMobile ? { scale: '0.5', transform: 'translate(-50%, -50%)' } : {}}
        textContrastRight="dark"
        {...signatureProps}
      />
    </BoxShadow>
  )
}

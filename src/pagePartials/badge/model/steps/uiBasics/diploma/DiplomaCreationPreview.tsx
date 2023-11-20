import React from 'react'

import { Box, alpha, styled } from '@mui/material'
import { DiplomaPreview } from '@thebadge/ui-library'
import { useFormContext } from 'react-hook-form'

import { APP_URL } from '@/src/constants/common'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { CreatorMetadata } from '@/types/badges/Creator'

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function DiplomaCreationPreview() {
  const { address } = useWeb3Connection()
  const { watch } = useFormContext<CreateThirdPartyModelSchemaType>()

  if (!address) {
    // TODO: Temporal error, I will remove it
    throw 'You may need to connect your wallet'
  }

  const { data } = useUserById(address)
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(data?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content
  const isVerified = useIsUserVerified(address, 'kleros')

  // Diploma Badge Configs
  const courseName = watch('courseName') || 'Name of the course'
  const achievementDescription =
    watch('achievementDescription') || 'has successfully completed the course'
  const achievementDate = watch('achievementDate') || 'November 9, 2023'

  const footerEnabled = watch('footerEnabled')
  const footerText =
    watch('footerText') || 'account.eth hast confirmed the identity {{studentName}}'

  const signatureEnabled = watch('signatureEnabled')

  const signatureImageUrl =
    'https://images.unsplash.com/photo-1645484686977-dbddd9e1dc0a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  const signerTitle = 'Max Mustermann'
  const signerSubline = 'CEO of TheGreatestCompany'

  const signatureProps = signatureEnabled
    ? {
        signatureImageUrl,
        signerTitle,
        signerSubline,
      }
    : {}

  return (
    <BoxShadow>
      <DiplomaPreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeUrl={APP_URL}
        courseName={courseName}
        date={achievementDate}
        description={achievementDescription}
        footerText={footerEnabled && footerText}
        issuedByLabel={'Issued by'}
        issuerAvatarUrl={creatorMetadata?.logo?.s3Url}
        issuerIsVerified={isVerified}
        studentName={'{{studentName}}'}
        {...signatureProps}
      />
    </BoxShadow>
  )
}

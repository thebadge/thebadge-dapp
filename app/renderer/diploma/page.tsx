import * as React from 'react'

import { DiplomaPreview } from '@thebadge/ui-library'

type InjectedArgs = {
  imageUrl: string
  achievementDate: string
  badgeUrl: string
  courseName: string
  achievementDescription: string
  footerText?: string
  headerLogoUrl: string
  issuedByLabel?: string
  issuerAvatarUrl?: string
  issuerDescription?: string
  issuerIsVerified?: string
  issuerTitle?: string
  studentName: string
  signatureImageUrl?: string
  signerTitle?: string
  signerSubline?: string
  decorationBackgroundUrl?: string
}

export default async function Page({ searchParams }: { searchParams: InjectedArgs }) {
  const {
    achievementDate,
    achievementDescription,
    badgeUrl,
    courseName,
    decorationBackgroundUrl,
    footerText,
    headerLogoUrl,
    issuedByLabel,
    issuerAvatarUrl,
    issuerDescription,
    issuerIsVerified,
    issuerTitle,
    signatureImageUrl,
    signerSubline,
    signerTitle,
    studentName,
  } = searchParams

  const signatureProps =
    signatureImageUrl || signerTitle || signerSubline
      ? {
          signatureImageUrl,
          signerTitle,
          signerSubline,
        }
      : {}

  return (
    <DiplomaPreview
      animationEffects={[]}
      badgeUrl={badgeUrl}
      courseName={courseName}
      date={achievementDate}
      decorationBackgroundUrl={decorationBackgroundUrl}
      description={achievementDescription}
      footerText={footerText}
      headerLogoUrl={headerLogoUrl}
      issuedByLabel={issuedByLabel}
      issuerAvatarUrl={issuerAvatarUrl}
      issuerDescription={issuerDescription}
      issuerIsVerified={issuerIsVerified}
      issuerTitle={issuerTitle}
      studentName={studentName}
      textContrastRight="dark"
      {...signatureProps}
    />
  )
}

'use client'
import * as React from 'react'

import { DiplomaPreview } from '@thebadge/ui-library'
import 'node_modules/@thebadge/ui-library/dist/index.css'

type InjectedArgs = {
  imageUrl: string
  achievementDate: string
  backgroundUrl: string
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
    backgroundUrl,
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

  const userVerified = issuerIsVerified ? JSON.parse(issuerIsVerified) : false

  return (
    <DiplomaPreview
      animationEffects={[]}
      backgroundUrl={backgroundUrl}
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
      issuerIsVerified={userVerified}
      issuerTitle={issuerTitle}
      studentName={studentName}
      textContrastRight="dark"
      {...signatureProps}
    />
  )
}

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import AnimateHeight, { Height } from 'react-animate-height'
import { FormProvider, useForm } from 'react-hook-form'

import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useSizeSM } from '@/src/hooks/useSize'
import useTransaction from '@/src/hooks/useTransaction'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import {
  EditProfileSchema,
  EditProfileSchemaType,
} from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import InfoAbout from '@/src/pagePartials/profile/userInfo/InfoAbout'
import InfoAvatarAddress from '@/src/pagePartials/profile/userInfo/InfoAvatarAddress'
import { InfoPreviewAboutContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewAboutContainer'
import { InfoPreviewContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewContainer'
import { InfoPreviewSocialContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewSocialContainer'
import InfoSocial from '@/src/pagePartials/profile/userInfo/InfoSocial'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'
import { WCAddress } from '@/types/utils'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

type Props = {
  address: WCAddress | string
}
export default function InfoPreview({ address }: Props) {
  const isMobile = useSizeSM()
  const [height, setHeight] = useState<Height>('auto')
  const contentDiv = useRef<HTMLDivElement | null>(null)
  const { address: connectedWalletAddress } = useWeb3Connection()
  const [readView, setReadView] = useState(true)
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  const router = useRouter()

  const { data } = useUserById(address as WCAddress)
  const userMetadata = useUserMetadata(address || connectedWalletAddress, data?.metadataUri || '')
  const { sendTx } = useTransaction()
  const methods = useForm<EditProfileSchemaType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      ...userMetadata,
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setHeight(contentDiv.current?.clientHeight ? contentDiv.current?.clientHeight + 20 : 'auto')
    })

    if (contentDiv.current) resizeObserver.observe(contentDiv.current)

    return () => resizeObserver.disconnect()
  }, [])

  const onSubmit = async (data: EditProfileSchemaType) => {
    if (!address || !userMetadata) {
      throw Error('Web3 address not provided')
    }

    try {
      const transaction = await sendTx(async () => {
        setReadView(true)
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadCreatorMetadata } = await import(
          '@/src/utils/creator/registerHelpers'
        )

        // If data has the base64File, the user had uploaded a new logo
        const logoHasChange = !!data.logo.base64File

        // Use previous data as default, and override with new values
        const upsertCreatorData = {
          logo: userMetadata.logo,
          website: userMetadata.website,
          twitter: userMetadata.twitter,
          discord: userMetadata.discord,
          ...data,
          ...(!logoHasChange && { logo: userMetadata?.logo.base64File }),
        } as EditProfileSchemaType

        const userMetadataIPFSHash = await createAndUploadCreatorMetadata(
          { register: { ...upsertCreatorData, terms: true } },
          logoHasChange,
        )

        return theBadgeUsers.updateProfile(userMetadataIPFSHash)
      })

      if (transaction) {
        await transaction.wait()
        router.refresh()
      }
    } catch (e) {
      setReadView(false)
      // Do nothing
    }
  }

  const onEdit = () => {
    setReadView(false)
  }

  const onClose = () => {
    methods.reset()
    setReadView(true)
  }

  const renderAboutSection = () => {
    if (userMetadata.hasAboutData) {
      return (
        <InfoPreviewAboutContainer>
          <InfoAbout address={address as WCAddress} readView={readView} />
        </InfoPreviewAboutContainer>
      )
    }
    return !readView ? (
      <InfoPreviewAboutContainer>
        <InfoAbout address={address as WCAddress} readView={readView} />
      </InfoPreviewAboutContainer>
    ) : null
  }

  const renderSocialSection = () => {
    if (userMetadata.hasSocialData) {
      return (
        <InfoPreviewSocialContainer isMobile={isMobile}>
          <InfoSocial address={address as WCAddress} readView={readView} />
        </InfoPreviewSocialContainer>
      )
    }
    return !readView ? (
      <InfoPreviewSocialContainer isMobile={isMobile}>
        <InfoSocial address={address as WCAddress} readView={readView} />
      </InfoPreviewSocialContainer>
    ) : null
  }

  return (
    <FormProvider {...methods}>
      <Box mb={6}>
        <AnimateHeight
          contentClassName="auto-content"
          contentRef={contentDiv}
          height={height}
          style={{ padding: 10 }}
        >
          <InfoPreviewContainer>
            <InfoAvatarAddress
              address={address as WCAddress}
              onClose={onClose}
              onEdit={onEdit}
              onSubmit={methods.handleSubmit(onSubmit)}
              readView={readView}
            />
          </InfoPreviewContainer>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
            {renderAboutSection()}
            {renderSocialSection()}
          </Box>
        </AnimateHeight>
      </Box>
    </FormProvider>
  )
}

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSignMessage } from 'wagmi'

import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BADGE_MODEL_TEXT_CONTRAST } from '@/src/constants/backgrounds'
import {
  DEFAULT_COURT_ID,
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useIsRegistered } from '@/src/hooks/subgraph/useIsRegistered'
import useCreateModelFeeValue from '@/src/hooks/theBadge/useCreateModelFeeValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import CreateCommunityBadgeModelWithSteps from '@/src/pagePartials/badge/model/CreateCommunityBadgeModelWithSteps'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import { NormalProfileFilter } from '@/src/pagePartials/profile/UserProfile'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerName, BadgeModelTemplate } from '@/types/badges/BadgeModel'
import { TheBadgeModels__factory, TheBadgeUsers__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const CreateCommunityBadgeModel: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state } = useTransaction()
  const { data: createModelProtocolFee } = useCreateModelFeeValue()
  const router = useRouter()

  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')
  const { data: isRegistered } = useIsRegistered()
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(
        generateProfileUrl({
          address,
          profileType: ProfileType.USER_PROFILE,
          filter: NormalProfileFilter.CREATED_BADGES,
        }),
      )
    }
  }, [router, state, address])

  const createBadgeModelSubmit = async (data: CreateCommunityModelSchemaType) => {
    const {
      backgroundImage,
      badgeMetadataColumns,
      badgeModelLogoUri,
      challengePeriodDuration,
      criteria,
      description,
      name,
      rigorousness,
      textContrast,
    } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const {
          createAndUploadClassicBadgeModelMetadata,
          createAndUploadClearingAndRegistrationFilesForKleros,
          encodeKlerosBadgeModelControllerData,
        } = await import('@/src/utils/badges/createBadgeModelHelpers')

        const { clearingIPFSHash, registrationIPFSHash } =
          await createAndUploadClearingAndRegistrationFilesForKleros(
            name,
            description,
            badgeModelLogoUri,
            criteria,
            badgeMetadataColumns,
          )

        const [badgeModelMetadataIPFSHash, klerosBadgeModelControllerDataEncoded] =
          await Promise.all([
            createAndUploadClassicBadgeModelMetadata(
              name,
              description,
              badgeModelLogoUri,
              backgroundImage,
              BADGE_MODEL_TEXT_CONTRAST[textContrast],
              BadgeModelTemplate.Badge, // TODO Implement template on Community
            ),
            encodeKlerosBadgeModelControllerData(
              address as string,
              contracts.Kleros.address[appChainId],
              readOnlyAppProvider,
              rigorousness,
              /**
               * Default Kleros court to use when creating a new badge model.
               * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
               * In advance mode the user should be able to select the court.
               */
              DEFAULT_COURT_ID,
              registrationIPFSHash,
              clearingIPFSHash,
              challengePeriodDuration,
            ),
          ])

        return theBadgeModels.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: BadgeModelControllerName.Kleros,
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          klerosBadgeModelControllerDataEncoded,
          {
            value: createModelProtocolFee,
          },
        )
      })
      if (transaction) {
        await transaction.wait()
      }
    } catch (e) {
      // Do nothing
    }
  }
  const createRegisterUserSubmit = async (data: CreateCommunityModelSchemaType) => {
    if (!address) {
      throw Error('Web3 address not provided')
    }

    // Message asking the user to accept the terms and privacy policy
    const message = `By signing this message, you confirm your acceptance of our [Terms and Conditions](${TERMS_AND_CONDITIONS_URL}) and [Privacy Policy](${PRIVACY_POLICY_URL}).`

    const signature = await signMessageAsync({ message })
    if (!signature) {
      throw new Error('User rejected the signing of the message.')
    }
    // TODO store the signature on the relayer
    localStorage.setItem('terms-and-conditions-accepted', JSON.stringify({ signature }))
    const transaction = await sendTx(async () => {
      // Use NextJs dynamic import to reduce the bundle size
      const { createAndUploadCreatorMetadata } = await import('@/src/utils/creator/registerHelpers')
      const creatorMetadataIPFSHash = await createAndUploadCreatorMetadata(data)
      return theBadgeUsers.registerUser(creatorMetadataIPFSHash, false)
    })

    if (transaction) {
      await transaction.wait()
    }
  }

  const onSubmit = async (data: CreateCommunityModelSchemaType) => {
    if (!isRegistered) {
      await createRegisterUserSubmit(data)
      await createBadgeModelSubmit(data)
      return
    }
    await createBadgeModelSubmit(data)
  }

  return (
    <CreateCommunityBadgeModelWithSteps
      onSubmit={onSubmit}
      resetTxState={resetTxState}
      txState={state}
    />
  )
}

export default withPageGenericSuspense(CreateCommunityBadgeModel)

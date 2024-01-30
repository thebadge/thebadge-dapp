import { useEffect } from 'react'
import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Divider, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { FormProvider, useForm } from 'react-hook-form'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import useBadgeIDFromULID from '@/src/hooks/nextjs/useBadgeIDFromULID'
import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import useRelayerTransactionEndpoint from '@/src/hooks/useRelayerTransactionEndpoint'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import {
  ClaimThirdPartyBadgeSchema,
  ClaimThirdPartyBadgeSchemaType,
} from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { StepClaimThirdParty } from '@/src/pagePartials/badge/claim/steps/StepClaimThirdParty'
import { StepClaimThirdPartyHeader } from '@/src/pagePartials/badge/claim/steps/StepClaimThirdPartyHeader'
import { StepClaimThirdPartyPreview } from '@/src/pagePartials/badge/claim/steps/StepsClaimThirdPartyPreview'
import StepsClaimThirdPartySucceed from '@/src/pagePartials/badge/claim/steps/StepsClaimThirdPartySucceed'
import { SubmitButton } from '@/src/pagePartials/creator/register/RegistrationWithSteps'
import { PreventActionIfClaimUUIDInvalid } from '@/src/pagePartials/errors/preventActionIfClaimUUIDInvalid'
import { sendClaimRequest } from '@/src/utils/relayTx'
import { NextPageWithLayout } from '@/types/next'

const ClaimBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { badgeModelId, contract } = useModelIdParam()
  const {
    resetTxState,
    sendRequest,
    setTransactionState,
    state: txState,
  } = useRelayerTransactionEndpoint()
  const badgeModelData = useBadgeModel(badgeModelId, contract)

  const badgeCreatorMetadata = useUserMetadata(
    badgeModelData.data?.badgeModel?.creator.id,
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelData || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const methods = useForm<ClaimThirdPartyBadgeSchemaType>({
    resolver: zodResolver(ClaimThirdPartyBadgeSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })
  const claimAddress = methods.getValues().claimAddress
  const triggerValidation = useTriggerRHF(methods)

  async function isValidStep() {
    return await triggerValidation(['claimAddress'])
  }

  const { claimUUID } = useClaimParams()
  const { data: badgeId } = useBadgeIDFromULID()
  if (!claimUUID || !badgeId) {
    throw `No claimUUID provided us URL query param`
  }

  const { data: isClaimable } = useIsClaimable(badgeId)

  const onSubmit = async () => {
    const inputValid = await isValidStep()
    if (inputValid) {
      const { claimAddress } = methods.getValues()
      await sendRequest(() => sendClaimRequest(claimUUID, claimAddress))
    }
  }

  /**
   * Temporal fix to avoid possible backend errors on claim
   */
  useEffect(() => {
    if (badgeId && !isClaimable) {
      setTransactionState(TransactionStates.success)
    }
  }, [badgeId, isClaimable, setTransactionState])

  return (
    <PreventActionIfClaimUUIDInvalid creatorEmail={badgeCreatorMetadata.email}>
      <FormProvider {...methods}>
        <Stack gap={4}>
          <StepClaimThirdPartyHeader
            creatorAddress={badgeModelData.data.badgeModel.creator.id}
            creatorName={badgeCreatorMetadata.name}
          />
          {txState !== TransactionStates.none && txState !== TransactionStates.success && (
            <TransactionLoading resetTxState={resetTxState} state={txState} />
          )}
          {txState === TransactionStates.none && (
            <>
              <StepClaimThirdPartyPreview />
              <Divider />
              <Container maxWidth="md">
                <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: '100%' }}>
                  <Stack mt={4}>
                    <StepClaimThirdParty />
                    <Stack gap={4} mt={8}>
                      <SubmitButton
                        color="blue"
                        sx={{ m: 'auto' }}
                        type="submit"
                        variant="contained"
                      >
                        {t('badge.model.claim.thirdParty.preview.submit')}
                      </SubmitButton>
                    </Stack>
                  </Stack>
                </form>
              </Container>
            </>
          )}
          {txState === TransactionStates.success && (
            <StepsClaimThirdPartySucceed claimAddress={claimAddress} />
          )}
        </Stack>
      </FormProvider>
    </PreventActionIfClaimUUIDInvalid>
  )
}

export default withPageGenericSuspense(ClaimBadge)

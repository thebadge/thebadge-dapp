import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Divider, Stack } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { FormProvider, useForm } from 'react-hook-form'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import useClaimUUIDParam from '@/src/hooks/nextjs/useClaimUUIDParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useRelayerTransactionEndpoint from '@/src/hooks/useRelayerTransactionEndpoint'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
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
import { Creator } from '@/types/badges/Creator'
import { NextPageWithLayout } from '@/types/next'

const ClaimBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const modelId = useModelIdParam()
  const { resetTxState, sendRequest, state: txState } = useRelayerTransactionEndpoint()
  const badgeModelData = useBadgeModel(modelId)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (
    !badgeCreatorMetadata ||
    !badgeCreatorMetadata.data ||
    !badgeModelData ||
    !badgeModelData.data
  ) {
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

  const claimUUID = useClaimUUIDParam()
  if (!claimUUID) {
    throw `No claimUUID provided us URL query param`
  }

  const onSubmit = async () => {
    const inputValid = await isValidStep()
    if (inputValid) {
      const { claimAddress } = methods.getValues()
      await sendRequest(() => sendClaimRequest(claimUUID, claimAddress))
    }
  }

  return (
    <PreventActionIfClaimUUIDInvalid creatorEmail={badgeCreatorMetadata.data.content.email}>
      <>
        {txState !== TransactionStates.none && txState !== TransactionStates.success && (
          <TransactionLoading resetTxState={resetTxState} state={txState} />
        )}
        {txState === TransactionStates.none && (
          <FormProvider {...methods}>
            <StepClaimThirdPartyHeader
              creatorAddress={badgeModelData.data.badgeModel.creator.id}
              creatorName={badgeCreatorMetadata.data.content.name}
            />
            <StepClaimThirdPartyPreview />
            <Divider />
            <Container maxWidth="md">
              <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <Stack mt={4}>
                  <StepClaimThirdParty />
                  <Stack gap={4} mt={8}>
                    <SubmitButton color="blue" sx={{ m: 'auto' }} type="submit" variant="contained">
                      {t('badge.model.claim.thirdParty.preview.submit')}
                    </SubmitButton>
                  </Stack>
                </Stack>
              </form>
            </Container>
          </FormProvider>
        )}
        {txState === TransactionStates.success && (
          <StepsClaimThirdPartySucceed claimAddress={claimAddress} />
        )}
      </>
    </PreventActionIfClaimUUIDInvalid>
  )
}

export default withPageGenericSuspense(ClaimBadge)

import { Box, Button, styled } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import useTranslation from 'next-translate/useTranslation'
import { useFormContext } from 'react-hook-form'

import { MINT_STEPS_AMOUNT, saveFormValues } from '../utils'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { PreventActionWithoutConnection } from '@/src/pagePartials/errors/preventActionWithoutConnection'

export const StepButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
  padding: theme.spacing(1, 4),
}))

export default function StepFooter({
  color,
  currentStep,
  onBackCallback,
  onNextCallback,
}: {
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
  currentStep?: number
  onNextCallback: VoidFunction
  onBackCallback: VoidFunction
}) {
  const { t } = useTranslation()
  const { badgeModelId } = useModelIdParam()
  const { getValues, watch } = useFormContext<MintBadgeSchemaType>()

  const canGoBack = currentStep !== 0
  const backButtonDisabled = currentStep === 0
  const isLastStep = currentStep === MINT_STEPS_AMOUNT - 1

  const imageHasBeenGenerated = watch('previewImage')

  function onBack() {
    saveFormValues(getValues(), badgeModelId)
    if (onBackCallback) onBackCallback()
  }

  function onNext() {
    saveFormValues(getValues(), badgeModelId)
    if (onNextCallback) onNextCallback()
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
        {!isLastStep && canGoBack && (
          <StepButton
            color={color || 'primary'}
            disabled={backButtonDisabled}
            onClick={onBack}
            variant="contained"
          >
            {t('badge.model.mint.back')}
          </StepButton>
        )}
        {!isLastStep && (
          <StepButton
            color={color || 'primary'}
            onClick={onNext}
            sx={{ ml: !canGoBack ? 'auto' : 'none' }}
            variant="contained"
          >
            {t('badge.model.mint.next')}
          </StepButton>
        )}
        {isLastStep && (
          <PreventActionWithoutConnection sx={{ m: 'auto' }}>
            <StepButton
              color={color || 'primary'}
              disabled={!imageHasBeenGenerated}
              sx={{ m: 'auto' }}
              type="submit"
              variant="contained"
            >
              {t('badge.model.mint.submit')}
            </StepButton>
          </PreventActionWithoutConnection>
        )}
      </Box>
    </>
  )
}

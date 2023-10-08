import { Box, Button, styled } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { CREATE_MODEL_STEPS_AMOUNT, saveFormValues } from '../utils'
import { PreventActionWithoutConnection } from '@/src/pagePartials/errors/preventActionWithoutConnection'

export const StepButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
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
  const { getValues } = useFormContext()

  const canGoBack = currentStep !== 0
  const backButtonDisabled = currentStep === 0
  const isLastStep = currentStep === CREATE_MODEL_STEPS_AMOUNT - 1

  function onBack() {
    saveFormValues(getValues())
    if (onBackCallback) onBackCallback()
  }

  function onNext() {
    saveFormValues(getValues())
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
            {t('badge.model.create.back')}
          </StepButton>
        )}
        {!isLastStep && (
          <StepButton
            color={color || 'primary'}
            onClick={onNext}
            sx={{ ml: !canGoBack ? 'auto' : 'none' }}
            variant="contained"
          >
            {t('badge.model.create.next')}
          </StepButton>
        )}
        {isLastStep && (
          <PreventActionWithoutConnection onlyCreator={true} sx={{ m: 'auto' }}>
            <StepButton
              color={color || 'primary'}
              sx={{ m: 'auto' }}
              type="submit"
              variant="contained"
            >
              {t('badge.model.create.submit')}
            </StepButton>
          </PreventActionWithoutConnection>
        )}
      </Box>
    </>
  )
}

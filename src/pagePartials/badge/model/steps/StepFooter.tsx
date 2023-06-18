import { Box, Button, styled } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import { useFormContext } from 'react-hook-form'

import { saveFormValues } from '../utils'

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
  const { getValues } = useFormContext()

  const canGoBack = currentStep !== 0
  const backButtonDisabled = currentStep !== 0
  const nextButtonDisabled = false

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
        {canGoBack && (
          <StepButton
            color={color || 'primary'}
            disabled={backButtonDisabled}
            onClick={onBack}
            variant="contained"
          >
            Back
          </StepButton>
        )}
        <StepButton
          color={color || 'primary'}
          disabled={nextButtonDisabled}
          onClick={onNext}
          sx={{ ml: !canGoBack ? 'auto' : 'none' }}
          variant="contained"
        >
          Next
        </StepButton>
      </Box>
    </>
  )
}

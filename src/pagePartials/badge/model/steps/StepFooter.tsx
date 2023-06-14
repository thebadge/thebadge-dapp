import { Box, Button, styled } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import { useFormContext } from 'react-hook-form'

import { FORM_STORE_KEY } from '@/src/pagePartials/badge/model/CreateWithSteps'

export const StepButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))

export default function StepFooter({
  color,
  onBackCallback,
  onSubmitCallback,
}: {
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
  onSubmitCallback: VoidFunction
  onBackCallback: VoidFunction
}) {
  const { getValues } = useFormContext()

  const canGoBack = true
  const backButtonDisabled = false
  const submitButtonDisabled = false

  function onBack() {
    console.log('BACK')
    if (onBackCallback) onBackCallback()
  }

  function onSubmit() {
    localStorage.setItem(FORM_STORE_KEY, JSON.stringify(getValues()))
    console.log('SUBMIT')
    if (onSubmitCallback) onSubmitCallback()
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
          disabled={submitButtonDisabled}
          onClick={onSubmit}
          sx={{ ml: !canGoBack ? 'auto' : 'none' }}
          variant="contained"
        >
          Next
        </StepButton>
      </Box>
    </>
  )
}

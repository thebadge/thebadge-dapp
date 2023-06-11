import { Box, Button, styled } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'

export const StepButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))
export default function StepFooter({
  color,
}: {
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
}) {
  const canGoBack = true
  const backButtonDisabled = true
  const submitButtonDisabled = true

  function onBack() {
    console.log('BACK')
  }

  function onSubmit() {
    console.log('SUBMIT')
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

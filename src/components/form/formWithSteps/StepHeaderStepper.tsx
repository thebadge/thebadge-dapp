import * as React from 'react'

import { Box, Typography } from '@mui/material'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { colors } from '@thebadge/ui-library'

export default function StepHeaderStepper({
  color,
  completedSteps,
  currentStep,
  onStepNavigation,
  steps,
}: {
  currentStep: number
  onStepNavigation: (n: number) => void
  completedSteps: Record<string, boolean>
  steps: string[]
  color?: string
}) {
  return (
    <Box display="flex" flex="1" width="100%">
      <Stepper
        activeStep={currentStep}
        alternativeLabel
        nonLinear
        orientation="horizontal"
        sx={{
          width: '100%',
        }}
      >
        {steps.map((label, index) => (
          <Step completed={completedSteps[index]} key={label}>
            <StepButton
              onClick={() => onStepNavigation(index)}
              sx={{
                '.MuiStepLabel-iconContainer': {
                  '.Mui-active, .Mui-completed': {
                    color: `${color || colors.purple} !important`,
                  },
                },
                '& .MuiStepIcon-text': {
                  fontSize: '1rem',
                },
              }}
            >
              <Typography variant="subtitle2">{label}</Typography>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

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
  hiddenSteps,
  onStepNavigation,
  steps,
}: {
  currentStep: number
  onStepNavigation: (n: number) => void
  completedSteps: Record<string, boolean>
  hiddenSteps?: Record<string, boolean>
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
        {steps.map((label, index) => {
          if (hiddenSteps && hiddenSteps[index]) {
            return null
          }
          return (
            <Step completed={completedSteps[index]} key={label}>
              <StepButton
                onClick={() => onStepNavigation(index)}
                sx={{
                  '.MuiStepLabel-iconContainer': {
                    '& .MuiStepIcon-root': {
                      color: `#D9D9D9 !important`,
                    },
                    '.Mui-active, .Mui-completed': {
                      color: `${color || colors.purple} !important`,
                      '& .MuiStepIcon-text': {
                        fill: `#D9D9D9 !important`,
                      },
                    },
                  },
                  '& .MuiStepIcon-text': {
                    fontSize: '1rem',
                    fill: `${color || colors.purple} !important`,
                  },
                }}
              >
                <Typography variant="subtitle2">{label}</Typography>
              </StepButton>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

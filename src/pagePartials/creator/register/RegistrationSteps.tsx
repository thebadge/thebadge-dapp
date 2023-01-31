import { useRef } from 'react'
import * as React from 'react'

import { StepContent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { AnyZodObject, ZodEffects } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/CustomForm'
import { useForceRender } from '@/src/hooks/useForceRender'
import useIsMobile from '@/src/hooks/useIsMobile'

type RegistrationStepsProps = {
  stepSchemas: (AnyZodObject | ZodEffects<any, any, any>)[]
  onSubmit: (data: AnyZodObject[]) => void
}

const steps = ['Basic information.', 'How to contact you.', 'Agreement.']

export default function RegistrationSteps({ onSubmit, stepSchemas }: RegistrationStepsProps) {
  const forceUpdate = useForceRender()
  const isMobile = useIsMobile()
  const formButtonRef = useRef<HTMLButtonElement>()

  const [activeStep, setActiveStep] = React.useState(0)
  const [stepsData, setStepsData] = React.useState<{
    [k: number]: any
  }>({})
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.values(completed).filter((c) => c).length
  }

  const handleComplete = (step: number) => {
    const newCompleted = completed
    newCompleted[step] = true
    setCompleted(newCompleted)
    if (Object.values(newCompleted).filter((c) => c).length === totalSteps()) forceUpdate()
  }

  const allStepsCompleted = () => completedSteps() === totalSteps()

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const handleNext = () => {
    handleComplete(activeStep)
    const newActiveStep = !isLastStep()
      ? // If not all steps have been completed,
        // find the first step that has not been completed
        steps.findIndex((step, i) => !completed[i] && i !== activeStep - 1)
      : activeStep + 1
    // We don't want to increase the value over the amount of given schemas
    if (newActiveStep < 0 || newActiveStep >= stepSchemas.length) return
    setActiveStep(newActiveStep)
  }

  const handleBack = (step: number) => {
    const newCompleted = completed
    newCompleted[step] = false
    setCompleted(newCompleted)
    setActiveStep(step)
  }

  const handleStep = (step: number) => async () => {
    // If the user want to go back, we dont need to validate
    if (activeStep >= step) return handleBack(step)
    // Is the user is trying to move forward, we need to validate if the step is completed
    // Hack to click the button and trigger the validations
    formButtonRef.current?.click()
  }

  const handleSubmitNext = (data: any) => {
    const newStepsData = stepsData
    newStepsData[activeStep] = data
    setStepsData(newStepsData)
    handleNext()
  }

  const handleOnSubmit = () => {
    const formData = Object.values(stepsData)
    onSubmit(formData)
  }

  const isFormStep = stepSchemas.length > activeStep

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        nonLinear
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map((label, index) => (
          <Step completed={completed[index]} key={label}>
            <StepButton
              color="inherit"
              onClick={handleStep(index)}
              sx={{
                '& .MuiStepIcon-text': {
                  fontSize: '1rem',
                },
              }}
            >
              <Typography variant="subtitle2">{label}</Typography>
            </StepButton>
            {isMobile && (
              <StepContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <CustomFormFromSchemaWithoutSubmit
                    formProps={{
                      buttonLabel: 'Next',
                      buttonRef: formButtonRef,
                    }}
                    onSubmit={handleSubmitNext}
                    schema={stepSchemas[activeStep]}
                  />
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      <div>
        {!isMobile && (
          <>
            <Box
              sx={{ display: allStepsCompleted() ? 'none' : 'flex', flexDirection: 'row', pt: 2 }}
            >
              {isFormStep && (
                <CustomFormFromSchemaWithoutSubmit
                  formProps={{
                    buttonLabel: 'Next',
                    buttonRef: formButtonRef,
                    useGridLayout: true,
                  }}
                  onSubmit={handleSubmitNext}
                  schema={stepSchemas[activeStep]}
                />
              )}
            </Box>
            {allStepsCompleted() && (
              <Box>
                {
                  // Review pre submit
                }
                <Box>{JSON.stringify(stepsData)}</Box>
                <Button onClick={handleOnSubmit}>{'Submit'}</Button>
              </Box>
            )}
          </>
        )}
      </div>
    </Box>
  )
}

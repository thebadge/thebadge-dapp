import * as React from 'react'
import { useRef } from 'react'

import { Stack, StepContent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { AnyZodObject, ZodEffects } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/customForms/CustomForm'
import { DataGrid, FormLayoutType } from '@/src/components/form/customForms/type'
import { useForceRender } from '@/src/hooks/useForceRender'
import useIsMobile from '@/src/hooks/useIsMobile'

type FormWithStepsProps = {
  stepSchemas: (AnyZodObject | ZodEffects<any, any, any>)[]
  stepNames: string[]
  formGridLayout: DataGrid[][]
  formLayout?: FormLayoutType
  formFieldProps?: Record<string, any>[]
  onSubmit: (data: any) => void
  formSubmitReview: (data: any) => React.ReactNode
}

export function FormWithSteps({
  formFieldProps,
  formGridLayout,
  formLayout,
  formSubmitReview,
  onSubmit,
  stepNames,
  stepSchemas,
}: FormWithStepsProps) {
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
    return stepSchemas.length
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
        stepNames.findIndex((step, i) => !completed[i] && i !== activeStep - 1)
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
    forceUpdate()
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
    let formData = {}
    Object.values(stepsData).forEach((step) => {
      formData = {
        ...formData,
        ...step,
      }
    })
    onSubmit(formData)
  }

  const handleFormSubmitReview = () => {
    let formData = {}
    Object.values(stepsData).forEach((step) => {
      formData = {
        ...formData,
        ...step,
      }
    })
    return formSubmitReview(formData)
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
        {stepNames.map((label, index) => (
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
                      layout: 'grid',
                      buttonLabel: 'Next',
                      buttonRef: formButtonRef,
                    }}
                    onSubmit={handleSubmitNext}
                    props={formFieldProps ? formFieldProps[activeStep] : undefined}
                    schema={stepSchemas[activeStep]}
                  />
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {!isMobile && (
          <>
            <Box
              sx={{ display: allStepsCompleted() ? 'none' : 'flex', flexDirection: 'row', pt: 2 }}
            >
              {isFormStep && (
                <CustomFormFromSchemaWithoutSubmit
                  formProps={{
                    layout: formLayout,
                    gridStructure: formGridLayout[activeStep],
                    buttonLabel: 'Next',
                    buttonRef: formButtonRef,
                  }}
                  onSubmit={handleSubmitNext}
                  props={formFieldProps ? formFieldProps[activeStep] : undefined}
                  schema={stepSchemas[activeStep]}
                />
              )}
            </Box>
            {allStepsCompleted() && (
              <Stack>
                {
                  // Review pre submit
                }
                <Box>{handleFormSubmitReview()}</Box>
                <Box display="flex" justifyContent="center">
                  <Button onClick={handleOnSubmit} variant="contained">
                    {'Submit'}
                  </Button>
                </Box>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

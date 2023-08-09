import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { Stack, StepContent } from '@mui/material'
import Box from '@mui/material/Box'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { OverridableStringUnion } from '@mui/types'
import { AnyZodObject, ZodEffects } from 'zod'

import {
  CustomFormFromSchemaWithoutSubmit,
  FormButton,
} from '@/src/components/form/customForms/CustomForm'
import { DataGrid, FormLayoutType } from '@/src/components/form/customForms/type'
import { useForceRender } from '@/src/hooks/useForceRender'
import { useSizeSM } from '@/src/hooks/useSize'
import { PreventActionWithoutConnection } from '@/src/pagePartials/errors/preventActionWithoutConnection'

type FormWithStepsProps = {
  stepSchemas: (AnyZodObject | ZodEffects<any, any, any>)[]
  stepNames: string[]
  formGridLayout?: DataGrid[][]
  // Avoid the user of an array of FormLayoutType, is a temporary solution to support a better badge creation form
  formLayout?: FormLayoutType | FormLayoutType[]
  formFieldProps?: Record<string, any>[]
  onSubmit: (data: any) => void
  formSubmitReview: (data: any) => React.ReactNode
  hideSubmit?: boolean
  onStepChanged?: (stepNumber: number) => void
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
}

/**
 * @deprecated Please don't use it anymore - It will be deleted as soon as i migrate the Registration Form, if you need
 * to create a form with steps, please visit the MintWithSteps.tsx and use it as example, or also CreateWithSteps.tsx as
 * a simple one
 */
export function FormWithSteps({
  color,
  formFieldProps,
  formGridLayout,
  formLayout,
  formSubmitReview,
  hideSubmit,
  onStepChanged,
  onSubmit,
  stepNames,
  stepSchemas,
}: FormWithStepsProps) {
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const forceUpdate = useForceRender()
  const isMobile = useSizeSM()
  const formButtonRef = useRef<HTMLButtonElement>()

  const [activeStep, setActiveStep] = React.useState(0)
  const [stepsData, setStepsData] = React.useState<{
    [k: number]: any
  }>({})
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  // Notify the parent component the change state
  useEffect(() => {
    if (onStepChanged) onStepChanged(activeStep)
  }, [activeStep, onStepChanged])

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
    if (newActiveStep < 0 || newActiveStep >= stepNames.length) return
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

  const handleOnSubmit = async () => {
    setDisabledSubmit(true)
    let formData = {}
    Object.values(stepsData).forEach((step) => {
      formData = {
        ...formData,
        ...step,
      }
    })
    await onSubmit(formData)
    setDisabledSubmit(false)
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
              onClick={handleStep(index)}
              sx={{
                '.MuiStepLabel-iconContainer': {
                  '.Mui-active, .Mui-completed': {
                    color: `${color || 'ihnerit'} !important`,
                  },
                },
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
                      submitButton: {
                        label: 'Next',
                        ref: formButtonRef,
                      },
                      backButton: {
                        label: 'Back',
                        disabled: activeStep < 1,
                      },
                      onBack: () => handleBack(activeStep - 1),
                      color,
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
                    layout: getFormLayout(formLayout, activeStep),
                    submitButton: {
                      label: 'Next',
                      ref: formButtonRef,
                      ...(getFormLayout(formLayout, activeStep) === 'gridResponsive' &&
                      formGridLayout
                        ? {
                            gridStructure: formGridLayout[activeStep],
                          }
                        : {}),
                    },
                    backButton: {
                      label: 'Back',
                      disabled: activeStep < 1,
                    },
                    onBack: () => handleBack(activeStep - 1),
                    color,
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
                <PreventActionWithoutConnection>
                  {!hideSubmit && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        m: 2,
                        width: '100%',
                      }}
                    >
                      <FormButton
                        color={color || 'primary'}
                        onClick={() => handleBack(activeStep - 1)}
                        variant="contained"
                      >
                        {'Back'}
                      </FormButton>
                      <FormButton
                        color={color || 'primary'}
                        disabled={disabledSubmit}
                        onClick={handleOnSubmit}
                        variant="contained"
                      >
                        {'Submit'}
                      </FormButton>
                    </Box>
                  )}
                </PreventActionWithoutConnection>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

function getFormLayout(
  formLayout: FormLayoutType | FormLayoutType[] | undefined,
  activeStep: number,
): FormLayoutType | undefined {
  return Array.isArray(formLayout) ? formLayout[activeStep] : formLayout
}

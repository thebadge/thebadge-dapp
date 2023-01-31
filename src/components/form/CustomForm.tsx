import { ReactNode, RefObject } from 'react'

import { Box, Button, styled } from '@mui/material'
import { createTsForm } from '@ts-react/form'

import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

const StyledFlexFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  alignItems: 'flex-end',
  margin: theme.spacing(2, 0),
  '& .MuiBox-root': {
    display: 'flex',
    flex: '1 1 25%',
  },
}))

const StyledGridFormContainer = styled(Box, {
  shouldForwardProp: (propName: string) => propName !== 'gridColumns',
})<{ gridColumns: number }>(({ gridColumns, theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  gap: theme.spacing(2),
  gridAutoRows: 'minmax(1fr, auto)',
  margin: theme.spacing(2, 0),
  '& .MuiBox-root': {
    justifyContent: 'flex-end',
  },
}))

function MyCustomFormComponent({
  buttonDisabled,
  buttonLabel = 'Submit',
  children,
  onSubmit,
}: {
  children: ReactNode
  onSubmit: () => void
  buttonLabel?: string
  buttonDisabled?: boolean
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* children are you form field components */}
      <StyledFlexFormContainer>{children}</StyledFlexFormContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="darkGreen" disabled={buttonDisabled} type="submit" variant="contained">
          {buttonLabel}
        </Button>
      </Box>
    </form>
  )
}

/**
 * In same cases we want to have some kind of nested or "stepped" forms, so we
 * want to avoid the use of type=submit and also the user of another Form Tag
 */
function MyCustomFormComponentWithoutSubmit({
  buttonDisabled,
  buttonLabel = 'Submit',
  buttonRef,
  children,
  gridColumns = 2,
  onSubmit,
  useGridLayout,
}: {
  children: ReactNode
  onSubmit: () => void
  useGridLayout?: boolean
  gridColumns?: number
  buttonLabel?: string
  buttonDisabled?: boolean
  buttonRef?: RefObject<any>
}) {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* children are you form field components */}
      {useGridLayout ? (
        <StyledGridFormContainer gridColumns={gridColumns} id="grid-container">
          {children}
        </StyledGridFormContainer>
      ) : (
        <StyledFlexFormContainer id="flex-container">{children}</StyledFlexFormContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color="darkGreen"
          disabled={buttonDisabled}
          onClick={onSubmit}
          ref={buttonRef}
          variant="contained"
        >
          {buttonLabel}
        </Button>
      </Box>
    </Box>
  )
}

// A typesafe React component
export const CustomFormFromSchema = createTsForm(mappingSchemaToComponents, {
  FormComponent: MyCustomFormComponent,
})

// A typesafe React component
export const CustomFormFromSchemaWithoutSubmit = createTsForm(mappingSchemaToComponents, {
  FormComponent: MyCustomFormComponentWithoutSubmit,
})

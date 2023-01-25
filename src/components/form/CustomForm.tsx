import { ReactNode } from 'react'

import { Box, Button, styled } from '@mui/material'
import { createTsForm } from '@ts-react/form'

import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

const StyledFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  alignItems: 'flex-end',
  ':nth-of-child': {
    display: 'flex',
    flex: '1 1 25%',
  },
  margin: theme.spacing(2, 0),
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
      <StyledFormContainer>{children}</StyledFormContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="darkGreen" disabled={buttonDisabled} type="submit" variant="contained">
          {buttonLabel}
        </Button>
      </Box>
    </form>
  )
}

// A typesafe React component
export const CustomFormFromSchema = createTsForm(mappingSchemaToComponents, {
  FormComponent: MyCustomFormComponent,
})

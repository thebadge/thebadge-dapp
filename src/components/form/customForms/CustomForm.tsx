import { Box, Button, Container, styled } from '@mui/material'
import { createTsForm } from '@ts-react/form'

import { getFormLayout } from '@/src/components/form/customForms/getFormLayout'
import { CustomFormProps } from '@/src/components/form/customForms/type'
import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

const FormButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))

function MyCustomFormComponent({
  buttonDisabled,
  buttonLabel = 'Submit',
  children,
  color,
  draggable,
  gridStructure,
  layout = 'flex',
  onSubmit,
  rowHeight,
}: CustomFormProps) {
  if (layout !== 'gridResponsive' && gridStructure) {
    throw new Error(`gridStructure must be provided only on layout = 'gridResponsive'`)
  }
  const Layout = getFormLayout(layout)
  return (
    <Container maxWidth="md" sx={{ display: 'flex', width: '100%' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* children are you form field components */}
        <Layout draggable={draggable} gridStructure={gridStructure} rowHeight={rowHeight}>
          {children}
        </Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormButton
            color={color || 'primary'}
            disabled={buttonDisabled}
            type="submit"
            variant="contained"
          >
            {buttonLabel}
          </FormButton>
        </Box>
      </form>
    </Container>
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
  color,
  draggable,
  gridStructure,
  layout = 'flex',
  onSubmit,
  rowHeight,
}: CustomFormProps) {
  if (layout !== 'gridResponsive' && gridStructure) {
    throw new Error(`gridStructure must be provided only on layout = 'gridResponsive'`)
  }
  const Layout = getFormLayout(layout)
  return (
    <Container maxWidth="md" sx={{ display: 'flex', width: '100%' }}>
      <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* children are you form field components */}
        <Layout draggable={draggable} gridStructure={gridStructure} rowHeight={rowHeight}>
          {children}
        </Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormButton
            color={color || 'primary'}
            disabled={buttonDisabled}
            onClick={onSubmit}
            ref={buttonRef}
            variant="contained"
          >
            {buttonLabel}
          </FormButton>
        </Box>
      </Box>
    </Container>
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

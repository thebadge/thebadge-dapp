import { Box, Button, Container, styled } from '@mui/material'
import { createTsForm } from '@ts-react/form'

import { getFormLayout } from '@/src/components/form/customForms/getFormLayout'
import { CustomFormProps } from '@/src/components/form/customForms/type'
import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

export const FormButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))

function MyCustomFormComponent({
  submitButton = { disabled: false, label: 'Submit', ref: undefined },
  backButton = { disabled: false, label: 'Back', ref: undefined },
  children,
  color,
  draggable,
  gridStructure,
  layout = 'flex',
  onBack,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <FormButton
            color={color || 'primary'}
            disabled={backButton.disabled}
            onClick={onBack}
            variant="contained"
          >
            {backButton.label}
          </FormButton>
          <FormButton
            color={color || 'primary'}
            disabled={submitButton.disabled}
            type="submit"
            variant="contained"
          >
            {submitButton.label}
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
  submitButton = { disabled: false, label: 'Submit', ref: undefined },
  backButton = { disabled: false, label: 'Back', ref: undefined },
  children,
  color,
  draggable,
  gridStructure,
  layout = 'flex',
  onBack,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <FormButton
            color={color || 'primary'}
            disabled={backButton.disabled}
            onClick={onBack}
            ref={backButton.ref}
            variant="contained"
          >
            {backButton.label}
          </FormButton>
          <FormButton
            color={color || 'primary'}
            disabled={submitButton.disabled}
            onClick={onSubmit}
            ref={submitButton.ref}
            variant="contained"
          >
            {submitButton.label}
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

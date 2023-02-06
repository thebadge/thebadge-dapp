import { Box, Button } from '@mui/material'
import { createTsForm } from '@ts-react/form'

import { getFormLayout } from '@/src/components/form/customForms/getFormLayout'
import { CustomFormProps } from '@/src/components/form/customForms/type'
import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

function MyCustomFormComponent({
  buttonDisabled,
  buttonLabel = 'Submit',
  children,
  layout = 'flex',
  onSubmit,
}: CustomFormProps) {
  const Layout = getFormLayout(layout)
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* children are you form field components */}
      <Layout>{children}</Layout>
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
  gridStructure,
  layout = 'flex',
  onSubmit,
}: CustomFormProps) {
  if (layout !== 'gridResponsive' && gridStructure) {
    throw new Error(`gridStructure must be provided only on layout = 'gridResponsive'`)
  }
  const Layout = getFormLayout(layout)
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* children are you form field components */}
      <Layout gridStructure={gridStructure}>{children}</Layout>
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

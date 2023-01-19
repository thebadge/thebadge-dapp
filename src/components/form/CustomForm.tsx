import { ReactNode } from 'react'

import { createTsForm } from '@ts-react/form'

import { mappingSchemaToComponents } from '@/src/components/form/helpers/schemaToComponent'

function MyCustomFormComponent({
  children,
  onSubmit,
}: {
  children: ReactNode
  onSubmit: () => void
}) {
  return (
    <form onSubmit={onSubmit}>
      {/* children is you form field components */}
      {children}
      <button type="submit">Submit</button>
    </form>
  )
}

// A typesafe React component
export const CustomFormFromSchema = createTsForm(mappingSchemaToComponents, {
  FormComponent: MyCustomFormComponent,
})

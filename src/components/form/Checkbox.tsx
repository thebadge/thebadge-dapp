import { Checkbox as MUICheckbox } from '@mui/material'
import { useTsController } from '@ts-react/form'

import { TextFieldStatus } from '@/src/components/form/Textfield'
import { FormField } from '@/src/components/form/helpers/FormField'

export const Checkbox: React.FC = () => {
  const { error, field } = useTsController<boolean>()

  function handleChange() {
    field.onChange(!field.value)
  }

  return (
    <FormField
      formControl={<MUICheckbox checked={!!field.value} onChange={handleChange} />}
      label={field.name}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}

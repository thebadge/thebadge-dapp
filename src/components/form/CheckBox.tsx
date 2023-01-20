import { Checkbox as MUICheckbox } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

export function CheckBox() {
  const { error, field } = useTsController<boolean>()
  const { label } = useDescription()

  function handleChange() {
    field.onChange(!field.value)
  }

  return (
    <FormField
      formControl={<MUICheckbox checked={!!field.value} onChange={handleChange} />}
      label={label}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}

import { Box, Divider, Checkbox as MUICheckbox, Stack, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

export default function AgreementField({ agreementText }: { agreementText: string }) {
  const { error, field } = useTsController<boolean>()
  const { label } = useDescription()

  function handleChange() {
    field.onChange(!field.value)
  }

  return (
    <Stack sx={{ mb: 2, gap: 2 }}>
      <Typography fontWeight="bold" variant={'h5'}>
        {label}
      </Typography>
      <Box maxHeight={'250px'} overflow="auto">
        <Typography variant="body2">{agreementText}</Typography>
      </Box>
      <Stack>
        <FormField
          formControl={
            <MUICheckbox
              checked={!!field.value}
              onChange={handleChange}
              sx={{ width: 'fit-content' }}
            />
          }
          label={'I have read and agree'}
          labelPosition={'left'}
          status={error ? TextFieldStatus.error : TextFieldStatus.success}
          statusText={error?.errorMessage}
        />
        <Divider sx={{ borderWidth: '1px' }} />
      </Stack>
    </Stack>
  )
}

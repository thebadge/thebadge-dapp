import { Box, Divider, Checkbox as MUICheckbox, Stack, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

export default function AgreementField({ agreementText }: { agreementText: string }) {
  const { error, field } = useTsController<boolean>()
  const { label } = useDescription()

  function handleChange() {
    field.onChange(!field.value)
  }

  // 👇	ReactMarkdown needs to have the children as a prop
  /* eslint-disable react/no-children-prop */
  return (
    <Stack sx={{ mb: 2, gap: 2 }}>
      <Typography fontWeight="bold" variant={'h5'}>
        {label}
      </Typography>
      <Box maxHeight={'350px'} overflow="auto">
        <Typography component={'div'}>
          {/* ReactMarkdown want it in this way  */}
          <ReactMarkdown
            children={agreementText}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank">
                  {props.href?.replace(/^.*:\/\//i, '')}
                </a>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
        </Typography>
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

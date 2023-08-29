import { Stack, styled } from '@mui/material'

import { DataGrid } from '@/src/components/form/customForms/type'

const FlexFormContainer = styled(Stack, {
  shouldForwardProp: (propName: string) =>
    propName !== 'gridColumns' && propName !== 'gridStructure' && propName !== 'rowHeight',
})<{ gridStructure?: DataGrid[] }>(({ theme }) => ({
  justifyContent: 'center',
  gap: theme.spacing(3),
  alignItems: 'flex-start',
  margin: theme.spacing(2, 0),
  '& > *': {
    display: 'flex',
    flex: '1',
    width: '100%',
  },
}))

export default FlexFormContainer

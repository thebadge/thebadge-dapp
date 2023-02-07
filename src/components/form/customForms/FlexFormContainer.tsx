import { Box, styled } from '@mui/material'

import { DataGrid } from '@/src/components/form/customForms/type'

const FlexFormContainer = styled(Box, {
  shouldForwardProp: (propName: string) => propName !== 'gridStructure',
})<{ gridStructure?: DataGrid[] }>(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  alignItems: 'flex-end',
  margin: theme.spacing(2, 0),
  '& > *': {
    display: 'flex',
    flex: '1 1 40%',
  },
}))

export default FlexFormContainer

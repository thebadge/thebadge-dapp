import { Box, styled } from '@mui/material'

const GridFormContainer = styled(Box, {
  shouldForwardProp: (propName: string) => propName !== 'gridColumns',
})<{ gridColumns: number }>(({ gridColumns, theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  gridAutoColumns: '1fr',
  gap: theme.spacing(2),
  gridAutoRows: 'minmax(7rem, auto)',
  placeContent: 'center center',
  margin: theme.spacing(2, 0),
  '& > *': {
    justifyContent: 'flex-end',
  },
}))

export default GridFormContainer

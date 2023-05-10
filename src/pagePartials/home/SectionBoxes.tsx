import { styled } from '@mui/material'

const SectionBox = styled('div')(() => ({
  width: '100%',
  padding: '2.25rem 3.325rem',
}))

const SectionTitleBox = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export { SectionBox, SectionTitleBox }

import React, { ReactElement, ReactNode } from 'react'

import { styled } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

export const DisableWrapper = styled('div')`
  position: relative;
  display: flex;
  opacity: 0.6;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  width: fit-content;
`

export const DisableOverlay = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: not-allowed;
`

type Props = {
  children: ReactElement | ReactNode
  disabled?: boolean
  sx?: SxProps<Theme>
}
export const Disable: React.FC<Props> = ({ children, disabled, sx }) => {
  if (!disabled) return <>{children}</>
  return (
    <DisableWrapper onClick={(e) => e.stopPropagation()} sx={sx}>
      {children}
      <DisableOverlay />
    </DisableWrapper>
  )
}

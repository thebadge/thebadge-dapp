import React, { PropsWithChildren } from 'react'

import { Label } from '@mui/icons-material'
import { Radio, css, styled } from '@mui/material'

export interface Props {
  checked?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Wrapper = styled('span')<{ disabled?: boolean }>`
  align-items: center;
  column-gap: 8px;
  display: flex;
  max-width: fit-content;

  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.5;

          .label {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
        `}
`

export const Radiobutton: React.FC<PropsWithChildren<Props>> = ({
  checked,
  children,
  disabled,
  onClick,
  ...restProps
}) => {
  return (
    <Wrapper
      disabled={disabled}
      onClick={() => {
        if (disabled) return

        if (typeof onClick !== 'undefined') {
          onClick()
        }
      }}
      {...restProps}
    >
      <Radio checked={checked} />
      {children && <Label>{children}</Label>}
    </Wrapper>
  )
}

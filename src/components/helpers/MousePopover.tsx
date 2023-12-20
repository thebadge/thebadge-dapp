import { KeyboardEventHandler } from 'react'

import { Popover } from '@mui/material'

import useMousePosition from '@/src/hooks/utils/useMousePosition'

type MousePopoverProps = {
  open: boolean
  onClose: VoidFunction
  children: React.ReactNode
  onKeyDown?: KeyboardEventHandler<HTMLDivElement> | undefined
}

export const MousePopover = ({ children, onClose, onKeyDown, open }: MousePopoverProps) => {
  const mousePosition = useMousePosition({ lockPosition: open })

  return (
    <Popover
      anchorPosition={{ top: mousePosition.y ?? 0, left: mousePosition.x ?? 0 }}
      anchorReference="anchorPosition"
      onClose={onClose}
      onKeyDown={onKeyDown}
      open={open}
    >
      {children}
    </Popover>
  )
}

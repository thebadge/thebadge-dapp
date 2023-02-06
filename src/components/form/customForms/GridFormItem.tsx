import React, { forwardRef } from 'react'

type BasicGridItemProps = DataGridProps & {
  onMouseDown?: () => void
  onMouseUp?: () => void
  onTouchEnd?: () => void
  children: any
}

type DataGridProps = {
  'data-grid': { i: string; x: number; y: number; w: number; h: number; static?: boolean }
}

export const GridFormItem = forwardRef<HTMLDivElement, BasicGridItemProps>(
  ({ children, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        id="CustomGridItemComponent"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        ref={ref}
        {...props}
      >
        {children} {/* Make sure to include children to add resizable handle */}
      </div>
    )
  },
)

GridFormItem.displayName = 'GridFormItem'

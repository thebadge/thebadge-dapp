import React, { RefObject, createRef } from 'react'

import { Box, MenuItem, Stack, Typography, alpha, styled } from '@mui/material'

import { MousePopover } from '@/src/components/helpers/MousePopover'
import { useListHighlightItem } from '@/src/hooks/utils/useListHighlightItem'
import { SUPPORTED_VARIABLES, TemplateVariable } from '@/src/utils/enrichTextWithValues'

const VariableContainer = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.primary.dark, 0.5),
  padding: theme.spacing(0.5, 0.75),
  marginRight: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
  display: 'flex',
  alignContent: 'center',
  flexWrap: 'wrap',
}))

const StyledMenuItem = styled(MenuItem)(() => ({
  '&.Mui-disabled': {
    opacity: 1,
  },
}))

type VariablesDropdownProps = {
  dropdownOpen: boolean
  onClose: VoidFunction
  onSelect: (value: TemplateVariable) => void
}

export const VariablesDropdown = ({ dropdownOpen, onClose, onSelect }: VariablesDropdownProps) => {
  const suggestionsRefs: RefObject<HTMLLIElement>[] = SUPPORTED_VARIABLES.map(() =>
    createRef<HTMLLIElement>(),
  )

  const onEnterPress = (highlightedIndex: number) => {
    onSelect(SUPPORTED_VARIABLES[highlightedIndex] as TemplateVariable)
  }

  const { handleKeyDown, highlightedIndex, setHighlightedIndex } = useListHighlightItem(
    SUPPORTED_VARIABLES.length,
    suggestionsRefs,
    onEnterPress,
  )

  return (
    <MousePopover onClose={onClose} onKeyDown={handleKeyDown} open={dropdownOpen}>
      <Stack padding={0.5}>
        <StyledMenuItem dense disabled>
          <Typography variant="titleMedium">Available variables</Typography>
        </StyledMenuItem>
        {SUPPORTED_VARIABLES.map((variable, index) => {
          return (
            <MenuItem
              key={variable}
              onClick={() => onSelect(variable as TemplateVariable)}
              onMouseMove={(e) => {
                e.preventDefault()
                if (highlightedIndex !== index) {
                  setHighlightedIndex(index)
                }
              }}
              ref={suggestionsRefs[index]}
              selected={index === highlightedIndex}
            >
              <VariableContainer>
                <Typography variant="labelMedium">{variable}</Typography>
              </VariableContainer>
            </MenuItem>
          )
        })}
      </Stack>
    </MousePopover>
  )
}

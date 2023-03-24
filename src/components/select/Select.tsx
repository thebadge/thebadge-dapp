import React from 'react'

import { FormControl, InputLabel, Select as MUISelect, MenuItem, styled } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select/SelectInput'

const StyledSelect = styled(MUISelect<string>)(() => ({
  fontSize: '1rem',
  width: 'auto',
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    padding: '4px 12px',
  },
}))

const StyledInputLabel = styled(InputLabel)(() => ({
  m: 0,
  fontSize: '1rem !important',
  top: '-4px',
  '&.Mui-focused': {
    top: '0',
  },
}))

const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '1rem !important',
}))

type SelectProps = {
  label: string
  onChange: (e: SelectChangeEvent<string>) => void
  items: string[]
  selectedItem: string
}
export default function TBadgeSelect({ items, label, onChange, selectedItem }: SelectProps) {
  return (
    <FormControl size="small" sx={{ mx: 1, minWidth: 120, width: 'auto' }}>
      <StyledInputLabel id="simple-select-category">{label}</StyledInputLabel>
      <StyledSelect label={label} onChange={onChange} value={selectedItem}>
        {items.map((category, index) => (
          <StyledMenuItem key={'item-' + index} sx={{ height: 32 }} value={category}>
            {category}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

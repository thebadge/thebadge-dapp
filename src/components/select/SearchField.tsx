import React, { useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField, styled } from '@mui/material'

const StyledTextField = styled(TextField)(({ theme }) => ({
  transition: 'all 1s',
  fontSize: '1rem',
  '& .MuiInputBase-root': {
    paddingRight: theme.spacing(1),
  },
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
  },
  '& .MuiFormLabel-root': {
    fontSize: '1rem',
  },
}))

type SearchFieldProps = {
  label: string
  onSearch: (searchValue: string) => void
}
export default function TBSearchField({ label, onSearch }: SearchFieldProps) {
  const [searchingText, setSearchingText] = useState<boolean>(false)
  const [textSearch, setTextSearch] = useState<string>('')

  function handleSearchFocus() {
    setSearchingText(true)
  }

  function handleSearchBlur() {
    setSearchingText(false)
  }

  function handleOnClick() {
    textSearch.length > 0 ? onSearch(textSearch) : handleSearchFocus()
  }

  return (
    <StyledTextField
      InputProps={{
        onFocus: () => handleSearchFocus(),
        onBlur: () => handleSearchBlur(),
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon
              onClick={handleOnClick}
              sx={{
                cursor: 'pointer',
              }}
            />
          </InputAdornment>
        ),
      }}
      id="search-input"
      label={label}
      onChange={(e) => setTextSearch(e.target.value)}
      size="small"
      sx={{
        fontSize: '1rem',
        width: searchingText || textSearch.length > 0 ? 180 : 140,
      }}
      value={textSearch}
      variant="outlined"
    />
  )
}

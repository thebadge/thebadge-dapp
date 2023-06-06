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
  disabled: boolean
}
export default function TBSearchField({ disabled, label, onSearch }: SearchFieldProps) {
  const [searchingText, setSearchingText] = useState<boolean>(false)
  const [textSearch, setTextSearch] = useState<string>('')

  function handleSearchFocus() {
    setSearchingText(true)
  }

  function handleSearchBlur() {
    setSearchingText(false)
  }

  function handleOnClick() {
    onSearch(textSearch)
    if (textSearch.length > 0) {
      handleSearchFocus()
    }
  }

  return (
    <StyledTextField
      InputProps={{
        onFocus: () => handleSearchFocus(),
        onBlur: () => handleSearchBlur(),
        disabled,
        endAdornment: (
          <InputAdornment position="end">
            {textSearch.length > 0 && (
              <button
                onClick={() => {
                  setTextSearch('')
                  onSearch('')
                }}
              >
                x
              </button>
            )}

            <SearchIcon
              onClick={disabled ? undefined : handleOnClick}
              sx={{
                cursor: disabled ? 'inherit' : 'pointer',
              }}
            />
          </InputAdornment>
        ),
      }}
      id="search-input"
      label={label}
      onChange={(e) => {
        setTextSearch(e.target.value)
        if (e.target.value.length === 0) {
          onSearch('')
        }
      }}
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

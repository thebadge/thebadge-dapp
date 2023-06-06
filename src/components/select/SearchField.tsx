import React, { useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SearchIcon from '@mui/icons-material/Search'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import { IconButton, InputAdornment, TextField, styled } from '@mui/material'

const StyledTextField = styled(TextField, {
  shouldForwardProp: (propName: string) => propName !== 'searchingText',
})<{ searchingText: boolean }>(({ searchingText, theme }) => ({
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
    maxWidth: `calc(100% - ${searchingText ? 22 : 46}px)`,
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
              <IconButton
                aria-label="Clean search field"
                color="secondary"
                component="label"
                onClick={() => {
                  setTextSearch('')
                  onSearch('')
                }}
              >
                <DeleteForeverIcon color="white" />
              </IconButton>
            )}

            {textSearch.length === 0 ? (
              <SearchIcon
                onClick={disabled ? undefined : handleOnClick}
                sx={{
                  cursor: disabled ? 'inherit' : 'pointer',
                }}
              />
            ) : (
              <SubdirectoryArrowRightIcon
                onClick={disabled ? undefined : handleOnClick}
                sx={{
                  cursor: disabled ? 'inherit' : 'pointer',
                }}
              />
            )}
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
      searchingText={searchingText}
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

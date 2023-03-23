import React, { useEffect, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  styled,
} from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'
import { colors } from 'thebadge-ui-library'

import { Loading } from '@/src/components/loading/Loading'
import { useColorMode } from '@/src/providers/themeProvider'

export type ListFilter = {
  title: string
  color?: OverridableStringUnion<
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ChipPropsColorOverrides
  >
  defaultSelected?: boolean // default is false
  fixed?: boolean // if true, cannot be deselected, default is false
}

type FilteredListProps = {
  title: string
  color?: string
  items?: Array<React.ReactNode>
  filters: Array<ListFilter>
  categories?: Array<string>
  search: (selectedFilters: Array<ListFilter>, selectedCategory: string, textSearch: string) => void
  loading?: boolean
}

const ItemsGridBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  justifyContent: 'center',
}))

const FilteredListHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export default function FilteredList(props: FilteredListProps) {
  const { mode } = useColorMode()
  const defaultSelectedFilters = props.filters.filter((f) => f.defaultSelected)
  const [selectedFilters, setSelectedFilters] = useState<ListFilter[]>(defaultSelectedFilters)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [textSearch, setTextSearch] = useState<string>('')
  const [searchingText, setSearchingText] = useState<boolean>(false)
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)

  useEffect(() => {
    if (!initialLoadDone) {
      props.search(defaultSelectedFilters, '', '')
      setInitialLoadDone(true)
    }
  }, [props, initialLoadDone, defaultSelectedFilters])

  const search = () => {
    const filters = selectedFilters
    const category = selectedCategory
    const text = textSearch
    props.search(filters, category, text)
  }

  const isFilterSelected = (filter: ListFilter) => {
    return !!selectedFilters.find((f) => f.title === filter.title)
  }

  const handleSelectFilter = (filter: ListFilter) => {
    if (!isFilterSelected(filter)) {
      const newSelectedFilters = selectedFilters.concat(filter)
      setSelectedFilters(() => newSelectedFilters)
      search()
    }
  }
  const handleRemoveFilter = (filter: ListFilter) => {
    if (!filter.fixed) {
      const newSelectedFilters = selectedFilters.filter((f) => f.title !== filter.title)
      setSelectedFilters(newSelectedFilters)
      search()
    }
  }

  const handleSearchFocus = () => {
    setSearchingText(true)
  }

  const handleSearchBlur = () => {
    setSearchingText(false)
  }

  const handleSelectCategory = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory)
    search()
  }

  return (
    <Box>
      <FilteredListHeaderBox>
        <Typography
          color={props.color ?? (mode === 'light' ? colors.blackText : colors.white)}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
          padding={[1, 1, 1, 0]}
        >
          {props.title}
        </Typography>

        <Box alignItems={'center'} display={'flex'} flexWrap={'wrap'} gap={1}>
          {/* filters */}
          {props.filters.map((filter, index) => {
            return (
              <Chip
                color={filter.color}
                key={'filter-' + index}
                label={filter.title}
                onClick={() => handleSelectFilter(filter)}
                onDelete={
                  filter.fixed || !isFilterSelected(filter)
                    ? undefined
                    : () => handleRemoveFilter(filter)
                }
                variant={isFilterSelected(filter) ? 'filled' : 'outlined'}
              />
            )
          })}

          {/* categories */}
          {props.categories ? (
            <FormControl size="small" sx={{ m: 1, minWidth: 120, height: 32, width: 'auto' }}>
              <InputLabel
                id="demo-simple-select-filled-label"
                sx={{ height: 32, fontSize: '13px !important' }}
              >
                Category
              </InputLabel>
              <Select
                label="c"
                onChange={(e) => handleSelectCategory(e.target.value)}
                sx={{
                  height: 32,
                  width: 'auto',
                }}
                value={selectedCategory}
              >
                {props.categories.map((category, index) => (
                  <MenuItem key={'category-' + index} sx={{ height: 32 }} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {/* text search */}
          <FormControl size="small" sx={{ m: 1, minWidth: 120, height: 32, width: 'auto' }}>
            <InputLabel
              id="demo-simple-select-filled-label"
              sx={{ height: 32, fontSize: '13px !important' }}
            >
              Text search
            </InputLabel>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon
                    onClick={(e) => {
                      textSearch.length > 0 ? search() : handleSearchFocus()
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                </InputAdornment>
              }
              inputProps={{
                onFocus: () => handleSearchFocus(),
                onBlur: () => handleSearchBlur(),
              }}
              onChange={(e) => setTextSearch(e.target.value)}
              sx={{
                height: 32,
                width: searchingText || textSearch.length > 0 ? 180 : 130,
              }}
              value={textSearch}
            />
          </FormControl>
        </Box>
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
      <Box mt={4}>
        {props.loading ? (
          <Loading />
        ) : (
          <ItemsGridBox>{props.items?.map((item) => item)}</ItemsGridBox>
        )}
      </Box>
    </Box>
  )
}

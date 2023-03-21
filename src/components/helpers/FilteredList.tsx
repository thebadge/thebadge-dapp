import React, { useEffect, useState } from 'react'

import { Box, Chip, Divider, Typography, styled } from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'

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
  color: string
  items?: Array<React.ReactNode>
  filters: Array<ListFilter>
  search: (selectedFilters: Array<ListFilter>) => void
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
  marginBottom: theme.spacing(2),
  justifyContent: 'space-between',
}))

export default function FilteredList(props: FilteredListProps) {
  const { mode } = useColorMode()
  const defaultSelectedFilters = props.filters.filter((f) => f.defaultSelected)
  const [selectedFilters, setSelectedFilters] = useState<ListFilter[]>(defaultSelectedFilters)
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)

  useEffect(() => {
    if (!initialLoadDone) {
      props.search(defaultSelectedFilters)
      setInitialLoadDone(true)
    }
  }, [props, initialLoadDone, defaultSelectedFilters])

  const isFilterSelected = (filter: ListFilter) => {
    return !!selectedFilters.find((f) => f.title === filter.title)
  }

  const handleSelectFilter = (filter: ListFilter) => {
    if (!isFilterSelected(filter)) {
      const newSelectedFilters = selectedFilters.concat(filter)
      setSelectedFilters(() => newSelectedFilters)
      props.search(newSelectedFilters)
    }
  }
  const handleRemoveFilter = (filter: ListFilter) => {
    if (!filter.fixed) {
      const newSelectedFilters = selectedFilters.filter((f) => f.title !== filter.title)
      setSelectedFilters(newSelectedFilters)
      props.search(newSelectedFilters)
    }
  }

  return (
    <Box>
      <FilteredListHeaderBox>
        <Typography
          color={props.color}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
        >
          {props.title}
        </Typography>
        {/* filters box */}
        <Box display={'flex'} gap={1}>
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
        </Box>
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
      <Box mt={2}>
        {props.loading ? (
          <Loading />
        ) : (
          <ItemsGridBox>{props.items?.map((item) => item)}</ItemsGridBox>
        )}
      </Box>
    </Box>
  )
}

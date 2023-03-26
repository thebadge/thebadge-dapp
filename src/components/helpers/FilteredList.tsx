import React, { PropsWithChildren, useEffect, useState } from 'react'

import { Box, Chip, Divider, Typography, styled } from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'
import { colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import TBSearchField from '@/src/components/select/SearchField'
import TBadgeSelect from '@/src/components/select/Select'
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

type FilteredListProps = PropsWithChildren & {
  title: string
  color?: string
  filters: Array<ListFilter>
  categories?: Array<string>
  search: (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => void
  loading?: boolean
  disableEdit?: boolean
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
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)

  useEffect(() => {
    if (!initialLoadDone) {
      props.search(defaultSelectedFilters, '', '')
      setInitialLoadDone(true)
    }
  }, [props, initialLoadDone, defaultSelectedFilters])

  const search = (textSearch?: string) => {
    props.search(selectedFilters, selectedCategory, textSearch)
  }

  const isFilterSelected = (filter: ListFilter) => {
    return !!selectedFilters.find((f) => f.title === filter.title)
  }

  const handleSelectFilter = (filter: ListFilter) => {
    if (!isFilterSelected(filter)) {
      const newSelectedFilters = selectedFilters.concat(filter)
      setSelectedFilters(() => newSelectedFilters)
      props.search(newSelectedFilters, selectedCategory)
    }
  }
  const handleRemoveFilter = (filter: ListFilter) => {
    if (!filter.fixed) {
      const newSelectedFilters = selectedFilters.filter((f) => f.title !== filter.title)
      setSelectedFilters(newSelectedFilters)
      props.search(newSelectedFilters, selectedCategory)
    }
  }

  const handleSelectCategory = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory)
    props.search(selectedFilters, selectedCategory)
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
                disabled={props.disableEdit && !isFilterSelected(filter)}
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
            <TBadgeSelect
              items={props.categories}
              label={'Category'}
              onChange={(e) => handleSelectCategory(e.target.value)}
              selectedItem={selectedCategory}
            />
          ) : null}

          {/* text search */}
          <TBSearchField label="Text Search" onSearch={(searchValue) => search(searchValue)} />
        </Box>
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
      <Box mt={4}>
        {props.loading ? (
          <Loading />
        ) : (
          <ItemsGridBox>
            <SafeSuspense>{props.children}</SafeSuspense>
          </ItemsGridBox>
        )}
      </Box>
    </Box>
  )
}
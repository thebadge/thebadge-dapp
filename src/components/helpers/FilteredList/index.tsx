import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'

import { Box, Chip, Divider, Typography, styled } from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'
import { colors } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'

import LastUpdated from '@/src/components/common/LastUpdated'
import FilteredListDesktopView from '@/src/components/helpers/FilteredList/DesktopView'
import FilteredListMobileView from '@/src/components/helpers/FilteredList/MobileView'
import { SpinnerColors } from '@/src/components/loading/Spinner'
import TBSearchField from '@/src/components/select/SearchField'
import TBadgeSelect from '@/src/components/select/Select'
import useSelectedFilters from '@/src/hooks/nextjs/useSelectedFilters'
import { useSizeSM } from '@/src/hooks/useSize'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type ListFilter<K = unknown> = {
  title: string
  color?: OverridableStringUnion<
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ChipPropsColorOverrides
  >
  defaultSelected?: boolean // default is false
  fixed?: boolean // if true, cannot be deselected, default is false
  key?: K // the key to be used in the search function
}

// TODO: It would be nice to add K to ListFilter here, but it exceeds my TS know
type FilteredListProps = PropsWithChildren & {
  // listId is used to store the selected filters by the user
  listId?: string
  title: string
  titleColor?: string
  filters?: Array<ListFilter>
  categories?: Array<string>
  search: (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => void
  loading?: boolean
  loadingColor?: SpinnerColors
  disableEdit?: boolean
  preview?: ReactNode | undefined
  searchInputLabel?: string
  showTextSearch?: boolean
  items: React.ReactNode[]
}

const FilteredListHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export default function FilteredList({
  filters = [],
  listId,
  showTextSearch = true,
  ...props
}: FilteredListProps) {
  const { t } = useTranslation()
  const isMobile = useSizeSM()

  const { mode } = useColorMode()
  const { appChainId } = useWeb3Connection()

  const { selectedFilters, setSelectedFilters } = useSelectedFilters({ listId, filters })
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)
  const [lastSearchTimestamp, setLastSearchTimestamp] = useState<number | undefined>()

  const onSearch = useCallback(
    async (filters = selectedFilters, selectedCategory = '', textSearch = '') => {
      await props.search(filters, selectedCategory, textSearch)
      setLastSearchTimestamp(dayjs().unix())
    },
    [props, selectedFilters],
  )

  useEffect(() => {
    if (!initialLoadDone) {
      onSearch()
      setInitialLoadDone(true)
    }
  }, [initialLoadDone, onSearch])

  const onStringSearch = (textSearch?: string) =>
    onSearch(selectedFilters, selectedCategory, textSearch)

  const refresh = () => onSearch(selectedFilters, selectedCategory)

  useEffect(() => {
    // Not the best, but it's working... Feel free to recommend something better
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appChainId])

  const isFilterSelected = (filter: ListFilter) => {
    return !!selectedFilters.find((f) => f.title === filter.title)
  }

  const handleSelectFilter = (filter: ListFilter) => {
    if (!isFilterSelected(filter)) {
      const newSelectedFilters = selectedFilters.concat(filter)
      setSelectedFilters(newSelectedFilters)
      onSearch(newSelectedFilters, selectedCategory)
    }
  }
  const handleRemoveFilter = (filter: ListFilter) => {
    if (!filter.fixed) {
      const newSelectedFilters = selectedFilters.filter((f) => f.title !== filter.title)
      setSelectedFilters(newSelectedFilters)
      onSearch(newSelectedFilters, selectedCategory)
    }
  }

  const handleSelectCategory = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory)
    onSearch(selectedFilters, selectedCategory)
  }

  return (
    <Box>
      <FilteredListHeaderBox>
        <Typography
          color={props.titleColor ?? (mode === 'light' ? colors.blackText : colors.white)}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
          padding={[1, 1, 1, 0]}
        >
          {props.title}
        </Typography>

        {!isMobile && (
          <Box alignItems={'center'} display={'flex'} flexWrap={'wrap'} gap={1}>
            {/* filters */}
            {filters.map((filter, index) => {
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
                label={t('filteredList.category')}
                onChange={(e) => handleSelectCategory(e.target.value)}
                selectedItem={selectedCategory}
              />
            ) : null}

            {/* text search */}
            {showTextSearch && (
              <TBSearchField
                disabled={!!props.disableEdit}
                label={props.searchInputLabel || t('filteredList.textSearch')}
                onSearch={(searchValue) => onStringSearch(searchValue)}
              />
            )}
          </Box>
        )}
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />

      <LastUpdated
        label={t('filteredList.lastUpdated')}
        lastSearchTimestamp={lastSearchTimestamp}
        onClick={refresh}
      />

      {isMobile && (
        <FilteredListMobileView
          items={props.items}
          loading={props.loading}
          loadingColor={props.loadingColor}
          preview={props.preview}
        />
      )}
      {!isMobile && (
        <FilteredListDesktopView
          loading={props.loading}
          loadingColor={props.loadingColor}
          preview={props.preview}
        >
          {props.items}
        </FilteredListDesktopView>
      )}
    </Box>
  )
}

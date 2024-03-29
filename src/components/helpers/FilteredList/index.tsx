import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'

import {
  Box,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  styled,
} from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'
import { colors } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'

import LastUpdated from '@/src/components/common/LastUpdated'
import NetworkMultiSelect from '@/src/components/common/NetworkMultiSelect'
import FilteredListDesktopView from '@/src/components/helpers/FilteredList/DesktopView'
import FilteredListMobileView from '@/src/components/helpers/FilteredList/MobileView'
import { SpinnerColors } from '@/src/components/loading/Spinner'
import TBSearchField from '@/src/components/select/SearchField'
import TBadgeSelect from '@/src/components/select/Select'
import useSelectedFilters from '@/src/hooks/nextjs/useSelectedFilters'
import { useSizeSM } from '@/src/hooks/useSize'
import { useColorMode } from '@/src/providers/themeProvider'
import { ChainsValues } from '@/types/chains'
import { CallbackFunction } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export type ListFilter<K = unknown> = {
  title: string
  color?: OverridableStringUnion<
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ChipPropsColorOverrides
  >
  defaultSelected?: boolean // default is false
  fixed?: boolean // if true, cannot be deselected, default is false
  key?: K // the key to be used in the search function
  filterType?: 'Chip' | 'Switch'
}

// TODO: It would be nice to add K to ListFilter here, but it exceeds my TS know
type FilteredListProps = PropsWithChildren & {
  // listId is used to store the selected filters by the user
  listId?: string
  title: string
  titleIcon?: ReactNode | undefined
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
  alignItems?: string
  searchInputLabel?: string

  showNetworksFilter?: boolean
  onChainsChange?: CallbackFunction<ChainsValues[]>
  chainsIds?: ChainsValues[]

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
  showNetworksFilter,
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
      setInitialLoadDone(true)
      onSearch()
    }
  }, [initialLoadDone, onSearch])

  const onStringSearch = (textSearch?: string) =>
    onSearch(selectedFilters, selectedCategory, textSearch)

  const refresh = () => onSearch(selectedFilters, selectedCategory)

  useEffect(() => {
    // Not the best, but it's working... Feel free to recommend something better
    if (initialLoadDone) {
      refresh()
    }
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
          {props.titleIcon} {props.title}
        </Typography>

        {!isMobile && (
          <Box alignItems={'center'} display={'flex'} flexWrap={'wrap'} gap={1}>
            {/* filters */}
            {filters.map((filter, index) => {
              if (filter.filterType === 'Switch') {
                return (
                  <FormGroup key={'filter-' + index}>
                    <FormControlLabel
                      control={
                        <Switch
                          color={filter.color}
                          disabled={props.disableEdit && !isFilterSelected(filter)}
                          onChange={() => {
                            if (!isFilterSelected(filter)) {
                              handleSelectFilter(filter)
                              return
                            }
                            handleRemoveFilter(filter)
                          }}
                        />
                      }
                      label={filter.title}
                      labelPlacement="start"
                    />
                  </FormGroup>
                )
              }
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

            {showNetworksFilter && props.onChainsChange && props.chainsIds && (
              <NetworkMultiSelect initialValue={props.chainsIds} onChange={props.onChainsChange} />
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
          alignItems={props.alignItems}
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

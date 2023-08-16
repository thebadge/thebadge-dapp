import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Box, Chip, Divider, Stack, Typography, styled } from '@mui/material'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import { OverridableStringUnion } from '@mui/types'
import { colors } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Sticky from 'react-sticky-el'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TimeAgo from '@/src/components/helpers/TimeAgo'
import { Loading } from '@/src/components/loading/Loading'
import { SpinnerColors } from '@/src/components/loading/Spinner'
import TBSearchField from '@/src/components/select/SearchField'
import TBadgeSelect from '@/src/components/select/Select'
import { useColorMode } from '@/src/providers/themeProvider'

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
}

const ItemsGridBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
}))

const FilteredListHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  alignItems: 'center',
}))

const LastUpdateTypography = styled(Typography)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px !important',
  '&:hover': {
    textDecoration: 'underline',
  },
  cursor: 'pointer',
}))

export default function FilteredList({
  filters = [],
  showTextSearch = true,
  ...props
}: FilteredListProps) {
  const { t } = useTranslation()

  const { mode } = useColorMode()
  const defaultSelectedFilters = useMemo(() => filters.filter((f) => f.defaultSelected), [filters])
  const [selectedFilters, setSelectedFilters] = useState<ListFilter[]>(defaultSelectedFilters)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)
  const [lastSearchTimestamp, setLastSearchTimestamp] = useState<number | undefined>()

  const onSearch = useCallback(
    async (selectedFilters = defaultSelectedFilters, selectedCategory = '', textSearch = '') => {
      await props.search(selectedFilters, selectedCategory, textSearch)
      setLastSearchTimestamp(dayjs().unix())
    },
    [defaultSelectedFilters, props],
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

  const isFilterSelected = (filter: ListFilter) => {
    return !!selectedFilters.find((f) => f.title === filter.title)
  }

  const handleSelectFilter = (filter: ListFilter) => {
    if (!isFilterSelected(filter)) {
      const newSelectedFilters = selectedFilters.concat(filter)
      setSelectedFilters(() => newSelectedFilters)
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
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />

      <Stack my={1}>
        <LastUpdateTypography ml="auto" onClick={refresh}>
          {t('filteredList.lastUpdated')}
          <TimeAgo timestamp={lastSearchTimestamp} />
        </LastUpdateTypography>
      </Stack>
      <Box display="flex" id="preview" mt={4}>
        <Box flex="3">
          {props.loading ? (
            <Loading color={props.loadingColor} />
          ) : (
            <ItemsGridBox sx={{ justifyContent: props.preview ? 'left' : 'center' }}>
              <SafeSuspense>{props.children}</SafeSuspense>
            </ItemsGridBox>
          )}
        </Box>
        {props.preview && (
          <Stack flex="2" overflow="hidden">
            <Sticky boundaryElement="#preview">{props.preview}</Sticky>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

import React, { useState } from "react";

import { Box } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'
import BadgesToCurate from '@/src/pagePartials/profile/inReview/BadgesToCurate'

export default function BadgesInReviewSection() {
  const filters: Array<ListFilter> = [
    {
      title: 'In Review',
      color: 'green',
      fixed: true,
      defaultSelected: true,
    },
    {
      title: 'Challenged',
      color: 'pink',
    },
    {
      title: 'Minted',
      color: 'blue',
    },
  ]

  const [badges, setBadges] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const search = (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch: string,
  ) => {
    setLoading(true)

    // TODO get real badges using filters, category, text

    setTimeout(() => {
      console.log('searched with', selectedFilters, selectedCategory, textSearch)
      setLoading(false)
      setBadges([...badgesExampleList, ...badgesExampleList, ...badgesExampleList])
    }, 2000)
  }

  return (
    <>
      <Box mb={5}>
        <BadgesToCurate />
      </Box>

      <FilteredList
        categories={['Category 1', 'Category 2', 'Category 3']}
        color={colors.green}
        filters={filters}
        items={badges}
        loading={loading}
        search={search}
        title={'Your badges in review'}
      ></FilteredList>
    </>
  )
}

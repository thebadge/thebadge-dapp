import React, { useState } from "react";

import { Box } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'
import BadgesToCurate from '@/src/pagePartials/profile/inReview/BadgesToCurate'

type MiniBadgePreviewProps = {
  title: string
  category?: string
  description?: string
}
const MiniBadgePreview = (props: MiniBadgePreviewProps) => {
  return <div>{props.title}</div>
}

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
  const search = (selectedFilters: Array<ListFilter>) => {
    setLoading(true)

    // TODO get real badges using selectedFilters

    setTimeout(() => {
      console.log('searched with filters', selectedFilters)
      setLoading(false)
      setBadges([...badgesExampleList, ...badgesExampleList, ...badgesExampleList])
    }, 5000)
  }

  return (
    <>
      <Box mb={5}>
        <BadgesToCurate />
      </Box>

      <FilteredList
        color={colors.green}
        filters={filters}
        items={badges}
        loading={loading}
        search={search}
        title={'Your badges in review'}
      ></FilteredList>
      {/*<h2>BadgesInReviewSection</h2>*/}
    </>
  )
}

import { useRouter } from 'next/router'
import React, { RefObject, createRef, useState } from 'react'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import ExploreIcon from '@mui/icons-material/Explore'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { shuffleBadges } from '@/src/components/utils/sortBadgeList'
import { APP_URL } from '@/src/constants/common'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useSizeSM } from '@/src/hooks/useSize'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { handleShare } from '@/src/utils/badges/viewUtils'
import { generateBadgePreviewUrl, generateMintUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { Badge } from '@/types/generated/subgraph'

const ExploreBadges = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const router = useRouter()
  const isMobile = useSizeSM()

  const { readOnlyChainId } = useWeb3Connection()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadge, setSelectedBadge] = useState<number>(0)

  const badgeElementRefs: RefObject<HTMLLIElement>[] = badges.map(() => createRef<HTMLLIElement>())

  const search = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedFilters: Array<ListFilter>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedCategory: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const allBadgesQuery = await gql.allBadges()
    const badges = (allBadgesQuery.badges as Badge[]) || []
    // Shuffles the badges to avoid having badges with the same model near to others
    const shuffledBadges = shuffleBadges(badges)
    setTimeout(() => {
      setLoading(false)
      setBadges(shuffledBadges)
      setSelectedBadge(0)
    }, 2000)
  }

  function renderBadgeItem(bt: Badge, index: number) {
    const isSelected = bt.id === badges[selectedBadge]?.id
    const mintUrl = generateMintUrl(bt.badgeModel.controllerType, bt.badgeModel.id)
    const viewUrl = generateBadgePreviewUrl(bt.id, {
      theBadgeContractAddress: bt.contractAddress,
      connectedChainId: readOnlyChainId,
    })
    const isThirdParty = bt.badgeModel.controllerType === BadgeModelControllerType.ThirdParty
    return (
      <InViewPort
        key={bt.id}
        minHeight={300}
        minWidth={180}
        onViewPortEnter={() => {
          if (isMobile) {
            setSelectedBadge(index)
          }
        }}
      >
        <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
          <MiniBadgePreviewContainer
            highlightColor={colors.green}
            onClick={() => setSelectedBadge(index)}
            ref={badgeElementRefs[index]}
            selected={isSelected}
          >
            <MiniBadgeModelPreview
              controllerType={bt?.badgeModel?.controllerType}
              disableAnimations
              highlightColor={colors.green}
              metadata={bt?.uri}
              onClick={() => router.push(viewUrl)}
            />
            <Box display="flex" flex="1" justifyContent="space-between">
              <Box display="flex" flex="1">
                <Tooltip arrow title={t('badge.viewBadge.viewBadge')}>
                  <IconButton
                    aria-label="View badge"
                    component="label"
                    onClick={() => router.push(viewUrl)}
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </Tooltip>
                {!isThirdParty ? (
                  <Tooltip arrow title={t('badge.viewBadge.mintBadge')}>
                    <IconButton
                      aria-label="Mint badge"
                      component="label"
                      onClick={() => router.push(mintUrl)}
                    >
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Box>
              <Box display="flex" flex="1" justifyContent="flex-end">
                <Tooltip arrow title={t('badge.viewBadge.shareBadge')}>
                  <IconButton
                    aria-label="Share badge preview"
                    component="label"
                    onClick={() => handleShare(APP_URL + viewUrl)}
                  >
                    <ShareOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </MiniBadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badges.length > 0) {
      return badges.map((bt, i) => renderBadgeItem(bt, i))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('explorer.noBadgesFound')} />
      </Stack>,
    ]
  }

  return (
    <>
      <FilteredList
        items={generateListItems()}
        loading={loading}
        loadingColor={'green'}
        search={search}
        title={t('explorer.badges.title')}
        titleColor={colors.green}
        titleIcon={<ExploreIcon />}
      />
    </>
  )
}

export default ExploreBadges

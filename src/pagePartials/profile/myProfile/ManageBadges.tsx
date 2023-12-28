import { useRouter } from 'next/router'
import React, { RefObject, createRef, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import SelectedItemPreviewWrapper from '@/src/components/helpers/FilteredList/SelectedItemPreviewWrapper'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import { useSizeSM } from '@/src/hooks/useSize'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeModelInfoPreview from '@/src/pagePartials/badge/explorer/BadgeModelInfoPreview'
import ThirdPartyBadgeModelInfoPreview from '@/src/pagePartials/badge/explorer/ThirdPartyBadgeModelInfoPreview'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateBadgeModelCreate } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { BadgeModel } from '@/types/generated/subgraph'

export default function ManageBadges() {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()

  const gql = useSubgraph()
  const isMobile = useSizeSM()
  const [badgeModels, setBadgeModels] = useState<BadgeModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeModelIndex, setSelectedBadgeModelIndex] = useState<number>(0)
  const { data } = useUserById(address)
  const creatorMetadata = useUserMetadata(address, data?.metadataUri || '')
  const router = useRouter()

  const badgeModelsElementRefs: RefObject<HTMLLIElement>[] = badgeModels.map(() =>
    createRef<HTMLLIElement>(),
  )

  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadgeModelIndex,
    badgeModelsElementRefs,
    selectedBadgeModelIndex,
    badgeModels.length,
  )

  const search = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedFilters: Array<ListFilter>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedCategory: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch?: string,
  ) => {
    setLoading(true)

    if (!address) return null

    const badgeModels = await gql.badgeModelByCreatorId({ creatorId: address })
    const badges = (badgeModels.badgeModels as BadgeModel[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadgeModels(badges)
      setSelectedBadgeModelIndex(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badgeModels[selectedBadgeModelIndex]) return null
    const selectedBadgeModel = badgeModels[selectedBadgeModelIndex]
    return (
      <SelectedItemPreviewWrapper
        color={colors.purple}
        onSelectNext={selectNext}
        onSelectPrevious={selectPrevious}
        title={t('explorer.preview.title')}
      >
        {selectedBadgeModel.controllerType === BadgeModelControllerType.Community ? (
          <BadgeModelInfoPreview badgeModel={selectedBadgeModel} />
        ) : (
          <ThirdPartyBadgeModelInfoPreview badgeModel={selectedBadgeModel} />
        )}
      </SelectedItemPreviewWrapper>
    )
  }

  function renderBadgeModelItem(bt: BadgeModel, index: number) {
    const isSelected = bt.id === badgeModels[selectedBadgeModelIndex]?.id
    return (
      <InViewPort
        key={bt.id}
        minHeight={300}
        minWidth={180}
        onViewPortEnter={() => {
          if (isMobile) {
            setSelectedBadgeModelIndex(index)
          }
        }}
      >
        <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
          <MiniBadgePreviewContainer
            highlightColor={colors.blue}
            onClick={() => setSelectedBadgeModelIndex(index)}
            ref={badgeModelsElementRefs[index]}
            selected={isSelected}
          >
            <MiniBadgeModelPreview
              buttonTitle={t('explorer.buttonManage')}
              disableAnimations
              highlightColor={colors.blue}
              metadata={bt.uri}
            />
          </MiniBadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badgeModels.length > 0) {
      return badgeModels.map((bt, i) => renderBadgeModelItem(bt, i))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('explorer.noBadgesFound')} />
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.pink}
          onClick={() => router.push(generateBadgeModelCreate(BadgeModelControllerType.ThirdParty))}
          sx={{ m: 'auto' }}
        >
          <Typography>{t('profile.badgesCreated.create')}</Typography>
        </ButtonV2>
      </Stack>,
    ]
  }

  return (
    <>
      <FilteredList
        items={generateListItems()}
        loading={loading}
        loadingColor={'blue'}
        preview={renderSelectedBadgePreview()}
        search={search}
        showTextSearch={false}
        title={t('profile.thirdParty.subtitle', { thirdPartyName: creatorMetadata?.name })}
        titleColor={colors.blue}
      ></FilteredList>
    </>
  )
}

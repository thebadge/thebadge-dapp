import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { AddressZero } from '@ethersproject/constants'
import { Box, Stack, Typography, styled } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import { MiniBadgePreviewContainer } from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import { RequiredCreatorAccess } from '@/src/pagePartials/errors/requiresCreatorAccess'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StyledBadgeContainer = styled(MiniBadgePreviewContainer)(({ theme }) => {
  return {
    '& #badge-info': {
      display: 'flex',
      flexDirection: 'column',
      background: theme?.palette.text.primary,
      color: theme?.palette.background.default,
      padding: '8px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      transition: 'all .75s cubic-bezier(0.83, 0, 0.17, 1)',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0%)',
      bottom: '2px',
    },
  }
})

export default function BadgesCreatedSection() {
  const { t } = useTranslation()
  const router = useRouter()
  const { address } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const gql = useSubgraph()

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const userCreatedBadges = await gql.userCreatedBadges({ ownerAddress: address ?? AddressZero })
    const badgeModels = userCreatedBadges?.user?.createdBadgeModels || []

    const badgesLayouts = badgeModels.map((badgeModel) => {
      return (
        <StyledBadgeContainer highlightColor={colors.pink} key={badgeModel.id}>
          <MiniBadgeModelPreview
            disableAnimations
            highlightColor={colors.pink}
            metadata={badgeModel?.uri}
          />
          <Box id="badge-info">
            <Typography variant="body4">
              {t('profile.badgesCreated.explorerBadgeCost')}{' '}
              {formatUnits(badgeModel.creatorFee, 18)}
            </Typography>
            <Typography variant="body4">
              {t('profile.badgesCreated.explorerBadgeMinted')} {badgeModel.badgesMintedAmount}
            </Typography>
          </Box>
        </StyledBadgeContainer>
      )
    })

    setTimeout(() => {
      setItems(badgesLayouts)
      setLoading(false)
    }, 2000)
  }

  return (
    <RequiredCreatorAccess>
      <FilteredList
        id="created-badges-explorer-list"
        loading={loading}
        loadingColor={'primary'}
        search={search}
        showTextSearch={false}
        title={t('profile.badgesCreated.title')}
        titleColor={colors.pink}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('profile.badgesCreated.badgesCreatedNoResults')} />
            <ButtonV2
              backgroundColor={colors.transparent}
              fontColor={colors.pink}
              onClick={() => router.push('/badge/model/create')}
              sx={{ m: 'auto' }}
            >
              <Typography>{t('profile.badgesCreated.create')}</Typography>
            </ButtonV2>
          </Stack>
        )}
      </FilteredList>
    </RequiredCreatorAccess>
  )
}

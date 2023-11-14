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
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateBadgeModelCreate } from '@/src/utils/navigation/generateUrl'
import { BadgeModel } from '@/types/generated/subgraph'

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
  const [badgeModels, setBadgeModels] = useState<BadgeModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const gql = useSubgraph()

  const search = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedFilters: Array<ListFilter>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedCategory: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const userCreatedBadges = await gql.userCreatedBadges({ ownerAddress: address ?? AddressZero })
    const badgeModels = (userCreatedBadges?.user?.createdBadgeModels as BadgeModel[]) || []

    setBadgeModels(badgeModels)
    setLoading(false)
  }

  function renderCreatedBadgeItem(badgeModel: BadgeModel) {
    return (
      <StyledBadgeContainer highlightColor={colors.pink} key={badgeModel.id}>
        <MiniBadgeModelPreview
          disableAnimations
          highlightColor={colors.pink}
          metadata={badgeModel?.uri}
        />
        <Box id="badge-info">
          <Typography variant="body4">
            {t('profile.badgesCreated.explorerBadgeCost')} {formatUnits(badgeModel.creatorFee, 18)}
          </Typography>
          <Typography variant="body4">
            {t('profile.badgesCreated.explorerBadgeMinted')} {badgeModel.badgesMintedAmount}
          </Typography>
        </Box>
      </StyledBadgeContainer>
    )
  }

  function generateListItems() {
    if (badgeModels.length > 0) {
      return badgeModels.map((badgeModel) => renderCreatedBadgeItem(badgeModel))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('profile.badgesCreated.badgesCreatedNoResults')} />
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.pink}
          onClick={() => router.push(generateBadgeModelCreate())}
          sx={{ m: 'auto' }}
        >
          <Typography>{t('profile.badgesCreated.create')}</Typography>
        </ButtonV2>
      </Stack>,
    ]
  }

  return (
    <RequiredCreatorAccess>
      <FilteredList
        items={generateListItems()}
        loading={loading}
        loadingColor={'primary'}
        search={search}
        showTextSearch={false}
        title={t('profile.badgesCreated.title')}
        titleColor={colors.pink}
      />
    </RequiredCreatorAccess>
  )
}

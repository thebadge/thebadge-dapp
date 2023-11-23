import { useRouter } from 'next/router'
import React from 'react'

import { Button, Skeleton, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeByDisputeId from '@/src/hooks/subgraph/useBadgeByDisputeId'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import BadgeEvidenceDisplay from '@/src/pagePartials/badge/curate/viewEvidence/BadgeEvidenceDisplay'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { ChainsValues } from '@/types/chains'

const Container = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}))

export default function CourtEvidenceDataView({
  arbitrableChainID,
  disputeID,
}: {
  arbitrableChainID?: ChainsValues
  disputeID?: string
}) {
  const { t } = useTranslation()

  const router = useRouter()
  const graphQueryResult = useBadgeByDisputeId(arbitrableChainID, disputeID)

  if (!graphQueryResult.data || !graphQueryResult.data.badge || !graphQueryResult.data.badgeModel) {
    return null
  }

  const badge = graphQueryResult.data.badge

  function handleViewBadgeClick() {
    if (!arbitrableChainID) {
      return null
    }
    const linkToSubmissionView =
      router.basePath +
      generateBadgePreviewUrl(badge.id, {
        theBadgeContractAddress: badge.contractAddress,
        connectedChainId: arbitrableChainID,
      })
    window.open(`${linkToSubmissionView}`, '_blank')
  }

  return (
    <Container>
      <Container p={0}>
        <Typography sx={{ fontSize: '14px !important' }}>
          {t('klerosCourt.evidence.title')}
          <SafeSuspense
            fallback={<Skeleton sx={{ margin: 'auto' }} variant={'text'} width={500} />}
          >
            {graphQueryResult.data?.badgeModel?.id && (
              <CurationCriteriaLink
                badgeModelId={graphQueryResult.data?.badgeModel?.id}
                type="curate"
              />
            )}
          </SafeSuspense>
        </Typography>
        <SafeSuspense>
          {graphQueryResult.data?.badge?.id && (
            <BadgeEvidenceDisplay badgeId={graphQueryResult.data?.badge?.id} />
          )}
        </SafeSuspense>
      </Container>
      <Container
        sx={{
          border: `1px solid ${colors.greyBackground}`,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ fontSize: '14px !important' }}>
          {t('klerosCourt.evidence.seeMore')}
        </Typography>
        <Button
          color="blue"
          onClick={handleViewBadgeClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            width: 'fit-content',
            fontSize: '16px !important',
          }}
          variant="text"
        >
          {t('klerosCourt.evidence.viewDetails')}
        </Button>
      </Container>
    </Container>
  )
}

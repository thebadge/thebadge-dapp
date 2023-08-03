import { Box, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import StatisticDisplay from '@/src/pagePartials/home/statistics/StatisticDisplay'
import StatisticDoubleDisplay from '@/src/pagePartials/home/statistics/StatisticDoubleDisplay'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(4, 2),
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  flexDirection: 'row',
  borderRadius: theme.spacing(2),
  background:
    'linear-gradient(90deg, #008362 0%, #5BBCAD 21.88%, #002CBF 51.56%, #B74AD6 76.04%, #891CFB 100%)',
}))

export default function ProtocolStatistics() {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const protocolStatistic = gql.useProtocolStatistic()

  return (
    <>
      <Typography fontWeight={600} mb={4} mt={8} textAlign="center" variant="title2">
        {t('home.statistics.title')}
      </Typography>
      <Container>
        <StatisticDisplay
          label={t('home.statistics.created')}
          number={protocolStatistic.data?.protocolStatistic?.badgesMintedAmount}
        />

        <StatisticDisplay
          label={t('home.statistics.types')}
          number={protocolStatistic.data?.protocolStatistic?.badgeModelsCreatedAmount}
          transparent
        />

        <StatisticDisplay
          label={t('home.statistics.challenged')}
          number={protocolStatistic.data?.protocolStatistic?.badgesChallengedAmount}
        />

        <StatisticDoubleDisplay
          primaryLabel={t('home.statistics.owners')}
          primaryNumber={protocolStatistic.data?.protocolStatistic?.badgesOwnersAmount}
          secondaryLabel={t('home.statistics.creators')}
          secondaryNumber={protocolStatistic.data?.protocolStatistic?.badgeCreatorsAmount}
          transparent
        />
        <StatisticDisplay
          label={t('home.statistics.curators')}
          number={protocolStatistic.data?.protocolStatistic?.badgeCuratorsAmount}
        />
      </Container>
    </>
  )
}

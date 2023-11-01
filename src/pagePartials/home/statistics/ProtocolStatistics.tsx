import { Box, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { useProtocolStatistic } from '@/src/hooks/subgraph/useProtocolStatistic'
import StatisticDisplay from '@/src/pagePartials/home/statistics/StatisticDisplay'
import StatisticDoubleDisplay from '@/src/pagePartials/home/statistics/StatisticDoubleDisplay'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  padding: theme.spacing(4, 2),
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  flexDirection: 'row',
  borderRadius: theme.spacing(2),
  background:
    'linear-gradient(90deg, #008362 0%, #5BBCAD 21.88%, #002CBF 51.56%, #B74AD6 76.04%, #891CFB 100%)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    maxHeight: '500px',
  },
  [theme.breakpoints.down(512)]: {
    maxHeight: 'inherit',
    width: '350px',
    margin: 'auto',
  },
}))

export default function ProtocolStatistics() {
  const { t } = useTranslation()

  const protocolStatistic = useProtocolStatistic()

  return (
    <>
      <Typography fontWeight={600} mb={4} mt={8} textAlign="center" variant="title2">
        {t('home.statistics.title')}
      </Typography>
      <Container>
        <StatisticDisplay
          label={t('home.statistics.minted')}
          number={protocolStatistic.data?.badgesMintedAmount}
        />

        <StatisticDisplay
          label={t('home.statistics.models')}
          number={protocolStatistic.data?.badgeModelsCreatedAmount}
          transparent
        />

        <StatisticDisplay
          label={t('home.statistics.challenged')}
          number={protocolStatistic.data?.badgesChallengedAmount}
        />

        <StatisticDoubleDisplay
          primaryLabel={t('home.statistics.owners')}
          primaryNumber={protocolStatistic.data?.badgesOwnersAmount}
          secondaryLabel={t('home.statistics.creators')}
          secondaryNumber={protocolStatistic.data?.badgeCreatorsAmount}
          transparent
        />
        <StatisticDisplay
          label={t('home.statistics.curators')}
          number={protocolStatistic.data?.badgeCuratorsAmount}
        />
      </Container>
    </>
  )
}

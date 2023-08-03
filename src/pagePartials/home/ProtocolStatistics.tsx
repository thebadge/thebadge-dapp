import { Box, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

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

const StatisticContainer = styled(Stack)<{ transparent?: boolean }>(({ theme, transparent }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  opacity: transparent ? 1 : 0.7,
  background: transparent ? 'transparent' : '#0D0D0D',
  whiteSpace: 'break-spaces',
}))

export default function ProtocolStatistics() {
  const { t } = useTranslation()

  return (
    <>
      <Typography fontWeight={600} mb={3} mt={6} textAlign="center" variant="title2">
        {t('home.statistics.title')}
      </Typography>
      <Container>
        <StatisticContainer>
          <Typography component="span" variant="h2">
            182
          </Typography>
          <Typography variant="dAppTitle2">{t('home.statistics.created')}</Typography>
        </StatisticContainer>

        <StatisticContainer transparent>
          <Typography color="black" component="span" variant="h2">
            19
          </Typography>
          <Typography color="black" variant="dAppTitle2">
            {t('home.statistics.types')}
          </Typography>
        </StatisticContainer>

        <StatisticContainer>
          <Typography component="span" variant="h2">
            182
          </Typography>
          <Typography variant="dAppTitle2">{t('home.statistics.challenged')}</Typography>
        </StatisticContainer>

        <StatisticContainer sx={{ py: 0 }} transparent>
          <Box alignItems="center" display="flex" gap={2}>
            <Typography color="black" component="div" variant="h2">
              19
            </Typography>
            <Typography color="black" component="div" lineHeight="110%" variant="dAppTitle2">
              {t('home.statistics.owners')}
            </Typography>
          </Box>
          <Box alignItems="center" display="flex" gap={2}>
            <Typography color="black" component="div" variant="h2">
              19
            </Typography>
            <Typography color="black" component="div" lineHeight="110%" variant="dAppTitle2">
              {t('home.statistics.creators')}
            </Typography>
          </Box>
        </StatisticContainer>

        <StatisticContainer>
          <Typography component="span" variant="h2">
            182
          </Typography>
          <Typography variant="dAppTitle2">{t('home.statistics.curators')}</Typography>
        </StatisticContainer>
      </Container>
    </>
  )
}

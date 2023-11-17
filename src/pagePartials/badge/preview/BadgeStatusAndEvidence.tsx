import { useState } from 'react'
import * as React from 'react'

import { Box, Divider, Stack, Tab, Tabs, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import SwipeableViews from 'react-swipeable-views'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useIsThirdPartyBadge from '@/src/hooks/subgraph/useIsThirdPartyBadge'
import { useSizeSM } from '@/src/hooks/useSize'
import ChallengeStatus from '@/src/pagePartials/badge/preview/addons/ChallengeStatus'
import EvidencesList from '@/src/pagePartials/badge/preview/addons/EvidencesList'

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  alignItems: 'flex-start',
  fontWeight: 700,
}))

export default function BadgeStatusAndEvidence() {
  const { t } = useTranslation()
  const isMobile = useSizeSM()

  const [selectedTab, setSelectedTab] = useState(0)

  const { badgeId } = useBadgeIdParam()
  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }
  const isThirdParty = useIsThirdPartyBadge(badgeId)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setSelectedTab(index)
  }

  return (
    <Stack gap={3} mt={isMobile ? 7 : 5}>
      {isMobile && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              indicatorColor="secondary"
              onChange={handleChange}
              textColor="secondary"
              value={selectedTab}
              variant="fullWidth"
            >
              <StyledTab label={t('badge.viewBadge.evidence.evidenceActivity')} />
              <StyledTab label={t('badge.viewBadge.challengeStatus.title')} />
            </Tabs>
          </Box>

          <SwipeableViews axis={'x'} index={selectedTab} onChangeIndex={handleChangeIndex}>
            <TabPanel index={0} value={selectedTab}>
              <SafeSuspense>
                <EvidencesList badgeId={badgeId} />
              </SafeSuspense>
            </TabPanel>

            {!isThirdParty && (
              <TabPanel index={1} value={selectedTab}>
                <SafeSuspense>
                  <ChallengeStatus />
                </SafeSuspense>
              </TabPanel>
            )}
          </SwipeableViews>
        </>
      )}
      {!isMobile && !isThirdParty && (
        <>
          <SafeSuspense>
            <ChallengeStatus />
          </SafeSuspense>
          <Divider color={colors.white} />
          <SafeSuspense>
            <EvidencesList badgeId={badgeId} />
          </SafeSuspense>
        </>
      )}
    </Stack>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, index, value, ...other } = props

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} role="tabpanel" {...other}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  )
}

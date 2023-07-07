import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { Box, Divider, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { SectionTitleBox } from '@/src/pagePartials/home/SectionBoxes'
import PendingList from '@/src/pagePartials/profile/myProfile/PendingList'

export default function Pending() {
  return (
    <Box sx={{ width: '100%', px: 2, py: 1 }}>
      <SectionTitleBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
          <NotificationsNoneOutlinedIcon color="green" />
          <Typography
            color={colors.green}
            fontWeight={900}
            lineHeight={'30px'}
            textAlign="center"
            variant={'h5'}
          >
            Pending
          </Typography>
        </Box>
      </SectionTitleBox>
      <Divider color={colors.green} />
      <SafeSuspense>
        <PendingList />
      </SafeSuspense>
    </Box>
  )
}

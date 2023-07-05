import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { Box, Divider, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { SectionTitleBox } from '@/src/pagePartials/home/SectionBoxes'
import NearToExpireList from '@/src/pagePartials/profile/myProfile/NearToExpireList'

export default function NearToExpire() {
  return (
    <Box sx={{ width: '100%', px: 2, py: 1, mr: 1 }}>
      <SectionTitleBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
          <HistoryOutlinedIcon color="purple" />
          <Typography
            color={colors.purple}
            fontWeight={900}
            lineHeight={'30px'}
            textAlign="center"
            variant={'h5'}
          >
            Near to expire
          </Typography>
        </Box>
      </SectionTitleBox>
      <Divider />
      <SafeSuspense>
        <NearToExpireList />
      </SafeSuspense>
    </Box>
  )
}

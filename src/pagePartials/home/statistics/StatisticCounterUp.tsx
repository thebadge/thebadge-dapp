import { Theme, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import CountUp from 'react-countup'

import InViewPort from '@/src/components/helpers/InViewPort'

export default function StatisticCounterUp({
  number,
  sx,
}: {
  number: number | undefined
  sx?: SxProps<Theme>
}) {
  if (!number) return null
  return (
    <InViewPort minHeight={60} minWidth={60}>
      <CountUp delay={0} end={number} start={number / 2}>
        {({ countUpRef }) => (
          <div>
            <Typography component="span" ref={countUpRef} sx={sx} variant="h2" />
          </div>
        )}
      </CountUp>
    </InViewPort>
  )
}

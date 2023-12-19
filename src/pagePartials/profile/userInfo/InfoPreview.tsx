import React, { useEffect, useRef, useState } from 'react'

import { Stack } from '@mui/material'
import AnimateHeight, { Height } from 'react-animate-height'

import { InfoPreviewContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewContainer'
import InfoPreviewEdit from '@/src/pagePartials/profile/userInfo/InfoPreviewEdit'
import { WCAddress } from '@/types/utils'

type Props = {
  address: string
}
export default function InfoPreview({ address }: Props) {
  const [height, setHeight] = useState<Height>('auto')
  const contentDiv = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setHeight(contentDiv.current?.clientHeight ? contentDiv.current?.clientHeight + 20 : 'auto')
    })

    if (contentDiv.current) resizeObserver.observe(contentDiv.current)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <Stack mb={6}>
      <AnimateHeight
        contentClassName="auto-content"
        contentRef={contentDiv}
        height={height}
        style={{ padding: 10 }}
      >
        <InfoPreviewContainer>
          <InfoPreviewEdit address={address as WCAddress} />
        </InfoPreviewContainer>
      </AnimateHeight>
    </Stack>
  )
}

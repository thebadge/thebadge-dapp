import { useRef } from 'react'

import { Box } from '@mui/material'
import Spline from '@splinetool/react-spline'
import { Application, SPEObject } from '@splinetool/runtime'

export default function BadgeRender() {
  const badgeRenderRef = useRef<SPEObject>()

  function onLoad(spline: Application) {
    spline.setZoom(1.5)
    spline.setBackgroundColor('transparent')
    // const obj = spline.findObjectByName('Texto')
    // or
    // const obj = spline.findObjectById('8E8C2DDD-18B6-4C54-861D-7ED2519DE20E');
    // save it in a ref for later use
    // badgeRenderRef.current = obj
  }

  return (
    <Box height="500px" marginLeft="auto" width="400px">
      <Spline
        onLoad={onLoad}
        scene="https://prod.spline.design/LmCscuaWa4zYPr8M/scene.splinecode"
      />
    </Box>
  )
}

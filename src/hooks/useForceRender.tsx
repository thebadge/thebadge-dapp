import { useState } from 'react'

export const useForceRender = () => {
  const [_, setValue] = useState(0)
  return () => setValue((prevValue) => ++prevValue)
}

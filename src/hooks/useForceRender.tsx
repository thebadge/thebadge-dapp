import { useState } from 'react'

export const useForceRender = () => {
  const [value, setValue] = useState(0)
  return () => setValue((prevValue) => ++prevValue)
}

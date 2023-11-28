import { useState } from 'react'

export const useForceRender = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useState(0)
  return () => setValue((prevValue) => ++prevValue)
}

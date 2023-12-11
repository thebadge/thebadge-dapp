import { useEffect, useState } from 'react'

export type MousePosition = {
  x: number | null
  y: number | null
}

const useMousePosition = ({ lockPosition = false }: { lockPosition: boolean }) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: null,
    y: null,
  })
  useEffect(() => {
    if (lockPosition) return
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [lockPosition])
  return mousePosition
}
export default useMousePosition

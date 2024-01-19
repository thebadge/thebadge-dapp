import { RefObject, useCallback, useEffect } from 'react'

import { useKeyPress } from '@/src/hooks/useKeypress'

export default function useListItemNavigation(
  setSelected: React.Dispatch<React.SetStateAction<number>>,
  elementRefs: RefObject<HTMLLIElement>[],
  selectedElement: number,
  amountOfListElements: number,
) {
  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (elementRefs[selectedElement]?.current) {
      window.scrollTo({
        top:
          (elementRefs[selectedElement].current?.offsetTop || 0) -
          (elementRefs[selectedElement].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [elementRefs, selectedElement])

  const selectPrevious = useCallback(() => {
    if (!amountOfListElements) return
    setSelected((prevIndex) => {
      if (prevIndex === 0) return amountOfListElements - 1
      return prevIndex - 1
    })
  }, [amountOfListElements, setSelected])

  const selectNext = useCallback(() => {
    if (!amountOfListElements) return
    setSelected((prevIndex) => {
      if (prevIndex === amountOfListElements - 1) return 0
      return prevIndex + 1
    })
  }, [amountOfListElements, setSelected])

  useEffect(() => {
    if (rightPress) {
      selectNext()
    }
  }, [rightPress, selectNext])

  useEffect(() => {
    if (leftPress) {
      selectPrevious()
    }
  }, [leftPress, selectPrevious])

  return { selectPrevious, selectNext }
}

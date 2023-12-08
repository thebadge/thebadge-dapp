import { KeyboardEvent, RefObject, useCallback, useEffect, useState } from 'react'

import { CallbackFunction } from '@/types/utils'

export enum EventKey {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Enter = 'Enter',
  Escape = 'Escape',
}

export function useListHighlightItem<T extends HTMLElement>(
  listLenght: number,
  listRefs: RefObject<T>[],
  onEnterPress?: CallbackFunction<number>,
  onEscapePress?: VoidFunction,
) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)

  useEffect(() => {
    if (listLenght === 0) setHighlightedIndex(0)
  }, [listLenght])

  /**
   * Handle the input keydown event, navigation, selection and also scrolls to the selected element
   */
  const handleKeyDown = useCallback<CallbackFunction<KeyboardEvent<HTMLDivElement>>>(
    (e: KeyboardEvent<HTMLDivElement>) => {
      let index = 0

      switch (e.key) {
        case EventKey.ArrowDown: {
          e.preventDefault()
          if (!listRefs.length) {
            break
          }
          if (highlightedIndex === listLenght - 1) {
            setHighlightedIndex(0)
          } else {
            index = highlightedIndex + 1
            setHighlightedIndex(index)
          }

          const itemRef = listRefs[index].current
          if (itemRef) {
            itemRef.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'center',
            })
          }
          break
        }
        case EventKey.ArrowUp: {
          e.preventDefault()
          if (highlightedIndex === 0) {
            index = listLenght - 1
            setHighlightedIndex(index)
          } else {
            index = highlightedIndex - 1
            setHighlightedIndex(index)
          }

          const itemRef = listRefs[index].current
          if (itemRef) {
            itemRef.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'center',
            })
          }

          break
        }
        case EventKey.Enter: {
          e.preventDefault()
          if (onEnterPress) onEnterPress(highlightedIndex)
          break
        }
        case EventKey.Escape: {
          e.preventDefault()
          if (onEscapePress) onEscapePress()
          break
        }
      }
    },
    [highlightedIndex, listLenght, listRefs, onEnterPress, onEscapePress],
  )

  return { highlightedIndex, handleKeyDown, setHighlightedIndex }
}

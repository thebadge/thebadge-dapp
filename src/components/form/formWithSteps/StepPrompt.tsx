import { useEffect } from 'react'

export default function StepPrompt({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) {
  /**
   * Helper component, to prop an alert when the user want to leave with unsaved
   * work on the form
   */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [hasUnsavedChanges])

  return <></>
}

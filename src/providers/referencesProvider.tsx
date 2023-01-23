import React, { RefObject, useContext, useRef } from 'react'

type SectionReferencesContextType = {
  homeSection: RefObject<HTMLDivElement> | null
  scrollTo: (ref: RefObject<HTMLDivElement>) => void
}

const SectionReferencesContext = React.createContext<SectionReferencesContextType>({
  homeSection: null,
  scrollTo: () => {
    // Empty function
  },
})

export default function SectionReferencesProvider({ children }: { children: React.ReactNode }) {
  const homeSection = useRef(null)

  const scrollTo = (sectionRef: RefObject<HTMLDivElement> | null) => {
    if (!sectionRef) return
    window.scrollTo({
      top: sectionRef.current?.offsetTop,
      behavior: 'smooth',
    })
  }

  return (
    <SectionReferencesContext.Provider
      value={{
        homeSection,
        scrollTo,
      }}
    >
      {children}
    </SectionReferencesContext.Provider>
  )
}

export const useSectionReferences = () => useContext(SectionReferencesContext)

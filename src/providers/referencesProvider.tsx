import React, { RefObject, useContext, useRef } from 'react'

type SectionReferencesContextType = {
  homeSection: RefObject<HTMLDivElement> | null
  claimBadgesSection: RefObject<HTMLDivElement> | null
  earnByCuratingSection: RefObject<HTMLDivElement> | null
  becomeACreatorSection: RefObject<HTMLDivElement> | null
  becomeAThirdPartySection: RefObject<HTMLDivElement> | null
  scrollTo: (ref: RefObject<HTMLDivElement>) => void
}

const SectionReferencesContext = React.createContext<SectionReferencesContextType>({
  homeSection: null,
  claimBadgesSection: null,
  earnByCuratingSection: null,
  becomeACreatorSection: null,
  becomeAThirdPartySection: null,
  scrollTo: () => {
    // Empty function
  },
})

export default function SectionReferencesProvider({ children }: { children: React.ReactNode }) {
  const homeSection = useRef(null)
  const claimBadgesSection = useRef(null)
  const earnByCuratingSection = useRef(null)
  const becomeACreatorSection = useRef(null)
  const becomeAThirdPartySection = useRef(null)

  const scrollTo = (sectionRef: RefObject<HTMLDivElement> | null) => {
    if (!sectionRef) return
    window.scrollTo({
      top: (sectionRef.current?.offsetTop || 0) - 75,
      behavior: 'smooth',
    })
  }

  return (
    <SectionReferencesContext.Provider
      value={{
        homeSection,
        claimBadgesSection,
        earnByCuratingSection,
        becomeACreatorSection,
        becomeAThirdPartySection,
        scrollTo,
      }}
    >
      {children}
    </SectionReferencesContext.Provider>
  )
}

export const useSectionReferences = () => useContext(SectionReferencesContext)

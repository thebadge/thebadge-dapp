import React, { RefObject, useContext, useRef } from 'react'

type SectionReferencesContextType = {
  homeSection: RefObject<HTMLDivElement> | null
  howItWorksSection: RefObject<HTMLDivElement> | null
  teamSection: RefObject<HTMLDivElement> | null
  partnershipSection: RefObject<HTMLDivElement> | null
  contactSection: RefObject<HTMLDivElement> | null
  scrollTo: (ref: RefObject<HTMLDivElement>) => void
}

const SectionReferencesContext = React.createContext<SectionReferencesContextType>({
  homeSection: null,
  howItWorksSection: null,
  teamSection: null,
  partnershipSection: null,
  contactSection: null,
  scrollTo: () => {
    // Empty function
  },
})

export default function SectionReferencesProvider({ children }: { children: React.ReactNode }) {
  const homeSection = useRef(null)
  const howItWorksSection = useRef(null)
  const teamSection = useRef(null)
  const partnershipSection = useRef(null)
  const contactSection = useRef(null)

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
        howItWorksSection,
        teamSection,
        partnershipSection,
        contactSection,
        scrollTo,
      }}
    >
      {children}
    </SectionReferencesContext.Provider>
  )
}

export const useSetionReferences = () => useContext(SectionReferencesContext)

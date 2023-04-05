import { useRouter } from 'next/router'
import React, { RefObject, useContext, useRef } from 'react'

type SectionReferencesContextType = {
  homeSection: RefObject<HTMLDivElement> | null
  claimBadgesSection: RefObject<HTMLDivElement> | null
  earnByCuratingSection: RefObject<HTMLDivElement> | null
  becomeACreatorSection: RefObject<HTMLDivElement> | null
  becomeAThirdPartySection: RefObject<HTMLDivElement> | null
  scrollTo: (path: string, ref: RefObject<HTMLDivElement> | null) => void
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
  const router = useRouter()

  const homeSection = useRef(null)
  const claimBadgesSection = useRef(null)
  const earnByCuratingSection = useRef(null)
  const becomeACreatorSection = useRef(null)
  const becomeAThirdPartySection = useRef(null)

  const scrollTo = async (path: string, sectionRef: RefObject<HTMLDivElement> | null) => {
    await router.push(path)
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

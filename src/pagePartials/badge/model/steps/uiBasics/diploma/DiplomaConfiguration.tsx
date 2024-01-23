import React from 'react'

import { Divider, Stack } from '@mui/material'

import SectionContainer from '../addons/SectionContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import ModelDescriptionField from '@/src/pagePartials/badge/model/steps/uiBasics/addons/ModelDescriptionField'
import ModelNameField from '@/src/pagePartials/badge/model/steps/uiBasics/addons/ModelNameField'
import BodyDataConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/BodyDataConfiguration'
import FooterConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/FooterConfiguration'
import HeaderConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/HeaderConfiguration'
import IssuerConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/IssuerConfiguration'
import SignatureConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/SignatureConfiguration'

export default function DiplomaConfiguration() {
  return (
    <>
      <SectionContainer>
        <Stack flex="1" gap={4}>
          <ModelNameField />

          <ModelDescriptionField />
        </Stack>
      </SectionContainer>
      <Divider />

      <Stack flex="1" mb={2}>
        <BadgeModelCreationPreview />
      </Stack>

      <BodyDataConfiguration />

      <HeaderConfiguration />

      <SafeSuspense>
        <FooterConfiguration />
      </SafeSuspense>

      <SignatureConfiguration />

      <SafeSuspense>
        <IssuerConfiguration />
      </SafeSuspense>
    </>
  )
}

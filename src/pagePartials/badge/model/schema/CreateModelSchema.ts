import { z } from 'zod'

import {
  AgreementSchema,
  ChallengePeriodTypeSchema,
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  LongTextSchema,
  NumberSchema,
  SeverityTypeSchema,
} from '@/src/components/form/helpers/customSchemas'
import { IS_DEVELOP } from '@/src/constants/common'

export const CreateModelSchema = z.object({
  howItWorks: AgreementSchema.describe(`Badge creation quick tutorial.`),
  // ------ UI BASICS FIELD ------
  name: z.string().describe('Name // This is the name that your badge type will have'),
  description: LongTextSchema.describe(
    'Description // This description will be showed on the Badge itself, you can use some helpers to inject user information on it.',
  ),
  badgeModelLogoUri: ImageSchema.describe(
    'Your badge type logo // This Logo will be on the center part of the Badge itself. Recommended images with aspect ratio of 1.',
  ),
  textContrast: z.string(),
  backgroundImage: z.string(),
  template: z.string(),
  // ------ STRATEGY FIELD ------
  criteriaFileUri: FileSchema.describe(
    'Curation criteria (PDF format). // This is the document containing your badge curation criteria, an example of curation criteria can be found on the docs.',
  ),
  criteriaDeltaText: z
    .object({ string: z.string(), delta: z.any() })
    .describe(
      'Curation criteria (Text format). // This is the document containing your badge curation criteria, an example of curation criteria can be found on the docs.',
    ),
  challengePeriodDuration: ChallengePeriodTypeSchema.describe(
    `Challenge period duration (${
      IS_DEVELOP ? 'minutes' : 'days'
    }) // Challenge period duration in days. During this time the community can analyze the evidence and challenge it.`,
  ),
  rigorousness: SeverityTypeSchema.describe(
    'Rigorousness // How rigorous the emission of badges should be',
  ),
  mintCost: NumberSchema.describe(
    'Cost to mint in ETH // How much it will be necessary to deposit.',
  ),
  validFor: ExpirationTypeSchema.describe(
    'Expiration time // The badge will be valid for this amount of time (0 is forever)',
  ),
  badgeMetadataColumns: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

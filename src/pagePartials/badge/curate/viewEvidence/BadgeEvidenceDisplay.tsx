import React from 'react'

import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import BadgeEvidenceSwiper from '@/src/pagePartials/badge/curate/viewEvidence/BadgeEvidenceSwiper'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function BadgeEvidenceDisplay({ badgeId }: { badgeId: string }) {
  const { readOnlyChainId } = useWeb3Connection()
  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badgeId)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  return <BadgeEvidenceSwiper badgeEvidence={badgeEvidence} networkId={readOnlyChainId} />
}

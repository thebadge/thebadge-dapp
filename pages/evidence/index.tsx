import { ReactElement, useEffect, useState } from 'react'

import ExternalLink from '@/src/components/helpers/ExternalLink'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import useBadgeByDisputeId from '@/src/hooks/subgraph/useBadgeByDisputeId'
import { useColorMode } from '@/src/providers/themeProvider'
import { NextPageWithLayout } from '@/types/next'

type InjectedParams = {
  // the ID of the dispute in the arbitrator contract;
  disputeID: string
  // the address of the arbitrator contract;
  arbitratorContractAddress: string
  // the ID of the chain (as defined by EIP-155) in which the arbitrator application is running;
  arbitratorChainID?: number
  // the URL of JSON RPC endpoint connecting to a node on the network. It MUST be pointing to a node from the same chain identified by arbitratorChainID.
  arbitratorJsonRpcUrl?: string
  // the address of the arbitrable contract;
  arbitrableContractAddress: string
  // the ID of the chain (as defined by EIP-155) in which the arbitrable application is running. If not provided by the Meta Evidence file, it SHOULD have the same value as arbitratorChainID.
  arbitrableChainID: number
  //the URL of JSON RPC endpoint connecting to a node on the network. It MUST be pointing to a node from the same chain identified by arbitrableChainID.
  arbitrableJsonRpcUrl: string
}

/**
 * Evidence Iframe used on Kleros Court to display a link to our preview page,
 * where the jurors would be able to see the data about the dispute
 **/
const EvidenceIframe: NextPageWithLayout = () => {
  const [parameters, setParameters] = useState<InjectedParams>()
  const { mode, setColorMode } = useColorMode()

  useEffect(() => {
    if (mode !== 'light') setColorMode('light')
  }, [mode, setColorMode])

  // Read query parameters.
  useEffect(() => {
    if (window.location.search[0] !== '?' || parameters) return
    const message = JSON.parse(
      window.location.search
        .substring(1)
        .replace(/%22/g, '"')
        .replace(/%7B/g, '{')
        .replace(/%3A/g, ':')
        .replace(/%2C/g, ',')
        .replace(/%7D/g, '}')
        .replace(/%2F/g, '/'),
    )

    const {
      arbitrableChainID,
      arbitrableContractAddress,
      arbitrableJsonRpcUrl,
      arbitratorContractAddress,
      disputeID,
    } = message

    if (!arbitrableContractAddress || !disputeID || !arbitratorContractAddress) return

    setParameters({
      arbitrableContractAddress,
      arbitratorContractAddress,
      disputeID,
      arbitrableChainID,
      arbitrableJsonRpcUrl,
    })
  }, [parameters])

  return (
    <>
      <SafeSuspense>
        <OpenTBViewButton
          arbitrableChainID={parameters?.arbitrableChainID}
          disputeID={parameters?.disputeID}
        />
      </SafeSuspense>
    </>
  )
}

function OpenTBViewButton({
  arbitrableChainID,
  disputeID,
}: {
  arbitrableChainID: number | undefined
  disputeID: string | undefined
}) {
  const graphQueryResult = useBadgeByDisputeId(arbitrableChainID, disputeID)

  const linkToSubmissionView = APP_URL + `/badge/preview/${graphQueryResult.data?.badge?.id}`

  return <ExternalLink href={`${linkToSubmissionView}`} label="Open TheBadge view page" />
}

EvidenceIframe.getLayout = (page: ReactElement) => <>{page}</>
export default EvidenceIframe

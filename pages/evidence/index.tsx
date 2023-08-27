import React, { ReactElement, useEffect, useState } from 'react'

import { Button, Skeleton, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import useBadgeByDisputeId from '@/src/hooks/subgraph/useBadgeByDisputeId'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import BadgeEvidenceDisplay from '@/src/pagePartials/badge/curate/viewEvidence/BadgeEvidenceDisplay'
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

const Container = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}))

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
        <TBDataView
          arbitrableChainID={parameters?.arbitrableChainID}
          disputeID={parameters?.disputeID}
        />
      </SafeSuspense>
    </>
  )
}

function TBDataView({
  arbitrableChainID,
  disputeID,
}: {
  arbitrableChainID: number | undefined
  disputeID: string | undefined
}) {
  const graphQueryResult = useBadgeByDisputeId(arbitrableChainID, disputeID)

  function handleViewBadgeClick() {
    const linkToSubmissionView = APP_URL + `/badge/preview/${graphQueryResult.data?.badge?.id}`
    window.open(`${linkToSubmissionView}`, '_ blank')
  }

  return (
    <Container>
      <Container p={0}>
        <Typography sx={{ fontSize: '14px !important' }}>
          Submitted Badge Evidence
          <SafeSuspense
            fallback={<Skeleton sx={{ margin: 'auto' }} variant={'text'} width={500} />}
          >
            {graphQueryResult.data?.badgeModel?.id && (
              <CurationCriteriaLink
                badgeModelId={graphQueryResult.data?.badgeModel?.id}
                type="curate"
              />
            )}
          </SafeSuspense>
        </Typography>
        <SafeSuspense>
          {graphQueryResult.data?.badge?.id && (
            <BadgeEvidenceDisplay badgeId={graphQueryResult.data?.badge?.id} />
          )}
        </SafeSuspense>
      </Container>
      <Container
        sx={{
          border: `1px solid ${colors.greyBackground}`,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ fontSize: '14px !important' }}>
          You can see more information about this dispute on TheBadge App
        </Typography>
        <Button
          color="blue"
          onClick={handleViewBadgeClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            width: 'fit-content',
            fontSize: '16px !important',
          }}
          variant="text"
        >
          View details on TheBadge App
        </Button>
      </Container>
    </Container>
  )
}

EvidenceIframe.getLayout = (page: ReactElement) => <>{page}</>
export default EvidenceIframe

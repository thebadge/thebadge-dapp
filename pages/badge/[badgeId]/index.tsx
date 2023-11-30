import { useRouter } from 'next/navigation'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types'
import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useIsThirdPartyBadge from '@/src/hooks/subgraph/useIsThirdPartyBadge'
import { ssrGetContentFromIPFS } from '@/src/hooks/subgraph/utils'
import useBadgeClaim from '@/src/hooks/theBadge/useBadgeClaim'
import useBadgeHelpers, { ReviewBadge } from '@/src/hooks/theBadge/useBadgeHelpers'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import BadgeOwnerPreview from '@/src/pagePartials/badge/preview/BadgeOwnerPreview'
import BadgeStatusAndEvidence from '@/src/pagePartials/badge/preview/BadgeStatusAndEvidence'
import DiplomaOwnedPreview from '@/src/pagePartials/badge/preview/DiplomaOwnedPreview'
import ChallengedStatusLogo from '@/src/pagePartials/badge/preview/addons/ChallengedStatusLogo'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { gqlQuery } from '@/src/subgraph/subgraph'
import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import { generateMintUrl } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'
import { BadgeByIdDocument, BadgeStatus } from '@/types/generated/subgraph'
import { BackendFileResponse, WCAddress } from '@/types/utils'

const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

const ViewBadge = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(props)
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { curate } = useCurateProvider()
  const { getBadgeReviewStatus } = useBadgeHelpers()
  const router = useRouter()
  const { mode } = useColorMode()
  const handleClaimBadge = useBadgeClaim()
  const isMobile = useSizeSM()
  const { badgeId, contract } = useBadgeIdParam()

  const badge = props.badge

  const badgeModelId = badge.badgeModel.id
  const ownerAddress = badge.account.id as WCAddress

  const { reviewTimeFinished: badgeReviewTimeFinished, status: badgeStatus } = getBadgeReviewStatus(
    badge as ReviewBadge,
  )
  const template = useBadgeModelTemplate(badgeModelId, contract)
  const isThirdPartyBadge = useIsThirdPartyBadge(badgeId, contract)

  // Show mint button if this is not the own badge
  const showMintButton = address !== ownerAddress && !isThirdPartyBadge

  // Show curate button if this is not the own badge and its not already challenged */
  const showCurateButton = address !== ownerAddress && !isThirdPartyBadge

  // Show claim button if it is an own badge, it has status requested and the review time finished
  const showClaimButton =
    address === ownerAddress &&
    badgeStatus === BadgeStatus.Requested &&
    badgeReviewTimeFinished &&
    !isThirdPartyBadge

  return (
    <>
      {/*<Head>
        {props.metaTags &&
          Object.entries(props.metaTags).map((entry) => (
            <meta content={entry[1]} key={entry[0]} property={entry[0]} />
          ))}
      </Head>*/}
      <Box sx={{ position: 'relative' }}>
        <Stack maxWidth={900} mx={'auto'}>
          {badge?.status === BadgeStatus.Challenged && <ChallengedStatusLogo />}
          {template === BadgeModelTemplate.Diploma ? (
            <DiplomaOwnedPreview />
          ) : (
            <BadgeOwnedPreview />
          )}
          <Box display="flex" gap={8}>
            {!isMobile && (
              <Box
                alignItems="center"
                display="flex"
                flex="1"
                justifyContent="space-between"
                maxWidth={300}
              >
                {showMintButton && (
                  <ButtonV2
                    backgroundColor={colors.transparent}
                    disabled={address === ownerAddress}
                    fontColor={mode === 'light' ? colors.blackText : colors.white}
                    onClick={() =>
                      router.push(generateMintUrl(badge?.badgeModel.controllerType, badgeModelId))
                    }
                    sx={{
                      borderRadius: '10px',
                      fontSize: '11px !important',
                      padding: '0.5rem 1rem !important',
                      height: 'fit-content !important',
                      lineHeight: '14px',
                      fontWeight: 700,
                      boxShadow: 'none',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('badge.mintButton')}
                  </ButtonV2>
                )}

                {showCurateButton && (
                  <ButtonV2
                    backgroundColor={colors.greenLogo}
                    disabled={address === ownerAddress}
                    fontColor={colors.blackText}
                    onClick={() => curate(badgeId)}
                    sx={{
                      borderRadius: '10px',
                      fontSize: '11px !important',
                      padding: '0.5rem 1rem !important',
                      height: 'fit-content !important',
                      lineHeight: '14px',
                      fontWeight: 700,
                      boxShadow: 'none',
                      textTransform: 'uppercase',
                    }}
                    variant="contained"
                  >
                    {t('badge.curateButton')}
                  </ButtonV2>
                )}

                {showClaimButton && (
                  <ButtonV2
                    backgroundColor={colors.blue}
                    disabled={!badgeReviewTimeFinished}
                    fontColor={colors.white}
                    onClick={() => handleClaimBadge(badge.id)}
                    sx={{
                      width: '100%',
                      height: 'fit-content !important',
                      marginTop: '1rem',
                      padding: '0.5rem 1rem !important',
                      borderRadius: '10px',
                      fontSize: '15px !important',
                      lineHeight: '15px',
                      fontWeight: 700,
                      boxShadow: 'none',
                      textTransform: 'uppercase',
                    }}
                    variant="contained"
                  >
                    {t('badge.claimButton')}
                  </ButtonV2>
                )}
              </Box>
            )}
            <SafeSuspense>
              <BadgeOwnerPreview ownerAddress={ownerAddress} />
            </SafeSuspense>
          </Box>
          <SafeSuspense>
            <BadgeStatusAndEvidence />
          </SafeSuspense>
        </Stack>
      </Box>
    </>
  )
}

export default ViewBadge

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ params, query, res }: GetServerSidePropsContext) {
  res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=59')

  const badgeId = params?.badgeId
  const contract = query.contract as string
  const { chainId, subgraphName } = parsePrefixedAddress(contract)

  const subGraph = isTestnet
    ? devEndpoints[chainId][subgraphName]
    : endpoints[chainId][subgraphName]

  console.log({
    subGraph,
    badgeId,
  })
  // Fetch data from external API
  const request = await gqlQuery(subGraph, { query: BadgeByIdDocument, variables: { id: badgeId } })

  const badge = request.badge
  const badgeModel = badge?.badgeModel

  const metadataRequest = await Promise.all([
    ssrGetContentFromIPFS<BadgeMetadata<BackendFileResponse>>(badge?.uri),
    ssrGetContentFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModel?.uri),
  ])

  const badgeMetadata = metadataRequest[0] ? metadataRequest[0].result?.content : null
  const badgeModelMetadata = metadataRequest[1] ? metadataRequest[1].result?.content : null

  const metaTags = {
    'og:title': `The Badge dApp - ${badgeModelMetadata?.name} Certificate`,
    'og:description': `${badgeModelMetadata?.description} - Powered by TheBadge `,
    'og:image': badgeMetadata?.image.s3Url,
    'og:url': `https://app.thebadge.xyz`,
  }

  // Pass data to the page via props
  return {
    props: {
      metaTags,
      badge: {
        ...badge,
        badgeModel: {
          ...badgeModel,
          badgeModelMetadata,
        },
        badgeMetadata,
      },
    },
  }
}

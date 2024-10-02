import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import peanut, { getTokenBalance } from '@squirrel-labs/peanut-sdk';
import {  JsonRpcSigner } from '@ethersproject/providers'

import InViewPort from '@/src/components/helpers/InViewPort'
import { getRequiredPremiumBadgesByNetworkId } from '@/src/constants/premiumSubscription'
import { APP_URL } from '@/src/constants/common'
import useGetMultiChainsConfig from '@/src/hooks/subgraph/useGetMultiChainsConfig'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import { useBadgesRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import BadgeItemGenerator from '@/src/pagePartials/badge/preview/generators/BadgeItemGenerator'
import { useColorMode } from '@/src/providers/themeProvider'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { Badge, BadgeStatus, Badge_Filter } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils';
import TBModal from '@/src/components/common/TBModal';
import { notify } from '@/src/components/toast/Toast';
import { ToastStates } from '@/types/toast';

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const FilteredListHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export default function ManageSubscription() {
  const { t } = useTranslation()
  const { address, readOnlyChainId, ethersSigner, appChainId } = useWeb3Connection()
  const { mode } = useColorMode()
  const { hasUserBadgeModelBalance } = useBadgesRequired()
  const [isUserPremium, setIsUserPremium] = useState(false)
  const [ownBadges, setBadges] = useState<Badge[]>([])
  const { chainIds: defaultChains } = useGetMultiChainsConfig()
  const multiSubgraph = useMultiSubgraph(SubgraphName.TheBadge, defaultChains)
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [subscriptionModalTitle, setSubscriptionModalTitle] = useState('')

  useEffect(() => {
    const getUserSubscriptionStatus = async () => {
      const badgeModelsRequired = getRequiredPremiumBadgesByNetworkId(readOnlyChainId)

      const balanceCheck = await Promise.all(
        badgeModelsRequired.map(
          async (badgeModel) => await hasUserBadgeModelBalance(badgeModel, address as string),
        ),
      )

      const hasAnyBalance = balanceCheck.some((hasBalance) => hasBalance)

      setIsUserPremium(hasAnyBalance ? hasAnyBalance : false)

      const where: Badge_Filter = {
        status_in: [BadgeStatus.Approved],
      }

      const userWithBadgesManyNetworks = await Promise.all(
        multiSubgraph.map((gql) =>
          gql.userBadges({
            ownerAddress: address as string,
            where,
          }),
        ),
      )

      let badges: Badge[] = []

      // For each network we put all the badges into a simple array
      userWithBadgesManyNetworks.forEach((userWithBadges) => {
        badges = [...badges, ...((userWithBadges?.user?.badges as Badge[]) || [])]
      })
      setBadges(badges)
    }
    getUserSubscriptionStatus()
  }, [address, hasUserBadgeModelBalance, multiSubgraph, readOnlyChainId])

  const renderPremiumBadge = () => {
    const badgeModelRequired = getRequiredPremiumBadgesByNetworkId(readOnlyChainId)

    const badges = ownBadges.filter((badge) =>
      badgeModelRequired.some(
        (requiredBadge) =>
          badge.badgeModel?.id.toLowerCase() === requiredBadge.id.toString().toLowerCase(),
      ),
    )

    if (!isUserPremium || !ownBadges.length || !badges) {
      return (
        <Typography
          color={mode === 'light' ? colors.blackText : colors.white}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
          padding={[1, 1, 1, 0]}
        >
          {t('profile.thirdParty.manageSubscriptions.nonSubscribed')}
        </Typography>
      )
    }

    return badges.map((badge) => {
      return (
        <InViewPort key={`${badge.id}:${badge.networkName}:${badge.contractAddress}`}>
          <BadgeItemGenerator
            badgeContractAddress={badge.contractAddress}
            badgeId={badge.id}
            badgeNetworkName={badge.networkName}
            key={badge.id}
            showNetwork
          />
        </InViewPort>
      )
    })
  }

  const payAndGenerateLink = async (amount: number) => {
    amount *= .00001 // TODO: remove multiplier for testing
    try {
      const balance = await peanut.getTokenBalance({
        chainId: String(appChainId),
        tokenAddress: '0x0000000000000000000000000000000000000000',
        walletAddress: address as WCAddress
      })
      const balanceNum = parseFloat(balance.toString())
      if (balanceNum < amount) {
        console.log(`Saldo insuficiente: req ${amount} avail ${balanceNum}`)
        setSubscriptionModalTitle(t("profile.thirdParty.manageSubscriptions.noFunds"))
        setSubscriptionModalOpen(true)
        return
      }
      const { link, txHash } = await peanut.createLink({
        structSigner: {
          signer: ethersSigner as JsonRpcSigner
        },
        linkDetails: {
          chainId: String(appChainId),
          tokenAmount: amount,
          tokenType: 0,  // 0 for ether, 1 for erc20, 2 for erc721, 3 for erc1155
          tokenDecimals: 18,
        }
      })
      console.log(link)
    } catch (error: any) {
      if (error?.originalError?.originalError?.code == "ACTION_REJECTED") {
        notify({
          message: t("profile.thirdParty.manageSubscriptions.rejectedPayment"),
          type: ToastStates.failed,
        })
        return
      }
    }
  }

  const onClose = () => {
    setSubscriptionModalOpen(false)
  }

  const tiers = [
    {
      name: 'Free',
      price: 0,
      img: `${APP_URL}/shareable/subscription-free.png`,
      perks: ['5 models', '10 badges per model', '0 team members'],
    },
    {
      name: 'Basic',
      price: 250,
      img: `${APP_URL}/shareable/subscription-base.png`,
      perks: ['10 models', '30 badges per model', '0 team members']
    },
    {
      name: 'Pro',
      price: 400,
      img: `${APP_URL}/shareable/subscription-pro.png`,
      perks: ['20 models', '70 badges per model', '2 team members']
    },
    {
      name: 'Enterprise',
      price: 1500,
      img: `${APP_URL}/shareable/subscription-enterprise.png`,
      perks: ['50 models', '200 badges per model', '5 team members']
    },
  ]

  return (
    <Box>
      <TBModal closeButtonAriaLabel="Close subscription modal" onClose={onClose} open={subscriptionModalOpen}>
        <Stack
          sx={{
            gap: 3,
            width: '100%',
            justifyContent: "space-between"
          }}
        >
          <Typography color="error" textAlign="center" variant="labelLarge">
            {subscriptionModalTitle}
          </Typography>
          <Button size="small" onClick={onClose}>Close</Button>
        </Stack>
      </TBModal>
      {isUserPremium && (
        <>
          <FilteredListHeaderBox>
            <Typography
              color={mode === 'light' ? colors.blackText : colors.white}
              component="div"
              fontSize={'20px'}
              fontWeight="900"
              lineHeight={'30px'}
              padding={[1, 1, 1, 0]}
            >
              {t('profile.thirdParty.manageSubscriptions.title')}
            </Typography>
          </FilteredListHeaderBox>
          <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
        </>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isUserPremium ? (
          renderPremiumBadge()
        ) : (
          <Box>
            <Typography
              color={mode === 'light' ? colors.blackText : colors.white}
              component="div"
              fontSize={'20px'}
              fontWeight="900"
              lineHeight={'30px'}
              textAlign="center"
              padding={[1, 1, 1, 0]}
            >
              {t('profile.thirdParty.manageSubscriptions.nonSubscribed')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >            
              {tiers.map((tier) => (
                <Card sx={{ maxWidth: 345 }} key={ tier.name }>
                  <CardMedia image={tier.img} sx={{ height: 235, borderBottomLeftRadius: 13, borderBottomRightRadius: 13 }} title={tier.name} />
                  <CardContent>
                    <Typography component="div" gutterBottom variant="h5">
                      { tier.price != 0 ? `${tier.price}/year` : tier.name }
                    </Typography>
                    { tier.perks.map(perk => (
                      <Typography sx={{ color: 'text.secondary' }} variant="body2" key={ perk }>
                        { perk }
                      </Typography>
                    )) }
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button size="small" onClick={() => payAndGenerateLink(tier.price)}>{tier.name}</Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

import { useRouter } from 'next/navigation'

import { Box, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { LogoTheBadgeWithText } from 'thebadge-ui-library'

import { Notification as NotificationIcon } from '@/src/components/assets/Notification'
import ConnectWalletButton from '@/src/components/header/ConnectWalletButton'
import { UserDropdown } from '@/src/components/header/UserDropdown'
import WrongNetwork from '@/src/components/utils/WrongNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  left: '50%',
  transform: 'translateX(-50%)',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: '5%',
  paddingRight: 'calc(5% - 16px)',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  },
  transition: 'padding-top 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
}))

const Header = () => {
  const { connectWallet, isWalletConnected } = useWeb3Connection()
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <HeaderContainer id="header-container">
      <Box
        id="logo-container"
        sx={{
          flex: 1,
        }}
      >
        <Box onClick={() => router.push('/')} sx={{ cursor: 'pointer', width: 'fit-content' }}>
          <LogoTheBadgeWithText size={92} />
        </Box>
      </Box>
      <Box alignItems="center" display="flex" gap={2}>
        <NotificationIcon />
        <WrongNetwork />
        {isWalletConnected && <UserDropdown />}
        {!isWalletConnected && (
          <ConnectWalletButton onClick={connectWallet}>
            {t('header.wallet.connect')}
          </ConnectWalletButton>
        )}
      </Box>
    </HeaderContainer>
  )
}

export default Header

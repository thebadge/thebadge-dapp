import { Box, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { LogoWithText } from '@/src/components/common/Logo'
import ActionButtons from '@/src/components/header/ActionButtons'
import ConnectWalletButton from '@/src/components/header/ConnectWalletButton'
import { UserDropdown } from '@/src/components/header/UserDropdown'
import WrongNetwork from '@/src/components/utils/WrongNetwork'
import { useSizeSM } from '@/src/hooks/useSize'
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
  paddingLeft: 'calc(5% - 32px)',
  paddingRight: 'calc(5% - 32px)',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  },
  transition: 'padding-top 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
}))

const Header = () => {
  const isMobile = useSizeSM()
  const { connectWallet, isWalletConnected } = useWeb3Connection()
  const { t } = useTranslation()

  return (
    <HeaderContainer id="header-container">
      <Box
        id="logo-container"
        sx={{
          flex: 1,
        }}
      >
        <LogoWithText />
      </Box>
      <Box display="flex">
        <WrongNetwork />
        {isWalletConnected && !isMobile && <UserDropdown />}
        {!isWalletConnected && !isMobile && (
          <Box display="flex" gap={2}>
            <ActionButtons />
            <ConnectWalletButton onClick={connectWallet}>
              {t('header.wallet.connect')}
            </ConnectWalletButton>
          </Box>
        )}
      </Box>
    </HeaderContainer>
  )
}

export default Header

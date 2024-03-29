import { useRouter } from 'next/router'
import React from 'react'

import {
  Backdrop,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { useMainMenuItems } from '@/src/components/navigation/MainMenu.config'
import useIsThirdPartyUser from '@/src/hooks/theBadge/useIsThirdPartyUser'
import {
  generateBadgeCurate,
  generateBadgeModelCreate,
  generateExplorer,
} from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const MobileActions = styled(SpeedDialAction)(({ theme }) => ({
  width: 65,
  height: 30,
  borderRadius: theme.spacing(1),
  borderWidth: '1px',
  borderStyle: 'solid',
}))

export default function MobileMenu() {
  const { t } = useTranslation()
  const router = useRouter()

  const { topMenuItems } = useMainMenuItems()
  const { address } = useWeb3Connection()
  const isThirdPartyUser = useIsThirdPartyUser(address)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        height: 330,
        width: 40,
        right: 0,
        zIndex: 2,
        transform: 'translateZ(0px)',
        flexGrow: 1,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Action items"
        direction="left"
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <MobileActions
          icon={
            <Stack>
              <Typography textAlign="center" variant="labelSmall">
                {t('header.buttons.mint')}
              </Typography>
            </Stack>
          }
          onClick={() => router.push(generateExplorer())}
          sx={{
            borderColor: colors.blue,
          }}
        />
        <MobileActions
          icon={
            <Stack>
              <Typography textAlign="center" variant="labelSmall">
                {t('header.buttons.curate')}
              </Typography>
            </Stack>
          }
          onClick={() => router.push(generateBadgeCurate())}
          sx={{
            borderColor: colors.greenLogo,
          }}
        />
        {!isThirdPartyUser && (
          <MobileActions
            icon={
              <Stack>
                <Typography textAlign="center" variant="labelSmall">
                  {t('header.buttons.create')}
                </Typography>
              </Stack>
            }
            onClick={() => router.push(generateBadgeModelCreate())}
            sx={{
              borderColor: colors.pink,
            }}
          />
        )}
        {isThirdPartyUser && (
          <MobileActions
            icon={
              <Stack>
                <Typography textAlign="center" variant="labelSmall">
                  {t('header.buttons.menu.community')}
                </Typography>
              </Stack>
            }
            onClick={() =>
              router.push(generateBadgeModelCreate(BadgeModelControllerType.Community))
            }
            sx={{
              borderColor: colors.pink,
            }}
          />
        )}
        {isThirdPartyUser && (
          <MobileActions
            icon={
              <Stack>
                <Typography textAlign="center" variant="labelSmall">
                  {t('header.buttons.menu.thirdParty')}
                </Typography>
              </Stack>
            }
            onClick={() =>
              router.push(generateBadgeModelCreate(BadgeModelControllerType.ThirdParty))
            }
            sx={{
              borderColor: colors.pink,
            }}
          />
        )}
      </SpeedDial>
      <SpeedDial
        ariaLabel="Navigation items"
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        {topMenuItems.map((action) => (
          <SpeedDialAction
            icon={action.icon}
            key={action.title}
            onClick={handleClose}
            tooltipOpen
            tooltipTitle={action.title}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

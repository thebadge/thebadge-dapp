import { Box, Container, Divider, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { LogoTheBadgeWithText, colors } from 'thebadge-ui-library'
import { IconDiscord } from 'thebadge-ui-library/src/components/icons/IconDiscord/IconDiscord'
import { IconEmail } from 'thebadge-ui-library/src/components/icons/IconEmail/IconEmail'
import { IconGithub } from 'thebadge-ui-library/src/components/icons/IconGithub/IconGithub'
import { IconMedium } from 'thebadge-ui-library/src/components/icons/IconMedium/IconMedium'
import { IconTwitter } from 'thebadge-ui-library/src/components/icons/IconTwitter/IconTwitter'

import {
  DISCORD_URL,
  DOCS_URL,
  EMAIL_URL,
  GITHUB_URL,
  MEDIUM_URL,
  PAPER_URL,
  TWITTER_URL,
} from '@/src/constants/common'
import { useSizeSM } from '@/src/hooks/useSize'
import { useCookiesWarningContext } from '@/src/providers/cookiesWarningProvider'
import { useColorMode } from '@/src/providers/themeProvider'

const SocialContainer = styled(Box)(({ theme }) => ({
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  columnGap: theme.spacing(2),
}))

export const Footer: React.FC = () => {
  const isMobile = useSizeSM()

  const { mode } = useColorMode()
  const { t } = useTranslation()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  const year = new Date().getFullYear()

  const iconColor = 'white'

  return (
    <Box sx={{ background: 'black' }}>
      <Container>
        <Stack sx={{ justifyContent: 'center', gap: 5, mb: 5 }}>
          <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 8 }}>
              <Stack gap={1.5}>
                <Typography color={colors.white} fontWeight="800" variant="h6">
                  {t('footer.about.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={EMAIL_URL}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Contact */}
                  {t('footer.about.items.0.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={DISCORD_URL}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Community */}
                  {t('footer.about.items.1.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={PAPER_URL}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Whitepaper */}
                  {t('footer.about.items.2.title')}
                </Typography>
              </Stack>
              <Stack gap={1.5}>
                <Typography color={colors.white} fontWeight="800" variant="h6">
                  {t('footer.help.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={DISCORD_URL}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Support */}
                  {t('footer.help.items.0.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={DOCS_URL}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Docs */}
                  {t('footer.help.items.1.title')}
                </Typography>
              </Stack>
              <Stack gap={1.5}>
                <Typography color={colors.white} fontWeight="800" variant="h6">
                  {t('footer.legal.title')}
                </Typography>
                <Typography
                  color={colors.white + ' !important'}
                  component={'a'}
                  href={'/legal/privacy-policy'}
                  sx={{ fontSize: '1rem !important' }}
                >
                  {/* Privacy Police */}
                  {t('footer.legal.items.0.title')}
                </Typography>
              </Stack>
            </Box>
            {!isMobile && <LogoTheBadgeWithText fill={iconColor} size={120} />}
          </Box>
          <Box
            display={'flex'}
            flexDirection={isMobile ? 'column' : 'row'}
            gap={2}
            justifyContent={'space-between'}
          >
            <SocialContainer>
              <IconTwitter color={iconColor} link={TWITTER_URL} />
              <IconGithub color={iconColor} link={GITHUB_URL} />
              <IconMedium color={iconColor} link={MEDIUM_URL} />
              <IconEmail color={iconColor} link={EMAIL_URL} />
              <IconDiscord color={iconColor} link={DISCORD_URL} />
            </SocialContainer>
            <Typography color={colors.white} component={'div'} textAlign="center">
              {t('footer.copyright', { year })}
              {cookiesWarningEnabled && (
                <>
                  &nbsp;-&nbsp;
                  <Typography color={colors.white} component="span" onClick={showCookiesWarning}>
                    Cookies
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

import { Box, Container, Divider, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { LogoTheBadgeWithText } from 'thebadge-ui-library'
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
  const { mode } = useColorMode()
  const { t } = useTranslation()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  const year = new Date().getFullYear()

  const iconColor = mode === 'dark' ? 'white' : 'black'

  return (
    <Box>
      <Container>
        <Stack sx={{ justifyContent: 'center', gap: 5 }}>
          <Divider color={iconColor} sx={{ borderWidth: '1px' }} />
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Stack gap={1.5}>
                <Typography fontWeight="600" variant="h6">
                  {t('footer.about.title')}
                </Typography>
                <Typography component={'a'} href={EMAIL_URL} variant="body4">
                  {/* Contact */}
                  {t('footer.about.items.0.title')}
                </Typography>
                <Typography component={'a'} href={DISCORD_URL} variant="body4">
                  {/* Community */}
                  {t('footer.about.items.1.title')}
                </Typography>
                <Typography component={'a'} href={PAPER_URL} variant="body4">
                  {/* Whitepaper */}
                  {t('footer.about.items.2.title')}
                </Typography>
              </Stack>
              <Stack gap={1.5}>
                <Typography fontWeight="600" variant="h6">
                  {t('footer.help.title')}
                </Typography>
                <Typography component={'a'} href={DISCORD_URL} variant="body4">
                  {/* Support */}
                  {t('footer.help.items.0.title')}
                </Typography>
                <Typography component={'a'} href={DOCS_URL} variant="body4">
                  {/* Docs */}
                  {t('footer.help.items.1.title')}
                </Typography>
              </Stack>
            </Box>
            <LogoTheBadgeWithText fill={iconColor} size={120} />
          </Box>
          <Stack gap={2}>
            <SocialContainer>
              <IconTwitter color={iconColor} link={TWITTER_URL} />
              <IconGithub color={iconColor} link={GITHUB_URL} />
              <IconMedium color={iconColor} link={MEDIUM_URL} />
              <IconEmail color={iconColor} link={EMAIL_URL} />
              <IconDiscord color={iconColor} link={DISCORD_URL} />
            </SocialContainer>
            <Typography component={'div'} textAlign="center">
              {t('footer.copyright', { year })}
              {cookiesWarningEnabled && (
                <>
                  &nbsp;-&nbsp;
                  <Typography component="span" onClick={showCookiesWarning}>
                    Cookies
                  </Typography>
                </>
              )}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

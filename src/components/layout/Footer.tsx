import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { useCookiesWarningContext } from '@/src/providers/cookiesWarningProvider'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  const { t } = useTranslation()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography color={colors.white}>
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
  )
}

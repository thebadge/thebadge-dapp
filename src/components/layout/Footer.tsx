import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { useCookiesWarningContext } from '@/src/providers/cookiesWarningProvider'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  const { t } = useTranslation()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography component={'div'}>
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
    </Box>
  )
}

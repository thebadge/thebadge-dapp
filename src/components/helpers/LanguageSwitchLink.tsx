import { ButtonBase, styled } from '@mui/material'
import { LanguageSwitcher } from 'next-export-i18n'

type LanguageSwitchLinkProps = {
  locale: string
}

type LanguageSwitcherInjetedProps = {
  'data-is-current'?: boolean
}

const StyledButtonBase = styled(ButtonBase)<LanguageSwitcherInjetedProps>(({ theme, ...props }) => {
  return {
    borderRadius: '50%',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    ...(props['data-is-current'] && {
      filter: `drop-shadow(0px 0px 5px ${theme.palette.white.main})`,
    }),
  }
})

const getFlag = (locale: string) => {
  switch (locale) {
    case 'en': {
      return `EN`
    }
    case 'es': {
      return `ES`
    }
    case 'de': {
      return 'DE'
    }
    default: {
      return `️`
    }
  }
}

const LanguageSwitchLink = ({ locale }: LanguageSwitchLinkProps) => {
  return (
    <LanguageSwitcher lang={locale}>
      <StyledButtonBase style={{ fontSize: 'small' }}>{getFlag(locale)}</StyledButtonBase>
    </LanguageSwitcher>
  )
}

export default LanguageSwitchLink

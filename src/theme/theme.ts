import { PaletteMode, Theme, ThemeOptions, Typography } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { colors, darkTheme, lightTheme } from '@thebadge/ui-library'
import { Mulish } from 'next/font/google'

const mulishFont = Mulish({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap', // 👈 The documentation seems to be wrong. 'swap' is not the default value, so we need to specify it
})

export const getTheme = (mode?: PaletteMode): ThemeOptions => ({
  ...(mode === 'light' ? lightTheme : darkTheme),
  palette: {
    mode,
    ...(mode === 'light' ? lightTheme.palette : darkTheme.palette),
    text: {
      main: mode === 'light' ? colors.blackText : colors.white,
    },
    mainMenu: {
      boxShadow: {
        main: mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)',
      },
      itemBorder: {
        main: mode === 'light' ? '#1C1B1F' : '#ffffff',
      },
    },
    button: {
      backgroundBlue: {
        main: '#3F61EA',
      },
    },
  },
  typography: {
    ...overrideFontFamily(mode === 'light' ? lightTheme : darkTheme, mulishFont.style.fontFamily),
  },
  customSizes: {
    avatar: 92,
    icon: 21,
  },
})

export function getTypographyVariants(theme: ThemeOptions) {
  // Take all the variants, to ensure MUI made all of them responsive, including our custom ones
  return Object.keys(theme.typography as TypographyOptions).filter(
    (keyName) => keyName !== 'fontFamily',
  ) as (keyof typeof Typography)[]
}

export function overrideFontFamily(theme: ThemeOptions, fontFamily: string): TypographyOptions {
  const overrideTypography: TypographyOptions = {
    ...theme.typography,
    fontFamily,
  } as TypographyOptions
  const variants = getTypographyVariants(theme)
  variants.forEach((variantKey) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    overrideTypography[variantKey].fontFamily = fontFamily
  })

  return overrideTypography
}

export function configureThemeComponents(theme: Theme) {
  const lightMode = theme.palette.mode === 'light'

  return {
    ...theme,
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            lineHeight: '150%',
            backgroundColor: theme.palette.grey[lightMode ? 800 : 700],
          },
          arrow: {
            color: theme.palette.grey[lightMode ? 800 : 700],
          },
        },
      },
    },
  }
}

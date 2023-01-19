import { PaletteMode, ThemeOptions, Typography } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { Mulish } from '@next/font/google'
import { defaultTheme } from 'thebadge-ui-library'

const mulishFont = Mulish({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const getTheme = (mode?: PaletteMode): ThemeOptions => ({
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: mulishFont.style.fontFamily,
  },
  customSizes: {
    avatar: 92,
    icon: 21,
  },
  components: {
    // We force to use always the same font family, if not we have our custom variants without the property
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: mulishFont.style.fontFamily,
        },
      },
    },
  },
})

export const getTypographyVariants = (theme: ThemeOptions) => {
  // Take all the variants, to ensure MUI made all of them responsive, including our custom ones
  const variants = Object.keys(theme.typography as TypographyOptions).filter(
    (keyName) => keyName !== 'fontFamily',
  ) as (keyof typeof Typography)[]
  return variants
}

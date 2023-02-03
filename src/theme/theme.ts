import { PaletteMode, ThemeOptions, Typography } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { Mulish } from '@next/font/google'
import { defaultTheme, gradients } from 'thebadge-ui-library'

const mulishFont = Mulish({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const gradientLight =
  'linear-gradient(180deg, rgba(137, 28, 251, 0.2475) -13.61%, rgba(255, 255, 255, 0.254) 40.93%, rgba(255, 255, 255, 0.55) 82.02%, rgba(255, 255, 255, 0.75) 129.84%)'

export const getTheme = (mode?: PaletteMode): ThemeOptions => ({
  ...defaultTheme,
  palette: {
    mode,
    ...defaultTheme.palette,
    text: {
      primary: mode === 'light' ? '#000000' : '#ffffff',
      light: '#ffffff',
      dark: '#000000',
    },
    background: {
      default: mode === 'light' ? '#F4F4F4' : '#000000',
    },
    backgroundGradient: {
      main: gradientLight,
      light: gradientLight,
      dark: gradients.gradientBackground,
    },
    mainMenu: {
      boxShadow: {
        main: mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)',
      },
      itemBorder: {
        main: mode === 'light' ? '#1C1B1F' : '#ffffff',
      },
    },
  },
  typography: {
    ...overrideFontFamily(defaultTheme, mulishFont.style.fontFamily),
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
  const overrideTypography: TypographyOptions = { ...theme.typography } as TypographyOptions
  const variants = getTypographyVariants(theme)
  variants.forEach((variantKey) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    overrideTypography[variantKey].fontFamily = fontFamily
  })

  return overrideTypography
}

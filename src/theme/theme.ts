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

export interface TBPaletteColorOptions {
  default?: string
  light?: string
  dark?: string
  contrastText?: string
}

interface TBPaletteExtensions {
  backgroundGradient: TBPaletteColorOptions
  mainMenu: {
    boxShadow: TBPaletteColorOptions
    itemBorder: TBPaletteColorOptions
  }
}

declare module '@mui/material/styles' {
  type Palette = Palette & TBPaletteExtensions
  type PaletteOptions = TBPaletteColorOptions
}

export const getTheme = (mode?: PaletteMode): ThemeOptions => ({
  ...defaultTheme,
  palette: {
    mode: 'dark', // TODO Temporal fix until we update the lib
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
      default: gradientLight,
      light: gradientLight,
      dark: gradients.gradientBackground,
    },
    mainMenu: {
      boxShadow: {
        default: mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)',
      },
      itemBorder: {
        default: mode === 'light' ? '#1C1B1F' : '#ffffff',
      },
    },
  },
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

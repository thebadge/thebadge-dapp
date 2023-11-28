import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material'

import { configureThemeComponents, getTheme, getTypographyVariants } from '@/src/theme/theme'
import { ThemeType } from '@/src/theme/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ColorModeContext = createContext<{
  toggleColorMode: () => void
  mode: PaletteMode
  setColorMode: (value: PaletteMode) => void
}>({} as any)

export function useColorMode() {
  return useContext(ColorModeContext)
}

const ThemeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const DEFAULT_THEME =
    process.env.NEXT_PUBLIC_DEFAULT_THEME === ThemeType.dark ||
    process.env.NEXT_PUBLIC_DEFAULT_THEME === ThemeType.light
      ? process.env.NEXT_PUBLIC_DEFAULT_THEME
      : ThemeType.dark

  const [mode, setMode] = useState<PaletteMode>(DEFAULT_THEME)
  const colorMode = useMemo(
    () => ({
      mode: mode,
      // The dark mode switch would invoke this method
      toggleColorMode: () =>
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light')),
      setColorMode: setMode,
    }),
    [mode],
  )

  const theme = useMemo(() => {
    const theme = getTheme(mode)
    const variants = getTypographyVariants(theme)
    const createdTheme = responsiveFontSizes(createTheme(theme), {
      disableAlign: true,
      factor: 1.7,
      variants,
    })

    return configureThemeComponents(createdTheme)
  }, [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ThemeContextProvider

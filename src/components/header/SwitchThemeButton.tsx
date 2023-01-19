import { Button, ButtonProps } from '@mui/material'

import { DarkMode } from '@/src/components/assets/DarkMode'
import { LightMode } from '@/src/components/assets/LightMode'
import { useColorMode } from '@/src/providers/themeProvider'
import { ThemeType } from '@/src/theme/types'

export const SwitchThemeButton: React.FC<ButtonProps> = ({ ...restProps }) => {
  const { mode, toggleColorMode } = useColorMode()

  return (
    <Button onClick={toggleColorMode} {...restProps}>
      {mode === ThemeType.dark && <LightMode />}
      {mode === ThemeType.light && <DarkMode />}
    </Button>
  )
}

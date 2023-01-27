import { colors } from 'thebadge-ui-library'

import { MenuItemType } from '@/src/components/navigation/MainMenu.types'

export const getMenuItemBackgroundColor = (type: MenuItemType): string => {
  switch (type) {
    case 'color':
      return colors.greenLogo
    case 'gray':
      return '#BDBDBD'
    case 'small':
    default:
      return 'transparent'
  }
}

export const getMenuItemHoverBackgroundColor = (type: MenuItemType): string => {
  switch (type) {
    case 'color':
      return '#22DBBD'
    case 'gray':
      return '#828282'
    case 'small':
    default:
      return 'transparent'
  }
}

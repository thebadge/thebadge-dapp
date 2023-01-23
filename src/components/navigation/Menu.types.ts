import { RefObject } from 'react'

import { UrlObject } from 'url'

export type MenuItemType = 'color' | 'gray' | 'small'
export type MenuItemHrefType = RefObject<HTMLDivElement> | UrlObject | string | null
export type MenuItemElement = {
  type: MenuItemType
  disabled?: boolean
  selected?: boolean
}
export type MenuItem = {
  type: MenuItemType
  icon: React.ReactNode
  title?: string
  subItems?: Array<SubMenuItem>
  validation?: boolean
  disabled?: boolean
  href?: MenuItemHrefType
  customOnClickBehavior?: () => void
}
export type SubMenuItem = {
  title: string
  href?: MenuItemHrefType
  customOnClickBehavior?: () => void
}

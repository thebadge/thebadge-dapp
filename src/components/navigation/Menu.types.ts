export type MenuItemType = 'color' | 'gray' | 'small'
export type MenuItemElement = {
  type: MenuItemType
  disabled?: boolean
  selected?: boolean
}
export type MenuItem = {
  type: MenuItemType
  icon: React.ReactNode
  title?: string
  ref: string
  validation?: boolean
  disabled?: boolean
  subItems?: Array<MenuSubItem>
}
export type MenuSubItem = {
  title: string
  ref: string
}

// ** React Import
import { ReactNode } from 'react'

// ** MUI Imports
import { MenuProps } from '@mui/material/Menu'
import { DividerProps } from '@mui/material/Divider'
import { MenuItemProps } from '@mui/material/MenuItem'
import { IconButtonProps } from '@mui/material/IconButton'

// ** Types
import { LinkProps } from 'next/link'
import { IconProps } from '@iconify/react'

export type OptionDividerType = {
  divider: boolean
  dividerProps?: DividerProps
  href?: never
  icon?: never
  text?: never
  linkProps?: never
  menuItemProps?: never
}
export type TitleMenuItemType = {
  text: ReactNode
  icon?: ReactNode
  linkProps?: LinkProps
  href?: LinkProps['href']
  menuItemProps?: MenuItemProps
  divider?: never
  dividerProps?: never
}

export type OptionType = string | OptionDividerType | TitleMenuItemType

export type TitleMenuType = {
  text?: string
  onClick?: (option: string) => void,
  options: OptionType[]
  leftAlignMenu?: boolean
  iconButtonProps?: IconButtonProps
  iconProps?: Omit<IconProps, 'icon'>
  menuProps?: Omit<MenuProps, 'open'>
}

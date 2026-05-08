// ** React Imports
import {ElementType, useState} from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink, NavGroup } from 'src/core/layouts/types'
import { Settings } from 'src/core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Imports
import { hexToRGBA } from 'src/core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/core/layouts/utils'
import {IconButton} from "@mui/material";

interface Props {
  parent?: boolean
  item: NavLink
  navHover?: boolean
  settings: Settings
  navVisible?: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  isSubToSub?: NavGroup | undefined
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(3.5),
  marginRight: theme.spacing(3.5),
  borderRadius: theme.shape.borderRadius,
  transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&.active': {
    '&, &:hover': {
      boxShadow: `0px 2px 6px ${hexToRGBA(theme.palette.primary.main, 0.48)}`,
      background: `linear-gradient(72.47deg, ${
        theme.direction === 'ltr' ? theme.palette.primary.main : hexToRGBA(theme.palette.primary.main, 0.7)
      } 22.16%, ${
        theme.direction === 'ltr' ? hexToRGBA(theme.palette.primary.main, 0.7) : theme.palette.primary.main
      } 76.47%)`,
      '&.Mui-focusVisible': {
        background: `linear-gradient(72.47deg, ${theme.palette.primary.dark} 22.16%, ${hexToRGBA(
          theme.palette.primary.dark,
          0.7
        )} 76.47%)`
      }
    },
    '& .MuiTypography-root, & svg': {
      color: `${theme.palette.common.white} !important`
    }
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}: Props) => {
  // ** Hooks
  const router = useRouter()

  // ** Vars
  const { navCollapsed } = settings

  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const [hovered, setHovered] = useState<boolean>(false);

  const isNavLinkActive = () => {
    // if (router.pathname === item.path || handleURLQueries(router, item.path)) {
    if (router.pathname === item.path) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 1, px: '0 !important' }}
        onMouseEnter={(e) => setHovered(true)}
        onMouseLeave={(e) => setHovered(false)}
      >
        <Box sx={{position: 'relative', width: '88%'}}>
          <MenuNavLink
            component={Link}
            {...(item.disabled && { tabIndex: -1 })}
            className={isNavLinkActive() ? 'active' : ''}
            href={item.path === undefined ? '/' : `${item.path}`}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              py: 1,
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
              px: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : (parent ? 4 : 1),
              '& .MuiTypography-root, & svg': {
                color: 'text.secondary'
              }
            }}
          >
            <ListItemIcon
              sx={{
                transition: 'margin .25s ease-in-out',
                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 1 }),
                ...(parent ? { ml: 0.5, mr: 1.5 } : {}), // This line should be after (navCollapsed && !navHover) condition for proper styling
                '& svg': {
                  fontSize: '0rem',
                  ...(!parent ? { fontSize: '1.225rem' } : {}),
                  ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                }
              }}
            >
              <UserIcon icon={icon as string} />
            </ListItemIcon>

            <MenuItemTextMetaWrapper
              sx={{
                ...(isSubToSub ? { ml: 2 } : {}),
                ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
              }}
            >
              <Typography
                variant={'body1'}
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
              >
                <Translations text={item.title} />
              </Typography>
              {item.badgeContent ? (
                <Chip
                  size='small'
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{ height: 22, minWidth: 22, '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' } }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
          {(item.addLink && hovered) ? (
            <Box sx={{position: 'absolute', right: 0, top: 3}}>
                <IconButton
                  color={'success'}
                  sx={{borderRadius: '4px', backgroundColor: isNavLinkActive() ? 'success.main' :'secondary.main', '&:hover': theme => ({
                      backgroundColor: `${isNavLinkActive() ? hexToRGBA(theme.palette.success.main??"", 0.5) : hexToRGBA(theme.palette.secondary.main, 0.5)}`
                    })}}
                  style={{padding: 1}}
                  component={Link}
                  href={item.addLink}>
                  <UserIcon icon={'tabler:plus'} fontSize={'1rem'} style={{color: isNavLinkActive() ? '#000' : 'white'}} />
                </IconButton>
            </Box>
          ) : null}
        </Box>
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink

// ** React Imports
import {useState, SyntheticEvent, Fragment, ReactNode, useContext} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import { Settings } from 'src/core/context/settingsContext'
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import {useTranslation} from "react-i18next";
import {AbilityContext} from "src/layouts/components/acl/Can";
import {useAuth} from "src/hooks/useAuth";
import { getProjectDetail } from '../../../utils/format'

export type ShortcutsType = {
  url: string
  icon: string
  title: string
  subtitle: string
}

interface Props {
  settings: Settings
  shortcuts: ShortcutsType[]
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: '50%',
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    opacity: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: '30rem'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const SettingsDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  const ability = useContext(AbilityContext)

  const {t} = useTranslation();

  const { user } = useAuth();

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Icon color={'#ffffff'} fontSize='1.525rem' icon='tabler:settings' />
      </IconButton>
      {!!anchorEl && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        >
          <MenuItem
            disableRipple
            disableTouchRipple
            sx={{
              m: 0,
              cursor: 'default',
              userSelect: 'auto',
              p: theme => theme.spacing(2, 2),
              backgroundColor: 'transparent !important'
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '& svg': { color: 'text.secondary' }
              }}
            >
              <Typography variant='h5'>{t('Settings')}</Typography>
            </Box>
          </MenuItem>
          <Divider sx={{ my: '0 !important' }} />
          <ScrollWrapper hidden={hidden}>
            <Grid
              container
              spacing={2}
              sx={{
                p: 2
              }}
              className={'match-height'}
            >
              {/* <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <Card>
                  <CardContent sx={{ p: theme => theme.spacing(0, 2) }} style={{ paddingBottom: 0 }}>
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 600, py: 1 }}>
                      {t('Definitions')}
                    </Typography>

                    <Divider />
                    {ability.can('view', 'Floors') && (
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/floors'}
                      >
                        <Icon icon={'tabler:building-arch'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t(`${getProjectDetail(user?.projectType??1)}`)}
                        </Typography>
                      </IconButton>
                    )}
                    {ability.can('view', 'Floors') && <Divider />}


                    {
                      ability.can('view', 'Prefrence') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/preferences'}
                      >
                        <Icon icon={'tabler:settings-2'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Preferences')}
                        </Typography>
                      </IconButton>
                    }

                    {ability.can('view', 'Prefrence') && <Divider />}


                    {
                      ability.can('view', 'PropStatues') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/prop-status'}
                      >
                        <Icon icon={'tabler:progress'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Properties Status')}
                        </Typography>
                      </IconButton>
                    }

                    {ability.can('read', 'PropStatues') && <Divider />}


                    {
                      ability.can('read', 'PropType') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/prop-type'}
                      >
                        <Icon icon={'tabler:hierarchy-2'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Properties Types')}
                        </Typography>
                      </IconButton>
                    }


                  </CardContent>
                </Card>
              </Grid> */}

              {/* <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <Card>
                  <CardContent sx={{ p: theme => theme.spacing(0, 2) }} style={{ paddingBottom: 0 }}>
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 600, py: 1 }}>
                      {t('Tools')}
                    </Typography>

                    <Divider />
                    {ability.can('view', 'CustAgentType') && (
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/agent-type'}
                      >
                        <Icon icon={'tabler:user-bolt'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Customer/Agent Type')}
                        </Typography>
                      </IconButton>
                    )}
                    {ability.can('view', 'CustAgentType') && <Divider />}


                    {
                      ability.can('view', 'InstTypes') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/installment-type'}
                      >
                        <Icon icon={'tabler:coins'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Installment Types')}
                        </Typography>
                      </IconButton>
                    }

                    {ability.can('view', 'InstTypes') && <Divider />}

                    {
                      ability.can('view', 'CustDocTypes') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/document-type'}
                      >
                        <Icon icon={'tabler:folder'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Document Types')}
                        </Typography>
                      </IconButton>
                    }

                    {ability.can('view', 'Charges') && <Divider />}

                    {
                      ability.can('view', 'Charges') &&
                      <IconButton
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDropdownClose()}
                        component={Link}
                        href={'/definitions/charges'}
                      >
                        <Icon icon={'tabler:cash'} />
                        <Typography variant={'body1'} sx={{ ml: 2 }}>
                          {t('Charges')}
                        </Typography>
                      </IconButton>
                    }

                  </CardContent>
                </Card>
              </Grid> */}

              <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <Card>
                  <CardContent sx={{ p: theme => theme.spacing(0, 2) }} style={{ paddingBottom: 0 }}>
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 600, py: 1 }}>
                      {t('CMS Settings')}
                    </Typography>

                    <Divider />
                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/settings'}
                    >
                      <Icon icon={'tabler:list'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Settings List')}
                      </Typography>
                    </IconButton>

                    <Divider />
                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/settings/menu-setting'}
                    >
                      <Icon icon={'tabler:settings-cog'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Menu Setting')}
                      </Typography>
                    </IconButton>

                    <Divider />
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 600, py: 1 }}>
                      {t('Blog Settings')}
                    </Typography>

                    <Divider />
                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/blogs/category'}
                    >
                      <Icon icon={'tabler:category'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Blog Category')}
                      </Typography>
                    </IconButton>

                    <Divider />

                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/blogs/sub-category'}
                    >
                      <Icon icon={'tabler:list-details'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Blog Sub Category')}
                      </Typography>
                    </IconButton>

                    <Divider />

                    <Typography variant={'subtitle1'} sx={{ fontWeight: 600, py: 1 }}>
                      {t('Case Study Settings')}
                    </Typography>

                    <Divider />
                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/case-study/category'}
                    >
                      <Icon icon={'tabler:category'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Case Study Category')}
                      </Typography>
                    </IconButton>

                    <Divider />

                    <IconButton
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        py: 2,
                        borderRadius: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => handleDropdownClose()}
                      component={Link}
                      href={'/case-study/sub-category'}
                    >
                      <Icon icon={'tabler:list-details'} />
                      <Typography variant={'body1'} sx={{ ml: 2 }}>
                        {t('Case Study Sub Category')}
                      </Typography>
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </ScrollWrapper>
        </Menu>
      )}
    </Fragment>
  )
}

export default SettingsDropdown

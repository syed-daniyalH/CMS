// ** React Imports
import {ReactNode, useEffect, useState} from 'react'

// ** MUI Imports
import {Theme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import {useSettings} from 'src/@core/hooks/useSettings'
import {useAuth} from "../hooks/useAuth";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Icon from "../@core/components/icon";

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const UserLayout = ({children, contentHeightFixed}: Props) => {
  // ** Hooks
  const {settings, saveSettings} = useSettings()
  const {user} = useAuth();
  const { t } = useTranslation();
  const [showExpiry, setShowExpiry] = useState<boolean>(false);
  const [difference, setDifference] = useState<number>(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Check for left-click + Ctrl or Cmd
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isLeftClick = e.button === 0;

      if (isCtrlOrCmd && isLeftClick) {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          document.cookie = `accessToken=${token}; path=/; max-age=15`;
        }
      }
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
      let isActive = true;

        if(isActive) {
          if(user) {
            let dueDate = new Date(user?.planDueDate);
            const timeDifference = dueDate.getTime() - new Date().getTime();
            const differenceInDays = timeDifference / (1000 * 3600 * 24);

            if(differenceInDays < 10 && !user?.isDueDatePassed) {
              setDifference(differenceInDays);
              setShowExpiry(true);
            }
          }
        }


      return () => {
        isActive = false;
      }
    }, [user])

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  return (
    <Box sx={{display: 'flex', position: 'relative', width: '100%', flexDirection: 'column'}}>
      {
        showExpiry &&
        <Box sx={{
          width: '100%',
          position: 'absolute',
          backgroundColor: '#ffca00',
          zIndex: 1599,
          bottom: 0,
          display: 'flex', justifyContent: 'center',
          py: 2.5
        }}>
          <Typography variant={'h6'}>
            {t(`Your Subscription is going to end in ${parseInt(`${difference}`)} days. `)}
          </Typography>

          <Box sx={{position: 'absolute', bottom: 2, right: 6}}>
            <IconButton
              size='small'
              onClick={() => setShowExpiry(false)}
              sx={{
                p: '0.375rem',
                borderRadius: 1,
                color: 'common.black',
                // backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                }
              }}
            >
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </IconButton>
          </Box>

        </Box>
      }
      <Box sx={{flexGrow: 1}}>
        <Layout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          contentHeightFixed={contentHeightFixed}
          verticalLayoutProps={{
            navMenu: {
              navItems: VerticalNavItems()

              // Uncomment the below line when using server-side menu in vertical layout and comment the above line
              // navItems: verticalMenuItems
            },
            appBar: {
              content: props => (
                <VerticalAppBarContent
                  hidden={hidden}
                  settings={settings}
                  saveSettings={saveSettings}
                  toggleNavVisibility={props.toggleNavVisibility}
                />
              )
            }
          }}
          {...(settings.layout === 'horizontal' && {
            horizontalLayoutProps: {
              navMenu: {
                navItems: HorizontalNavItems()

                // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
                // navItems: horizontalMenuItems
              },
              appBar: {
                content: () => <HorizontalAppBarContent hidden={hidden} settings={settings}
                                                        saveSettings={saveSettings}/>
              }
            }
          })}
        >
          {children}

        </Layout>

      </Box>
    </Box>
  )
}

export default UserLayout

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import {styled, useTheme} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {useAuth} from "../../hooks/useAuth";
import authConfig from "../../configs/auth";
import {localServerAddress} from "../../@core/utils/form-types";


interface Props {
  isLoggedOut: boolean
  setOpenLogout: (value: any) => void
  open: boolean
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const LogoutDialog = ({open, isLoggedOut, setOpenLogout } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const { logout } = useAuth();


  const onSuccess = (e: any) => {
    e.preventDefault();

    if(isLoggedOut) {
      setOpenLogout({open: false, logout: false})
      logout();
    } else {
      window.sessionStorage.setItem('userData', window.localStorage.getItem('userData')??"")
      window.sessionStorage.setItem(authConfig.storageTokenKeyName, window.localStorage.getItem(authConfig.storageTokenKeyName)??"")
      window.sessionStorage.setItem(localServerAddress, window.localStorage.getItem(localServerAddress)??"")
      setOpenLogout({open: false, logout: false})
      window.location.reload();
    }

  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={undefined}
      transitionDuration={1000}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 0,
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '35%' : '98%'}}>
        <Header sx={{px: 4, py: 1}}>
          <Typography variant='subtitle1'>{t(isLoggedOut ? "Logout" :"Refresh Session")}</Typography>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '40vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200}}>
              {isLoggedOut ? "You are no longer logged in." : "You are no longer logged in to current organization."}
            </Typography>

            <Typography variant={'body2'} sx={{fontWeight: 200, mt: 2}}>
              {isLoggedOut ? "You are no longer logged in. Please Logout and login again to continue" :`Please refresh to fetch the latest data.`}
            </Typography>
          </Box>

        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '35%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <LoadingButton size={'small'} color={isLoggedOut ? 'error' : 'warning'} variant='contained' onClick={onSuccess} sx={{mr: 4}}>
            {t(isLoggedOut ? "Logout" : "Refresh")}
          </LoadingButton>
        </Box>
      </Card>
    </Drawer>
  )
}

export default LogoutDialog

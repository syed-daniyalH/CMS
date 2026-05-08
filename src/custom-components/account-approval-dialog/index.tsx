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
import Button from "@mui/material/Button";
import Link from "next/link";


interface Props {
  toggle: () => void
  open: boolean
  rejected: boolean
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AccountApprovalDialog = ({rejected, open, toggle } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={toggle}
      transitionDuration={1000}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 0,
          height: '100vh'
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '35%' : '98%', position: 'relative'}}>
        <Header sx={{px: 4, py: 1}}>
          <Typography variant='subtitle1'>{t("Account Verification")}</Typography>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '40vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200}}>
              {rejected ? "Your organization approval request has been rejected." :"Your organization is in approval process."}
            </Typography>

            <Typography variant={'body2'} sx={{fontWeight: 200, mt: 2}}>
              {rejected ? "Please contact with support for the further assistance." :`Kindly wait for the approval and come back after sometime.`}
            </Typography>
          </Box>

        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: '100%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          {
            rejected &&
            <Button component={Link} href={`${process.env.NEXT_PUBLIC_WEB_URL}contact-us`} size={'small'} color={'success'} variant='contained' sx={{mr: 4}}>
              {t("Contact Support")}
            </Button>
          }
          <Button size={'small'} color={'secondary'} variant='contained' onClick={toggle} sx={{mr: 4}}>
            {t("Close")}
          </Button>
        </Box>
      </Card>
    </Drawer>
  )
}

export default AccountApprovalDialog

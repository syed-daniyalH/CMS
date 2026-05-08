// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'

// ** Icon Imports
import Icon from '../../core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import InventorySerials from "./index";

interface Props {
  open: boolean
  toggle: () => void
  data: any
  formType: string
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddSerialsSidebar = ({open, toggle, data, formType}: Props) => {

  const {t} = useTranslation();


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={toggle}
      sx={{'& .MuiDrawer-paper': {width: '50%', mx: '10px', my: '10px', height: '97vh', borderRadius: '12px'}}}
      ModalProps={{keepMounted: true}}
    >
      <Header sx={{px: 4, py: 2}}>
        <Typography variant='h5'>{t("Manage Document Serials")}</Typography>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{
            p: '0.375rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem'/>
        </IconButton>
      </Header>

      <Divider/>

      <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', overflow: 'auto'}}>
        <InventorySerials formType={formType} data={data}/>
      </Box>
    </Drawer>
  )
}

export default AddSerialsSidebar

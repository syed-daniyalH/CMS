// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {CustomerDataParams} from "src/store/inventory-operations/customers";
import TaxTypeSelector from "src/@core/dropdown-selectors/TaxTypeSelector";
import {GenericDropdownObj} from "src/store/dropdowns";

interface Props {
  open: boolean
  toggle: () => void
  searchData: CustomerDataParams
  onSearch: (data: any) => void
  clearSearch: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const CustomerFilter = ({ open, toggle, clearSearch, searchData, onSearch }: Props) => {

  const {t} = useTranslation();
  const [advanceFilters, setAdvanceFilters] = useState<boolean>(false);
  const [state, setState] = useState<CustomerDataParams>({...searchData});

  const toggleAdvance = () => {
    setAdvanceFilters(!advanceFilters);
  }

  useEffect(() => {
    let isActive = true;

    if(isActive && searchData) {
      setState({...searchData})
    }

    return () => {
      isActive = false;
    }
  }, [searchData])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400], mx: '10px', my: '10px', height: '97vh', borderRadius: '12px' } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header sx={{px: 4, py: 2}}>
        <Typography variant='h5'>{t("Search Customers")}</Typography>
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
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </Header>

      <Divider />

      <Box sx={{ p: theme => theme.spacing(4, 6, 16), position: 'relative', overflow: 'auto' }}>

      </Box>
      <Box sx={{position: 'absolute', zIndex: 1, bottom: 0, width: '100%', display: 'flex', justifyContent: "end", p: 2, backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Button variant='contained' onClick={() => {
          toggle();
          onSearch!(state);
        }} sx={{mr: 4}}>
          {t("Apply")}
        </Button>
        <Button variant='tonal' color='error' onClick={() => {
          toggle();
          clearSearch!();
        }}>
          {t("Reset")}
        </Button>
      </Box>
    </Drawer>
  )
}

export default CustomerFilter

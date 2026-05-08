// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/core/components/mui/text-field'
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import TaxTypeSelector from "src/core/dropdown-selectors/TaxTypeSelector";
import {GenericDropdownObj} from "src/store/dropdowns";

interface Props {
  open: boolean
  toggle: () => void
  searchData: any
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
  const [state, setState] = useState<any>({...searchData});

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


  const handleChangeTaxType = (value: GenericDropdownObj | null) => {
    setState({...state, TaxType: value?.value ? parseInt(`${value?.value??"0"}`) : null})
  }

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
        <CustomTextField
          fullWidth
          type='text'
          label={t('Display Name')}
          sx={{ mb: 3 }}
          variant='outlined'
          placeholder={t('Display Name') as string}
          value={state?.Name??""}
          onChange={(e) => setState({...state, Name: e.target.value})}
        />
        <CustomTextField
          fullWidth
          label={t('Company Name')}
          type='text'
          sx={{ mb: 3 }}
          variant='outlined'
          placeholder={t('Company Name') as string}
          value={state?.CompanyName??""}
          onChange={(e) => setState({...state, CompanyName: e.target.value})}
        />

        <CustomTextField
          fullWidth
          label={t('Email')}
          sx={{ mb: 3 }}
          variant='outlined'
          placeholder={t('Email') as string}
          value={state?.Email??""}
          onChange={(e) => setState({...state, Email: e.target.value})}
        />

        <CustomTextField
          fullWidth
          label={t('Phone')}
          sx={{ mb: 3 }}
          variant='outlined'
          placeholder={t('Phone') as string}
          value={state?.Mobile??""}
          onChange={(e) => setState({...state, Mobile: e.target.value})}
        />

        <Typography onClick={(_) => toggleAdvance()} variant={'body2'} sx={{mb: 3, cursor: 'pointer', textDecoration: 'underline', color: theme => theme.palette.customColors.linkColor}}>
          {t("Advance Filters")}
        </Typography>
        {
          advanceFilters &&
          <CustomTextField
            fullWidth
            label={t('Address')}
            sx={{ mb: 3 }}
            variant='outlined'
            placeholder={t('Address') as string}
            value={state?.Address??""}
            onChange={(e) => setState({...state, Address: e.target.value})}
          />
        }
        {
          advanceFilters &&
          <TaxTypeSelector selected_value={state.TaxType??null} handleChange={handleChangeTaxType} props={{placeholder: t("Tax Type") as string}} />
        }
        {
          advanceFilters &&
          <CustomTextField
            fullWidth
            label={t('Notes')}
            sx={{ mb: 3 }}
            variant='outlined'
            placeholder={t('Notes')  as string}
            value={state?.Notes??""}
            onChange={(e) => setState({...state, Notes: e.target.value})}
          />
        }
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

// ** React Imports
import {useState, SyntheticEvent, Fragment, ReactNode, useEffect} from 'react'

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
import {useTranslation} from "react-i18next";
import {useSettings} from "src/core/hooks/useSettings";
import TypoLabel from "../inputs/TypoLabel";
import CustomTextField from "../../core/components/mui/text-field";
import Button from "@mui/material/Button";

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: '20%',
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '70%'
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

interface Props {
  baseCurrencyCode: string
  currencyCode: string
  convertedRate: number
  conversionRate: number
  onUpdate: (updatedRate: number) => void
}

const CurrencyConversion = ({baseCurrencyCode, currencyCode, convertedRate, conversionRate, onUpdate}: Props) => {
  // ** Props
  const { settings } = useSettings();

  const {t} = useTranslation();

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const [conversionValue, setConversionValue] = useState<number>(1);

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setConversionValue(convertedRate)
    setAnchorEl(null)
  }

  useEffect(() => {
    let isActive = true;

    if(isActive && convertedRate) {
      setConversionValue(convertedRate)
    }

    return () => {
      isActive = false;
    }
  }, [convertedRate]);

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Icon icon='tabler:edit' color={'#0080ff'} fontSize={'1.15rem'} />
      </IconButton>
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
            backgroundColor: theme => `${theme.palette.primary.main} !important`
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '& svg': { color: 'text.secondary' },
            }}
          >
            <Typography variant='h6' color={'white'}>{t("Currency Conversion")}</Typography>
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
          >
           <Grid item xs={12} lg={12}>
             <CustomTextField
               fullWidth
               type='number'
               sx={{mb: 3}}
               label={<TypoLabel name={t("Conversion Rate")} /> }
               variant='outlined'
               placeholder={t('Conversion Rate') as string}
               value={conversionValue > 0 ? conversionValue : ""}
               onChange={(e => setConversionValue(+e.target.value))}
             />
           </Grid>

           <Grid item xs={12} lg={12}>
             <Typography variant={"body2"} sx={{textAlign: 'right'}}>1 {currencyCode} = {conversionRate} {baseCurrencyCode}</Typography>
           </Grid>

           <Grid item xs={12} lg={12}>
             <Divider sx={{mb: 2}}/>
             <Box sx={{display: 'flex', justifyContent: 'end'}}>
               <Button size={'small'} variant='contained' onClick={() => {
                 onUpdate(conversionValue);
                 handleDropdownClose();
               }} color='success'>
                 {t("Update")}
               </Button>
             </Box>
           </Grid>

          </Grid>
        </ScrollWrapper>
      </Menu>
    </Fragment>
  )
}

export default CurrencyConversion

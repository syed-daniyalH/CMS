// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Type Import
import { Settings } from 'src/core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/core/layouts/components/shared-components/UserDropdown'
// import NotificationDropdown from 'src/core/layouts/components/shared-components/NotificationDropdown'
import { ShortcutsType } from 'src/core/layouts/components/shared-components/ShortcutsDropdown'
import SettingsDropdown  from 'src/core/layouts/components/shared-components/SettingsDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import SwitchOrganization from "../../../core/layouts/components/shared-components/SwitchOrganization";
import {Divider} from "@mui/material";
import {useEffect, useState} from "react";
import LanguageDropdown from "../../../core/layouts/components/shared-components/LanguageDropdown";
import LogoutDialog from "../../../components/logged-out-dialog";

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const shortcuts: ShortcutsType[] = [
  {
    title: 'Add Invoice',
    url: '/financial-operations/sales/invoices/add-invoice',
    icon: 'tabler:receipt',
    subtitle: 'Create new invoice',
    action: 'new',
    subject: 'SalesInvoices'
  },
  {
    title: 'Record Payments',
    url: '/financial-operations/sales/recoveries/add-recovery',
    icon: 'tabler:coins',
    subtitle: 'Receive payments.',
    action: 'new',
    subject: 'Recoveries'
  },
  {
    title: 'Create Bills',
    icon: 'tabler:receipt-dollar',
    url: '/financial-operations/purchases/bills/add-bill',
    subtitle: 'Create New Bills',
    action: 'new',
    subject: 'PurchaseInvoices'
  },
  {
    url: '/financial-operations/purchases/payments/add-payment',
    icon: 'tabler:credit-card',
    subtitle: 'Made your payments',
    title: 'Payments Made',
    action: 'new',
    subject: 'Payments'
  },
  {
    subtitle: 'Create new Expenses',
    title: 'Add Expenses',
    url: '/financial-operations/purchases/expenses/add-expense',
    icon: 'tabler:wallet',
    action: 'new',
    subject: 'Expenses'
  },
  {
    title: 'Settings',
    icon: 'tabler:settings',
    subtitle: 'Account Settings',
    url: '/settings',
    action: 'view',
    subject: 'Settings'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const auth = useAuth()
  const [openLogout, setOpenLogout] = useState<any>({open: false, logout: false});


  useEffect(() => {
    let isActive = true;

    if(isActive && auth.user) {
      if(!localStorage.getItem('userData')) {
        setOpenLogout({open: true, logout: true});
      } else if(auth.user?.loginUserId !== JSON.parse(localStorage.getItem('userData')??"")?.loginUserId) {
        setOpenLogout({open: true, logout: false});
      }
    }

    return () => {
      isActive = false;
    }
  }, [auth.user, localStorage.getItem('userData')])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon  color={'#ffffff'} fontSize='1.3rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        <Divider orientation={'vertical'} sx={{height: 14, backgroundColor: '#ffffffa0'}} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
            <SettingsDropdown settings={settings} shortcuts={shortcuts} />
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>

      {
        openLogout.open &&
        <LogoutDialog isLoggedOut={openLogout.logout} open={openLogout.open} setOpenLogout={setOpenLogout} />
      }

    </Box>
  )
}

export default AppBarContent

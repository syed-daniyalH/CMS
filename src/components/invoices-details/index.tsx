

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

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import {useTranslation} from "react-i18next";
import {useSettings} from "src/core/hooks/useSettings";
import CustomChip from "../../core/components/mui/chip";
import Link from "next/link";


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

export interface InvoiceDetailPopupType {
  invCode: string
  invType: string
  invRecno: number
  invId: number
  invAmount: number
  invOutStanding: number
  invPaidAmount: number
  transactionInvAmount: number
  transactionInvOutStanding: number
  transactionInvPaidAmount: number
}
export interface AdjustmentDetailPopupType {
  invCode: string
  invType: string
  invRecno: number
  recoveryRecno: number
  invId: number
  invAmount: number
  invAdjustableAmount: number
  invAdjustedAmount: number
  transactionInvAmount: number
  transactionInvAdjustableAmount: number
  transactionInvAdjustedAmount: number
}

interface Props {
  title?: string | null
  row: any
  invoices: InvoiceDetailPopupType[]
  adjustments: AdjustmentDetailPopupType[]
}

const InvoiceDetailsPopup = ({title, invoices, adjustments, row}: Props) => {
  // ** Props
  const { settings } = useSettings();

  const {t} = useTranslation();

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


  const generateLinkInvoices = (row: InvoiceDetailPopupType) => {
    if(row.invType === "Purchase") {
      return `/financial-operations/purchases/bills/bills-list?billNo=${row.invRecno}`
    } else if(row.invType === "Invoice") {
      return `/financial-operations/sales/invoices/invoice-list?invoiceNo=${row.invRecno}`
    } else {
      return '/';
    }
  }

  return (
    <Fragment>

      <CustomChip
        rounded
        size='small'
        skin='light'
        color={'info'}
        label={`${(invoices??[]).length > 9 ? "9+" : (invoices??[]).length} ${(invoices??[]).length === 1 ? ("invoice") :("invoices")}`}
        sx={{'& .MuiChip-label': {textTransform: 'capitalize', fontSize: '0.7rem'}, ":hover": invoices.length > 0 ? {backgroundColor: '#00000000'} : {}}}
        onClick={invoices.length > 0 ? handleDropdownOpen : undefined}
        aria-haspopup='true'  aria-controls='customized-menu'
      />

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
            <Typography variant='h6' color={'white'}>{t(title??"Invoice")} ({row?.code??""})</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: '0 !important' }} />
        <ScrollWrapper hidden={hidden}>
          {
            invoices.map((invoice, index) => (
              <Grid
                key={index}
                container
                sx={{
                  p: 2
                }}
              >
                <Grid item xs={6} lg={6}>
                  <Typography variant={'body2'}>
                    {t("Receipt No")}
                  </Typography>
                </Grid>
                <Grid item xs={6} lg={6} sx={{display: 'flex', justifyContent: 'end'}}>
                  <Link href={generateLinkInvoices(invoice)}>
                    <Typography variant={'body2'} sx={{textAlign: 'right',  color: theme => theme.palette.customColors.linkColor,
                      textDecoration: 'underline',
                      cursor: 'pointer'}}>
                      {invoice.invCode??""}
                    </Typography>
                  </Link>
                </Grid>
                {
                  index !== (invoices.length - 1) &&
                  <Grid item xs={12} lg={12}>
                    <Divider sx={{my: 1}}/>
                  </Grid>
                }
              </Grid>
            ))
          }
          {
            adjustments.length > 0 &&
            <Divider />
          }
          {
            adjustments.map((invoice, index) => (
              <Grid
                key={index}
                container
                sx={{
                  p: 2
                }}
              >
                <Grid item xs={6} lg={6}>
                  <Typography variant={'body2'}>
                    {t("Adjustment No")}
                  </Typography>
                </Grid>
                <Grid item xs={6} lg={6} sx={{display: 'flex', justifyContent: 'end'}}>
                  <Typography variant={'body2'} sx={{textAlign: 'right',  color: theme => theme.palette.customColors.linkColor,
                    textDecoration: 'underline',
                    cursor: 'pointer'}}>
                    {invoice.invCode??""}
                  </Typography>
                </Grid>
                {
                  index !== (invoices.length - 1) &&
                  <Grid item xs={12} lg={12}>
                    <Divider sx={{my: 1}}/>
                  </Grid>
                }
              </Grid>
            ))
          }
        </ScrollWrapper>
      </Menu>
    </Fragment>
  )
}

export default InvoiceDetailsPopup

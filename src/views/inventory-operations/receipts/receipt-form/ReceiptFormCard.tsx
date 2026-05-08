// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'
import IconButton from '@mui/material/IconButton'
import { useReceipt } from '../context/useReceipt'
import { useRouter } from 'next/navigation'
import CustomDatePicker from '../../../../@core/components/custom-date-picker'

//@ts-ignore
import dateFormat from 'dateformat'
import { formatCurrency, globalSendDateFormat } from '../../../../@core/utils/format'
import CustomerSelector from '../../../../@core/dropdown-selectors/CustomerSelector'
import PaymentModeSelector from '../../../../@core/dropdown-selectors/PaymentModeSelector'
import ReceiptEditTable from './editable-table/ReceiptEditTable'


const ReceiptFormCard = ({ toggle }: any) => {
  // ** State
  const { t } = useTranslation()

  // ** Hook
  const theme = useTheme()

  const { receipt, handleReceiptData } = useReceipt()
  const router = useRouter()


  return (
    <Grid container spacing={3} className={'match-height'}>
      <Grid item xl={12} md={12} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant={'h5'}>{receipt?.recepitId ? t('Update Receipt') : t('New Receipt')}</Typography>
            </Box>
            <Divider />
            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>
              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel  name={'Manual Receipt#'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Receipt#') as string}
                  value={receipt?.manualRecpNo ?? ''}
                  onChange={e => {
                    handleReceiptData({ manualRecpNo: e.target.value ?? '' })
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <Box sx={{ mb: 2 }}>
                  <CustomDatePicker
                    date={receipt?.recepitDate}
                    onChange={(date: Date) => {
                      handleReceiptData({ recepitDate: dateFormat(new Date(date), globalSendDateFormat) })
                    }}
                    label={'Receipt Date'}
                  />
                </Box>
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomerSelector
                  handleChange={value => {
                    handleReceiptData({ customerId: value?.value ?? null })
                  }}
                  selected_value={receipt?.customerId ?? null}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <PaymentModeSelector
                  handleChange={value => {
                    handleReceiptData({ paymentModeId: value?.value ?? null })
                  }}
                  selected_value={receipt?.paymentModeId ?? null}
                  props={{label:<TypoLabel important name={'"Payment Mode"'} />}}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel important name={'Actual Amount'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Actual Amount') as string}
                  value={receipt?.actualAmount ?? ''}
                  onChange={e => {
                    handleReceiptData({ actualAmount: +e.target.value ?? 0 ,recepitAmount:+e.target.value})
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Discount Amount'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Discount Amount') as string}
                  value={receipt?.distAmount ?? ''}
                  onChange={e => {
                    handleReceiptData({ distAmount: +e.target.value ?? 0 ,recepitAmount:((receipt?.actualAmount??0)-(+e.target.value??0))??0})
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {
        receipt?.customerId &&
        <Grid item xl={12} md={12} xs={12}>
          <ReceiptEditTable />
        </Grid>
      }
      <Grid item xl={8} md={7} xs={12}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
            }}
          >
            <CustomTextField
              fullWidth
              multiline
              minRows={3}
              type='text'
              sx={{ mb: 3 }}
              label={<TypoLabel name={t('Notes')} />}
              variant='outlined'
              placeholder={t('Notes') as string}
              value={receipt?.remarks ?? ''}
              onChange={e => handleReceiptData({ remarks: e.target.value ?? '' })}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xl={4} md={5} xs={12}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant={'body1'} sx={{ fontWeight: 500 }}>
                  {t(`Original Cost`)}
                </Typography>
                <Typography variant={'body1'} sx={{ fontWeight: 500 }}>
                  {formatCurrency(receipt?.actualAmount, null)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {t(`Discount`)}
                </Typography>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {formatCurrency(receipt?.distAmount, null)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {t(`Total Amount`)}
                </Typography>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {formatCurrency(
                    ((receipt?.actualAmount ?? 0) - (receipt?.distAmount ?? 0)),
                    null
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReceiptFormCard

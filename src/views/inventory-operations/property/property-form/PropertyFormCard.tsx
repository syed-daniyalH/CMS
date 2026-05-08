// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'
import { useProperty } from '../context/useProperty'
import { useRouter } from 'next/navigation'
import CustomDatePicker from '../../../../@core/components/custom-date-picker'

// ** Utils
// @ts-ignore
import dateFormat from 'dateformat'
import { formatCurrency, getProjectDetail, getProjectField, globalSendDateFormat } from '../../../../@core/utils/format'

// ** Dropdowns
import FloorSelector from '../../../../@core/dropdown-selectors/FloorSelector'
import PropertyTypeSelector from '../../../../@core/dropdown-selectors/PropertyTypeSelector'
import PropertyStatusSelector from '../../../../@core/dropdown-selectors/PropertyStatusSelector'
import PreferenceSelector from '../../../../@core/dropdown-selectors/PreferenceSelector'

// ** Hooks
import { useAuth } from '../../../../hooks/useAuth'

// ** Utility for numeric formatting
const formatNumber = (num: number | null | undefined, decimals = 0) => {
  if (num == null || isNaN(num)) return ''
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

const parseNumber = (val: string) => {
  const parsed = parseFloat(val.replace(/,/g, ''))
  return isNaN(parsed) ? 0 : parsed
}

const PropertyFormCard = ({ toggle }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { property, handlePropertyData } = useProperty()
  const { user } = useAuth()
  const projectInfo = getProjectField(user?.projectType ?? 1);
  const visibleFields:any = projectInfo.fields;

  const rounding = user?.roundingDigit ?? 0
  const marlaSize = user?.marlaSize ?? 1

  return (
    <Grid container spacing={3} className={'match-height'}>
      <Grid item xl={12} md={12} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant='h5'>
                {property?.propertyId ? t('Update Property') : t('New Property')}
              </Typography>
            </Box>
            <Divider />

            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>

              {/* Setup Date */}
              <Grid item md={3} xs={12}>
                <CustomDatePicker
                  date={property?.setupDate}
                  onChange={(date: Date) => {
                    handlePropertyData({
                      setupDate: dateFormat(new Date(date), globalSendDateFormat)
                    })
                  }}
                  label={'Setup Date'}
                  important
                />
              </Grid>

              {/* Floor */}
              <Grid item md={3} xs={12}>
                <FloorSelector
                  selected_value={property?.floorId ?? null}
                  handleChange={(value) => {
                    handlePropertyData({
                      floorId: value?.value ? parseInt(`${value?.value}`) : null
                    })
                  }}
                  props={{
                    placeholder: t(`Select ${getProjectDetail(user?.projectType ?? 1)}`) as string,
                    label: <TypoLabel name={`${getProjectDetail(user?.projectType ?? 1)}`} important />
                  }}
                />
              </Grid>

              {/* Property Type */}
              <Grid item md={3} xs={12}>
                <PropertyTypeSelector
                  selected_value={property?.typeId ?? null}
                  handleChange={(value) => {
                    handlePropertyData({
                      typeId: value?.value ? parseInt(`${value?.value}`) : null
                    })
                  }}
                  props={{
                    placeholder: t('Select Type') as string,
                    label: <TypoLabel name={'Property Type'} important />
                  }}
                />
              </Grid>

              {/* Property Number */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel important name={'Property#'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Property#') as string}
                  value={property?.propertyNo ?? ''}
                  onChange={e => handlePropertyData({ propertyNo: e.target.value ?? '' })}
                />
              </Grid>

              {/* Area Marla */}
              {visibleFields.includes('areaMarla') && (
                <Grid item md={3} xs={12}>
                  <CustomTextField
                    fullWidth
                    label={<TypoLabel important name={'Area Marla'} />}
                    type='text'
                    sx={{ mb: 2 }}
                    variant='outlined'
                    placeholder={t('Area Marla') as string}
                    value={formatNumber(property?.areaMarla, rounding)}
                    onChange={e => {
                      const marla = parseNumber(e.target.value)
                      const sqft = marla * marlaSize
                      const ratePerSqft = (marla > 0 ? (property?.marlaRate ?? 0) / marlaSize : 0)
                      handlePropertyData({
                        areaMarla: marla,
                        areaSqft: sqft,
                        ratePerSqft
                      })
                    }}
                  />
                </Grid>
              )}

              {/* Rate/Marla */}
              {visibleFields.includes('rateMarla') && (
                <Grid item md={3} xs={12}>
                  <CustomTextField
                    fullWidth
                    label={<TypoLabel important name={'Rate/Marla'} />}
                    type='text'
                    sx={{ mb: 2 }}
                    variant='outlined'
                    placeholder={t('Rate/Marla') as string}
                    value={formatNumber(property?.marlaRate, rounding)}
                    onChange={e => {
                      const marlaRate = parseNumber(e.target.value)
                      const ratePerSqft = marlaRate / marlaSize
                      handlePropertyData({
                        marlaRate,
                        ratePerSqft
                      })
                    }}
                  />
                </Grid>
              )}

              {/* Area Sqft */}
              {visibleFields.includes('areaSqft') && (
                <Grid item md={3} xs={12}>
                  <CustomTextField
                    fullWidth
                    label={<TypoLabel important name={'Area Square Feet'} />}
                    type='text'
                    sx={{ mb: 2 }}
                    variant='outlined'
                    placeholder={t('Area Square Feet') as string}
                    value={formatNumber(property?.areaSqft, rounding)}
                    onChange={e => {
                      const sqft = parseNumber(e.target.value)
                      const marla = sqft / marlaSize
                      const marlaRate = (property?.ratePerSqft ?? 0) * marlaSize
                      handlePropertyData({
                        areaSqft: sqft,
                        areaMarla: marla,
                        marlaRate
                      })
                    }}
                  />
                </Grid>
              )}


              {/* Rate/Sqft */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel important name={'Rate/Square Feet'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Rate/Square Feet') as string}
                  value={formatNumber(property?.ratePerSqft, rounding)}
                  onChange={e => {
                    const ratePerSqft = parseNumber(e.target.value)
                    const marlaRate = ratePerSqft * marlaSize
                    handlePropertyData({
                      ratePerSqft,
                      marlaRate
                    })
                  }}
                />
              </Grid>

              {/* Preference */}
              <Grid item md={3} xs={12}>
                <PreferenceSelector
                  selected_value={property?.prefId ?? null}
                  handleChange={(value) => {
                    handlePropertyData({
                      prefId: value?.value,
                      prefPercentage: value?.prefPercentage ?? 0
                    })
                  }}
                />
              </Grid>

              {/* Preference Percentage */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Preference%'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Preference%') as string}
                  value={formatNumber(property?.prefPercentage, rounding)}
                  onChange={e => {
                    handlePropertyData({ prefPercentage: parseNumber(e.target.value) })
                  }}
                />
              </Grid>

              {/* Registration# */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel important name={'Registration#'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Registration#') as string}
                  value={property?.regNo ?? ''}
                  onChange={e => handlePropertyData({ regNo: e.target.value ?? '' })}
                />
              </Grid>

              {/* Status */}
              <Grid item md={3} xs={12}>
                <PropertyStatusSelector
                  selected_value={property?.statusId ?? null}
                  handleChange={(value) => {
                    handlePropertyData({
                      statusId: value?.value ? parseInt(`${value?.value}`) : null
                    })
                  }}
                  props={{
                    placeholder: t('Select Status') as string,
                    label: <TypoLabel name={'Property Status'} important />
                  }}
                />
              </Grid>

              {/* Dimensions */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Dimensions'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Dimensions') as string}
                  value={property?.dimensions ?? ''}
                  onChange={e => handlePropertyData({ dimensions: e.target.value ?? '' })}
                />
              </Grid>

              {/* Second# */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label={<TypoLabel name={'Second#'} />}
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Second#') as string}
                  value={property?.secondNo ?? ''}
                  onChange={e => handlePropertyData({ secondNo: e.target.value ?? '' })}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Notes */}
      <Grid item xl={8} md={7} xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', p: [`${theme.spacing(3)} !important`] }}>
            <CustomTextField
              fullWidth
              multiline
              minRows={3}
              type='text'
              sx={{ mb: 3 }}
              label={<TypoLabel name={t('Notes')} />}
              variant='outlined'
              placeholder={t('Notes') as string}
              value={property?.remarks ?? ''}
              onChange={e => handlePropertyData({ remarks: e.target.value ?? '' })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Card */}
      <Grid item xl={4} md={5} xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', p: [`${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='body1' sx={{ fontWeight: 500 }}>
                {t('Original Cost')}
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 500 }}>
                {formatCurrency(property?.orgPrice, null)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant='body1' sx={{ fontWeight: 400 }}>
                {t('Preferences')}
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 400 }}>
                {formatCurrency(property?.prefAmount, null)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant='body1' sx={{ fontWeight: 400 }}>
                {t('Total Amount')}
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 400 }}>
                {formatCurrency(property?.saleablePrice, null)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PropertyFormCard

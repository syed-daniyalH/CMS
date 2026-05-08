// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Imports
import CustomTextField from 'src/core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import Icon from 'src/core/components/icon'
import TypoLabel from 'src/components/inputs/TypoLabel'
import IconButton from '@mui/material/IconButton'
import { useSectionType } from '../context/useSectionType'
import { useRouter } from 'next/navigation'
import CustomDatePicker from 'src/core/components/custom-date-picker'

//@ts-ignore
import dateFormat from 'dateformat'
import { formatCurrency, globalSendDateFormat } from 'src/core/utils/format'
import CustomerSelector from 'src/core/dropdown-selectors/CustomerSelector'
import PaymentModeSelector from 'src/core/dropdown-selectors/PaymentModeSelector'
import SectionTypeEditTable from './editable-table/SectionTypeEditTable'


const SectionTypeFormCard = ({ toggle }: any) => {
  // ** State
  const { t } = useTranslation()

  // ** Hook
  const theme = useTheme()

  const { sectionType, handleSectionTypeData } = useSectionType()
  const router = useRouter()

  const slugify = (value: string) =>
    `${value ?? ''}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  return (
    <Grid container spacing={3} className={'match-height'}>
      <Grid item xl={12} md={12} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant={'h5'}>{sectionType?._id ? t('Update Section Type') : t('New Section Type')}</Typography>
            </Box>
            <Divider />
            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Name'} important />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Section Type Name') as string}
                  value={sectionType?.name ?? ''}
                  onChange={e => {
                    handleSectionTypeData({
                      name: e.target.value,
                      slug: slugify(e.target.value)
                    })
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Slug'} important />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('slug url') as string}
                  value={sectionType?.slug ?? ''}
                  onChange={e => {
                    handleSectionTypeData({ slug: slugify(e.target.value) })
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Description'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Description') as string}
                  value={sectionType?.description ?? ''}
                  onChange={e => {
                    handleSectionTypeData({ description: e.target.value })
                  }}
                />
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xl={12} md={12} xs={12}>
        <SectionTypeEditTable />
      </Grid>

      {/* <Grid item xl={8} md={7} xs={12}>
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
              value={sectionType?.remarks ?? ''}
              onChange={e => handlesectionTypeData({ remarks: e.target.value ?? '' })}
            />
          </CardContent>
        </Card>
      </Grid> */}

      {/* <Grid item xl={4} md={5} xs={12}>
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
                  {formatCurrency(sectionType?.actualAmount, null)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {t(`Discount`)}
                </Typography>
                <Typography variant={'body1'} sx={{ fontWeight: 400 }}>
                  {formatCurrency(sectionType?.distAmount, null)}
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
                    ((sectionType?.actualAmount ?? 0) - (sectionType?.distAmount ?? 0)),
                    null
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default SectionTypeFormCard

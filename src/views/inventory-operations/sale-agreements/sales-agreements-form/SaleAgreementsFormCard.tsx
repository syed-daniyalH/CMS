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
import { useSaleAgreements } from '../context/useSaleAgreements'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { saleAgreementInstallment } from '../context/types'
import { formatCurrency, getProjectDetail, getProjectField, globalSendDateFormat } from '../../../../core/utils/format'
import CustomDatePicker from 'src/core/components/custom-date-picker'

//@ts-ignore
import dateFormat from 'dateformat';
import CustomerSelector from 'src/core/dropdown-selectors/CustomerSelector'
import FloorSelector from 'src/core/dropdown-selectors/FloorSelector'
import PropertyTypeSelector from 'src/core/dropdown-selectors/PropertyTypeSelector'
import PropertyByTypeSelector from 'src/core/dropdown-selectors/PropertyByTypeSelector'
import SalePlanSelector from 'src/core/dropdown-selectors/SalePlanSelector'
import AgentSelector from 'src/core/dropdown-selectors/AgentSelector'
import InstallmentPlansEditTable from '../sales-agreements-form/TableSaleAgreements'
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'
import { CardHeader } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'




const SaleAgreementsFormCard = ({ toggle }: any) => {
  // ** State
  const { t } = useTranslation()

  // ** Hook
  const theme = useTheme()
  const { user } = useAuth();
  const projectInfo = getProjectField(user?.projectType ?? 1);
  const visibleFields:any = projectInfo.fields;
  const { saleAgreements, handleSaleAgreementsData ,recalcAllInstallments} = useSaleAgreements()
  const router = useRouter()

  const [subDetail, setSubDetail] = useState<saleAgreementInstallment>({
    chargeId: 0,
    instPercentage: 0,
    instTypeId: 0,
    installmentAmount: 0,
    installmentStartDate: new Date(),
    isCharged: false,
    monthGap: 0,
    noOfInstallment: 0,
    totalInstallmentAmount: 0
  });

  const handleSubDetail = (updated: any) => {
    setSubDetail({...subDetail, ...updated});
  }


  return (
    <Grid container spacing={3}>
      <Grid item xl={12} md={12} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant={'h5'}>{saleAgreements?.agreeId ? t('Update Sale Agreements') : t('New Sale Agreements')}</Typography>
            </Box>
            <Divider />
            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>

              <Grid item md={4} xs={12}>
                <CustomerSelector disabled={Boolean(saleAgreements?.agreeId)} selected_value={saleAgreements?.customerId??null} handleChange={(value) => {
                  handleSaleAgreementsData({customerId: value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={"Customer"} important /> }} />
              </Grid>

              <Grid item md={4} xs={12}>
                <FloorSelector disabled={Boolean(saleAgreements?.agreeId)} selected_value={saleAgreements?.floorId??null} handleChange={(value) => {
                  handleSaleAgreementsData({floorId: value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={` ${getProjectDetail(user?.projectType??1)}`} important />}} />
              </Grid>

              <Grid item md={4} xs={12}>
                <PropertyTypeSelector disabled={Boolean(saleAgreements?.agreeId)} selected_value={saleAgreements?.typeId??null} handleChange={(value) => {
                  handleSaleAgreementsData({typeId: value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={"Property Type"} important />}} />
              </Grid>

              <Grid item md={4} xs={12}>
                <PropertyByTypeSelector   disabled={Boolean(saleAgreements?.agreeId)} floorId={saleAgreements?.floorId??null} typeId={saleAgreements?.typeId??null} selected_value={saleAgreements?.propertyId??null} handleChange={(value) => {
                  console.log(value,"value")
                  handleSaleAgreementsData({saleAgreementsId: value?.value??null, areaMarla: value?.areaMarla??0, areaSqft: value?.areaSqft??0, marlaRate: value?.marlaRate??0, ratePerSqft: value?.ratePerSqft??0, orgPrice: value?.saleablePrice??0, soldPrice: value?.saleablePrice??0, planId: null,propertyId:value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={"Property"} important />}} />
              </Grid>

              {visibleFields.includes('areaMarla') && (
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Area Marla'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Area Marla') as string}
                  value={formatCurrency(saleAgreements?.areaMarla ?? 0,null)}
                  disabled={true}

                />
              </Grid> )}
              {visibleFields.includes('rateMarla') && (
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Rate Per Marla'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Rate Per Marla') as string}

                  value={saleAgreements?.marlaRate ?? 0}
                  disabled={true}

                />
              </Grid> )}
              {visibleFields.includes('areaSqft') && (
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Area Per SqFt'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Rate Per SqFt') as string}
                  value={saleAgreements?.areaSqft ?? 0}
                  disabled={true}

                />
              </Grid>
              )}
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Rate Per SqFt'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Rate Per SqFt') as string}
                  value={formatCurrency(saleAgreements?.ratePerSqft ?? 0,null)}
                  disabled={true}

                />
              </Grid>
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Original Price'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Original Price') as string}
                  value={saleAgreements?.orgPrice ?? 0}
                  disabled={true}

                />
              </Grid>
              <Grid item md={4} xs={12}>
                <SalePlanSelector disabled={Boolean(saleAgreements?.agreeId)} areaMarla={saleAgreements?.areaMarla??null} areaSqFt={saleAgreements?.areaSqft??null} selected_value={saleAgreements?.planId??null} handleChange={(value) => {
                  handleSaleAgreementsData({planId: value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={"Sale Plan"} important />}} />
              </Grid>

              <Grid item md={4} xs={12}>
                <CustomTextField
                  disabled={Boolean(saleAgreements?.agreeId)}
                  fullWidth
                  label={<TypoLabel name={'Discount (%)'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Discount (%)') as string}
                  value={saleAgreements?.distPercentage ?? ''}
                  onChange={e => {
                    const percentage:any = +e.target.value || "";
                    const orgPrice:any = saleAgreements?.orgPrice ?? 0;
                    const distAmount :any = (orgPrice * percentage) / 100;
                    const soldPrice :any = orgPrice - distAmount;

                    handleSaleAgreementsData({
                      distPercentage: percentage,
                      distAmount,
                      soldPrice
                    });
                  }}
                />
              </Grid>


              {/* Discount Amount */}
              <Grid item md={4} xs={12}>
                <CustomTextField

                  disabled={Boolean(saleAgreements?.agreeId)}
                  fullWidth
                  label={<TypoLabel name={'Discount Amount'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Discount Amount') as string}
                  value={saleAgreements?.distAmount ?? ''}
                  onChange={e => {
                    const amount:any = +e.target.value || "";
                    const orgPrice:any = saleAgreements?.orgPrice ?? 0;
                    const percentage:any = orgPrice ? (amount / orgPrice) * 100 : 0;
                    const soldPrice:any = (orgPrice - amount)??0;

                    handleSaleAgreementsData({
                      distAmount: amount,
                      distPercentage: percentage,
                      soldPrice
                    });
                  }}
                />
              </Grid>
              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Sold Price'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Sold Price') as string}
                  value={saleAgreements?.soldPrice ?? ""}
                  disabled={true}

                />
              </Grid>

              <Grid item md={4} xs={12}>
                <AgentSelector selected_value={saleAgreements?.agentId??null} handleChange={(value) => {
                  handleSaleAgreementsData({agentId: value?.value});
                }} props={{sx: {mb: 0}, label: <TypoLabel name={"Agent"} />}} />
              </Grid>

              <Grid item md={4} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Commission (%)'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Commission  (%)') as string}
                  value={saleAgreements?.agentPercentage ?? ''}
                  onChange={e => {
                    const percentage:any = +e.target.value || "";
                    const orgPrice:any = saleAgreements?.orgPrice ?? 0;
                    const distAmount:any = (orgPrice * percentage) / 100;


                    handleSaleAgreementsData({
                      agentPercentage: percentage,
                      agentAmout: distAmount,
                    });
                  }}
                />
              </Grid>

              {/* Discount Amount */}
              <Grid item md={4} xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Commission Amount'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Commission Amount') as string}
                  value={saleAgreements?.agentAmout ?? ''}
                  onChange={e => {
                    const amount:any = +e.target.value || "";
                    const orgPrice:any = saleAgreements?.orgPrice ?? 0;
                    const percentage:any = orgPrice ? (amount / orgPrice) * 100 : 0;


                    handleSaleAgreementsData({
                      agentAmout: amount,
                      agentPercentage: percentage,

                    });
                  }}
                />
              </Grid>



              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Form#'} important />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Form#') as string}
                  value={saleAgreements?.formNo ?? ''}
                  onChange={e => {
                    handleSaleAgreementsData({ formNo: e.target.value ?? 0})
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Second#'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Second#') as string}
                  value={saleAgreements?.secondNo ?? ''}
                  onChange={e => {
                    handleSaleAgreementsData({ secondNo: e.target.value ?? 0})
                  }}
                />
              </Grid>

              <Grid item md={4} xs={12}>
                <CustomDatePicker disabled={saleAgreements?.agreeId} date={saleAgreements?.saleDate} onChange={(date: Date) => {
                  handleSaleAgreementsData({saleDate: dateFormat(date, globalSendDateFormat)})
                  date.setMonth(date.getMonth() + subDetail.monthGap);
                  handleSubDetail({installmentStartDate: date});
                }} label={"Sale Date"} />
              </Grid>


              <Grid item md={4} xs={12} >
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Remarks'} />}
                  type='text'
                  variant='outlined'
                  placeholder={t('Remarks') as string}
                  value={saleAgreements?.remarks ?? ''}
                  onChange={e => {
                    handleSaleAgreementsData({ remarks: e.target.value ?? 0})
                  }}
                />
              </Grid>




            </Grid>
          </CardContent>

        </Card>
      </Grid>


      {(saleAgreements?.vmSaleAgreementInstallments??[]).length>0 &&(<Grid item md={12} xs={12}>
        <Card>


          <CardHeader
            sx={{
              width: '100%',
              display: 'flex',
              p: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
            }}
            title="Installment Plan Details"
            action={
              <>

                <IconButton
                  size="small"
                  onClick={() =>
                    recalcAllInstallments(
                      saleAgreements?.vmSaleAgreementInstallments ?? [],
                      { orgPrice: saleAgreements?.soldPrice ?? 0 },

                    )
                  }
                  sx={{
                    p: '0.375rem',
                    borderRadius: 1,
                    ml: 2,
                    color: 'common.white',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.main + 'C2'
                    }
                  }}
                >
                  <Icon icon="tabler:refresh" fontSize="1.25rem" />
                </IconButton>
              </>
            }
          />

          <DatePickerWrapper>
            <InstallmentPlansEditTable details={saleAgreements?.vmSaleAgreementInstallments}
                                       />
          </DatePickerWrapper>

        </Card>
      </Grid>)}


    </Grid>
  )
}

export default SaleAgreementsFormCard

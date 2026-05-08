// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import Divider from '@mui/material/Divider'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid'
import DateViewFormat from '../../../../../core/components/date-view'
import { formatCurrency } from '../../../../../core/utils/format'
import InstallmentPlansEditTable from './editable-table/InstallmentsEditTable'
import CustomBackdrop from '../../../../../core/components/loading'
import DatePickerWrapper from '../../../../../core/styles/libs/react-datepicker'

interface Props {
  open: boolean
  toggle: (data: any) => void
  agreement: any
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

export interface InstallmentPlansDataType {
  isEditing?: boolean | null;
  installmentId: number;
  agreeId: number;
  propertyId: number;
  instNo: number;
  chargeId: number;
  isCharged: boolean;
  instTypeId: number;
  instAmount: number;
  recAmount: number;
  dueDate: string; // or Date if you want to parse it
  totalIncludedInstallmentAmount: number;
}

const InstallmentPlansSidebar = ({ open, toggle, agreement }: Props) => {

  const {t} = useTranslation();
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlansDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ error: boolean, message: string }>({error: false, message: ""})


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          if(agreement) {
            getInstallmentPlans().then(() => console.log("loaded"));
          }
        }


      return () => {
        isActive = false;
      }
    }, [agreement])

  const getInstallmentPlans = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/SaleAgreement/GetInstallmentsList/${agreement.agreeId}`);

      if(response.data.succeeded) {
        setInstallmentPlans(response.data.data);
      }

    } catch (e: any) {
      toast.error("Unable to get installment plans");
    } finally {
      setLoading(false);
    }
  }

  const addInstallmentDetail = () => {
    setInstallmentPlans([...installmentPlans, {
      installmentId: 0,
      isEditing: true,
      agreeId: agreement.agreeId,
      propertyId: installmentPlans.length > 0 ? installmentPlans[0].propertyId : 0,
      instNo: (installmentPlans[installmentPlans.length-1].instNo)+1,
      chargeId: 0,
      isCharged: false,
      instTypeId: installmentPlans[installmentPlans.length-1].instTypeId,
      instAmount: 0,
      recAmount: 0,
      dueDate: installmentPlans[installmentPlans.length-1].dueDate,
      totalIncludedInstallmentAmount: installmentPlans[installmentPlans.length-1].totalIncludedInstallmentAmount
    }])
  }

  const removeInstallmentDetail = (lineNo: number) => {
    const index = installmentPlans.findIndex(
      (row: InstallmentPlansDataType) => row.instNo === lineNo
    );
    console.log(lineNo,"linlinlineNoeNoeNo")

    if (index === -1) return; // item not found

    // create a new array by slicing around the index
    const updatedPlans = [
      ...installmentPlans.slice(0, index),
      ...installmentPlans.slice(index + 1)
    ];

    setInstallmentPlans(updatedPlans);
  };
  const handleInstallmentDetailData = (updatedData: any, lineNo: number) => {
    let index = installmentPlans.findIndex((row: InstallmentPlansDataType) => row.instNo === lineNo);
    if (index > -1) {
      setInstallmentPlans(insPs => {
        // Create a new details array with updated item
        return insPs.map((item, i) => {
          if (i === index) {
            return { ...item, ...updatedData }
          }
          return item
        })
      });
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const totalAmount = installmentPlans.reduce((sum, plan) => sum + (plan.instAmount || 0), 0);
      if(totalAmount != agreement?.soldPrice) {
        setError({error: true, message: `There is difference of amount "${(agreement?.soldPrice??0)-totalAmount}". Sold Amount is "${agreement?.soldPrice}" and Installments total is "${totalAmount}".`});
        return;
      } else {
        setError({error: false, message: ""});
      }

      const response  = await axios.put("/SaleAgreement/PutinstallmentsUpdate", installmentPlans);

      if(response.data.succeeded) {
        toast.success("Installments updated Successfully");
        toggle(null);
      }

    } catch (e: any) {
      setError({error: true, message: `${e.response?.data?.Message??e.response?.message??e.data?.message??""}. Unable to update installments`});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={() => toggle(null)}
      sx={{ '& .MuiDrawer-paper': { width: '85%', mx: '10px', my: '10px', height: '97vh', borderRadius: '12px' } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header sx={{px: 4, py: 2}}>
        <Typography variant='h5'>{`${agreement?.customerName??""} ${t("Installment Plans")}`}</Typography>
        <IconButton
          size='small'
          onClick={() => toggle(null)}
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
        <Card>
          <CardHeader title={"Agreement Detail"} sx={{p: 2}} />
          <Divider />
          <CardContent sx={{p: 2}}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Customer Name")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : {agreement?.customerName??""}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Property#")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : {agreement?.propertyNo??""}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Floor Name")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : {agreement?.floorName??""}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Sale Date")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : <DateViewFormat date={agreement?.saleDate} />
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Amount")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : {formatCurrency(agreement?.orgPrice, null)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  {t("Discount Amount")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Typography variant={'h6'}>
                  : {formatCurrency(agreement?.discountAmount, null)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{my: 5}}/>
        <DatePickerWrapper>
          <InstallmentPlansEditTable details={installmentPlans} handleInstallmentDetailData={handleInstallmentDetailData} addInstallmentDetail={addInstallmentDetail} removeInstallmentDetail={removeInstallmentDetail} />
        </DatePickerWrapper>

      </Box>
      <Box sx={{position: 'absolute', zIndex: 1, bottom: 0, width: '100%', display: 'flex', justifyContent: "end", p: 2, backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Box sx={{flexGrow: 1}}>
          <Typography variant={'body1'} sx={{color: 'error.main'}}>
            {error.message}
          </Typography>
        </Box>
        <Button variant='contained' color='primary' sx={{mr: 2}} onClick={onSubmit}>
          {t("Save")}
        </Button>

        <Button variant='tonal' color='error' onClick={() => {
          toggle(null);
        }}>
          {t("Close")}
        </Button>
      </Box>

      <CustomBackdrop open={loading} />
    </Drawer>
  )
}

export default InstallmentPlansSidebar

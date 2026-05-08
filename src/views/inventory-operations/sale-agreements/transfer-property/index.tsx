// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled, useTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";


// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/core/components/mui/text-field'
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
//@ts-ignore
import dateFormat from 'dateformat'
import axios from "axios";
import toast from "react-hot-toast";
import React, {useEffect, useState} from "react";
import TypoLabel from "src/components/inputs/TypoLabel";
import {getData} from "src/store/inventory-operations/sale-agreements";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {saveCloseKey, saveNewKey} from "src/core/utils/translation-file";
import FormSaveButton from "src/components/form-save-button";
import CustomBackdrop from "src/core/components/loading";
import FloorSelector from '../../../../core/dropdown-selectors/FloorSelector'
import { getDefaultFloors } from '../../../../store/dropdowns'
import { formatCurrency, getProjectDetail, globalSendDateFormat } from '../../../../core/utils/format'
import { useAuth } from '../../../../hooks/useAuth'
import { MenuItem } from '@mui/material'
import PropertyTypeSelector from 'src/core/dropdown-selectors/PropertyTypeSelector'
import PropertyByTypeSelector from 'src/core/dropdown-selectors/PropertyByTypeSelector'
import AgentSelector from 'src/core/dropdown-selectors/AgentSelector'
import CustomerSelector from 'src/core/dropdown-selectors/CustomerSelector'
import CustomDatePicker from 'src/core/components/custom-date-picker'
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'


interface Props {
  hoveredRow?: TransferPropertyType | null
  open: boolean
  toggle: (data?: TransferPropertyType | null) => void
  onSuccess?: (data: any) => void
}

export interface TransferPropertyType {
  transferDate?: string;
  newCustomerId?: number;
  propertyId?: number;
  floorId?: number;
  typeId?: number;
  charges?: number;
  remarks?: string;
  agentId?: number;
  agentAmount?: number;
  discountAmount?: number;
  agreeId?: number;
  orgPrice?: number;
  recno?: number;
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const TransferProperty = ({open, toggle, hoveredRow, onSuccess}: Props) => {


  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<TransferPropertyType |null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.saleAgreements)
  const { user } = useAuth();

  useEffect(() => {
    let isActive = true;

    if(isActive && hoveredRow?.recno) {
      getFloorsData().then(() => console.log('loaded'));
    }

    return () => {
      isActive = false;
    }
  }, [hoveredRow?.recno])


  const getFloorsData = async () => {

    try {
      let res = await axios.get(`/Properties/${hoveredRow?.propertyId}`);
      setState({...(res?.data?.data)})
    } catch (e: any) {
      toast.error(t('Unable to load the class data.'));
      toggle(null);
    }
  }

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault();
    setLoading(true);
    let payload = {
      floorId:hoveredRow?.floorId,
      typeId:hoveredRow?.typeId,
      propertyId:hoveredRow?.propertyId,
      newCustomerId :state?.newCustomerId,
      charges :state?.charges,
      transferDate :state?.transferDate,
      agentId :state?.agentId,
      agentAmount :state?.agentAmount,
      remarks :state?.remarks,


  }

    try {
      let errorMessage = "";
      if(!(state?.newCustomerId)) {
        errorMessage += "*Please Select Customer.\n";
      }


      let response: any =  await axios.post('/PropertyTransfer', payload)
      let res = response?.data;
      if(res?.succeeded) {
        toast.success("Property Transfer Successfully.");
        toggle(null);
        dispatch(getData({
          ...(store.params)
        }));

        if(!!onSuccess) {
          onSuccess({
            recno: res?.data?.recno,
            text: res?.data?.name,
            code: res?.data?.code
          })
        }

      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while Update Property!. ${message}`)
    } finally {
      setLoading(false);
    }

  }
 const handleSaleAgreementsData =(value:any)=>{

    setState({...state,agentId:value?.value??null})
 }
 const handleCustomer = (value:any)=>{

   setState({...state,newCustomerId:value?.value})
 }
  return (



    <Drawer
      open={open}
      anchor='top'
      variant='temporary'
      onClose={loading ? undefined : () => toggle(null)}
      transitionDuration={500}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 2,
        }
      }}
      ModalProps={{keepMounted: true}}
    >

      <Card sx={{width: hidden ? '50%' : '98%'}} id={"transferDate"}>
        <Header sx={{px: 4, py: 2}}>
          <Typography variant='h5'>Transfer Property</Typography>
          <IconButton
            size='small'
            onClick={loading ? undefined : () => toggle(null)}
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
            <Icon icon='tabler:x' fontSize='1.25rem'/>
          </IconButton>
        </Header>

        <Divider/>
        <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%',} }}>
        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '90vh', overflow: 'auto'}}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mt: 4,
              width: '100%',
              px: 3,
              py: 2,
              border: theme => `1px solid rgb(255 159 67 / 0.38)`,
              borderRadius: '10px',
              backgroundColor: 'rgb(255 159 67 / 0.08)',
            }}
          >
            <Icon
              icon="tabler:alert-triangle"
              fontSize="1.4rem"
              color="#d32f2f"
            />

            <Typography
              variant="body1"
              sx={{

                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              {t("After this process, the property will be transferred to the selected customer.")}
            </Typography>
          </Box>


          <Grid container spacing={2} >
            <Grid item md={12} xs={12}>
              <Typography fontWeight={700} mt={4} mb={1}>
                Property Details
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <FloorSelector disabled={Boolean(hoveredRow?.agreeId)} selected_value={hoveredRow?.floorId??null} handleChange={(value) => {
              console.log(value)
              }} props={{sx: {mb: 0}, label: <TypoLabel name={` ${getProjectDetail(user?.projectType??1)}`}  />}} />
            </Grid>
            <Grid item md={4} xs={12}>
              <PropertyTypeSelector disabled={Boolean(hoveredRow?.agreeId)} selected_value={hoveredRow?.typeId??null} handleChange={(value) => {
                console.log(value)
              }} props={{sx: {mb: 0}, label: <TypoLabel name={"Property Type"}  />}} />
            </Grid>

            <Grid item md={4} xs={12}>
              <PropertyByTypeSelector   disabled={Boolean(hoveredRow?.agreeId)} floorId={hoveredRow?.floorId??null} typeId={hoveredRow?.typeId??null} selected_value={hoveredRow?.propertyId??null} handleChange={(value) => {
                console.log(value,"value")
              }} props={{sx: {mb: 0}, label: <TypoLabel name={"Property"}  />}} />
            </Grid>



            <Grid item md={4} xs={12} >
              <CustomTextField
                fullWidth
                label={<TypoLabel name={'Amount'} />}
                type='text'
                variant='outlined'
                placeholder={t('Total Amount') as string}
                value={formatCurrency(hoveredRow?.orgPrice ?? 0,null)}
                disabled={true}

              />
            </Grid>
            <Grid item md={4} xs={12} >
              <CustomTextField
                fullWidth
                label={<TypoLabel name={'Discount'} />}
                type='text'
                variant='outlined'
                placeholder={t('Discount') as string}
                value={formatCurrency(hoveredRow?.discountAmount ?? 0,null)}
                disabled={true}

              />
            </Grid>
            <Grid item md={4} xs={12} >
              <CustomTextField
                fullWidth
                label={<TypoLabel name={'Total Amount'} />}
                type='text'
                variant='outlined'
                placeholder={t('Total Amount') as string}
                value={formatCurrency(hoveredRow?.orgPrice ?? 0,null)}
                disabled={true}

              />
            </Grid>
            {/* ================= TRANSFER INFO ================= */}
            <Grid item md={12} xs={12}>
              <Typography fontWeight={700} mt={4} mb={1}>
                Transfer Details
              </Typography>
            </Grid>


            <Grid item md={4} xs={12}>
              <CustomerSelector selected_value={state?.newCustomerId??null} handleChange={handleCustomer} props={{sx: {mb: 0}, label: <TypoLabel name={"Customer"} important />}} />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Transfer Charges'} important />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Transfer Charges') as string}
                value={state?.charges??""}
                onChange={(event) => {
                  setState({...(state??{}), charges: +event.target.value??""})
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomDatePicker

                date={state?.transferDate}
                onChange={(date: Date) => {
                  setState({...state, transferDate: dateFormat(new Date(date), globalSendDateFormat) })
                }}
                label={'Transfer Date'}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <AgentSelector selected_value={state?.agentId??null} handleChange={handleSaleAgreementsData} props={{sx: {mb: 0}, label: <TypoLabel name={"Agent"} />}} />
            </Grid>
            <Grid item md={6} xs={12} >
              <CustomTextField
                fullWidth
                label={<TypoLabel name={'Agent Amount'} />}
                type='text'
                variant='outlined'
                placeholder={t('Agent Amount') as string}
                onChange={(e)=> setState({...state,agentAmount:+e.target.value})}

                value={state?.agentAmount??""}

              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name={'Remarks'}  />}
                type={'text'}
                sx={{mb: 3}}
                rows={3}
                multiline
                variant='outlined'
                placeholder={t('Remarks') as string}
                value={state?.remarks??""}
                onChange={(event) => {
                  setState({...(state??{}), remarks: event.target.value??""})
                }}
              />

            </Grid>



          </Grid>
        </Box>
        </DatePickerWrapper>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '50%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Box sx={{display: 'flex'}}>
            <FormSaveButton options={!!hoveredRow ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
                            onClick={(option: number, event: any) => onSubmit(event, option)}/>

            <Button disabled={loading} variant='tonal' color='error' onClick={() => toggle(null)} sx={{ml: 4}}>
              {t("Close")}
            </Button>
          </Box>
        </Box>

        <CustomBackdrop open={loading} />
      </Card>

    </Drawer>

  )
}

export default TransferProperty

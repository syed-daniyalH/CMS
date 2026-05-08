// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled, useTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";


// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import SaleItemSelector from "../../core/dropdown-selectors/SaleItemSelector";
import {Grid} from "@mui/material";
import CustomTextField from "../../core/components/mui/text-field";
import TypoLabel from "../inputs/TypoLabel";

interface Props {
  dynamic_data: any
  detail: any
  open: boolean
  handleChangeDynamicFields: (data: any, lineno: number) => void
  toggle: (row: any) => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const DynamicFieldsDialog = ({open, toggle, detail, handleChangeDynamicFields, dynamic_data} : Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);

  useEffect(() => {
      let isActive = true;

        if(isActive) {
          setDynamicFields(detail?.dynamicFields??[])
        }


      return () => {
        isActive = false;
      }
    }, [detail])

  const getDynamicValue = (recno: any) => {
    let value = "";
    let dIndex = (dynamicFields??[]).findIndex((e: any) => e.dynamicFieldId === recno);

    if(dIndex > -1) {
      return  (dynamicFields??[])[dIndex].value??"";
    }
    return value;
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={() => toggle(null)}
      transitionDuration={1000}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 0,
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '35%' : '98%'}}>
        <Header sx={{px: 4, py: 1}}>
          <Typography variant='subtitle1'>{t("Set Dynamic Fields")}</Typography>
          <IconButton
            size='small'
            onClick={() => toggle(null)}
            sx={{
              p: '0.3rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.1rem'/>
          </IconButton>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '80vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200, mb: 4}}>
              {`Please Setup your dynamic fields.`}
            </Typography>

            <Divider />

            <Box sx={{display: 'flex', alignItems: 'center', mt: 2, mb: 2}}>

              <SaleItemSelector useListObject selected_value={detail.itemId ?? null} handleChange={(_) => {
                console.log('Item Selected');
              }} preview props={{label: null, sx: {mb: 0}}}
                                noBorder/>

              <Typography variant={'body2'} sx={{fontWeight: 500, ml: 4}}>
                - {t("Qty")}: {detail?.qty??0} - {t("Rate")}: {detail?.transactionCurrencyRate??0}
              </Typography>
            </Box>

            <Divider />

            <Grid container sx={{mt: 4}}>
              {
                (dynamic_data??[]).map((dynamicField: any, index: number) => {
                  return (
                    <Grid key={index} item md={6} xs={12}>
                      <CustomTextField
                        fullWidth
                        label={<TypoLabel name={t(dynamicField.fieldName??"")} />}
                        type='text'
                        variant='outlined'
                        placeholder={t(dynamicField.fieldName??"") as string}
                        value={getDynamicValue(dynamicField.recno)}
                        onChange={(e => {
                          let dIndex = (dynamicFields??[]).findIndex((fI: any) => fI.dynamicFieldId === dynamicField.recno);

                          if(dIndex > -1) {
                            let tempDynamicFields = (dynamicFields??[]).map((tDynamic: any, dIndx: number) => {
                              if(dIndx === dIndex) {
                                return {
                                  dynamicFieldId: dynamicField?.recno,
                                  value: e.target.value??""
                                };
                              } else {
                                return tDynamic;
                              }
                            })
                            setDynamicFields(tempDynamicFields);
                          } else {
                            setDynamicFields([
                              {
                                dynamicFieldId: dynamicField?.recno,
                                value: e.target.value??""
                              }
                            ])
                          }
                        })}
                      />
                    </Grid>
                  )
                })
              }
            </Grid>

          </Box>

        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '35%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Button size={'small'} variant='tonal' color={'success'} onClick={() => {
            handleChangeDynamicFields({dynamicFields: dynamicFields}, detail?.lineno)
            toggle(null);
          }} sx={{mr: 2}}>
            {t("Save")}
          </Button>

          <Button size={'small'} variant='tonal' color={'secondary'} onClick={() => toggle(null)}>
            {t("Close")}
          </Button>
        </Box>
      </Card>
    </Drawer>
  )
}

export default DynamicFieldsDialog

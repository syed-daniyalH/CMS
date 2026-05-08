import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../../core/components/spinner";
import SerialEditTable from "./SerialEditTable";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
//@ts-ignore
import dateFormat from 'dateformat';


interface Props {
  formType: string
  data: any
}

export interface InventorySerialsData {
  id?: string
  documentCode: string
  documentSource: string
  documentRecno: number
  documentLineRecno: number
  lineTotalQty: number
  isInStockSerial: boolean
  serialCode: string[]
  itemId: number
  itemName?: string
  tenantId?: number
  tenantName?: string
  fyearId?: number
  fyearName?: string
  locationId?: number
  locationName?: string
  source: string
  formName: string
  formControllerName: string
  isEditing?: boolean | null
}

export interface SerialsTypeData {
  documentSource: string
  text: string
  source: string
  formName: string
  formControllerName: string
  isInStockSerial: boolean
}

const InventorySerials = ({formType, data}: Props) => {

  // ** States
  const [loading, setLoading]  = useState<boolean>(false);
  const [serials, setSerials]  = useState<InventorySerialsData[]>([]);

  // ** Hooks
  const { t } = useTranslation();


  useEffect(() => {
      let isActive = true;

        if(isActive && formType) {
          getSerialTypes().then(() => console.log('serial loaded.'))
        }


      return () => {
        isActive = false;
      }
    }, [formType])

  const getSerialTypes = async () => {
    setLoading(true);
    try {

      let response = await axios.get(`/Defaults/GetInventorySerialTypes?DocumentSource=${formType}`);

      if(response?.data?.succeeded) {
        if((response?.data?.data??[]).length > 0) {
          // getSerialList(response?.data?.data[0]).then(() => console.log("loaded!"));
          let serType = response?.data?.data[0];
          let tempList : InventorySerialsData[]  = [];
          for(let i = 0; i < (data?.details??[]).length; i++) {
            let save_data: InventorySerialsData = {
              documentCode: data?.code,
              documentLineRecno: data?.details[i].recno,
              documentSource: serType?.documentSource??"",
              formControllerName: serType?.formControllerName??"",
              formName: serType?.formName??"",
              isInStockSerial: serType?.isInStockSerial??false,
              lineTotalQty: data?.details[i].qty??0,
              serialCode: [],
              source: serType?.source??"",
              itemId: data?.details[i].itemId,
              documentRecno: data?.recno,
            }
            tempList.push(save_data);
          }
          setSerials(tempList);
          setLoading(false);
        } else {
          toast.error("Error while loading serials.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }

    } catch (e) {
      console.log(e)
      toast.error("Error while loading serials.")
      setLoading(false);
    }
  }

  const handleSerialsData = (updated: any, docLineRecno: number) => {
    let index = serials.findIndex((e) => e.documentLineRecno === docLineRecno);
    if(index > -1) {
      setSerials(ser => {
        const newDetails = ser.map((item, i) => {
          if (i === index) {
            return {...item, ...updated};
          }
          return item;
        });

        return [...newDetails]
      })
    }
  }

  const getSerialList = async (serType: SerialsTypeData) => {
    try {
      let response = await axios.get(`/Defaults/GetDocumentSerialsList/${data?.recno}/${formType}`);

      if(response?.data?.succeeded) {
        let addedSerials = response?.data?.data?.list??[];
        let tempList: InventorySerialsData[] = [];
        for(let i = 0; i < (data?.details??[]).length; i++) {
          let obj = addedSerials.find((e: any) => e?.itemId === data.details[i].itemId);
          if(obj) {
            tempList.push(obj);
          } else {
            let save_data: InventorySerialsData = {
              documentCode: data?.code,
              documentLineRecno: data?.details[i].recno,
              documentSource: serType?.documentSource??"",
              formControllerName: serType?.formControllerName??"",
              formName: serType?.formName??"",
              isInStockSerial: serType?.isInStockSerial??false,
              lineTotalQty: data?.details[i].qty??0,
              serialCode: [],
              source: serType?.source??"",
              itemId: data?.details[i].itemId,
              documentRecno: data?.recno,
            }
            tempList.push(save_data);
          }
        }
        setSerials(tempList);
      }
      setLoading(false);
    } catch (e) {
      console.log(e)
      toast.error("Error while loading item serials.")
      setLoading(false);
    }
  }

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', height: `calc(100vh - 68px)`, overflow: 'hidden', width: '100%'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', px: 2, py: 1.5, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Typography variant={'h5'}>
          {t("Document Serials")}
        </Typography>
      </Box>
      {
        loading ?
          <Spinner />
          : <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', px: 2}}>
              <Card sx={{mb: 1, mt: 2}} style={{padding: 0}}>
                <CardContent sx={{px: 2, py: 2}} style={{paddingBottom: '10px'}}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{borderRight: theme => `1px solid ${theme.palette.divider}`}}>
                      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 1}}>
                        <Typography variant={'h6'}>
                          {t("Code")}:
                        </Typography>

                        <Typography variant={'body1'}>
                          #{data?.code??""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant={'h6'}>
                          {data?.customerName ? t("Customer") : t("Supplier")}:
                        </Typography>

                        <Typography variant={'body1'}>
                          {data?.customerName??data?.vendorName??""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{borderRight: theme => `1px solid ${theme.palette.divider}`}}>
                      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 1}}>
                        <Typography variant={'h6'}>
                          {t("Date")}:
                        </Typography>

                        <Typography variant={'body1'}>
                          { data?.pDate || data?.vDate  || data?.sDate   ? dateFormat(new Date(data?.sDate??data?.pDate??data?.vDate), 'dd mmm, yyyy') : ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant={'h6'}>
                          {t("Credit Terms")}:
                        </Typography>

                        <Typography variant={'body1'}>
                          {data?.creditTermsName??""}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <SerialEditTable serialDetails={serials} handleSerialData={handleSerialsData} />
          </Box>
      }
    </Box>
  )
}

export default InventorySerials;

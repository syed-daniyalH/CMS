// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Util Import
import {useTranslation} from "react-i18next";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import {useAuth} from "../../../hooks/useAuth";
import {defaultCurrencyCode, formatCurrency, getDateRange} from "../../../@core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect, useState} from "react";
import {getSupplierStats} from "../../../store/dashboard";
import {useAppDefaults} from "../../../hooks/useAppDefaults";


type dataTypes = {
  icon: string
  heading: string
  amount: string
  payable: string
  progressColor: string
  progressColorVariant: string
  progressData: string
  widthClass?: string
}

const AnalyticsSupplierPayable = () => {
  // ** Hook
  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(7, user);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const [data, setData] = useState<dataTypes[]>([]);
  const { t } = useTranslation();
  const { defaultCurrency } = useAppDefaults();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getSupplierStats({
        FromDate: fromDate,
        ToDate: toDate,
        NoOfRecords: 6,
      }))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.supplier_stats.length > 0) {

        let tempData: dataTypes[] = [];
        let colors = ['primary', 'success', 'info', 'warning', 'secondary', 'divider']
        let total = store.supplier_stats.reduce((total: number, stat: any) => (((stat.purchasePayableAmount??0) - (stat.purchasePaidAmount??0))+total), 0);

        for(let i = 0; i < store.supplier_stats.length; i++) {
          tempData.push(
            {
              icon: 'tabler:circle-arrow-down',
              heading: `${store.supplier_stats[i].vendorName??""}`,
              amount: `${formatCurrency((store.supplier_stats[i].purchasePayableAmount??0) - (store.supplier_stats[i].purchasePaidAmount??0), defaultCurrency?.code??defaultCurrencyCode)}`,
              payable: `${formatCurrency((store.supplier_stats[i].purchasePayableAmount??0), defaultCurrency?.code??defaultCurrencyCode)}`,
              progressColor: colors[i],
              progressColorVariant: colors[i] === 'divider' ? '' :'main',
              progressData: `${((((store.supplier_stats[i].purchasePayableAmount??0) - (store.supplier_stats[i].purchasePaidAmount??0))/total) * 100).toFixed(2)}%`,
              widthClass: `${((((store.supplier_stats[i].purchasePayableAmount??0) - (store.supplier_stats[i].purchasePaidAmount??0))/total) * 100).toFixed(2)}%`
            }
          )
        }

        setData(tempData);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.supplier_stats])


  return (
    <Card sx={{ml: 2}}>
      <CardHeader title={t('Top Suppliers')} subheader={t("Top Payable Suppliers.")} sx={{px: 3, py: 2}}/>
      <Divider />
      <CardContent>
        {
          store.loadingState.getSupplierStats &&
          <Box sx={{width: '100%', height: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <LinearProgress variant={'indeterminate'} sx={{width: '20%', height: 3}} />
            <Typography variant={'caption'} sx={{mt: 3}}>
              {t("loading...")}
            </Typography>
          </Box>
        }

        {
          !store.loadingState.getSupplierStats &&
          <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 6}}>
            <Box sx={{display: 'flex', width: '100%'}}>
              {data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    width: item.progressData,
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative'
                  }}
                >
                  <Tooltip title={`${item.heading} balance is ${item.amount}`}>
                    <Typography variant={'body2'} sx={{
                      position: 'relative', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{item.heading}</Typography>
                  </Tooltip>
                  <Tooltip title={`${item.heading} balance is ${item.amount}`} >
                    <LinearProgress
                      variant='determinate'
                      value={-1}
                      // eslint-disable-next-line lines-around-comment
                      // @ts-ignore
                      sx={{
                        backgroundColor: `${item.progressColor}.${item.progressColorVariant}`,
                        borderTopLeftRadius: index === 0 ? 8 : 0,
                        borderBottomLeftRadius: index === 0 ? 8 : 0,
                        borderTopRightRadius: index === (data.length - 1) ? 8 : 0,
                        borderBottomRightRadius: index === (data.length - 1) ? 8 : 0,
                        height: 30,
                      }}
                    />
                  </Tooltip>
                  <Typography
                    variant='body2'
                    sx={{
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      color: theme =>
                        index === (data.length - 1)
                          ? theme.palette.text.primary
                          : (item.progressColor === 'info' || item.progressColor === 'secondary')
                            ? theme.palette.primary.main
                            : // eslint-disable-next-line lines-around-comment
                              // @ts-ignore
                            theme.palette.common.white
                    }}
                  >
                    {item.progressData}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{overflowX: 'auto', border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px'}}>
              <Table>
                <TableHead sx={{p: 0}}>
                  <TableRow sx={{backgroundColor: 'customColors.tableHeaderBg'}}>
                    <TableCell colSpan={3} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important', ml: -4}} variant={'h6'}
                                  color='text.primary'>{t("Name")}</Typography>
                    </TableCell>
                    <TableCell colSpan={1} align={'right'} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important'}} variant={'h6'} color='text.primary'>
                        {t("Payable")}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={1} align={'right'} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important', mr: -4}}
                                  variant={'h6'}>{t("Balance")}</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={3} style={{padding: '8px'}}>
                        <Box sx={{p: 0, display: 'flex', alignItems: 'center'}}>
                          <Typography variant={'subtitle2'} color='text.primary'>{item.heading}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell colSpan={1} align={'right'} style={{padding: '8px'}}>
                        <Typography variant={'subtitle2'} color='text.primary'>
                          {item.payable}
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} align={'right'} style={{padding: '8px'}}>
                        <Typography variant={'subtitle2'}>{item.amount}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        }
      </CardContent>
    </Card>
  )
}

export default AnalyticsSupplierPayable

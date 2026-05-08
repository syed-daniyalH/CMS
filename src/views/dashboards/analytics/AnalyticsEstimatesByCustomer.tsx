// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import Avatar from "../../../@core/components/mui/avatar";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getEstimateStats} from "../../../store/dashboard";
import {defaultCurrencyCode, formatCurrency, getDateRange} from "../../../@core/utils/format";
import {useAuth} from "../../../hooks/useAuth";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppDefaults} from "../../../hooks/useAppDefaults";

interface DataType {
  title: string
  imgSrc: string
  subtitle: string
  trendNumber: number
}

const AnalyticsEstimatesByCustomer = () => {
  const  { t } = useTranslation();
  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(10, user);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const [data, setData] = useState<DataType[]>([]);
  const { defaultCurrency } = useAppDefaults();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getEstimateStats({
        FromDate: fromDate,
        ToDate: toDate
      }))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if((store.estimate_stats?.data??[]).length > 0) {
        let tempStats: DataType[] = [];
        for(let i = 0; i < (store.estimate_stats?.data??[]).length; i ++) {
          tempStats.push({
            title: `${formatCurrency(store.estimate_stats?.data[i].totalDraftedEstimateAmount??0, defaultCurrency?.code??defaultCurrencyCode)}`,
            subtitle: `${store.estimate_stats?.data[i].customerName}`,
            trendNumber: parseFloat(((store?.estimate_stats?.data[i].totalDraftedEstimateAmount??0)/(store?.estimate_stats?.totalDraftedEstimateAmount??0) * 100).toFixed(2)),
            imgSrc: ''
          })
        }

        setData(tempStats);
      }
    }


    return () => {
      isActive = false;
    }
  }, [store.estimate_stats])

  return (
    <Card>
      <CardHeader
        title={t('Customer Estimates')}
        subheader={t('Last 6 months estimates by customer')}
        sx={{px: 3, py: 2}}
      />

      <Divider />

      <CardContent>
        {
          store.loadingState.getEstimateStats &&
          <Box sx={{width: '100%', height: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <LinearProgress variant={'indeterminate'} sx={{width: '20%', height: 3}} />
            <Typography variant={'caption'} sx={{mt: 3}}>
              {t("loading...")}
            </Typography>
          </Box>
        }

        {
          !store.loadingState.getEstimateStats &&
          data.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                // '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== data.length - 1 ? 4.5 : undefined
              }}
            >
              <Avatar src={item.imgSrc} skin='light'
                      variant='circular'
                      color={'primary'}
                      sx={{width: 34, height: 34, mr: 4, fontSize: '3rem' }} />

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6'>{`${item.trendNumber}%`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })
        }

        {
          data?.length <= 0 &&
          <Typography variant={'body2'} sx={{width: '100%', textAlign: 'center'}}>
            {t("No Data Available!")}
          </Typography>
        }

      </CardContent>
    </Card>
  )
}

export default AnalyticsEstimatesByCustomer

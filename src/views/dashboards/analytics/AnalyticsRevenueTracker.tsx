// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import {useTheme} from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import {ApexOptions} from 'apexcharts'

// ** Type Import
import {ThemeColor} from 'src/@core/layouts/types'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import {hexToRGBA} from 'src/@core/utils/hex-to-rgba'
import {useTranslation} from "react-i18next";
import Divider from "@mui/material/Divider";
import {useEffect, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import {getDateRange, globalDateFormat, kFormatter} from "../../../@core/utils/format";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

//@ts-ignore
import dateFormat from 'dateformat';
import LinearProgress from "@mui/material/LinearProgress";

interface DataType {
  title: string
  subtitle: string
  avatarIcon: string
  avatarColor?: ThemeColor
}

const AnalyticsRevenueTracker = () => {
  // ** Hook
  const theme = useTheme()
  const {user} = useAuth();
  let {fromDate, toDate} = getDateRange(7, user);
  const store = useSelector((state: RootState) => state.dashboard)
  const {t} = useTranslation();
  const [percentage, setPercentage] = useState<number>(0);
  const [recoveries, setRecoveries] = useState<number>(0);
  const [data, setData] = useState<DataType[]>([]);

  const options: ApexOptions = {
    chart: {
      sparkline: {enabled: true}
    },
    stroke: {dashArray: 10},
    labels: [t('Total Recoveries')],
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: {type: 'none'}
      },
      active: {
        filter: {type: 'none'}
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.primary.main]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: {size: '60%'},
        track: {background: 'transparent'},
        dataLabels: {
          name: {
            offsetY: -15,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h1.fontSize as string
          }
        }
      }
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0
            }
          }
        }
      }
    ]
  }


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (store.revenue_stats.length > 0) {
        let totalSales = 0;
        let totalRecoveries = 0;

        for (let i = 0; i < (store.revenue_stats ?? []).length; i++) {
          totalSales += (store.revenue_stats[i].totalSales ?? 0);
          totalRecoveries += (store.revenue_stats[i].totalRecoveries ?? 0);
        }

        setPercentage(parseFloat(((totalRecoveries/totalSales) * 100).toFixed(2)))

        setRecoveries(totalRecoveries)

        setData([
          {
            subtitle: `${kFormatter(totalSales)}`,
            title: t('Total Sales'),
            avatarIcon: 'tabler:trending-up'
          },
          {
            subtitle: `${kFormatter(totalRecoveries)}`,
            avatarColor: 'success',
            title: t('Total Recoveries'),
            avatarIcon: 'tabler:cash'
          },
          {
            subtitle: `${kFormatter(totalSales-totalRecoveries)}`,
            title: t('Balance'),
            avatarColor: 'warning',
            avatarIcon: 'tabler:clock'
          }
        ]);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.revenue_stats])


  return (
    <Card sx={{mt: 1, mr: 1}}>
      <CardHeader
        title={t('Revenue Tracker')}
        subheader={t(`Revenue tracker for the current year `)+(`${dateFormat(new Date(fromDate), (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(new Date(toDate), (user?.dateFormat??globalDateFormat).toLowerCase())}`) + "."}
        sx={{px: 3, py: 2}}
      />
      <Divider/>
      <CardContent>
        {
          store.loadingState.getRevenueStats &&
          <Box sx={{width: '100%', height: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <LinearProgress variant={'indeterminate'} sx={{width: '20%', height: 3}} />
            <Typography variant={'caption'} sx={{mt: 3}}>
              {t("loading...")}
            </Typography>
          </Box>
        }
        {
          !(store.loadingState.getRevenueStats) &&
          <Grid container spacing={6}>
            <Grid item xs={12} sm={5}>
              <Typography variant='h1'>{kFormatter(recoveries)}</Typography>
              <Typography sx={{mb: 6, color: 'text.secondary'}}>{t("Total Recoveries")}</Typography>
              {data.map((item: DataType, index: number) => (
                <Box
                  key={index}
                  sx={{display: 'flex', alignItems: 'center', mb: index !== data.length - 1 ? 4 : undefined}}
                >
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{mr: 4, width: 34, height: 34}}
                  >
                    <Icon icon={item.avatarIcon}/>
                  </CustomAvatar>
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Typography variant='h6'>{item.title}</Typography>
                    <Typography variant='body2' sx={{color: 'text.disabled'}}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={7} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {
                percentage > 0 &&
                <ReactApexcharts type='radialBar' height={325} options={options} series={[percentage]}/>
              }
            </Grid>
          </Grid>
        }
      </CardContent>
    </Card>
  )
}

export default AnalyticsRevenueTracker

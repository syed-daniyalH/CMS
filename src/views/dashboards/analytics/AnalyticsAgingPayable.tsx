// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'


// ** Util Import
import {getPayableAging} from "../../../store/dashboard";
import {AppDispatch, RootState} from "../../../store";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../../../hooks/useAuth";
import {useEffect, useState} from "react";
import {getDateRange, kFormatter} from "../../../@core/utils/format";
import {useTranslation} from "react-i18next";

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const AnalyticsAgingPayable = () => {
  // ** State
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { user } = useAuth();
  const [barSeries, setBarSeries] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      let { toDate } = getDateRange(8, user);
      dispatch(
        getPayableAging({
          ToDate: toDate
        })
      );

    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.payable_aging_data) {
        setBarSeries([{name: t("Paid"), data: [store.payable_aging_data?.currentAmount??0, store.payable_aging_data?.last30Amount??0, store.payable_aging_data?.last60Amount??0, store.payable_aging_data?.above60Amount??0]}])
      }
    }


    return () => {
      isActive = false;
    }
  }, [store.payable_aging_data])

  // ** Hooks & Var
  const theme = useTheme()

  const barOptions: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: {
      enabled: true
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 0.5,
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    colors: [theme.palette.success.light, theme.palette.info.light, theme.palette.warning.light, theme.palette.error.light],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: [theme.palette.success.dark, theme.palette.info.dark, theme.palette.warning.dark, theme.palette.error.dark], // or any color you want to fade to
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    legend: {
      show: false,
      offsetY: -5,
      offsetX: -30,
      position: 'top',
      fontSize: '13px',
      horizontalAlign: 'left',
      fontFamily: theme.typography.fontFamily,
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 4,
        horizontal: 10
      },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'ltr' ? -4 : 5
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 8,
        columnWidth: '25%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: { show: false }
      },
      padding: {
        left: -15,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      crosshairs: { opacity: 0 },
      axisBorder: { show: false },
      categories: [t('Current'), '1-30', '30-60', '60+'],
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        },
        formatter(val: number, opts?: any): string | string[] {
          return kFormatter(val);
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          chart: { height: 321 },
          plotOptions: {
            bar: { columnWidth: '30%' }
          }
        }
      },
      {
        breakpoint: 1380,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      },
      {
        breakpoint: 1290,
        options: {
          chart: { height: 421 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 321 },
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: 680,
        options: {
          plotOptions: {
            bar: { columnWidth: '30%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: 450,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <Grid container>
        <Grid
          item
          sm={12}
          xs={12}
          sx={{
            '& .apexcharts-series[rel="1"]': { transform: 'translateY(-6px)' },
            '& .apexcharts-series[rel="2"]': { transform: 'translateY(-9px)' }
          }}
        >
          <CardHeader title={<Typography variant={'h4'}>{t('Aging-Payable')}</Typography>} sx={{p: 3,backgroundColor: 'customColors.tableHeaderBg'}} />
        </Grid>
        <StyledGrid
          item
          sm={12}
          xs={12}
          sx={{
            '& .apexcharts-series[rel="1"]': { transform: 'translateY(-6px)' },
            '& .apexcharts-series[rel="2"]': { transform: 'translateY(-9px)' }
          }}
        >
          <CardContent>
            {
              (barSeries).length > 0 &&
              <ReactApexcharts type='bar' height={301} series={barSeries} options={barOptions}/>
            }
          </CardContent>
        </StyledGrid>
      </Grid>
    </Card>
  )
}

export default AnalyticsAgingPayable

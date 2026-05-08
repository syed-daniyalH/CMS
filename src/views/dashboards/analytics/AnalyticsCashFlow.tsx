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
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect, useState} from "react";
import {defaultCurrencyCode, formatCurrency, getDateRange, kFormatter} from "../../../@core/utils/format";
import {getCashFlowChartStats} from "../../../store/dashboard";
import {useAuth} from "../../../hooks/useAuth";
import {useAppDefaults} from "../../../hooks/useAppDefaults";
import DateViewFormat from "../../../@core/components/date-view";

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const AnalyticsCashFlow = () => {
  // ** State

  // ** Hooks & Var
  const { t } = useTranslation();
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { user } = useAuth();
  const { defaultCurrency } = useAppDefaults();

  const [barSeries, setBarSeries] = useState<any[]>([]);
  const [labels, setLabels] = useState<string[]>([]);


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      let { fromDate, toDate } = getDateRange(8, user);

      dispatch(
        getCashFlowChartStats({
          FromDate: fromDate,
          ToDate: toDate,
          type: 'month'
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
      let tempLabels: string[] = [];
      let data = [];

      for(let i = 0; i < (store.cash_flow_data?.data??[]).length; i++) {
        data.push(store.cash_flow_data?.data[i].closing);
        tempLabels.push(`${store.cash_flow_data?.data[i].month}-${store.cash_flow_data?.data[i].year}`);
      }

      setLabels(tempLabels)
      setBarSeries([
        {
          name: t('Cash'),
          data: data
        }
      ])
    }


    return () => {
      isActive = false;
    }
  }, [store.cash_flow_data])

  const barOptions: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: {
      enabled: true,
      custom: function ({ _series, seriesIndex, dataPointIndex, w }) {
        let data = store.cash_flow_data?.data[store.cash_flow_data?.data.findIndex((e: any) => `${e.month}-${e.year}` === w.globals.labels[dataPointIndex])];
        return `<div style="background: #fff; display: flex; flex-direction: column; padding: 10px; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
                <strong>${w.globals.labels[dataPointIndex]}</strong>
                <hr style="width: 100%;"/>
                <span style="color: green"><strong>${t("Incoming")}:</strong> ${formatCurrency(data.incoming, defaultCurrency?.code??defaultCurrencyCode)}</span>

                <span style="color: darkred"><strong>${t("Outgoing")}:</strong> ${formatCurrency(data.outgoing, defaultCurrency?.code??defaultCurrencyCode)}</span>

                <span><strong>${t("Closing")}:</strong> ${formatCurrency(data.closing, defaultCurrency?.code??defaultCurrencyCode)}</span>

              </div>`;
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    colors: [theme.palette.warning.light],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: [theme.palette.primary.light, theme.palette.warning.light, theme.palette.primary.dark], // or any color you want to fade to
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    legend: {
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
        borderRadius: 8,
        columnWidth: '40%',
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
      offsetX: 20,
      offsetY: 20,
      axisTicks: { show: false },
      crosshairs: { opacity: 0 },
      axisBorder: { show: false },
      categories: labels,
      labels: {
        rotate: 30,
        rotateAlways: true,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      labels: {
        formatter(val: number, _opts?: any): string | string[] {
          return kFormatter(val);
        },
        offsetX: -15,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          chart: { height: 321 },
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: 1380,
        options: {
          plotOptions: {
            bar: { columnWidth: '55%' }
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
            bar: { columnWidth: '40%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      },
      {
        breakpoint: 680,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      },
      {
        breakpoint: 450,
        options: {
          plotOptions: {
            bar: { columnWidth: '55%' }
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
          <CardHeader title={<Typography variant={'h4'}>{t('Cashflow')}</Typography>} sx={{p: 3,backgroundColor: 'customColors.tableHeaderBg'}} />
        </Grid>
        <StyledGrid
          item
          sm={8}
          xs={12}
          sx={{
            '& .apexcharts-series[rel="1"]': { transform: 'translateY(-6px)' },
            '& .apexcharts-series[rel="2"]': { transform: 'translateY(-9px)' }
          }}
        >
          <CardContent>
            <ReactApexcharts type='bar' height={301} series={barSeries} options={barOptions} />
          </CardContent>
        </StyledGrid>
        {
          <Grid item xs={12} sm={4}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'end',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >

              <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
                {t("Cash as on ")}<DateViewFormat date={store.cash_flow_data_params?.FromDate} />
              </Typography>

              <Typography variant='h6' sx={{ mb: 6 }}>
                {formatCurrency(store.cash_flow_data.opening, defaultCurrency?.code??defaultCurrencyCode)}
              </Typography>

              <Typography variant='body1' sx={{ mb: 1, color: 'success.main' }}>
                {t("Incoming")}
              </Typography>

              <Typography variant='h6' sx={{ mb: 6 }}>
                {formatCurrency(store.cash_flow_data.incoming, defaultCurrency?.code??defaultCurrencyCode)}
              </Typography>

              <Typography variant='body1' sx={{ mb: 1, color: 'error.main' }}>
                {t("Outgoing")}
              </Typography>

              <Typography variant='h6' sx={{ mb: 6 }}>
                {formatCurrency(store.cash_flow_data.outgoing, defaultCurrency?.code??defaultCurrencyCode)}
              </Typography>


              <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
                {t("Cash as on ")} <DateViewFormat date={store.cash_flow_data_params?.ToDate} />
              </Typography>

              <Typography variant='h6' sx={{ mb: 1 }}>
                {formatCurrency(store.cash_flow_data.closing, defaultCurrency?.code??defaultCurrencyCode)}
              </Typography>

            </CardContent>
          </Grid>
        }
      </Grid>
    </Card>
  )
}

export default AnalyticsCashFlow

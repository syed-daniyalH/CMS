// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/core/utils/hex-to-rgba'
import CardHeader from "@mui/material/CardHeader";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect, useState} from "react";
import {getReceivableStats} from "../../../store/dashboard";


const AnalyticsReceivableOverdue = () => {
  // ** Hook
  const theme = useTheme()

  const [series, setSeries] = useState<number[]>([]);

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          if(store.receivable_data) {
            setSeries([parseFloat((store.receivable_data?.totalReceivables??0).toFixed(2)), parseFloat((store.receivable_data?.totalPendingReceivables??0).toFixed(2)), parseFloat((store.receivable_data?.totalReceived??0).toFixed(2))])
          }
        }


      return () => {
        isActive = false;
      }
    }, [store.receivable_data])

  const options: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true
      }
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.primary.main,
    ],
    stroke: { width: 0 },
    legend: {
      show: true,
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
    tooltip: { enabled: false },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme.palette.text.primary, theme.palette.text.primary]
      },
      background: {
        enabled: true,
        borderColor: theme.palette.text.secondary,
        foreColor: theme.palette.text.primary,
        dropShadow: {
          enabled: false
        }
      },
      formatter(val: string | number | number[], opts?: any): string | number {
        return `${parseFloat(`${val}`).toFixed(2)}%`
      }
    },
    labels: ['Total Receivable', 'Pending Receivable', 'Received'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        bottom: -22
      }
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { width: 200, height: 249 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { width: 150, height: 199 }
        }
      }
    ]
  }



  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(!store.receivable_data_success) {
        dispatch(
          getReceivableStats({
            ToDate: new Date()
          })
        );
      }

    }


    return () => {
      isActive = false;
    }
  }, [dispatch])

  return (
    <Card>
      <CardHeader title={<Typography variant={'h4'}>{'Receivable Overdue'}</Typography>} sx={{p: 3, mb: 2,backgroundColor: 'customColors.tableHeaderBg'}} />

      <CardContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        {
          series.length > 0 &&
          <ReactApexcharts type='donut' series={series} options={options}/>
        }
      </CardContent>
    </Card>
  )
}

export default AnalyticsReceivableOverdue

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Icon from 'src/core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/core/utils/hex-to-rgba'
import CardHeader from "@mui/material/CardHeader";

const series = [32, 41, 41, 70]

const AnalyticsAssetVLiability = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    colors: [
      theme.palette.success.main,
      hexToRGBA(theme.palette.error.main, 1),
      hexToRGBA(theme.palette.warning.main, 1),
      hexToRGBA(theme.palette.info.main, 1)
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ['Land', 'Loan', 'Machinery', 'Salaries'],
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
        top: -22,
        bottom: -18
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        expandOnClick: false,
        donut: {
          size: '73%',
          labels: {
            show: true,
            name: {
              offsetY: 22,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: -17,
              fontWeight: 500,
              formatter: val => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize as string
            },
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize as string
            }
          }
        }
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

  return (
    <Card>
      <CardHeader title='Assets VS Liabilities' />
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
          <ReactApexcharts type='donut' width={'100%'} height={350} series={series} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsAssetVLiability

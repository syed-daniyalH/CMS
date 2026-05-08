// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import Avatar from "../../../@core/components/mui/avatar";

interface DataType {
  title: string
  imgSrc: string
  subtitle: string
  trendNumber: number
  trend?: 'positive' | 'negative'
}

const data: DataType[] = [
  {
    title: '$8.45k',
    trendNumber: 25.8,
    subtitle: 'Zaboor Khawazmi',
    imgSrc: '/images/avatars/1.png'
  },
  {
    title: '$7.78k',
    trend: 'negative',
    trendNumber: 16.2,
    subtitle: 'Lila Bansari',
    imgSrc: '/images/avatars/2.png'
  },
  {
    title: '$6.48k',
    subtitle: 'John Red',
    trendNumber: 12.3,
    imgSrc: '/images/avatars/3.png'
  },
  {
    title: '$5.12k',
    trend: 'negative',
    trendNumber: 11.9,
    subtitle: 'Ruhi Javeed',
    imgSrc: '/images/avatars/4.png'
  },
  {
    title: '$4.45k',
    subtitle: 'Rahul Prem',
    trendNumber: 16.2,
    imgSrc: '/images/avatars/5.png'
  },
  {
    title: '$3.90k',
    subtitle: 'Aliza',
    trendNumber: 14.8,
    imgSrc: '/images/avatars/6.png'
  }
]

const AnalyticsSalesByCountries = () => {
  return (
    <Card>
      <CardHeader
        title='Sales by Salesman'
        subheader='Monthly Sales Overview'
        action={
          <OptionsMenu
            options={['Last Week', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        {data.map((item: DataType, index: number) => {
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

              {/*<img width={34} height={34} src={item.imgSrc} alt={item.subtitle} />*/}

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
                    alignItems: 'center',
                    '& > *': { color: item.trend === 'negative' ? 'error.main' : 'success.main' }
                  }}
                >
                  <Icon
                    fontSize='1.25rem'
                    icon={item.trend === 'negative' ? 'tabler:chevron-down' : 'tabler:chevron-up'}
                  />
                  <Typography variant='h6'>{`${item.trendNumber}%`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesByCountries

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import { Theme, useTheme } from '@mui/material/styles'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Custom Components Imports
import { hexToRGBA } from 'src/core/utils/hex-to-rgba'
import {brandConfigs} from "../../../configs/branding";

interface SwiperData {
  img: string
  title: string
  description: string
}

const data: SwiperData[] = [
  {
    title: `${process.env.NEXT_PUBLIC_APP_NAME}-Commerce`,
    img: (brandConfigs[process.env.NEXT_PUBLIC_APP_NAME??"Indraaj"] || brandConfigs["indraaj"]).commerceLogo??'/images/logos/indraaj-commerce.png',
    description: `${process.env.NEXT_PUBLIC_APP_NAME} integrates with WooCommerce, Shopify, and WordPress, syncing sales, inventory, and customer transactions. This ensures real-time updates for accurate revenue tracking, expense management, and streamlined financial reporting.`
  },
  {
    title: `${process.env.NEXT_PUBLIC_APP_NAME}-Payroll`,
    img: (brandConfigs[process.env.NEXT_PUBLIC_APP_NAME??"Indraaj"] || brandConfigs["indraaj"]).payrollLogo??'/images/logos/payroll-logo.png',
    description: "Indraaj’s integrated payroll effortlessly syncs with its accounting system, simplifying compensation and financial tracking. Generate payslips, manage employee records, and get real-time insights into salary expenses and tax liabilities."
  },
  {
    title: 'Mobile Application',
    img: (brandConfigs[process.env.NEXT_PUBLIC_APP_NAME??"Indraaj"] || brandConfigs["indraaj"]).mobileLogo??`/images/logos/indraaj-mobile-logo.png`,
    description: `The ${process.env.NEXT_PUBLIC_APP_NAME} mobile app lets users easily create invoices, track expenses, and view real-time financial dashboards. With cloud backup, multi-user access, and automated reports, it offers a complete accounting solution on the go.`
  },
  {
    title: 'Multi-Currency',
    img: (brandConfigs[process.env.NEXT_PUBLIC_APP_NAME??"Indraaj"] || brandConfigs["indraaj"]).currencyLogo??'/images/logos/multi-currency-logo.png',
    description: `${process.env.NEXT_PUBLIC_APP_NAME}’s multi-currency feature enables businesses to manage transactions in multiple currencies with real-time exchange rate adjustments. It simplifies invoicing, payment tracking and financial reporting, ensuring accuracy for global businesses.`
  }
]

const Slides = ({ theme }: { theme: Theme }) => {
  return (
    <>
      {data.map((slide: SwiperData, index: number) => {
        return (
          <Box
            key={index}
            className='keen-slider__slide'
            sx={{ p: 6, '& .MuiTypography-root': { color: 'common.white' }, height: '220px' }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} sx={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{height: '100px'}}>
                  <img src={slide.img} alt={slide.title} style={{maxHeight: '100px'}}/>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12}
                    sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <Typography variant='h6' sx={{mb: 1.5}}>
                  {slide.title}
                </Typography>
                <Typography variant='caption' sx={{
                  mb: 2.5,
                  textAlign: 'center',
                  ontWeight: 300,
                  color: 'text.disabled',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'normal',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {slide.description}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )
      })}
    </>
  )
}

const AppsForYou = () => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const theme = useTheme()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${hexToRGBA(theme.palette.primary.main, 0.9)}, ${hexToRGBA(theme.palette.primary.main, 0.8)}, ${hexToRGBA(theme.palette.primary.main, 0.7)})`}}>
      {loaded && instanceRef.current && (
        <Box className='swiper-dots' sx={{ top: 2, left: 12, position: 'absolute' }}>
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
            return (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({ active: currentSlide === idx })}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  mr: `${theme.spacing(3.5)} !important`,
                  '& .MuiBadge-dot': {
                    width: '8px !important',
                    height: '8px !important',
                    backgroundColor: `${hexToRGBA(theme.palette.common.white, 0.4)} !important`
                  },
                  '&.active .MuiBadge-dot': {
                    backgroundColor: `${theme.palette.common.white} !important`
                  }
                }}
              />
            )
          })}
        </Box>
      )}
      <Box ref={sliderRef} className='keen-slider'>
        <Slides theme={theme} />
      </Box>
    </Card>
  )
}

export default AppsForYou

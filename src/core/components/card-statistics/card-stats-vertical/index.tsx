// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Import
import { CardStatsVerticalProps } from 'src/core/components/card-statistics/types'

// ** Custom Component Import
import CustomChip from 'src/core/components/mui/chip'
import {Box} from "@mui/material";
import Icon from "../../icon";
import CustomAvatar from "../../mui/avatar";

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const {
    sx,
    stats,
    title,
    chipText,
    subtitle,
    chipColor = 'primary',
    avatarIcon,
    avatarColor
  } = props

  const RenderChip = chipColor === 'default' ? Chip : CustomChip

  return (
    <Card sx={{ ...sx, position: 'relative', mt: 1, ml: 1, width: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant={'h3'} sx={{ mb: 1, color: 'text.secondary' }}>{stats}</Typography>
        <Typography variant='body1' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='caption' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        {
          !!(chipText) &&
          <RenderChip
            size='small'
            label={chipText}
            color={chipColor}
            {...(chipColor === 'default'
              ? {sx: {borderRadius: '4px', color: 'text.secondary'}}
              : {rounded: true, skin: 'light'})}
          />
        }
      </CardContent>
      <Box sx={{position: 'absolute', top: 20, right: 10}}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color={avatarColor}
          sx={{ mb: 3.5, width: 32, height: 32 }}
        >
          <Icon icon={avatarIcon} fontSize={'1.35rem'}  />
        </CustomAvatar>
      </Box>
    </Card>
  )
}

export default CardStatsVertical

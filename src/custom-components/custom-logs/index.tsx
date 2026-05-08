// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Hook Import
import {getTimeAgo} from "../../@core/utils/format";
import {ThemeColor} from "../../@core/layouts/types";
import {getInitials} from "../../@core/utils/get-initials";

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})


const CustomActivityLogs = ({ logData }: any) => {
  // ** Hook & Var

  const renderClient = (log: any) => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]

    if ((log.imageUrl??"").length) {
      return <CustomAvatar src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${log.imageUrl}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
    }  else {
      return (
        <CustomAvatar
          skin='light'
          color={color as ThemeColor}
          sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
        >
          {getInitials(log.transactionByName ? log.transactionByName : 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  return (
    <Box
      sx={{
        maxHeight: '73vh', // Restricts height to viewport
        overflowY: 'auto',  // Enables vertical scrolling
        overflowX: 'hidden', // Optional: Prevents horizontal scrolling
      }}
    >
      <Timeline
        sx={{
          padding: 0, // Removes extra padding if unnecessary
        }}
      >
        {logData && logData.length > 0 ? (
          logData.map((log: any, index: any) => (
            <TimelineItem key={log.id}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    log.status === 'UPDATE'
                      ? 'error'
                      : log.status === 'ADD'
                      ? 'success'
                      : 'info'
                  }
                  variant="outlined"
                />
                {index < logData.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ mr: 2 }} variant="h6">
                    {log.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {getTimeAgo(log.transactionTime)}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {new Date(log.transactionTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>

                <Box sx={{ display: 'flex' }}>
                  {renderClient(log)}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {log.transactionByName}
                    </Typography>
                    <Typography variant="caption">
                      {log.tableName}# {log.code} was {log.status.toLowerCase()}.
                    </Typography>
                  </Box>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              No data found
            </Typography>
          </Box>
        )}
      </Timeline>
    </Box>
  )
}

export default CustomActivityLogs

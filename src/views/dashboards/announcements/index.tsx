// ** MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Hook Import
import {getTimeAgo} from "src/core/utils/format";
import { useState } from 'react'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})


const AnnouncementsTab = () => {
  // ** Hook & Var
  const  [announcements, setAnnouncements] = useState<any>([]);

  return (
    <Box
      sx={{
        maxHeight: '100vh', // Restricts height to viewport
        overflowY: 'auto',  // Enables vertical scrolling
        overflowX: 'hidden', // Optional: Prevents horizontal scrolling
      }}
    >
      <Timeline
        sx={{
          padding: 0, // Removes extra padding if unnecessary
        }}
      >
        {(announcements?.length??0) > 0 ? (
          announcements.map((log: any, index: any) => (
            <TimelineItem key={log.id}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    log.isViewed
                      ? 'success'
                        : 'info'
                  }
                  variant="outlined"
                />
                {index < announcements.length - 1 && <TimelineConnector />}
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
                    {log.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {getTimeAgo(log.createdAt??"")}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {new Date(log.createdAt??"").toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>

                <Box sx={{ display: 'flex' }}>
                  <Avatar src={!!log.senderImage ? `${log.senderImage}` :'/images/avatars/2.png'} sx={{ width: '2rem', height: '2rem', mr: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {log.senderUserName??""}
                    </Typography>
                    <Typography variant="caption">
                      {log.description}.
                    </Typography>
                  </Box>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              No announcement found
            </Typography>
          </Box>
        )}
      </Timeline>
    </Box>
  )
}

export default AnnouncementsTab

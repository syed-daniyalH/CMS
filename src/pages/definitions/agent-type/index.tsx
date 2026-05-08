// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { Box, Divider } from '@mui/material'

// ** Components Imports
import TableAgentType from 'src/views/definitions/agent-type/list/TableAgentType'
import Icon from 'src/core/components/icon'
import CustomBackdrop from 'src/core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useState } from 'react'
import AgentTypeForm, { AgentTypeSchema } from 'src/views/definitions/agent-type/form'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../core/utils/hex-to-rgba'
import Card from '@mui/material/Card'

const AgentTypeList = () => {
  const { t } = useTranslation()
  const store = useSelector((state: RootState) => state.agentType)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AgentTypeSchema | null>(null)

  const toggleForm = (data?: AgentTypeSchema | null) => {
    if (data) {
      setSelectedRow(data)
    } else {
      setSelectedRow(null)
    }

    setOpenForm(!openForm)
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
      <Box
        sx={{
          py: 1,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'customColors.trackBg'
        }}
      >
        <Typography variant={'h5'}>{t('Agent Types')}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <IconButton
            size='small'
            onClick={() => toggleForm(null)}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'common.white',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: theme => hexToRGBA(`${theme.palette.primary.main}`, 0.76)
              }
            }}
          >
            <Icon icon='tabler:plus' fontSize='1.25rem' />
          </IconButton>

          <IconButton
            size='small'
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'customColors.bodyBg',
              ml: 2,
              backgroundColor: 'text.primary',
              '&:hover': {
                backgroundColor: theme => hexToRGBA(`${theme.palette.text.primary}`, 0.96)
              }
            }}
          >
            <Icon icon='tabler:adjustments' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>

      <Divider />
      <TableAgentType toggleForm={toggleForm} />

      <CustomBackdrop open={store.loadingState.getData ?? false} />

      {openForm && <AgentTypeForm open={openForm} toggle={toggleForm} data={selectedRow} />}
    </Card>
  )
}

AgentTypeList.contentHeightFixed = true

AgentTypeList.acl = {
  action: 'read',
  subject: 'PropType'
}

export default AgentTypeList

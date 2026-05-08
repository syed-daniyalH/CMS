// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { Box, Divider } from '@mui/material'

// ** Components Imports
import TablePropStatus from 'src/views/definitions/prop-status/list/TablePropStatus'
import Icon from 'src/core/components/icon'
import CustomBackdrop from 'src/core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useState } from 'react'
import PropStatusForm, { PropStatusSchema } from 'src/views/definitions/prop-status/form'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { hexToRGBA } from '../../../core/utils/hex-to-rgba'

const PropertyStatusList = () => {
  const { t } = useTranslation()
  const store = useSelector((state: RootState) => state.propStatus)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<PropStatusSchema | null>(null)


  const toggleForm = (data?: PropStatusSchema | null) => {
    if (data) {
      setSelectedRow(data)
    } else {
      setSelectedRow(null)
    }

    setOpenForm(!openForm)

  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
      <Box sx={{
        py: 1,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'customColors.trackBg'
      }}>
        <Typography variant={'h5'}>
          {t('Property Status')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <IconButton
            size="small"
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
            <Icon icon="tabler:plus" fontSize="1.25rem" />
          </IconButton>

          <IconButton
            size="small"
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
            <Icon icon="tabler:adjustments" fontSize="1.25rem" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <TablePropStatus toggleForm={toggleForm} />

      <CustomBackdrop open={(store.loadingState.getData ?? false)} />

      {
        openForm &&
        <PropStatusForm open={openForm} toggle={toggleForm} data={selectedRow} />
      }

    </Card>
  )
}

PropertyStatusList.contentHeightFixed = true

PropertyStatusList.acl = {
  action: 'read',
  subject: 'PropStatues'
}

export default PropertyStatusList

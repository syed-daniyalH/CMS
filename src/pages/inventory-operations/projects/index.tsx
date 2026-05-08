// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { Box, Divider } from '@mui/material'

// ** Components Imports
import TableProjects from '../../../views/inventory-operations/projects/list/TableProjects'
import Icon from '../../../@core/components/icon'
import CustomBackdrop from '../../../@core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useState } from 'react'
import ProjectsForm, { ProjectsSchema } from '../../../views/inventory-operations/projects/form'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../@core/utils/hex-to-rgba'
import Card from '@mui/material/Card'
import CustomTextField from '../../../@core/components/mui/text-field'
import Collapse from '@mui/material/Collapse'

const ProjectsList = () => {
  const { t } = useTranslation()
  const store = useSelector((state: RootState) => state.projects)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<ProjectsSchema | null>(null)
  const [value, setValue] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false)

  const toggleForm = (data?: ProjectsSchema | null) => {
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
        <Typography variant={'h5'}>{t('All Projects')}</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Collapse in={showSearch} orientation='horizontal' sx={{ flexGrow: 1, mx: 2 }}>
            <CustomTextField
              autoFocus
              value={value}
              placeholder='Press Enter to Search…'
              onChange={e => setValue(e.target.value ?? '')}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  console.log('Searching for:', value)
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <Icon fontSize='1.25rem' icon='tabler:search' />
                  </Box>
                ),
                endAdornment: (
                  <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => {
                    setValue('');
                    setShowSearch(prev => !prev);
                  }}>
                    <Icon fontSize='1.25rem' icon='tabler:x' />
                  </IconButton>
                )
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root > svg': { mr: 2 }
              }}
            />
          </Collapse>

          <Collapse in={!showSearch} orientation='horizontal' sx={{ flexGrow: 1 }}>
            <IconButton
              size='small'
              onClick={() => setShowSearch(prev => !prev)}
              sx={{
                p: '0.375rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => hexToRGBA(`${theme.palette.primary.main}`, 0.76)
                }
              }}
            >
              <Icon icon='tabler:search' fontSize='1.25rem' />
            </IconButton>
          </Collapse>

          <IconButton
            size='small'
            onClick={() => toggleForm(null)}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              ml: 2,
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
      <TableProjects toggleForm={toggleForm} />

      <CustomBackdrop open={store.loadingState.getData ?? false} />

      {openForm && <ProjectsForm open={openForm} toggle={toggleForm} data={selectedRow} />}
    </Card>
  )
}

ProjectsList.contentHeightFixed = true

ProjectsList.acl = {
  action: 'read',
  subject: 'Floors'
}

export default ProjectsList

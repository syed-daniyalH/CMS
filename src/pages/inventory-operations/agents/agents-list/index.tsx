// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { Box, Divider } from '@mui/material'

// ** Demo Components Imports
import TableAgents from 'src/views/inventory-operations/agents/agents-list/TableAgents'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomBackdrop from 'src/@core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useRouter } from 'next/navigation'
import { encodeParameters } from 'src/@core/utils/encrypted-params'
import Collapse from '@mui/material/Collapse'
import CustomTextField from '../../../../@core/components/mui/text-field'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../../@core/utils/hex-to-rgba'
import Card from '@mui/material/Card'
import TitleMenu from '../../../../@core/components/title-menu'


const AgentsList = () => {
  const { t } = useTranslation()
  const [openFilter, setOpenFilter] = useState<boolean>(false)


  const store = useSelector((state: RootState) => state.agents)
  const [value, setValue] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("All Agents");

  const router = useRouter()

  const toggleFilter = () => {
    setOpenFilter(!openFilter)
  }

  const onNewClick = (e: any, index: number) => {
    e.preventDefault()
    switch (index) {
      case 0:
        router.push(`/inventory-operations/agents/add-agents`)
        break
      case 1:
        router.push(`/system-import?query=${encodeParameters({ url: '/Agents', type: 'Agent' })}`)
        break

    }
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
        <TitleMenu onClick={(option: string) => {
          setSelectedType(option);
          // props.onMenuChange(option);
        }} options={[t("All Agents"), t("Active Agents"), t("In-Active Agents")] as string[]}
                   text={t(selectedType) as string}/>

        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Collapse in={showSearch} orientation="horizontal" sx={{ flexGrow: 1, mx: 2 }}>
            <CustomTextField
              autoFocus
              value={value}
              placeholder="Press Enter to Search…"
              onChange={e => setValue(e.target.value ?? '')}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  console.log('Searching for:', value)
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <Icon fontSize="1.25rem" icon="tabler:search" />
                  </Box>
                ),
                endAdornment: (
                  <IconButton size="small" title="Clear" aria-label="Clear" onClick={() => {
                    setValue('')
                    setShowSearch(prev => !prev)
                  }}>
                    <Icon fontSize="1.25rem" icon="tabler:x" />
                  </IconButton>
                )
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root > svg': { mr: 2 }
              }}
            />
          </Collapse>

          <Collapse in={!showSearch} orientation="horizontal" sx={{ flexGrow: 1 }}>
            <IconButton
              size="small"
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
              <Icon icon="tabler:search" fontSize="1.25rem" />
            </IconButton>
          </Collapse>

          <IconButton
            size="small"
            onClick={(e) => onNewClick(e, 0)}
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
      <TableAgents toggleFilter={toggleFilter} openFilter={openFilter} />


      <CustomBackdrop open={store.loadingState.getData ?? false} />

    </Card>
  )
}

AgentsList.contentHeightFixed = true

AgentsList.acl = {
  action: 'read',
  subject: 'Agents'
}

export default AgentsList

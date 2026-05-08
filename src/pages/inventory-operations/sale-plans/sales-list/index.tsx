// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import { Box, Divider } from '@mui/material'

// ** Demo Components Imports
import TableSalePlans from '../../../../views/inventory-operations/sale-plans/sales-list/TableSalePlans'
import { useState } from 'react'
import Icon from 'src/core/components/icon'
import CustomBackdrop from 'src/core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useRouter } from 'next/navigation'
import { encodeParameters } from 'src/core/utils/encrypted-params'
import Collapse from '@mui/material/Collapse'
import CustomTextField from '../../../../core/components/mui/text-field'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../../core/utils/hex-to-rgba'
import Card from '@mui/material/Card'

const SalePlansList = () => {
  const { t } = useTranslation()
  const [openFilter, setOpenFilter] = useState<boolean>(false)

  const [value, setValue] = useState<string>('')
  const [showSearch, setShowSearch] = useState(false)

  const store = useSelector((state: RootState) => state.salePlans)

  const router = useRouter()

  const toggleFilter = () => {
    setOpenFilter(!openFilter)
  }

  const onNewClick = (e: any, index: number) => {
    e.preventDefault()
    switch (index) {
      case 0:
        router.push(`/inventory-operations/sale-plans/add-sales`)
        break
      case 1:
        router.push(`/system-import?query=${encodeParameters({ url: '/Customers', type: 'Customer' })}`)
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
        <Typography variant={'h5'}>{t('Sale Plans')}</Typography>

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
                  <IconButton
                    size='small'
                    title='Clear'
                    aria-label='Clear'
                    onClick={() => {
                      setValue('')
                      setShowSearch(prev => !prev)
                    }}
                  >
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
      <TableSalePlans toggleFilter={toggleFilter} openFilter={openFilter} />

      <CustomBackdrop open={store.loadingState.getData ?? false} />
    </Card>
  )
}

SalePlansList.contentHeightFixed = true

SalePlansList.acl = {
  action: 'read',
  subject: 'SalePlans'
}

export default SalePlansList

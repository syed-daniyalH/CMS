// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

// ** Components
import Icon from 'src/@core/components/icon'
import CustomBackdrop from 'src/@core/components/loading'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import TableSectionType from 'src/views/crm/section-type/TableSectionType'
import { SectionTypeProvider } from 'src/views/crm/section-type/add-section-type/context/sectionContext'

// ** Store
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useRouter } from 'next/navigation'

const SectionTypeList = () => {
  const { t } = useTranslation()
  const store = useSelector((state: RootState) => state.sectionType)
  const router = useRouter()

  return (
    <SectionTypeProvider>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
        <Box
          sx={{
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'customColors.trackBg'
          }}
        >
          <Typography variant={'h5'}>{t('Section Types')}</Typography>

          <IconButton
            size='small'
            onClick={() => router.push('/crm/section-type/add-section-type')}
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
        </Box>

        <Divider />
        <TableSectionType />

        <CustomBackdrop open={store?.loadingState?.getData ?? false} />
      </Card>
    </SectionTypeProvider>
  )
}

export default SectionTypeList

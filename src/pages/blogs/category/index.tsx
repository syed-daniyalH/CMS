import { useState } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Icon from 'src/@core/components/icon'
import CustomBackdrop from 'src/@core/components/loading'
import { RootState } from 'src/store'
import CategoryTable from 'src/views/blogs/category/CategoryTable'
import CategoryFormDrawer, { BlogCategorySchema } from 'src/views/blogs/category/CategoryFormDrawer'

const BlogCategoryList = () => {
  const { t } = useTranslation()
  const store = useSelector((state: RootState) => state.blogCategory)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<BlogCategorySchema | null>(null)

  const toggleForm = (row?: BlogCategorySchema | null) => {
    setSelectedRow(row ?? null)
    setOpenForm(prev => !prev)
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
      <Box sx={{ py: 1, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'customColors.trackBg' }}>
        <Typography variant='h5'>{t('Blog Categories')}</Typography>

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
      </Box>

      <Divider />
      <CategoryTable toggleForm={toggleForm} />
      <CustomBackdrop open={store?.loadingState?.getData ?? false} />
      {openForm && <CategoryFormDrawer open={openForm} toggle={toggleForm} data={selectedRow} />}
    </Card>
  )
}

BlogCategoryList.contentHeightFixed = true

export default BlogCategoryList

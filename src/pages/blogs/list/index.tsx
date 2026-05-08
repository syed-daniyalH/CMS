import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { hexToRGBA } from 'src/core/utils/hex-to-rgba'
import Icon from 'src/core/components/icon'
import CustomBackdrop from 'src/core/components/loading'
import { RootState } from 'src/store'
import BlogTable from 'src/views/blogs/blog/BlogTable'

const BlogList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const store = useSelector((state: RootState) => state.blogs)

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
      <Box sx={{ py: 1, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'customColors.trackBg' }}>
        <Typography variant='h5'>{t('Blogs')}</Typography>

        <IconButton
          size='small'
          onClick={() => router.push('/blogs/add-blog')}
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
      <BlogTable />
      <CustomBackdrop open={store?.loadingState?.getData ?? false} />
    </Card>
  )
}

BlogList.contentHeightFixed = true

export default BlogList

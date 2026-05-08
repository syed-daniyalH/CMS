import Link from 'next/link'
import { Card, CardContent, Grid, Typography, IconButton, Divider } from '@mui/material'
import Icon from 'src/core/components/icon'

const SettingsIndexPage = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1 }}>
              Menu Settings
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
              Manage menu types and mapped menu nodes.
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <IconButton component={Link} href='/settings/menu-setting' sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: 1 }}>
              <Icon icon='tabler:settings-cog' />
              <Typography variant='body2' sx={{ ml: 2 }}>
                Open Menu Setting
              </Typography>
            </IconButton>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1 }}>
              Blog Taxonomy
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
              Manage blog categories and sub categories.
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <IconButton component={Link} href='/blogs/category' sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: 1 }}>
              <Icon icon='tabler:category' />
              <Typography variant='body2' sx={{ ml: 2 }}>
                Blog Category
              </Typography>
            </IconButton>
            <IconButton component={Link} href='/blogs/sub-category' sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: 1 }}>
              <Icon icon='tabler:list-details' />
              <Typography variant='body2' sx={{ ml: 2 }}>
                Blog Sub Category
              </Typography>
            </IconButton>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsIndexPage

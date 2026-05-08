// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {brandConfigs} from "../../../../../configs/branding";

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FooterContent = () => {
  // ** Var
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`© ${new Date().getFullYear()}, all copyright reserved `}
        {`by`}
        <Typography sx={{ ml: 1 }} target='_blank' href={process.env.NEXT_PUBLIC_WEB_URL??""} component={StyledCompanyName}>
          {process.env.NEXT_PUBLIC_APP_NAME}.com
        </Typography>
      </Typography>
    </Box>
  )
}

export default FooterContent

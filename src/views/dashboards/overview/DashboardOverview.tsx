// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomBackdrop from "src/@core/components/loading";
import {useTranslation} from "react-i18next";
import {Box, CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";
import CustomAvatar from 'src/@core/components/mui/avatar';
import Divider from "@mui/material/Divider";
import Icon from 'src/@core/components/icon'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {useState} from "react";
import Link from "next/link";
import AppsForYou from "./AppsForYou";
import QRCode from "react-qr-code";
import {brandConfigs} from "src/configs/branding";

const DashboardOverview = () => {

  const { t } = useTranslation();

  return (
    <Box sx={{p: 2, overflow: 'auto', maxHeight: 'calc(100vh - 160px)'}}>
      <Grid container spacing={6} className={'match-height'}>

        <Grid item xs={12} lg={8} md={8}>
          <Box sx={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography variant={'h3'} sx={{color: 'text.primary', fontWeight: 600, mb: 1}}>
                {t("GOOD MORNING!")}
              </Typography>
              <Typography variant={'body1'} sx={{color: 'text.primary', fontWeight: 300, mb: 1}}>
                {t("Your path to hassle-free accounting begins today.")}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{mb: 4}}/>

          <Grid container spacing={6} className={'match-height'}>
            <Grid item xs={12} lg={8} md={8}>
              <Card sx={{backgroundColor: '#00000000'}}>
                <Box sx={{backgroundColor: 'customColors.tableHeaderBg', borderRadius: '2px', px: 4, py: 4}}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} lg={5} md={5} sx={{position: 'relative'}}>
                      <CustomAvatar skin={'light'} src={`${process.env.NEXT_PUBLIC_WEB_URL}/assets/imgs/page/blog/img9.png`} variant={'rounded'} sx={{width: '100%', height: 150}} />
                      <Box sx={{position: 'absolute', top: '40%', left: '45%'}}>
                        <Box sx={{width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '300px', backgroundColor: theme => `${theme.palette.background.paper}`}}>
                          <Icon icon={'tabler:player-play-filled'}/>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} lg={7} md={7}>
                      <Typography variant={'h5'} sx={{color: 'text.primary', fontWeight: '900'}}>
                        {t(`Getting Started With ${process.env.NEXT_PUBLIC_APP_NAME} Overview`)}
                      </Typography>

                      <Typography variant={'body1'} sx={{color: 'text.primary', mt: 4}}>
                        {t(`Watch this video to acquire an in-depth insight into ${process.env.NEXT_PUBLIC_APP_NAME}, uncovering its core features and how it enhances financial management for businesses of all types.`)}
                      </Typography>

                      <Typography variant={'body2'} sx={{mt: 4, color: 'customColors.linkColor', textDecoration: 'underline', fontWeight: '300'}}>
                        {t(`Watch & Learn`)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4} md={4}>
              <Card sx={{backgroundColor: '#00000000', p: 4}}>
                <Typography variant={'h5'} sx={{color: 'text.primary', fontWeight: '600'}}>
                  {t(`For Detailed Videos`)}
                </Typography>
                <Typography variant={'body2'} sx={{color: 'text.primary', fontWeight: '300'}}>
                  {t(`Visit to our youtube channel`)}
                </Typography>
                <Divider sx={{mt: 2}}/>
                <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                  <CustomAvatar src={'/images/logos/youtube.png'} variant={'rounded'} sx={{width: 80, height: 80, mr: 4}} />
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                    <Typography variant={'body2'} sx={{color: 'text.primary', fontWeight: '600'}}>
                      {t(`${process.env.NEXT_PUBLIC_APP_NAME} | Best Cloud Accounting Software`)}
                    </Typography>
                    <Link href={process.env.NEXT_PUBLIC_YT_URL??"/"} target={'_blank'} style={{textDecoration: 'none'}}>
                      <Typography variant={'body2'} sx={{color: 'customColors.linkColor', textDecoration: 'underline', fontWeight: '300'}}>
                        {t(`Visit for more detail`)}
                      </Typography>
                    </Link>
                  </Box>

                </Box>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{mt: 4}}/>

          <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', mt: 6}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
              <Typography variant={'h3'} sx={{color: 'text.primary', fontWeight: 600, mb: 1}}>
                {t("Let's Get Started")}
              </Typography>
              <Typography variant={'body1'} sx={{color: 'text.primary', fontWeight: 300, mb: 1}}>
                {t("Manage your accounting effortlessly from day one.")}
              </Typography>
            </Box>
          </Box>

        </Grid>

        <Grid item xs={12} lg={4} md={4}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Card>
              <CardHeader title={t(`${process.env.NEXT_PUBLIC_APP_NAME}: Apps For you`)} sx={{p: theme => theme.spacing(3, 4)}} />

              <Divider />

              <CardContent sx={{p: 0}} style={{padding: 0}}>
                <AppsForYou />
              </CardContent>
            </Card>


            <Card sx={{mt: 4, paddingBottom: 0}} >
              <CardHeader title={t('Get Into Your Mobile App')} sx={{p: theme => theme.spacing(3, 4)}} />

              <Divider />

              <CardContent sx={{p: 0}} style={{paddingBottom: '0px'}}>
                <Box sx={{p: theme => theme.spacing(4,6), position: 'relative'}}>
                  <img alt={'QR-Code'} src={'/images/avatars/qr-illustration.png'} width={'100%'} />

                  <Box sx={{position: 'absolute', top: '30%', p: 20, display: 'flex', justifyContent: 'center', left: 0, right: 0}}>
                    <Box sx={{width: 80, height: 80}}>
                      <QRCode value={`${process.env.NEXT_PUBLIC_API_URL??""}`} size={90} level={'Q'} />
                    </Box>
                  </Box>
                </Box>

              </CardContent>
            </Card>


          </Box>

        </Grid>


        <Grid item xs={12} lg={12} md={12}>
          <Divider />
        </Grid>


        <Grid item xs={12} lg={12} md={12}>
          <Box sx={{display: 'flex', backgroundColor: 'customColors.tableHeaderBg', p: 4, borderRadius: '10px'}}>
            <Grid container spacing={6}>

              <Grid item xs={12} lg={3} md={3}>
                <img alt={'Logo'} src={(brandConfigs[process.env.NEXT_PUBLIC_APP_NAME??"Indraaj"] || brandConfigs["indraaj"]).logo??'/images/logos/logo.png'} style={{height: 50}} />
                <Typography variant={'body1'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                  <Icon icon={'tabler:map-pin'} fontSize={'1rem'} style={{marginRight: '5px'}} />
                  Office:#1904, Metropolis Tower Business Bay, Dubai.
                </Typography>

                <Typography variant={'body1'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                  <Icon icon={'tabler:phone'} fontSize={'1rem'} style={{marginRight: '5px'}} />
                  +971 4 571 3703
                </Typography>

                <Typography variant={'body1'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                  <Icon icon={'tabler:mail'} fontSize={'1rem'} style={{marginRight: '5px'}} />
                  info@connect-sol.com
                </Typography>

                <Typography variant={'h5'} sx={{mt: 6, display: 'flex', alignItems: 'center', fontWeight: 900, color: 'text.primary'}}>
                  Follow Us
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                  <Link href={process.env.NEXT_PUBLIC_FB_URL??"/"} target={'_blank'} style={{textDecoration: 'none'}}>
                    <Typography variant={'body1'} sx={{color: 'text.primary', mr: 2}}>
                      <Icon icon={'tabler:brand-facebook'} fontSize={'2.5rem'} />
                    </Typography>
                  </Link>

                  <Link href={process.env.NEXT_PUBLIC_INSTA_URL??"/"} target={'_blank'} style={{textDecoration: 'none'}}>
                    <Typography variant={'body1'} sx={{color: 'text.primary', mr: 2}}>
                      <Icon icon={'tabler:brand-instagram'} fontSize={'2.5rem'} />
                    </Typography>
                  </Link>

                  <Link href={process.env.NEXT_PUBLIC_LI_URL??"/"} target={'_blank'} style={{textDecoration: 'none'}}>
                    <Typography variant={'body1'} sx={{color: 'text.primary', mr: 2}}>
                      <Icon icon={'tabler:brand-linkedin'} fontSize={'2.5rem'} />
                    </Typography>
                  </Link>

                  <Link href={process.env.NEXT_PUBLIC_YT_URL??"/"} target={'_blank'} style={{textDecoration: 'none'}}>
                    <Typography variant={'body1'} sx={{color: 'text.primary', mr: 2}}>
                      <Icon icon={'tabler:brand-youtube'} fontSize={'2.5rem'} />
                    </Typography>
                  </Link>
                </Box>

              </Grid>


              <Grid item xs={12} lg={3} md={3}>
                <Typography variant={'h3'} sx={{fontWeight: 900, color: 'text.primary'}}>
                  {t("Support")}
                </Typography>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}training-videos`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 4, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Training Videos")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}Faq`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("FAQ")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}contact-us`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Contact Us")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}about`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("About Us")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}blogs`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Blogs")}
                  </Typography>
                </Link>

              </Grid>

              <Grid item xs={12} lg={3} md={3}>
                <Typography variant={'h3'} sx={{fontWeight: 900, color: 'text.primary'}}>
                  {t("Links")}
                </Typography>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}data-security`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 4, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Trust & Data Security")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}terms-condition`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Terms & Conditions")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}privacy-policy`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Privacy Policy")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}guest-blogging`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Guest Blogging")}
                  </Typography>
                </Link>

                <Link href={`${process.env.NEXT_PUBLIC_WEB_URL??"/"}guideLine`} target={'_blank'} style={{textDecoration: 'none'}}>
                  <Typography variant={'h5'} sx={{mt: 2, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                    {t("Guidelines")}
                  </Typography>
                </Link>

              </Grid>

              <Grid item xs={12} lg={3} md={3}>
                <Typography variant={'h3'} sx={{fontWeight: 900, color: 'text.primary'}}>
                  {t("App & Payment")}
                </Typography>

                <Link href={process.env.NEXT_PUBLIC_PLAY_STORE_URL??"/"} target={'_blank'}>
                  <Box sx={{width: '100%'}}>
                    <img alt={"Play Store"} src={'/images/google-play.png'} style={{marginTop: '25px'}} />
                  </Box>
                </Link>

                <Link href={process.env.NEXT_PUBLIC_APP_STORE_URL??"/"} target={'_blank'}>
                  <Box sx={{width: '100%'}}>
                    <img alt={"Play Store"} src={'/images/appstore.png'} style={{marginTop: '15px'}} />
                  </Box>
                </Link>

                <Typography variant={'h5'} sx={{mt: 4, display: 'flex', alignItems: 'center', color: 'text.primary'}}>
                  {t("Secured Payment Gateways")}
                </Typography>


                <Box sx={{width: '100%', display: 'flex', alignItems: 'center'}}>
                  <img alt={"Play Store"} src={'/images/payment-method-4.png'} style={{marginTop: '15px'}} />
                </Box>

              </Grid>

            </Grid>
          </Box>
        </Grid>

        <CustomBackdrop open={false} />

      </Grid>
    </Box>
  )
}
export default DashboardOverview

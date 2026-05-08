// ** React Imports
import {ReactNode, useEffect} from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/mock-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/core/components/auth/AclGuard'
import ThemeComponent from 'src/core/theme/ThemeComponent'
import AuthGuard from 'src/core/components/auth/AuthGuard'
import GuestGuard from 'src/core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/icons/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import axios, {CreateAxiosDefaults} from "axios";
import {AppDefaultsProvider} from "../context/AppDefaultContext";
import {useFirebaseNotifications} from "../core/hooks/useFirebaseNotifications";
import i18n from "i18next";
import {brandConfigs} from "../configs/branding";



axios.defaults.baseURL = (process.env.NEXT_PUBLIC_API_URL) + "/en/";

axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL) + "/en/", // Set your desired base URL here
  timeout: 5000, // Set a timeout, if needed
} as CreateAxiosDefaults);


// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return  <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  useFirebaseNotifications();

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  // useEffect(() => {
  //   const savedLang = localStorage.getItem('lang') || 'en';
  //   if (i18n.language !== savedLang) {
  //     i18n.changeLanguage(savedLang).then(() => console.log(savedLang));
  //   }
  // }, []);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Techionik</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} –Techionik CMS.`}
          />
          <meta property="og:image" content={`Techionik Website CMS`}/>
          <meta name='keywords' content='Techionik'/>
          <meta name='viewport' content='initial-scale=1, width=device-width'/>
        </Head>
        <AuthProvider>
          <AppDefaultsProvider>
            <SettingsProvider {...(setConfig ? {pageSettings: setConfig()} : {})}>
                <SettingsConsumer>
                  {({settings}) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={{className: 'react-hot-toast'}}/>
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </AppDefaultsProvider>
          </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App

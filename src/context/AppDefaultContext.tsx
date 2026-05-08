// ** React Imports
import {createContext, useEffect, useMemo, useState} from 'react'
import {defaultCurrencyCode, getFingerprint} from 'src/core/utils/format'
import axios from "axios";
import {
  CurrencyTypeData,
  DefaultGenericDataType,
  DefaultTenantType,
  DefaultValuesType,
  SystemInfoDataType
} from "./types";
import {useAuth} from "../hooks/useAuth";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store";



// ** Defaults
const defaultProvider: DefaultValuesType = {
  defaultCurrency: null,
  currencies: [],
  defaultCostLocation: null,
  defaultTanent: null,
  systemInfo: null,
  unauthorized: false,
}


// ** Create Context
const AppDefaultsContext = createContext(defaultProvider)

const AppDefaultsProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();
  const userData = user;
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyTypeData>({code: "AED"})
  const [currencies, setCurrencies] = useState<CurrencyTypeData[]>([])
  const [unauthorized, setUnauthorized] = useState<boolean>(false)
  const [defaultCostLocation, setDefaultCostLocation] = useState<DefaultGenericDataType>({})
  const [defaultTanent, setDefaultTanent] = useState<DefaultTenantType>()
  const [systemInfo, setSystemInfo] = useState<SystemInfoDataType>({ip: undefined, long: undefined, lat: undefined, name: undefined})



  const loadDefaultTanent = async () => {
    try {
      if(defaultTanent?.tenantId !== userData?.loginTenantId) {
        const response = await axios.get('/Defaults/GetTenantDetails', {params: {Recno: userData?.loginTenantId}});

        if (userData?.tenantDetails.length) {
          const tanent = userData?.tenantDetails.find((ele) => ele.tenantId === userData.loginTenantId);
          if (tanent?.logo) {
            axios.get(`${process.env.NEXT_PUBLIC_IMAGE_URL}${tanent.logo}?asBase64=true`)
              .then(base64 => {
                setDefaultTanent(response.data?.data.length ? {...response.data?.data[0], base64Logo: base64.data} : undefined)
                setUnauthorized(false)
                console.log(`BASE64 LOGO ${base64}`); // Logs the base64 string
              })
              .catch(error => {
                console.error(error);
                setDefaultTanent(response.data?.data.length ? response.data?.data[0] : undefined)
                setUnauthorized(false)
              });
          } else {
            setDefaultTanent(response.data.length ? response.data[0] : undefined)
            setUnauthorized(false)
          }
        } else {
          setDefaultTanent(response.data?.data?.length ? response.data?.data[0] : undefined)
          setUnauthorized(false)
        }
      }
    } catch (e) {
      if (typeof e === "string") {
        if (e === "You are Not authorized") {
          setUnauthorized(true)
        }
      } else {
        setUnauthorized(false)
      }
    }
  }

  const setDefaultResetAuthorized = () => {
    setUnauthorized(false)
  }

  const loadTenantCurrencies = async () => {
    try {
      if(currencies.length <= 0) {
        const response = await axios.get(`/Defaults/GetTenantCurrenciesDetail`)
        const defCurrency = response.data.data?.find((e:any) => e.isDefaultCurrency)
        setDefaultCurrency(defCurrency ?? {code: defaultCurrencyCode})
        setCurrencies(response.data?.data??[])

        return response.data.data
      }
    } catch (e: any) {
      console.log(e)
    }
  }

  const getIp = async () => {
    try {
      const ipApiResponse = await fetch(`https://api.ipify.org/?format=json`).then(body => body.json())
      setSystemInfo(info => ({...info, ...ipApiResponse}))
    } catch (ignored) {
      console.log(ignored)
    }
  }

  const getGeoLocation = async () => {
    function showError() {
      console.log('GeoLocation Error')
    }

    function showPosition(position: any) {
      setSystemInfo(info => ({...info, long: `${position.coords.longitude}`, lat: `${position.coords.latitude}`}) as any)
    }

    navigator.geolocation?.getCurrentPosition(showPosition, showError)
  }

  const getSystemFingerprint = async () => {
    const fingerPrint = localStorage.getItem('fingerprint')
    if (!!fingerPrint) {
      setSystemInfo(info => ({...info, name: JSON.parse(fingerPrint)}))
    } else {
      getFingerprint(name => {
        localStorage.setItem('fingerprint', JSON.stringify(name))
        setSystemInfo(info => ({...info, name}))
      })
    }
  }

  const updateTanantLogo = (updated: any) => {
    setDefaultTanent(({...defaultTanent, ...updated}))
  }


  const values: any = useMemo(() => ({
      currencies,
      unauthorized,
      defaultCurrency,
      defaultCostLocation,
      defaultTanent,
      updateTanantLogo,
      systemInfo,
      userData,
      setDefaultResetAuthorized,
      loadDefaultTanent,
      loadTenantCurrencies
    }),
    [
      currencies,
      unauthorized,
      defaultCurrency,
      defaultCostLocation,
      defaultTanent,
      systemInfo,
      updateTanantLogo,
      setDefaultResetAuthorized,
      loadDefaultTanent,
      userData
    ]
  )


  //** ComponentDidMount
  // useEffect(() => {
  //   if (userData && !!(userData?.loginTenantId)) {
  //     Promise.all([
  //       loadDefaultCostLocation(),
  //       loadDefaultTanent(),
  //       loadTenantCurrencies()
  //     ]);
  //   }
  // }, [userData])

  // useEffect(() => {
  //   Promise.all([
  //     getIp(),
  //     getGeoLocation(),
  //     getSystemFingerprint()
  //   ])

  // }, [])

  return <AppDefaultsContext.Provider value={values}>{children}</AppDefaultsContext.Provider>
}

export {AppDefaultsContext, AppDefaultsProvider}

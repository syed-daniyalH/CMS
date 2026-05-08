// ** React Imports
import {createContext, useMemo, useState} from 'react'
import axios from "axios";
import { PropertyDataType, DefaultValuesType } from './types'
import {useAuth} from "src/hooks/useAuth";
import {propertyFormType} from "src/core/utils/form-types";

// ** Defaults
const defaultProvider: DefaultValuesType = {
  property: null,
  loadPropertyData: () => null,
  handlePropertyData: () => null,
  resetPropertyData: () => null,
  storeProperty: () => null
}

const createNewProperty = () : PropertyDataType => {
  return {
    areaMarla: 0, areaSqft: 0, marlaRate: 0, orgPrice: 0, propertyNo: '', ratePerSqft: 0, saleablePrice: 0
  };
}

// ** Create Context
const PropertyContext = createContext(defaultProvider)

const PropertyProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [property, setProperty] = useState<PropertyDataType>(createNewProperty())

  const loadPropertyData = async (recno: number) => {
    const api_data: any = await axios.get(`/Properties/${recno}`)
    setProperty(api_data.data.data)
    return api_data.data.data
  }

  const handlePropertyData = (updated: any) => {
    updated.orgPrice = (updated?.areaMarla??property?.areaMarla??0) * (updated?.marlaRate??property?.marlaRate??0);
    updated.prefAmount = (((updated.prefPercentage??property.prefPercentage??0)/100) * updated?.orgPrice);
    updated.saleablePrice = updated.orgPrice + updated.prefAmount;
    setProperty(model => ({ ...model, ...updated }))
  }

  const resetPropertyData = () => {
    setProperty(createNewProperty())
  }

  const storeProperty = async (attachments: File[]) => {

    let response: any;
    if (property?.propertyId) {
      response = await axios.put('/Properties', property)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', propertyFormType)
        formData.append('Recno', data.recno)
        attachments.forEach(file => formData.append(
          "objfile",
          file,
          file.name
        ))
        await axios.post('/FileUpload', formData)
      }
      return response.data
    } else {
      response = await axios.post('/Properties', property)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', propertyFormType)
        formData.append('Recno', data.recno)
        attachments.forEach(file => formData.append(
          "objfile",
          file,
          file.name
        ))
        await axios.post('/FileUpload', formData)
      }
      return response.data
    }

  }


  const values: any = useMemo(() => ({
      property,
      user,
      loadPropertyData,
      handlePropertyData,
      resetPropertyData,
      storeProperty
    }),
    [
      property,
      user,
      loadPropertyData,
      handlePropertyData,
      resetPropertyData,
      storeProperty
    ]
  )

  return <PropertyContext.Provider value={values}>{children}</PropertyContext.Provider>
}

export {PropertyContext, PropertyProvider}

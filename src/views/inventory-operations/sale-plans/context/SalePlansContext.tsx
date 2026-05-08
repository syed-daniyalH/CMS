// ** React Imports
import {createContext, useMemo, useState} from 'react'
import axios from "axios";
import { SalePlansDataType, DefaultValuesType, SubSalePlanObj } from './types'
import {useAuth} from "src/hooks/useAuth";
import {salePlansFormType} from "src/@core/utils/form-types";

// ** Defaults

const createNewSalePlans = () : any => {
  return {
    salePlan: {
      description: "",
      defSalePrice: 0,
      isDefault: false,
      areaSqft: 0,
      areaMarla: 0
    },
    subSalePlan: []
  };
}

// ** Create Context
const SalePlansContext = createContext<any | null>(null);

const SalePlansProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [salePlans, setSalePlans] = useState<SalePlansDataType>(createNewSalePlans());


  const loadSalePlansData = async (recno: number) => {
    const api_data: any = await axios.get(`/SalePlans/GetSingleSalePlanWithDetail/${recno}`)
    setSalePlans(api_data.data.data)
    return api_data.data.data
  }

  const handleSalePlansData = (updated: any) => {
    setSalePlans(model => ({ ...model, salePlan: {...model.salePlan, ...updated} }))
  }



  const resetSalePlansData = () => {
    setSalePlans(createNewSalePlans())
  }

  const storeSalePlans = async (attachments: File[]) => {

    let response: any;
    if (salePlans?.salePlan.planId) {
      response = await axios.put('/SalePlans', salePlans)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', salePlansFormType)
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
      response = await axios.post('/SalePlans', salePlans)


      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', salePlansFormType)
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

  const addSaleDetailPlans = (data: SubSalePlanObj) => {
    setSalePlans({...salePlans, subSalePlan: [...salePlans.subSalePlan, data]});
  }

  const removeSaleDetailPlans = (index: any) => {
    setSalePlans(sPlan => {
      // Create a copy of the details array
      const newDetails = [...sPlan.subSalePlan];
        // Remove the item if it is newly added
      newDetails.splice(index, 1);

      // Return the new bill state
      return {
        ...sPlan,
        subSalePlan: newDetails
      };
    });
  }


  const values: any = useMemo(() => ({
      salePlans,
      user,
      loadSalePlansData,
      handleSalePlansData,
      setSalePlans,
      removeSaleDetailPlans,
      addSaleDetailPlans,
      resetSalePlansData,
      storeSalePlans,

    }),
    [
      salePlans,
      user,
      loadSalePlansData,
      handleSalePlansData,
      setSalePlans,
      removeSaleDetailPlans,
      addSaleDetailPlans,
      resetSalePlansData,
      storeSalePlans,

    ]
  )

  return <SalePlansContext.Provider value={values}>{children}</SalePlansContext.Provider>
}

export {SalePlansContext, SalePlansProvider}

// ** React Imports
import { createContext, useMemo, useState } from 'react'
import axios from "axios";
import { AgentDataType, DefaultValuesType, Nominee } from './types'
import {useAuth} from "src/hooks/useAuth";
import { agentFormType, agentProfileFormType } from 'src/@core/utils/form-types'

// ** Defaults
const defaultProvider: DefaultValuesType = {
  agent: null,
  nominee: null,
  handleNominee: () => null,
  resetNominee: () => null,
  loadAgentData: () => null,
  handleAgentData: () => null,
  resetAgentData: () => null,
  storeAgent: () => null
}

const createNewAgent = () : AgentDataType => {
  return {
    firstName: '',
    secondName: '',
    gender: 'Male',
    isActive: true,
    isAllowLogin: false,
    nominees: []
  };
}

const createNewNominee = () : Nominee => {
  return {
    name: '',
    email: '',
  };
}

// ** Create Context
const AgentContext = createContext(defaultProvider)

const AgentProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [agent, setAgent] = useState<AgentDataType>(createNewAgent())
  const [nominee, setNominee] = useState<Nominee>(createNewNominee())

  const loadAgentData = async (recno: number) => {
    const api_data: any = await axios.get(`/Agents/${recno}`)
    setAgent(api_data.data.data)
    return api_data.data.data
  }

  const handleAgentData = (updated: any) => {
    setAgent(model => ({ ...model, ...updated }))
  }

  const handleNominee = (updated: any) => {
    setNominee(model => ({ ...model, ...updated }))
  }

  const resetNominee = () => {
    setNominee(createNewNominee())
  }

  const resetAgentData = () => {
    setAgent(createNewAgent())
  }

  const storeAgent = async (attachments: File[], imageFiles: File[]) => {

    if(imageFiles.length > 0) {
      const formData = new FormData()
      formData.append('FormType', agentProfileFormType)
      formData.append('DocumentId', '0')
      imageFiles.forEach(file => formData.append(
        "objfile",
        file,
        file.name
      ))
      let res = await axios.post('/FileUpload', formData)
      agent.customerImageUrl = (res?.data?.data??[]).length > 0 ? res?.data?.data[0].path : null
    }

    let response: any;
    if (agent?.agentId) {
      response = await axios.put('/Agents', agent)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', agentFormType)
        formData.append('DocumentId', data.recno)
        attachments.forEach(file => formData.append(
          "objfile",
          file,
          file.name
        ))
        await axios.post('/FileUpload', formData)
      }
      return response.data
    } else {
      response = await axios.post('/Agents', agent)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', agentFormType)
        formData.append('DocumentId', data.recno)
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
      agent,
      user,
      nominee,
      handleNominee,
      resetNominee,
      loadAgentData,
      handleAgentData,
      resetAgentData,
      storeAgent
    }),
    [
      agent,
      nominee,
      handleNominee,
      resetNominee,
      user,
      loadAgentData,
      handleAgentData,
      resetAgentData,
      storeAgent
    ]
  )

  return <AgentContext.Provider value={values}>{children}</AgentContext.Provider>
}

export {AgentContext, AgentProvider}

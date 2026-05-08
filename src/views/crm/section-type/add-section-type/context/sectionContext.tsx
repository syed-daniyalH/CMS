// ** React Imports
import { createContext, useMemo, useState, useEffect, ReactNode } from 'react'
import axios, { AxiosError } from 'axios'
import axiosInstance from 'src/@core/utils/axiosInstence'
import { DefaultSectionTypeContextType, SectionTypeData, SectionTypeField, ApiResponse } from './types'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

// ** Defaults
const defaultProvider: DefaultSectionTypeContextType = {
  sectionType: null,
  sectionTypes: [],
  loading: false,
  loadSectionTypes: () => Promise.resolve(),
  loadSectionType: () => Promise.resolve(),
  handleSectionTypeData: () => undefined,
  handleSectionTypeFieldData: () => undefined,
  addSectionTypeField: () => undefined,
  removeSectionTypeField: () => undefined,
  storeSectionType: () => Promise.resolve(null),
  resetSectionTypeData: () => undefined,
  deleteSectionType: () => Promise.resolve(),
  updateSectionTypeStatus: () => Promise.resolve(),
  fields: [],
  setFields: () => undefined

}

// ** Create new section type
const createNewSectionType = (): SectionTypeData => {
  return {
    name: '',
    slug: '',
    description: '',
    fields: [createNewField(0)],
    isActive: true,
    icon: 'segment',
    category: 'general'
  }
}

// ** Create new field
const createNewField = (index: number): SectionTypeField => {
  return {
    key: `field_${index + 1}`,
    label: `Field ${index + 1}`,
    type: 'text',
    required: false,
    placeholder: '',
    defaultValue: '',
    validation: {}
  }
}

// ** Create Context
const SectionTypeContext = createContext<DefaultSectionTypeContextType>(defaultProvider)

interface SectionTypeProviderProps {
  children: ReactNode
}

const SectionTypeProvider: React.FC<SectionTypeProviderProps> = ({ children }) => {
  // ** Hooks
  const { user } = useAuth()

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.message ||
    error?.message ||
    'Something went wrong.'

  // ** State
  const [sectionType, setSectionType] = useState<SectionTypeData>(createNewSectionType())
  const [sectionTypes, setSectionTypes] = useState<SectionTypeData[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  console.log(sectionType, "sectionType");

  console.log(sectionTypes, "sectionTypes ");

  // ** Load all section types
  const loadSectionTypes = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<SectionTypeData[]>>('/api/section-types')
      const data = response.data

      if (data?.data) {
        setSectionTypes(data.data)
      } else {
        setSectionTypes(data as any || [])
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  // ** Load single section type
  const loadSectionType = async (id: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<SectionTypeData>>(`/api/section-types/${id}`)
      const data = response.data

      if (data?.data) {
        setSectionType(data.data)
      } else {
        setSectionType(data as any)
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  // ** Handle section type data changes
  const handleSectionTypeData = (updated: Partial<SectionTypeData>) => {
    setSectionType((prev: any) => ({ ...prev, ...updated }))
  }

  // ** Handle section type field data changes
  const handleSectionTypeFieldData = (field: Partial<SectionTypeField>, index: number) => {
    setSectionType((prev: any) => {
      const newFields = [...prev.fields]
      if (index >= 0 && index < newFields.length) {
        newFields[index] = { ...newFields[index], ...field }
      }
      return { ...prev, fields: newFields }
    })
  }

  // ** Add new field (with optional position)
  const addSectionTypeField = (position?: number) => {
    setSectionType((prev: any) => {
      const newIndex = prev.fields.length
      const newField = createNewField(newIndex)

      let newFields
      if (position !== undefined && position >= 0 && position <= prev.fields.length) {
        // Insert at specific position
        newFields = [...prev.fields]
        newFields.splice(position, 0, newField)
      } else {
        // Add to the end
        newFields = [...prev.fields, newField]
      }

      return { ...prev, fields: newFields }
    })
  }

  // ** Remove field
  const removeSectionTypeField = (index: number) => {
    if (sectionType.fields.length <= 1) {
      toast.error('At least one field is required')
      return
    }

    setSectionType((prev: any) => {
      const newFields = [...prev.fields]
      newFields.splice(index, 1)

      // Update keys and labels for remaining fields
      const updatedFields = newFields.map((field, idx) => ({
        ...field,
        key: field.key.startsWith('field_') ? `field_${idx + 1}` : field.key,
        label: field.label.startsWith('Field ') ? `Field ${idx + 1}` : field.label
      }))

      return { ...prev, fields: updatedFields }
    })
  }

  // ** Reset section type data
  const resetSectionTypeData = () => {
    setSectionType(createNewSectionType())
  }

  // ** Store/Update section type
  const storeSectionType = async (): Promise<any> => {
    try {
      // Generate slug if not provided
      let dataToSend = { ...sectionType }

      if (!dataToSend.slug && dataToSend.name) {
        dataToSend.slug = dataToSend.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      // Validate required fields
      if (!dataToSend.name?.trim()) {
        toast.error('Name is required')
        return null
      }

      // Map frontend virtual types to backend supported categories
      const typeMapping: Record<string, string> = {
        email: 'text',
        password: 'text',
        tel: 'text',
        color: 'text',
        url: 'link',
        checkbox: 'boolean',
        radio: 'select',
        file: 'image'
      }

      if (dataToSend.fields) {
        dataToSend.fields = dataToSend.fields.map(field => ({
          ...field,
          type: (typeMapping[field.type] || field.type) as any
        }))
      }

      let response
      if (sectionType._id) {
        // Update existing
        response = await axiosInstance.put(`/api/section-types/${sectionType._id}`, dataToSend)
        toast.success('Section type updated successfully!')
      } else {
        // Create new
        response = await axiosInstance.post('/api/section-types', dataToSend)
        toast.success('Section type created successfully!')
      }

      // Refresh the list
      await loadSectionTypes()

      return response.data
    } catch (error: any) {
      toast.error(getErrorMessage(error))
      return null
    }
  }

  // ** Delete section type
  const deleteSectionType = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/section-types/${id}`)
      await loadSectionTypes()
      toast.success('Section type deleted successfully!')

    } catch (error: any) {
      toast.error(getErrorMessage(error))
    }
  }

  // ** Update section type status (active/inactive)
  const updateSectionTypeStatus = async (id: string, isActive: boolean) => {
    try {
      await axiosInstance.patch(`/api/section-types/${id}/status`, { isActive })
      await loadSectionTypes()
      toast.success(`Section type ${isActive ? 'activated' : 'deactivated'} successfully!`)

    } catch (error: any) {
      toast.error(getErrorMessage(error))
    }
  }

  // ** Load section types on mount
  useEffect(() => {
    loadSectionTypes()
  }, [])

  // ** Memoized values
  const values: DefaultSectionTypeContextType = useMemo(() => ({
    sectionType,
    sectionTypes,
    loading,
    loadSectionTypes,
    loadSectionType,
    handleSectionTypeData,
    handleSectionTypeFieldData,
    addSectionTypeField,
    removeSectionTypeField,
    storeSectionType,
    resetSectionTypeData,
    deleteSectionType,
    updateSectionTypeStatus,
    setFields,
    fields,
  }), [
    sectionType,
    sectionTypes,
    loading,
    loadSectionTypes,
    loadSectionType,
    handleSectionTypeData,
    handleSectionTypeFieldData,
    addSectionTypeField,
    removeSectionTypeField,
    storeSectionType,
    resetSectionTypeData,
    deleteSectionType,
    updateSectionTypeStatus,
    setFields,
    fields,
  ])

  return <SectionTypeContext.Provider value={values}>{children}</SectionTypeContext.Provider>
}

export { SectionTypeContext, SectionTypeProvider }
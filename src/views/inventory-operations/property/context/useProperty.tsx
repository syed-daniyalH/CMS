import { useContext } from 'react'
import { PropertyContext } from './PropertyContext'

export const useProperty = () => useContext(PropertyContext)

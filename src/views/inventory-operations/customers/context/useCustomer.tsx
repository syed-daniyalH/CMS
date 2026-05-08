import { useContext } from 'react'
import { CustomerContext } from './CustomerContext'

export const useCustomer = () => useContext(CustomerContext)

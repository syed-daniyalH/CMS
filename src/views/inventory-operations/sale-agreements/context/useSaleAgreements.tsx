import { useContext } from 'react'
import { SaleAgreementsContext } from './SaleAgreementsContext'

export const useSaleAgreements = () => useContext(SaleAgreementsContext)

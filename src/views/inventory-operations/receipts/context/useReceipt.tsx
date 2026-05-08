import { useContext } from 'react'
import { ReceiptContext } from './ReceiptContext'

export const useReceipt = () => useContext(ReceiptContext)

// ** Custom Component
import ReceiptForm from "src/views/inventory-operations/receipts/receipt-form/ReceiptForm";
import {ReceiptProvider} from "src/views/inventory-operations/receipts/context/ReceiptContext";

const AddReceipt = ({callback, toggle}: any) => {
  return (
    <ReceiptProvider>
      <ReceiptForm toggle={toggle} callback={callback} />
    </ReceiptProvider>
  )
}

AddReceipt.acl = {
  action: 'new',
  subject: 'Receipts'
}
export default AddReceipt

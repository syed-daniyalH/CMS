// ** Custom Component
import CustomerForm from "src/views/inventory-operations/customers/customer-form/CustomerForm";
import {CustomerProvider} from "src/views/inventory-operations/customers/context/CustomerContext";

const AddCustomer = ({callback, toggle}: any) => {
  return (
    <CustomerProvider>
      <CustomerForm toggle={toggle} callback={callback} />
    </CustomerProvider>
  )
}

AddCustomer.acl = {
  action: 'new',
  subject: 'Customer'
}
export default AddCustomer

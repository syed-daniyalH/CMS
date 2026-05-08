// ** Custom Component
import SalePlansForm from "src/views/inventory-operations/sale-plans/sales-form/SalePlansForm";
import { SalePlansProvider } from '../../../../views/inventory-operations/sale-plans/context/SalePlansContext';

const AddSalePlans = ({callback, toggle}: any) => {
  return (
    <SalePlansProvider>
      <SalePlansForm toggle={toggle} callback={callback} />
    </SalePlansProvider>
  )
}

AddSalePlans.acl = {
  action: 'new',
  subject: 'SalePlans'
}
export default AddSalePlans

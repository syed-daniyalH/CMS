// ** Custom Component
import PropertyForm from "src/views/inventory-operations/property/property-form/PropertyForm";
import { PropertyProvider } from '../../../../views/inventory-operations/property/context/PropertyContext';

const AddProperty = ({callback, toggle}: any) => {
  return (
    <PropertyProvider>
      <PropertyForm toggle={toggle} callback={callback} />
    </PropertyProvider>
  )
}

AddProperty.acl = {
  action: 'new',
  subject: 'Properties'
}
export default AddProperty

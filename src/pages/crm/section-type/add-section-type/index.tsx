// ** Custom Component
import SectionTypeForm from "src/views/crm/section-type/add-section-type/section-type-form/SectionTypeForm";
import { SectionTypeProvider } from "src/views/crm/section-type/add-section-type/context/sectionContext"

const AddSectionType = ({ callback, toggle }: any) => {
  return (
    <SectionTypeProvider>
      <SectionTypeForm toggle={toggle} callback={callback} />
    </SectionTypeProvider>
  )
}

AddSectionType.acl = {
  action: 'new',
  subject: 'SectionTypes'
}
export default AddSectionType

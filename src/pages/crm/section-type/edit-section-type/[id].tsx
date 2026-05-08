// ** Custom Component
import SectionTypeForm from "src/views/crm/section-type/add-section-type/section-type-form/SectionTypeForm";
import { SectionTypeProvider } from "src/views/crm/section-type/add-section-type/context/sectionContext"
import { useRouter } from "next/router";

const EditSectionType = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <SectionTypeProvider>
            <SectionTypeForm recId={id as string} />
        </SectionTypeProvider>
    )
}

EditSectionType.acl = {
    action: 'update',
    subject: 'SectionTypes'
}

export default EditSectionType

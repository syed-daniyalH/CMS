// ** Styled Component
import {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next/types";
import {decodeParameters} from "src/core/utils/encrypted-params";
import PropertyForm from "src/views/inventory-operations/property/property-form/PropertyForm";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import { PropertyProvider } from '../../../../views/inventory-operations/property/context/PropertyContext'

const EditProperty = ({ recno }: InferGetStaticPropsType<typeof getStaticProps>) => {

  const router = useRouter();
  const query = router.query;
  const [recNo, setRecno] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(!recno) {
        if(query?.recno) {
          setRecno(decodeParameters(`${query.recno}`).recno ? parseInt(`${decodeParameters(`${query.recno}`).recno??""}`) : null)
        }
      }
    }


    return () => {
      isActive = false;
    }
  }, [recno])

  return (
    <PropertyProvider>
      <PropertyForm recno={recNo??recno} />
    </PropertyProvider>
  )
}

export const getStaticPaths = async () => {
  // Fetch or generate the list of paths
  const paths = [{params: {recno: `${1}`}}]

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps =   ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      recno: decodeParameters(`${params?.recno}`).recno??null
    }
  }
}

EditProperty.acl = {
  action: 'update',
  subject: 'Properties'
}

export default EditProperty

// ** Styled Component
import {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next/types";
import {decodeParameters} from "src/core/utils/encrypted-params";
import CustomerForm from "src/views/inventory-operations/customers/customer-form/CustomerForm";
import {CustomerProvider} from "src/views/inventory-operations/customers/context/CustomerContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

const EditCustomer = ({ recno }: InferGetStaticPropsType<typeof getStaticProps>) => {

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
    <CustomerProvider>
      <CustomerForm recno={recNo??recno} />
    </CustomerProvider>
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

EditCustomer.acl = {
  action: 'update',
  subject: 'Customer'
}

export default EditCustomer

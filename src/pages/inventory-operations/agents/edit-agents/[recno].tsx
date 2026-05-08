// ** Styled Component
import {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next/types";
import {decodeParameters} from "src/core/utils/encrypted-params";
import {AgentProvider} from "src/views/inventory-operations/agents/context/AgentContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AgentForm from '../../../../views/inventory-operations/agents/agent-form/AgentForm'

const EditAgents = ({ recno }: InferGetStaticPropsType<typeof getStaticProps>) => {

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
    <AgentProvider>
      <AgentForm recno={recNo??recno} />
    </AgentProvider>
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

EditAgents.acl = {
  action: 'update',
  subject: 'Agents'
}

export default EditAgents

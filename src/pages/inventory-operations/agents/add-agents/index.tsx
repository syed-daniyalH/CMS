// ** Custom Component
import AgentForm from "src/views/inventory-operations/agents/agent-form/AgentForm";
import { AgentProvider } from '../../../../views/inventory-operations/agents/context/AgentContext'

const AddAgents = ({callback, toggle}: any) => {
  return (
    <AgentProvider>
      <AgentForm toggle={toggle} callback={callback} />
    </AgentProvider>
  )
}

AddAgents.acl = {
  action: 'new',
  subject: 'Agents'
}
export default AddAgents

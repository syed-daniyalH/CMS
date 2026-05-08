import { useContext } from 'react'
import { AgentContext } from './AgentContext'

export const useAgent = () => useContext(AgentContext)

import { useContext } from 'react'
import {AppDefaultsContext} from "../context/AppDefaultContext";

export const useAppDefaults = () => useContext(AppDefaultsContext)

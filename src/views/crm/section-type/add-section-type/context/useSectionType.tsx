import { useContext } from 'react'
import { SectionTypeContext } from './sectionContext'

export type { SectionTypeField } from './types'

export const useSectionType = () => useContext(SectionTypeContext)

import { AbilityBuilder, Ability } from '@casl/ability'
import { AbilityData } from "../context/types"

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'view' | 'new' | 'edit'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Define ability rules - Now all users get full permissions
 */
const defineRulesFor = (role: AbilityData) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  
  // Give ALL users full access to everything
  can('manage', 'all')
  
  return rules
}

export const buildAbilityFor = (role: AbilityData): AppAbility => {
  return new AppAbility(defineRulesFor(role), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
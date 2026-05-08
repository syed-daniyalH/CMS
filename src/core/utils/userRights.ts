import {AnyAbility} from "@casl/ability";

const isScreenViewable = (name: string, ability: AnyAbility) => {
  return ability.can('view' as any, name as any);
}

export default isScreenViewable;

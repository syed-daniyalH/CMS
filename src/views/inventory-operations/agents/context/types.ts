export interface AgentDataType {
  agentId?: number;
  parentAgentId?: number;
  firstName: string;
  secondName: string;
  typeId?: number | null;
  gender: string;
  identityNo?: string | null;
  regNo?: string | null;
  identityExpDate?: string | Date | null; // ISO date string
  isActive: boolean;
  guardianType?: number | null;
  guardianName?: string | null;
  dob?: string | Date | null; // ISO date string
  nationality?: string | null;
  city?: string | null;
  country?: string | null;
  countryId?: number | null;
  tempAddress?: string | null;
  permAddress?: string | null;
  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  remarks?: string | null;
  passNo?: string | null;
  customerImageUrl?: string | null;
  passExpDate?: string | Date | null; // ISO date string
  isAllowLogin: boolean;
  nominees: Nominee[];
}

export interface Nominee {
  nomId?: number;
  custAgentId?: number;
  name: string;
  email: string;
  phone?: string | null;
  relation?: string | null;
  identityNo?: string | null;
  nomFor?: number | null;
  identityExp?: string | null | Date; // ISO date string
  address?: string | null;
  remarks?: string | null;
}

export interface DefaultValuesType {
  agent: AgentDataType | null
  nominee: Nominee | null
  loadAgentData: (recno: number) => Promise<void> | null,
  storeAgent: (attachments: File[], imageFiles: File[]) => Promise<void> | null,
  handleAgentData: (update: any) => void
  handleNominee: (update: any) => void
  resetAgentData: () => void
  resetNominee: () => void
}

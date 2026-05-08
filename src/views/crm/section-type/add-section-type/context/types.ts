export interface SectionTypeField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'select' | 'checkbox' | 'radio' | 'date' | 'textarea' | 'file' | 'image' | 'video' | 'array' | 'link' | 'richtext' | 'color';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface SectionTypeData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  fields: SectionTypeField[];
  isActive: boolean;
  icon: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface DefaultSectionTypeContextType {
  sectionType: SectionTypeData | null;
  sectionTypes: SectionTypeData[];
  loading: boolean;
  fields: any
  loadSectionTypes: () => Promise<void>;
  loadSectionType: (id: string) => Promise<void>;
  setFields: any
  handleSectionTypeData: (updated: Partial<SectionTypeData>) => void;
  handleSectionTypeFieldData: (field: Partial<SectionTypeField>, index: number) => void;
  addSectionTypeField: (position?: number) => void;
  removeSectionTypeField: (index: number) => void;
  storeSectionType: () => Promise<any>;
  resetSectionTypeData: () => void;

  deleteSectionType: (id: string) => Promise<void>;
  updateSectionTypeStatus: (id: string, isActive: boolean) => Promise<void>;
}
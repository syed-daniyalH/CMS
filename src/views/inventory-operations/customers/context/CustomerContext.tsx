// ** React Imports
import { createContext, useEffect, useMemo, useState } from 'react'
import axios from "axios";
import { CustomerDataType, DefaultValuesType, DocumentDataType, Nominee } from './types'
import {useAuth} from "src/hooks/useAuth";
import { customerFormType, customerProfileFormType } from 'src/core/utils/form-types'

// ** Defaults
const defaultProvider: DefaultValuesType = {
  customer: null,
  nominee: null,
  documents: [],
  storeDocument: () => null,
  removeDocument: () => null,
  handleNominee: () => null,
  resetNominee: () => null,
  loadCustomerData: () => null,
  handleCustomerData: () => null,
  resetCustomerData: () => null,
  storeCustomer: () => null
}

const createNewCustomer = () : CustomerDataType => {
  return {
    firstName: '',
    secondName: '',
    gender: 'Male',
    isActive: true,
    isAllowLogin: false,
    nomineesList: []
  };
}

const createNewNominee = () : Nominee => {
  return {
    name: '',
    email: '',
  };
}

// ** Create Context
const CustomerContext = createContext(defaultProvider)

const CustomerProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [customer, setCustomer] = useState<CustomerDataType>(createNewCustomer())
  const [nominee, setNominee] = useState<Nominee>(createNewNominee())
  const [documents, setDocuments] = useState<DocumentDataType[]>([]);



  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(customer?.customerId) {
        loadEmployeeDocuments().then(() => console.log("Documents loaded"));
      }
    }


    return () => {
      isActive = false;
    }
  }, [customer?.customerId]);

  const loadCustomerData = async (recno: number) => {
    const api_data: any = await axios.get(`/Customer/${recno}`)
    setCustomer(api_data.data.data)
    return api_data.data.data
  }

  const handleCustomerData = (updated: any) => {
    setCustomer(model => ({ ...model, ...updated }))
  }

  const handleNominee = (updated: any) => {
    setNominee(model => ({ ...model, ...updated }))
  }

  const resetNominee = () => {
    setNominee(createNewNominee())
  }

  const resetCustomerData = () => {
    setCustomer(createNewCustomer())
  }

  const storeCustomer = async (attachments: File[], imageFiles: File[]) => {

    if(imageFiles.length > 0) {
      const formData = new FormData()
      formData.append('FormType', customerProfileFormType)
      formData.append('DocumentId', '0')
      imageFiles.forEach(file => formData.append(
        "objfile",
        file,
        file.name
      ))
      let res = await axios.post('/FileUpload', formData)
      customer.customerImageUrl = (res?.data?.data??[]).length > 0 ? res?.data?.data[0].path : null
    }

    let response: any;
    if (customer?.customerId) {
      response = await axios.put('/Customer', customer)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', customerFormType)
        formData.append('DocumentId', data.recno)
        attachments.forEach(file => formData.append(
          "objfile",
          file,
          file.name
        ))
        await axios.post('/FileUpload', formData)
      }
      return response.data
    } else {
      response = await axios.post('/Customer', customer)

      if (response?.data?.succeeded && !!attachments?.length) {
        const { data } = response?.data;
        const formData = new FormData()
        formData.append('FormType', customerFormType)
        formData.append('DocumentId', data.recno)
        attachments.forEach(file => formData.append(
          "objfile",
          file,
          file.name
        ))
        await axios.post('/FileUpload', formData)
      }
      return response.data
    }

  }

  const loadEmployeeDocuments = async () => {

    try {
      const response = await axios.get(`/Customer/GetCustomerDocumentsList/${customer?.customerId}`);
      if (response?.data?.succeeded) {
        setDocuments(response?.data?.data ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const storeDocument = async (doc: DocumentDataType) => {
    if (customer?.customerId) {
      let attachments = doc?.files;

      const formData = new FormData();
      formData.append('CustomerId', `${customer?.customerId??""}`);
      formData.append('DocTypeId', `${doc?.docTypeId??""}`);
      formData.append('DocumentNo', doc?.documentNo??"");
      formData.append('Comments', doc?.comments??"");

      if(doc.countryId) {
        formData.append('CountryId', `${doc?.countryId??""}`);
      }

      if(doc.issuedOn) {
        formData.append('IssuedOn', doc?.issuedOn??"");
      }
      if(doc.validFrom) {
        formData.append('ValidFrom', doc?.validFrom??"");
      }

      if(doc.expiresOn) {
        formData.append('ExpiresOn', doc?.expiresOn??"");
      }

      attachments.forEach(file => formData.append(
        "Files",
        file,
        file.name
      ))

      attachments.forEach(file => formData.append(
        "Documents",
        file,
        file.name
      ))

      let response = await axios.post(`/Customer/AddCustomerDocument`, formData)

      let documentIndex = documents.findIndex((e) => e.docTypeId === response?.data?.data?.docTypeId);

      if(documentIndex > -1) {
        documents[documentIndex] = response?.data?.data;
        setDocuments([...documents]);
      } else {
        setDocuments([...documents, response?.data?.data]);
      }

      return response.data
    }

    return null;

  }



  const removeDocument = async (recno: number) => {
    if (customer?.customerId) {
      try {
        let response = await axios.delete(`/Customer/RemoveCustomerDocument/${customer?.customerId}/${recno}`)


        setDocuments((prevDocs: DocumentDataType[]) =>
          prevDocs.map(doc => ({
            ...doc,
            documents: (doc.documents ?? []).filter(d => d.documentId !== recno)
          })));

        return response.data
      } catch (e: any) {
        return null
      }
    }

    return null;

  }


  const values: any = useMemo(() => ({
      customer,
      user,
      nominee,
      documents,
      handleNominee,
      resetNominee,
      loadCustomerData,
    storeDocument,
      removeDocument,
      handleCustomerData,
      resetCustomerData,
      storeCustomer
    }),
    [
      customer,
      nominee,
      documents,
      handleNominee,
      resetNominee,
      storeDocument,
      removeDocument,
      user,
      loadCustomerData,
      handleCustomerData,
      resetCustomerData,
      storeCustomer
    ]
  )

  return <CustomerContext.Provider value={values}>{children}</CustomerContext.Provider>
}

export {CustomerContext, CustomerProvider}

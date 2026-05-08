// ** React Imports
import { createContext, useMemo, useState } from 'react'
import axios from 'axios'
import { DefaultValuesType, ReceiptDataList, ReceiptDataType } from './types'
import { useAuth } from 'src/hooks/useAuth'
import { receiptFormType } from 'src/core/utils/form-types'
import toast from 'react-hot-toast'

// ** Defaults
const defaultProvider: DefaultValuesType = {
  receipt: null,
  loadReceiptData: () => null,
  handleReceiptData: () => null,
  handleReceiptDetailData: () => null,
  addReceiptDetail: () => null,
  removeReceiptDetail: () => null,
  resetReceiptData: () => null,
  storeReceipt: () => null
}

const createNewReceipt = () : ReceiptDataType => {
  let receiptInitial: ReceiptDataType =  {
    actualAmount: 0,
    distAmount: 0,
    isBuyBack: false,
    isRealized: false,
    manualRecpNo: '',
    presentedDate: new Date(),
    recepitAmount: 0,
    recepitDate: new Date(),
    remarks: '',
    vMRecepitRefrenceLists: []
  };

  receiptInitial.vMRecepitRefrenceLists.push(createReceiptDetail(0));

  return receiptInitial;
}

const createReceiptDetail = (lineno: number) : ReceiptDataList => {
  return {
    amount: 0,
    lineno: lineno
  };
}

// ** Create Context
const ReceiptContext = createContext(defaultProvider)

const ReceiptProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [receipt, setReceipt] = useState<ReceiptDataType>(createNewReceipt())



  const loadReceiptData = async (recno: number) => {
    const api_data: any = await axios.get(`/Receipts/${recno}`);
    const data = api_data.data.data;

    // Add line numbers
    const updatedRefs = data?.vMRecepitRefrenceLists?.map((item: any, index: number) => ({
      ...item,
      lineno: index + 1
    })) ?? [];

    const updatedReceipt = {
      ...data,
      vMRecepitRefrenceLists: updatedRefs
    };

    setReceipt(updatedReceipt);
    return updatedReceipt;
  };

  const handleReceiptData = (updated: any) => {
    setReceipt(model => ({ ...model, ...updated }))
  }

  const resetReceiptData = () => {
    setReceipt(createNewReceipt())
  }


  const handleReceiptDetailData = (detail: any, lineno: number) => {
    let index = receipt.vMRecepitRefrenceLists.findIndex((row: ReceiptDataList) => row.lineno === lineno);
    if (index > -1) {

      setReceipt(rep => {
        // Create a new details array with updated item
        const newDetails = rep.vMRecepitRefrenceLists.map((item, i) => {
          if (i === index) {
            return {...item, ...detail};
          }
          return item;
        });

        return { ...rep, vMRecepitRefrenceLists: newDetails };
      });
    }
  }


  const addReceiptDetail = () => {
    const lineno = receipt.vMRecepitRefrenceLists.length > 0 ? receipt.vMRecepitRefrenceLists[receipt.vMRecepitRefrenceLists.length - 1].lineno + 1 : 0
    let det = createReceiptDetail(lineno)
    setReceipt(resp => ({...resp, vMRecepitRefrenceLists: [...resp.vMRecepitRefrenceLists, det]}))
  }


  const removeReceiptDetail = (index: number) => {
    setReceipt(resp => {
      // Create a copy of the details array
      const newDetails = [...resp.vMRecepitRefrenceLists];

      newDetails.splice(index, 1);

      // Update the line numbers for remaining items
      newDetails.forEach((detail, i) => {
        detail.lineno = i;
      });

      return {
        ...resp,
        vMRecepitRefrenceLists: newDetails
      };
    });
  };



  const storeReceipt = async (attachments: File[]) => {
    try {
      let response: any;

      if (receipt?.recepitId) {
        // Update
        response = await axios.put("/Receipts", receipt);
      } else {
        // Create
        response = await axios.post("/Receipts", receipt);
      }

      // ✅ Handle success
      if (response?.data?.succeeded) {
        // Upload files (if any)
        if (attachments?.length) {
          const { data } = response?.data;
          const formData = new FormData();
          formData.append("FormType", receiptFormType);
          formData.append("Recno", data.recno);
          attachments.forEach((file) =>
            formData.append("objfile", file, file.name)
          );
          await axios.post("/FileUpload", formData);
        }

        toast.success("Receipt saved successfully!");
        return response.data;
      }
      return response.data;
    } catch (error: any) {

      if (axios.isAxiosError(error) && error.response) {
        const errData = error.response.data;
if (!errData?.Succeeded && errData?.Message){

  toast.error(errData?.Message, { duration: 6000 });
}
        // Show all validation messages
        if (errData?.errors) {
          const messages = Object.values(errData.errors) ||errData?.Message
            .flat()
            .join("\n");

          const msg = Array.isArray(messages)
            ? messages.join(', ')
            : messages;

          toast.error(msg, { duration: 6000 });

        }
      }

    }
  };


  const values: any = useMemo(() => ({
      receipt,
      user,
      loadReceiptData,
      handleReceiptData,
      resetReceiptData,
      handleReceiptDetailData,
      removeReceiptDetail,
      addReceiptDetail,
      storeReceipt
    }),
    [
      receipt,
      user,
      loadReceiptData,
      handleReceiptData,
      resetReceiptData,
      handleReceiptDetailData,
      removeReceiptDetail,
      addReceiptDetail,
      storeReceipt
    ]
  )

  return <ReceiptContext.Provider value={values}>{children}</ReceiptContext.Provider>
}

export {ReceiptContext, ReceiptProvider}

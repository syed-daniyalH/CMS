// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import TypoLabel from '../../components/inputs/TypoLabel'

export interface InstallmentDropObj {
  installmentNo: number;
  installmentId: number;
  agreeId: number;
  propertyId: number;
  instAmount: number;
  recAmount: number;
  dueAmount: number;
  dueDate: string; // ISO date (e.g., "2025-09-16")
  installmentType: string;
}


interface Props {
  selected_value: number | null
  customerId: number | null
  propertyId: number | null
  handleChange: (value: InstallmentDropObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  canAdd?: boolean | null
  preview?: boolean | null
  noBorder?: boolean | null
  props?: TextFieldProps
}


const InstallmentByCustomerSelector = ({selected_value, customerId, propertyId, preview = false, noBorder = false, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<InstallmentDropObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<InstallmentDropObj[]>([])
  const [openAdd, setOpenAdd] = useState<boolean>(false);


  // ** translation
  const {t} = useTranslation();

  const toggleOpenAdd = () => {
    setOpenAdd(!openAdd);
  }


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && customerId && propertyId && object?.installmentId !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: InstallmentDropObj) => element.installmentId === selected_value)??null)
        }
      } else if(!selected_value) {
        setObject(null);
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if(isActive && customerId && propertyId) {

      getObjectList().then(() => console.log("loaded"));
    }

    return () => {
      isActive = false;
    }
  }, [customerId, propertyId])

  const getObjectList = async () => {
    try {
      axios.get(`/Receipts/GetInstallmentsListByCustnProp/${customerId}/${propertyId}`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
        setObjectList(data.data??[])
      })
    } catch (e: any) {
      console.log(e)
    }
  }


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: InstallmentDropObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<InstallmentDropObj> | undefined) => {
    if (value?.installmentId !== -1) {
      setObject(value);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return preview ? <> {object
    ? `Due Date: ${object?.dueDate ?? ""} / Total: ${object?.instAmount ?? 0} / Received: ${object?.recAmount ?? 0} / Receivable: ${object?.dueAmount ?? 0}`
    : ""}</> :(
    <>
      <CustomAutocomplete
        options={objectList ?? []}
        sx={{ mb: (props?.sx as any)?.mb ?? 3 }}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={(disabled??false) || !(customerId)}
        isOptionEqualToValue={(option, value) => option.installmentId === value.installmentId}
        getOptionLabel={(option: InstallmentDropObj) =>
          option
            ? `Due Date: ${option?.dueDate ?? ""} / Total: ${option?.instAmount ?? 0} / Received: ${option?.recAmount ?? 0} / Receivable: ${option?.dueAmount ?? 0}`
            : ""
        }        renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={"Installment"} />} placeholder={t("Select Installment") as string} {...(props??{})}  noBorder={noBorder??false}/>}
        renderOption={(props, option, { index }) => (
          <li {...props} key={(option.installmentId ?? "") + index}>
            {`Due Date: ${option?.dueDate ?? ""} / Total: ${option?.instAmount ?? 0} / Received: ${option?.recAmount ?? 0} / Receivable: ${option?.dueAmount ?? 0}`}
          </li>
        )}
      />

    </>
  )
}

export default InstallmentByCustomerSelector;

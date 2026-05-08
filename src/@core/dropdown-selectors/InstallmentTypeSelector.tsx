// @ts-nocheck
import React, { useEffect, useMemo, useState, SyntheticEvent } from "react";
import axios from "axios";
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import TypoLabel from "../../custom-components/inputs/TypoLabel";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getDefaultInstallmentTypes } from "../../store/dropdowns";
import { AppDispatch, RootState } from '../../store'

// GenericDropdownObj: { value: number|string, text: string, ... }

function coerceId(v:any) {
  // normalize to string for safe compare; or change to Number(...) for numeric scheme
  return v == null ? null : String(v);
}

const InstallmentTypeSelector = ({
                                   selected_value,
                                   handleChange,
                                   clearable = true,
                                   disabled = false,
                                   important = false,
                                   preview = false,
                                   noBorder = false,
                                   props,
                                 }:any) => {
  const [object, setObject] = useState<any>(null);
  const [objectList, setObjectList] = useState<any>([]);

  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state:RootState) => state.dropdowns);
  const { t } = useTranslation();

  // ---- Load list from store (or trigger fetch)
  useEffect(() => {
    if (store.installment_types?.length || store.installment_types_success) {
      setObjectList(store.installment_types || []);
    } else {
      //@ts-ignore
      dispatch(getDefaultInstallmentTypes({}));// no TS error now
    }
  }, [store.installment_types, store.installment_types_success, dispatch]);

  // ---- Resolve object from selected_value
  useEffect(() => {
    if (selected_value == null) {
      setObject(null);
      return;
    }

    const selId = coerceId(selected_value);

    // Try list first (fast path)
    let found = (objectList || []).find((el:any) => coerceId(el.value) === selId);
    if (found) {
      setObject(found);
      return;
    }

    // Fallback: fetch single record
    axios
      .get(`/Dropdowns/GetActiveInstallmentTypes`, { params: { Recno: selected_value } })
      .then((res) => {
        const data = res?.data?.data?.[0];
        if (data) setObject(data);
      })
      .catch(() => {
        // swallow – keep previous
      });
  }, [selected_value, objectList]);

  // ---- In preview, just render the label (no inputs)
  if (preview) {

    const selId = coerceId(selected_value);
    const fromList :any= (objectList || []).find((el:any) => coerceId(el.value) === selId);
    const label = (fromList?.text ?? object?.text ?? "—");
    return <>{label}</>;
  }

  // ---- Editable
  const onChange = (_e:any, value:any) => {
    setObject(value);
    handleChange?.(value);
  };

  return (
    <CustomAutocomplete
      options={objectList || []}
      id="installment-type-selector"
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled}
      fullWidth
      getOptionLabel={(option:any) => option?.text || ""}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          fullWidth
          label={
            <TypoLabel
              name={t("Installment Types")}
              important={!!important}
            />
          }
          placeholder={t("Installment Types")}
          {...(props || {})}
          noBorder={!!noBorder}
        />
      )}
    />
  );
};

export default React.memo(InstallmentTypeSelector);

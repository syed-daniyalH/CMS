// ** React Imports
import {createContext, useMemo, useState} from 'react'
import axios from "axios";
import { SaleAgreementsDataType, DefaultValuesType, saleAgreementInstallment } from './types'
import {useAuth} from "src/hooks/useAuth";
import {saleAgreementsFormType} from "src/@core/utils/form-types";
import toast from 'react-hot-toast'
import { InstallmentPlansDataType } from '../sales-agreements-list/sidebar/InstallmentPlansSidebar'

// ** Defaults
const defaultProvider: DefaultValuesType = {
  saleAgreements: null,
  loadSaleAgreementsData: () => null,
  handleSaleAgreementsData: () => null,
  resetSaleAgreementsData: () => null,
  addInstallmentDetail: () => null,
  removeInstallmentDetail: () => null,
  handleInstallmentDetailData: () => null,
  removeSaleDetailAgreements: () => null,
  storeSaleAgreements: () => null,
  recalcFrom: () => null,
  recalcAllInstallments: () => null,
}

const createNewSaleAgreements = () : SaleAgreementsDataType => {
  return {
    agentAmout: 0,
    agentPercentage: 0,
    distAmount: 0,
    distPercentage: 0,
    formNo: '',
    isMarkSale: false,
    orgPrice: 0,
    remarks: '',
    saleDate: new Date(),
    secondNo: '',
    soldPrice: 0,
    vmSaleAgreementInstallments: []
  };
}

// ** Create Context
const SaleAgreementsContext = createContext(defaultProvider)

const SaleAgreementsProvider = ({children}: any) => {
  // ** Hooks
  const { user } = useAuth();

  // ** State
  const [saleAgreements, setSaleAgreements] = useState<SaleAgreementsDataType>(createNewSaleAgreements())

  const asArray = <T,>(x: T[] | undefined | null): T[] => Array.isArray(x) ? x : [];
  const loadSaleAgreementsData = async (recno: number) => {
    try {
      const response = await axios.get(`/SaleAgreement/${recno}`);
      const data = response?.data?.data;
      console.log(data?.vmSaleAgreementInstallments, "API Installments");

      // 🧩 Map API data to your internal saleAgreementInstallment structure
      const tempInst: saleAgreementInstallment[] = (data?.vmSaleAgreementInstallments ?? []).map(
        (item: any, index: number) => {
          // Adjust date with month gap (if any)
          const installmentDate = new Date(item.installmentStartDate);
          installmentDate.setMonth(installmentDate.getMonth() + (item.monthGap ?? 0));

          return {
            recno: index + 1,
            instTypeId: item.instTypeId ?? null,
            installmentStartDate: installmentDate,
            noOfInstallment: item.noOfInstallment ?? 1,
            instPercentage: item.instPercentage ?? 0,
            installmentAmount: item.installmentAmount ?? 0,
            totalInstallmentAmount: item.totalInstallmentAmount ?? 0,
            isCharged: item.isCharged ?? false,
            monthGap: item.monthGap ?? 0,
          } as saleAgreementInstallment;
        }
      );

      // 🧠 Update context state with mapped data
      setSaleAgreements({
        ...data,
        vmSaleAgreementInstallments: tempInst,
      });

      return data;
    } catch (error) {
      console.error("Error loading Sale Agreement:", error);
      return error;
    }
  };

  const withRecomputedTotals = (row: saleAgreementInstallment): saleAgreementInstallment => {
    const amount = Number(row.installmentAmount ?? 0);
    const count  = Number(row.noOfInstallment ?? 0);
    const total  = amount * count;
    return { ...row, totalInstallmentAmount: Number.isFinite(total) ? total : 0 };
  };

  const addInstallmentDetail = (subDetail:any) => {
    setSaleAgreements(prev => {
      const existing = prev.vmSaleAgreementInstallments ?? [];

      const maxRecno =
        existing.length > 0
          ? Math.max(...existing.map(item => item.recno ?? 0))
          : 0;
      return {
        ...prev,
        vmSaleAgreementInstallments: [...existing, {...subDetail,  recno: maxRecno + 1,}]
      };
    });
  };

  const removeInstallmentDetail = (recno: number) => {
    setSaleAgreements(prev => {
      const updated = asArray(prev.vmSaleAgreementInstallments).filter(it => it.recno !== recno);
      return { ...prev, vmSaleAgreementInstallments: updated };
    });
  };

  const handleInstallmentDetailData = (
    data: any,
    recno: any
  ) => {
    setSaleAgreements(prev => {
      const rows = asArray(prev.vmSaleAgreementInstallments);
      const idx  = rows.findIndex(r => r.recno === recno);
      if (idx === -1) return prev;

      // merge incoming patch on top of current row
      const merged = { ...rows[idx], ...data } as saleAgreementInstallment;

      // If caller already passed back the recalcFrom() output (which we do in the table),
      // just persist `merged` as-is.
      const updated = rows.slice();
      updated[idx] = merged;

      return { ...prev, vmSaleAgreementInstallments: updated };
    });
  };

  const loadSaleAgreementsInstallments = async (recno: number) => {
    try {
      const api_data: any = await axios.get(`/SaleAgreement/GetSaleSubPlanList/${recno}`)
      let tempInst: saleAgreementInstallment[] = [];

      for(let i = 0; i < (api_data.data.data??[]).length; i++) {
        let installmentDate = new Date(saleAgreements.saleDate);
        installmentDate.setMonth(installmentDate.getMonth() + api_data.data.data[i].monthGap )

        tempInst.push({
          installmentStartDate: installmentDate,
          recno: Number((i + 1)),
          noOfInstallment: api_data.data.data[i].noOfInst,
          instPercentage: api_data.data.data[i].percentage,
          installmentAmount: api_data.data.data[i].instAmount,
          totalInstallmentAmount: api_data.data.data[i].totalInstAmount,
          isCharged: !(api_data.data.data[i].isInclude),
          instTypeId: api_data.data.data[i].instTypeId,
          monthGap: api_data.data.data[i].monthGap
        })
      }

      setSaleAgreements(model => ({...model, vmSaleAgreementInstallments: tempInst}))
    } catch (e) {
      toast.error("No installments plans were loaded.");
    }
  }

  const handleSaleAgreementsData = (updated: any) => {
    if (saleAgreements?.agreeId){
      return
    }
    setSaleAgreements(model => ({ ...model, ...updated }))
    if(updated?.planId) {
      loadSaleAgreementsInstallments(updated?.planId).then(() => console.log("loaded"));
    }
  }

  const resetSaleAgreementsData = () => {
    setSaleAgreements(createNewSaleAgreements())
  }

  const storeSaleAgreements = async (attachments: File[]) => {
    try {
      let response: any;

      if (saleAgreements?.agreeId) {
        response = await axios.put('/SaleAgreement', saleAgreements);
      } else {
        response = await axios.post('/SaleAgreement', saleAgreements);
      }

      if (response?.data?.succeeded && attachments?.length > 0) {
        const { data } = response?.data;
        const formData = new FormData();
        formData.append('FormType', saleAgreementsFormType);
        formData.append('Recno', data.recno);

        attachments.forEach(file => {
          formData.append('objfile', file, file.name);
        });

        await axios.post('/FileUpload', formData);
      }

      toast.success('Sale Agreement saved successfully');
      return response?.data;

    }  catch (error: any) {
      console.error('Error storing Sale Agreement:', error);

      if (error?.response?.data) {
        const errData = error.response.data;

        if (errData?.errors) {
          const validationMessages = Object.entries(errData.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          toast.error(`Validation Error:\n${validationMessages}`);
        }
        else if (errData?.Message) {
          toast.error(errData.Message);
        } else if (errData?.title) {
          toast.error(errData.title);
        } else {
          toast.error('An unexpected error occurred while saving the sale agreement.');
        }
      } else {
        toast.error('Network or server error. Please try again later.');
      }

      throw error;
    }
  };

  const removeSaleDetailAgreements = (index: number) => {
    setSaleAgreements(sAgreement => {
      const newDetails = [...sAgreement.vmSaleAgreementInstallments];
      newDetails.splice(index, 1);

      return {
        ...sAgreement,
        vmSaleAgreementInstallments: newDetails
      };
    });
  }

  function recalcFrom(
    source: 'percentage' | 'installmentAmount' | 'noOfInstallment' | 'totalInstallmentAmount' | 'defSalePrice',
    sub: any,
    sale: any
  ) {

    const salePrice = Number(sale?.orgPrice ?? sale?.defSalePrice ?? 0);
    const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

    let pct = sub.instPercentage != null ? Number(sub.instPercentage) : null;
    let per = sub.installmentAmount != null ? Number(sub.installmentAmount) : null;
    let n = sub.noOfInstallment != null ? Number(sub.noOfInstallment) : null;
    let total = sub.totalInstallmentAmount != null ? Number(sub.totalInstallmentAmount) : null;

    const safeN = n && n > 0 ? n : 1;

    const totalFromPct = (percent: number) => (salePrice * percent) / 100;
    const pctFromTotal = (t: number) => (salePrice > 0 ? (t / salePrice) * 100 : 0);

    switch (source) {
      case 'percentage': {
        if (pct != null && salePrice > 0) {
          total = totalFromPct(pct);
          per = total / safeN;
        }
        break;
      }

      case 'noOfInstallment': {
        if (!n || n <= 0) {
          break;
        }

        if (pct != null && salePrice > 0) {
          total = totalFromPct(pct);
          per = total / n;
        } else if (total != null && total > 0) {
          per = total / n;
          pct = pctFromTotal(total);
        } else if (per != null && per > 0) {
          total = per * n;
          pct = pctFromTotal(total);
        }
        break;
      }

      case 'installmentAmount': {
        if (per != null && safeN > 0) {
          total = per * safeN;
          pct = pctFromTotal(total);
        }
        break;
      }

      case 'totalInstallmentAmount': {
        if (total != null && safeN > 0) {
          per = total / safeN;
          pct = pctFromTotal(total);
        }
        break;
      }

      case 'defSalePrice': {
        if (pct != null && salePrice > 0) {
          total = totalFromPct(pct);
          per = total / safeN;
        } else if (total != null && total > 0) {
          pct = pctFromTotal(total);
          per = total / safeN;
        } else if (per != null && per > 0) {
          total = per * safeN;
          pct = pctFromTotal(total);
        }
        break;
      }
    }

    return {
      ...sub,
      noOfInstallment: n != null ? n : null,
      instPercentage: pct != null ? round2(pct) : null,
      installmentAmount: per != null ? round2(per) : null,
      totalInstallmentAmount: total != null ? round2(total) : null,
    };
  }

  function recalcAllInstallments(
    installments: any[],
    sale: { orgPrice?: number; defSalePrice?: number }
  ) {
    const salePrice = Number(sale?.orgPrice ?? sale?.defSalePrice ?? 0);
    if (!salePrice || !Array.isArray(installments)) return installments;

    const updated = installments.map((sub) => {
      return recalcFrom("percentage", sub, { orgPrice: salePrice });
    });

    const totalSum = updated.reduce(
      (sum, s) => sum + Number(s.totalInstallmentAmount ?? 0),
      0
    );

    const diff = Math.round((salePrice - totalSum + Number.EPSILON) * 100) / 100;
    if (Math.abs(diff) > 0.01 && updated.length > 0) {
      const last = updated[updated.length - 1];
      last.totalInstallmentAmount = Math.round(
        ((last.totalInstallmentAmount ?? 0) + diff + Number.EPSILON) * 100
      ) / 100;
      last.installmentAmount = Math.round(
        ((last.totalInstallmentAmount ?? 0) / (last.noOfInstallment || 1) +
          Number.EPSILON) *
        100
      ) / 100;
      last.instPercentage = Math.round(
        (((last.totalInstallmentAmount ?? 0) / salePrice) * 100 + Number.EPSILON) *
        100
      ) / 100;
    }
    setSaleAgreements((prev) => ({
      ...prev,
      vmSaleAgreementInstallments: updated
    }));
  }

  const values: any = useMemo(() => ({
      saleAgreements,
      user,
      loadSaleAgreementsData,
      handleSaleAgreementsData,
      removeSaleDetailAgreements,
      addInstallmentDetail,
      removeInstallmentDetail,
      handleInstallmentDetailData,
      resetSaleAgreementsData,
      storeSaleAgreements,
      recalcFrom,
      recalcAllInstallments,
    }),
    [
      saleAgreements,
      user,
      loadSaleAgreementsData,
      handleSaleAgreementsData,
      removeSaleDetailAgreements,
      addInstallmentDetail,
      removeInstallmentDetail,
      handleInstallmentDetailData,
      resetSaleAgreementsData,
      storeSaleAgreements,
      recalcFrom,
      recalcAllInstallments
    ]
  )

  return <SaleAgreementsContext.Provider value={values}>{children}</SaleAgreementsContext.Provider>
}

export {SaleAgreementsContext, SaleAgreementsProvider}

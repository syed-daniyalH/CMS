import { gql } from '@apollo/client';

export const GET_PROPERTY_TYPE_WISE_REPORT = gql`
query SalesInstallmentInstTypeWise($model: VMRptSalesSummaryListFiltersInput) {
  salesInstallmentInstTypeWise(model: $model) {
    nodes {
      agreeId
      saleDate
      floorName
      typeName
      propertyNo
      propertyStatus
      customerName
      customerIdentityNo
      areaMarla
      ratePerMarla
      areaSqft
      ratePerSqft
      perfrence
      perfrenceAmount
      plotAmount
      discountAmount
      netAmount
      regNo
      agentName
      agentComAmount
      totalInstAmount
      totalRecAmount
      totalPendingAmount
      totalInInstAmount
      totalInRecAmount
      totalInPendingAmount
      totalExInstAmount
      totalExRecAmount
      totalExPendingAmount
      typeAmounts {
        installmentTypeName
        instTypeId
        count
        totalAmount
        totalRecAmount
        totalPendingAmount
        totalInAmount
        totalInRecAmount
        totalInPendingAmount
        totalExAmount
        totalExRecAmount
        totalExPendingAmount
      }
    }
  }
}
`;

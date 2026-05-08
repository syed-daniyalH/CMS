import { gql } from '@apollo/client';

export const GET_PROPERTY_WISE_REPORT = gql`
query InstallmentsSummaryData($model: VMRptSalesSummaryListFiltersInput) {
  installmentsSummaryData(model: $model) {
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
      monthWiseAmounts {
        monthYear
        totalAmount
        totalRecAmount
        totalPendingAmount
        totalInAmount
        totalInRecAmount
        totalInPendingAmount

      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;

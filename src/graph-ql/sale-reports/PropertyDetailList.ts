import { gql } from '@apollo/client';

export const GET_SALE_SUMMARY_LIST = gql`
  query SalesSummaryData($model: VMRptSalesSummaryListFiltersInput) {
    salesSummaryData(model: $model) {
     nodes {
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
      totalAddtionalCharges
      receviedAddtionalCharges
      totalPlotInstllemntsAmount
      totalPlotInstllemntsReceviedAmount
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

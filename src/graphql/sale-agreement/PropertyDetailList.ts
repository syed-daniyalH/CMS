import { gql } from '@apollo/client';

export interface PropertyFilterModel {
  floorId?: number | null
  fromAreaSQFT?: number | null
  prefrenceId?: number | null
  propertyId?: number | null
  propertyNo?: string | null
  propertyTypeId?: number | null
  soldUnSoldStatus?: string | null
  statusId?: number | null
  toAreaSQFT?: number | null
}

export const  GET_PROPERTY_DETAIL_LIST = gql`
  query PropertyDetailList($model: VMRptPropertyListFiltersInput, $first: Int, $after: String, $last: Int, $before: String) {
  propertyDetailList(model: $model, first: $first, after: $after, last: $last, before: $before) {
    nodes {
      propertyId
      floorName
      typeName
      propertyNo
      setupDate
      currentStatus
      status
      areaSqft
      ratePerSqft
      areaMarla
      marlaRate
      marlaSize
      orgPrice
      saleablePrice
      prefName
      prefPercentage
      prefAmount
      secondNo
      regNo
      customerName
      customerIdentityNo
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

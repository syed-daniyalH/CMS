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

export const GET_RECEIPT_LIST = gql`
 query RecepitDetailList($model: VMRptRecepitListFiltersInput, $first: Int, $after: String, $last: Int, $before: String) {
  recepitDetailList(model: $model, first: $first, after: $after, last: $last, before: $before) {
    nodes {
      recepitId
      rno
      date
      propertyNo
      customerName
      customerIdentityNo
      paymentMode
      isRealized
      recAmount
      distAmount
      actAmount
      typeAmount
      instellmentType
      propertyType
      floorName
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`;

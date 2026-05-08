import { gql } from '@apollo/client';

export const GET_SINGLE_RECEIPT_DETAIL = gql`
query SingleRecepitData($recepitId: Int!) {
  singleRecepitData(recepitId: $recepitId) {
    nodes {
      recepitId
      rno
      actualAmount
      distAmount
      recepitAmount
      customerName
      customerIdentityNo
      recepitDate
      paymentMode
      manualRecpNo
      remarks
      isRealized
      vMRptSingleRecepitRefrenceList {
        installmentType
        propertyType
        propertyNo
        floorName
      }
    }
  }
}
`;

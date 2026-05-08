
export const StatusColor = (type: string, columnName: string) => {


  if (columnName.toLowerCase() === 'status' && type) {
    const normalizedType = type.toLowerCase().trim().replace(/\s+/g, ' ');

    return (
      normalizedType === 'pending' ? "#686868" :
        normalizedType === 'paid' ? "#2C962C" :
          normalizedType === 'overdue' ? "#f00" :
            normalizedType === 'out of stock' ? "#f00" :
              normalizedType === 'void' ? "#FFA500" :
                normalizedType === 'low' ? "#FFA500" :
                  normalizedType === 'billed' ? "#2C962C" :
                    normalizedType === 'safe' ? "#2C962C" :
                      type.toLowerCase() === 'pending' ? "#686868" :
                        type.toLowerCase() === 'paid' ? "#2C962C" :
                          type.toLowerCase() === 'overdue' ? "#f00" :
                            type.toLowerCase() === 'out of stock' ? "#f00" :
                              type.toLowerCase() === 'void' ? "#FFA500" :
                                type.toLowerCase() === 'low' ? "#FFA500" :
                                  type.toLowerCase() === 'billed' ? "#2C962C":
                                    type.toLowerCase() === 'safe' ? "#2C962C":
                                      type.toLowerCase() === 'partially billed' ? "#2C962C" :
                      normalizedType === 'partially billed' ? "#2C962C" :
                        '#686868'
    );
  }
}
// export const StatusColor = (type: string, columnName: string) => {

//   if(columnName.toLowerCase() === 'status' && type)
//     return (
//       type.toLowerCase() === 'pending' ? "#686868" :
//         type.toLowerCase() === 'paid' ? "#2C962C" :
//           type.toLowerCase() === 'overdue' ? "#f00" :
//           type.toLowerCase() === 'out of stock' ? "#f00" :
//             type.toLowerCase() === 'void' ? "#FFA500" :
//             type.toLowerCase() === 'low' ? "#FFA500" :
//               type.toLowerCase() === 'billed' ? "#2C962C":
//               type.toLowerCase() === 'safe' ? "#2C962C":
//                 type.toLowerCase() === 'partially billed' ? "#2C962C" : '#686868'
//
//     )
// }

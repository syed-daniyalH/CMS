//@ts-ignore
import base64url from "base64-url";
import queryString from "query-string";


export const encodeParameters = (parameters: any) => {
  return base64url.encode((queryString.stringify(parameters)))
}

export const decodeParameters = (encoded: string | any) => {
  let decodedParams = base64url.decode(encoded);
  return queryString.parse(decodedParams);
}

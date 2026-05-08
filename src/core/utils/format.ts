import {PaymentTypes} from './types'
import {LoginDataType} from "../../context/types";

//@ts-ignore
import dateFormat from 'dateformat'
import {PolicyDetailDataType, ScreenGroup} from "../../store/roles-permissions";
import {ToWords} from "to-words";
import axios from "axios";
import { MutableRefObject } from 'react'
import { GridApiCommunity } from '@mui/x-data-grid/internals'

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

// ** Checks if the passed date is today
const isToday = (date: Date | string) => {
  const today = new Date()

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  )
}


export const getLastEnableColumn = (apiRef: MutableRefObject<GridApiCommunity>, defaultValue: string): string => {
  const allColumns = apiRef.current.getAllColumns();
  const visibleEditableColumns = allColumns.filter((col: any) => col.hide !== true && col.editable === true);

  if(visibleEditableColumns.length > 0) {
    return visibleEditableColumns[visibleEditableColumns.length - 1].field;
  } else {
    return defaultValue;
  }
}

export function idGenerator(): string {
  return Math.floor(Math.random() * 100001).toString();
}

export const showField = (list: any[], keyName: string) => {
  return list.some(item => item.keyName === keyName && item.isVisible);
}

export const formatDate = (
  value: any,
  formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const formatDateFields = (
  value: Date | string
) => {
  if (!value) return value
  const date = new Date(value);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date | string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const formatCurrency = (number: number | null | undefined, currencyCode: string | null, open?: boolean | null) => {
  if (currencyCode) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(number??0);
  } else {
    // Format as currency but remove currency symbol
    let options: any = {
      style: 'currency',
      currency: defaultCurrencyCode, // Use any default currency for formatting
    };

    if(open) {
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 13;
    }
    const formatter = new Intl.NumberFormat('en-US', {...options});

    // Format the number
    let formattedNumber = formatter.format(number??0);

    // Remove the currency symbol
    formattedNumber = formattedNumber.replace(/[^0-9.,-]/g, '').trim();

    return formattedNumber;
  }
}

export const getCardImage = (brand: string) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return '/images/cards/visa-with-bg.png';
    case 'mastercard':
      return '/images/cards/mastercard-with-bg.png';
    case 'american express':
      return '/images/cards/american-express-with-bg.png';
    default:
      return '/images/cards/visa-with-bg.png';
  }
}

export const formatQty = (number: number | null | undefined) => {
    // Format as currency but remove currency symbol
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrencyCode, // Use any default currency for formatting
      minimumFractionDigits: 2, // Ensure 3 decimal places
      maximumFractionDigits: 4,
    });

    // Format the number
    let formattedNumber = formatter.format(number??0);

    // Remove the currency symbol
    formattedNumber = formattedNumber.replace(/[^0-9.,-]/g, '').trim();

    return formattedNumber;
}

// ? The following functions are taken from https://codesandbox.io/s/ovvwzkzry9?file=/utils.js for formatting credit card details
// Get only numbers from the input value
const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '')
}

export const kFormatter = (num: number | null): string => {
  let number = num??0;
  const absNum = Math.abs(number??0);

  if (absNum < 1000) {
    return number.toString();
  } else if (absNum >= 1000 && absNum < 1_000_000) {
    return (Math.sign(number) * +(absNum / 1000).toFixed(2)) + 'k';
  } else if (absNum >= 1_000_000 && absNum < 1_000_000_000) {
    return (Math.sign(number) * +(absNum / 1_000_000).toFixed(2)) + 'M';
  } else {
    return (Math.sign(number) * +(absNum / 1_000_000_000).toFixed(2)) + 'B';
  }
}

// Format credit cards according to their types
export const formatCreditCardNumber = (value: string, Payment: PaymentTypes) => {
  if (!value) {
    return value
  }

  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(
        12,
        19
      )}`
      break
  }

  return nextValue.trim()
}

export const globalDateFormat = "dd-MM-yyyy";
export const globalSendDateFormat = "yyyy-mm-dd'T'HH:MM:ss";
export const defaultCurrencyCode = "AED";

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

// Format CVC in any credit card
export const formatCVC = (value: string, cardNumber: string, Payment: PaymentTypes) => {
  const clearValue = clearNumber(value)
  const issuer = Payment.fns.cardType(cardNumber)
  const maxLength = issuer === 'amex' ? 4 : 3

  return clearValue.slice(0, maxLength)
}


export const getFingerprint = (callback: (name: any) => void) => {
  //@ts-ignore
  const RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection

  const addrs = Object.create(null)
  addrs["0.0.0.0"] = false

  const fingerprint = () => {
    const rtc = new RTCPeerConnection({iceServers: []})

    //@ts-ignore
    if (1 || window.mozRTCPeerConnection) {
      rtc.createDataChannel('', {reliable: false})
    }
    const updateDisplay = (newAddr: any) => {
      if (!(newAddr in addrs)) addrs[newAddr] = true
    }

    const grepSDP = (sdp: any) => {
      sdp.split('\r\n').forEach((line: any) => {
        if (~line.indexOf("a=candidate")) {
          const parts = line.split(' '),
            addr = parts[4],
            type = parts[7]
          if (type === 'host') updateDisplay(addr)
        } else if (~line.indexOf("c=")) {
          const parts = line.split(' '),
            addr = parts[2]
          updateDisplay(addr)
        }
      })
      const displayAddrs = Object.keys(addrs).filter((k) => addrs[k])
      callback(displayAddrs)
    }

    rtc.onicecandidate = (evt: any) => evt.candidate && grepSDP("a=".concat(evt.candidate.candidate))

    rtc.createOffer((offerDesc: any) => {
      grepSDP(offerDesc.sdp)
      rtc.setLocalDescription(offerDesc)
    }, (e: any) => {
      console.warn("offer failed", e)
    })
  }


  if (RTCPeerConnection) {
    fingerprint()
  } else {
    callback([])
  }
}

export const imageUrlToBase64 = async (url: string) => {

  try {
    const response = await axios.get(`${url}?asBase64=true`);

 return response?.data

  } catch (error) {
    console.error('Error converting image to base64:', error);
  }
}
export const applyOpacityToBase64Image = (
  base64Image: any,
  opacity: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const fadedBase64 = canvas.toDataURL("image/png");
        resolve(fadedBase64);
      } else {
        resolve(base64Image); // fallback
      }
    };

    img.onerror = () => resolve(base64Image); // fallback
  });
};

interface DateRangeType {
  fromDate: string | Date;
  toDate: string | Date;
}

interface DataDateRangeType {
  dataFromDate: string | Date;
  dataToDate: string | Date;
}

export const getDateRange = (type: number, userData: LoginDataType | null): DateRangeType => {
  let fYearType = userData?.fYearType ?? 1;
  let weekType = userData?.weekType ?? 3;
  const now = new Date();
  let firstDay = new Date();
  let lastDay = new Date();

  if (type === 0) { // Today
    firstDay = new Date();
    lastDay = new Date();
  } else if (type === 1) { // Yesterday
    firstDay = new Date(now.setDate(now.getDate() - 1));
    lastDay = new Date(now.setDate(now.getDate()));
  } else if (type === 2) { // This Week
    let first = now.getDate() - now.getDay() + 1; // Default to Monday

    switch (weekType) {
      case 1:
        first = now.getDate() - now.getDay() + 6; // Saturday
        break;
      case 2:
        first = now.getDate() - now.getDay() + 7; // Sunday
        break;
      case 3:
        first = now.getDate() - now.getDay() + 1; // Monday
        break;
      case 4:
        first = now.getDate() - now.getDay() + 2; // Tuesday
        break;
      case 5:
        first = now.getDate() - now.getDay() + 3; // Wednesday
        break;
      case 6:
        first = now.getDate() - now.getDay() + 4; // Thursday
        break;
      case 7:
        first = now.getDate() - now.getDay() + 5; // Friday
        break;
      default:
        break;
    }

    if (first > now.getDate()) {
      first -= 7;
    }

    firstDay = new Date(now.setDate(first));
    lastDay = new Date(now.setDate(now.getDate() + 6));
  } else if (type === 3) { // Last 7 Days
    firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    lastDay = new Date();
  } else if (type === 4) { // This month
    firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (type === 5) { // Last Month
    firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (type === 6) { // Last 30 days
    firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    lastDay = new Date();
  } else if (type === 10) { // Last 6 Months
    firstDay = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    lastDay = new Date();
  } else if (type === 7) { // This Year
    if (fYearType > 1) {
      if (now.getMonth() + 1 >= fYearType) {
        firstDay = new Date(now.getFullYear(), fYearType - 1, 1);
        lastDay = new Date(now.getFullYear() + 1, fYearType - 1, 0);
      } else {
        firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
        lastDay = new Date(now.getFullYear(), fYearType - 1, 0);
      }
    } else {
      firstDay = new Date(now.getFullYear(), 0, 1);
      lastDay = new Date(now.getFullYear(), 11, 31);
    }
  } else if (type === 8) { // year to date Year
    if (now.getMonth() + 1 >= fYearType) {
      firstDay = new Date(now.getFullYear(), fYearType - 1, 1);
    } else {
      firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
    }
    lastDay = new Date();
  } else if (type === 9) { // last year to date
    if (now.getMonth() + 1 >= fYearType) {
      firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
    } else {
      firstDay = new Date(now.getFullYear() - 2, fYearType - 1, 1);
    }
    lastDay = new Date();
  } else if (type === 11) { // last year
    if (now.getMonth() + 1 >= fYearType) {
      firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
      lastDay = new Date(now.getFullYear(), fYearType - 1, 0);
    } else {
      firstDay = new Date(now.getFullYear() - 2, fYearType - 1, 1);
      lastDay = new Date(now.getFullYear() - 1, fYearType - 1, 0);
    }
  }

  return {
    fromDate: dateFormat(firstDay, globalSendDateFormat),
    toDate: dateFormat(lastDay, globalSendDateFormat),
  };
};


export const getDateFromMonth = (month: string, year: number): DataDateRangeType => {
  let firstDay = new Date();
  let lastDay = new Date();

  let monthName = month.toLowerCase();

  if(monthName === 'jan' || monthName === 'january') {
    firstDay = new Date(year, 0, 1);
    lastDay = new Date(year, 1, 0);
  } else if(monthName === 'feb' || monthName === 'february') {
    firstDay = new Date(year, 1, 1);
    lastDay = new Date(year, 2, 0);
  } else if(monthName === 'mar' || monthName === 'march') {
    firstDay = new Date(year, 2, 1);
    lastDay = new Date(year, 3, 0);
  } else if(monthName === 'apr' || monthName === 'april') {
    firstDay = new Date(year, 3, 1);
    lastDay = new Date(year, 4, 0);
  } else if(monthName === 'may') {
    firstDay = new Date(year, 4, 1);
    lastDay = new Date(year, 5, 0);
  } else if(monthName === 'jun' || monthName === 'june') {
    firstDay = new Date(year, 5, 1);
    lastDay = new Date(year, 6, 0);
  } else if(monthName === 'jul' || monthName === 'july') {
    firstDay = new Date(year, 6, 1);
    lastDay = new Date(year, 7, 0);
  } else if(monthName === 'aug' || monthName === 'august') {
    firstDay = new Date(year, 7, 1);
    lastDay = new Date(year, 8, 0);
  } else if(monthName === 'sep' || monthName === 'september') {
    firstDay = new Date(year, 8, 1);
    lastDay = new Date(year, 9, 0);
  } else if(monthName === 'oct' || monthName === 'october') {
    firstDay = new Date(year, 9, 1);
    lastDay = new Date(year, 10, 0);
  } else if(monthName === 'nov' || monthName === 'november') {
    firstDay = new Date(year, 10, 1);
    lastDay = new Date(year, 11, 0);
  } else if(monthName === 'dec' || monthName === 'december') {
    firstDay = new Date(year, 11, 1);
    lastDay = new Date(year+1, 0, 0);
  }

  return {
    dataFromDate: dateFormat(firstDay, globalSendDateFormat),
    dataToDate: dateFormat(lastDay, globalSendDateFormat),
  };
};

export const cvalue = (value: any) => {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
}
export const getDateFromTerm = (term = "", invDate: Date = new Date()): Date => {
  let dueDate = new Date(new Date(invDate).toUTCString());

  switch (term.toLowerCase()) {
    case "due on receipt":
      break; // No change needed, due date is the invoice date
    case "net 15":
      dueDate.setDate(dueDate.getDate() + 15);
      break;
    case "net 30":
      dueDate.setDate(dueDate.getDate() + 30);
      break;
    case "net 45":
      dueDate.setDate(dueDate.getDate() + 45);
      break;
    case "net 60":
      dueDate.setDate(dueDate.getDate() + 60);
      break;
    case "due end of the month":
      dueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0);
      break;
    case "due end of next month":
      dueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 2, 0);
      break;
    default:
      let days: number = parseInt(term);
      dueDate.setDate(dueDate.getDate() + (isNaN(days) ? 0 : days));
      break;
  }

  return new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()));
}

export const getBrowserType = (): string => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Firefox')) {
    return 'firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'safari'; // Safari does not include 'Chrome' in its userAgent
  } else if (userAgent.includes('Chrome')) {
    return 'chrome';
  } else if (userAgent.includes('Edge')) {
    return 'edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'opera';
  }

  return 'unknown';
}

export const fixedGridHeaderTop = {
  position: 'fixed',
  top: {
    xs: '56px',
    sm: '64px',
    md: '65px', // Desktops
  },
  width: {
    width: '100%',
    xs: '100%',
    sm: '93.8%',
    md: '95.2%',
    lg: '98.8%',
    xl: '93.8%'

  },
  '@media (min-width: 1920px)': {
    width: '75%'
  },
  '@media (min-width: 2120px)': {
    width: '62.5%'
  },

  zIndex: 2400,
  transition: 'position 0.3s ease'
}

export const customDateFormat = 'dd-MM-yyyy';

// export const isDate = (dateString: any) => {
//
//   if (dateString && dateString !== "" && typeof dateString === 'string') {
//     // Check if the string is a valid date format using a regular expression
//     const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/ ;
//     if (!dateRegex.test(dateString)) {
//       return false;
//     }
//
//
//     const parsedDate = new Date(dateString);
//
//     return !isNaN(parsedDate.getTime());
//   } else {
//     return false;
//   }
// }
export const isDate = (dateString: any) => {
  if (dateString && typeof dateString === 'string') {
    // Match ISO 8601 with either Z or offset (e.g., +05:00)
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/;

    if (!dateRegex.test(dateString)) return false;

    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
  }

  return false;
};

export function groupByScreenGroup(screens: PolicyDetailDataType[]): ScreenGroup[] {
  const groupedMap = screens.reduce((acc, screen) => {
    let group = acc.get(screen.screenGroup);

    if (!group) {
      group = { screenGroup: screen.screenGroup, viewScreen: true, addScreen: true, deleteScreen: true, updateScreen: true, others: true, screens: [] };
      acc.set(screen.screenGroup, group);
    }

    group.screens.push(screen);

    // If any screen in the group has viewScreen set to false, set the group's viewScreen to false
    if (!screen.viewScreen) {
      group.viewScreen = false;
    }

    if (!screen.addScreen) {
      group.addScreen = false;
    }

    if (!screen.updateScreen) {
      group.updateScreen = false;
    }

    if (!screen.deleteScreen) {
      group.deleteScreen = false;
    }

    return acc;
  }, new Map<string, ScreenGroup>());

  // Convert the Map to a list of ScreenGroups
  return Array.from(groupedMap.values());
}

// Convert the grouped structure back to a flat list for sending to the server
export function flattenGroupedScreens(groupedScreens: ScreenGroup[]): PolicyDetailDataType[] {
  return groupedScreens.flatMap(group =>
    group.screens.map(screen => ({
      ...screen,
    }))
  );
}

// ** convert number in words
export const inWords = (number:any, defaultCurrency:any) => {
  const toWords = new ToWords({
    localeCode: 'en-US',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: defaultCurrency?.code,
        plural: defaultCurrency?.code,
        symbol: defaultCurrency.symbol,
        fractionalUnit: {
          name: defaultCurrency.subUnit ?? "",
          plural: defaultCurrency.subUnit ?? "",
          symbol: '',
        },
      }
    }
  });
  return toWords?.convert(number ?? 0);
}

// activity logs time

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  }
}

export const getHeaderName = (field: string, defaultName: string, columnsList: any[]) => {
  let obj = columnsList.find((element: any) => element.columnName === field);

  return obj?.columnDescription??defaultName;
}

export const getDateRangeByFilter = (type: string, userData: any) => {
  let fYearType = userData?.fYearType ?? 1;
  let weekType = userData?.weekType ?? 3;
  const now = new Date();
  let firstDay = new Date(),
    lastDay = new Date();
  if (type === "today") {
    firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (type === "previousQuarter") {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();


    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;


    let prevQuarterStartMonth = quarterStartMonth - 3;
    if (prevQuarterStartMonth < 0) {
      prevQuarterStartMonth += 12;
    }
    const prevQuarterEndMonth = quarterStartMonth - 1 >= 0 ? quarterStartMonth - 1 : 11;

    const prevQuarterStartDate = new Date(currentYear, prevQuarterStartMonth, 1);
    const prevQuarterEndDate = new Date(currentYear, prevQuarterEndMonth, new Date(currentYear, prevQuarterEndMonth + 1, 0).getDate());

    firstDay = prevQuarterStartDate;
    lastDay = prevQuarterEndDate;
  }
  if (type === "previousYear") {
    const prevYear = now.getFullYear() - 1;
    firstDay = new Date(prevYear, 0, 1);
    lastDay = new Date(prevYear, 11, 31);
  }

  if (type === "thisQuarter") {
    const currentMonth = now.getMonth();
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    firstDay = new Date(now.getFullYear(), quarterStartMonth, 1);
    lastDay = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
  }
  if (type === "month") {
    firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (type === "week") {
    let first = now.getDate() - now.getDay() + 1; // First day is the day of the month - the day of the week
    if (weekType === 1) {
      first = now.getDate() - now.getDay() + 6; // First day is the day of the month - the day of the week
    } else if (weekType === 2) {
      first = now.getDate() - now.getDay() + 7; // First day is the day of the month - the day of the week
    } else if (weekType === 3) {
      first = now.getDate() - now.getDay() + 1; // First day is the day of the month - the day of the week
    } else if (weekType === 4) {
      first = now.getDate() - now.getDay() + 2; // First day is the day of the month - the day of the week
    } else if (weekType === 5) {
      first = now.getDate() - now.getDay() + 3; // First day is the day of the month - the day of the week
    } else if (weekType === 6) {
      first = now.getDate() - now.getDay() + 4; // First day is the day of the month - the day of the week
    } else if (weekType === 7) {
      first = now.getDate() - now.getDay() + 5; // First day is the day of the month - the day of the week
    }

    if(first > now.getDate()){
      first = first-7;
    }

    firstDay = new Date(now.setDate(first));
    lastDay = new Date(now.setDate(now.getDate() + 6));
  } else if (type === "yesterday") {
    firstDay = new Date(now.setDate(now.getDate() - 1));
    lastDay = new Date(now.setDate(now.getDate()));
  }
  if (type === "previousWeek") {
    const today = now.getDay();
    const diff = today === 0 ? 6 : today;
    const prevMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    firstDay = new Date(prevMonday.getFullYear(), prevMonday.getMonth(), prevMonday.getDate() - 6);
    lastDay = new Date(prevMonday.getFullYear(), prevMonday.getMonth(), prevMonday.getDate());
  }

  else if (type === "LastSevenDays") {
    firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    lastDay = new Date(now);
  } else if (type === "LastMonth") {
    firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (type === "LastThirtyDays") {
    firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    lastDay = new Date(now);
  }else if (type === "LastSixMonths") {
    firstDay = new Date(now.getFullYear(), now.getMonth()-6, 1);
    lastDay = new Date(now);
  } else if (type === "YearToDate") {
    if (now.getMonth() + 1 >= fYearType) {
      firstDay = new Date(now.getFullYear(), fYearType - 1, 1);
    } else {
      firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
    }
    lastDay = new Date(now);
  } else if (type === "PrevYearDate") {
    if (now.getMonth() + 1 >= fYearType) {
      firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
    } else {
      firstDay = new Date(now.getFullYear() - 2, fYearType - 1, 1);
    }
    lastDay = new Date(now);
  }  else if (type === "thisYear") {
    firstDay = new Date(now.getFullYear(), 0, 1);
    lastDay = new Date(now.getFullYear(), 11, 31);
  }else if (type === "year") {
    if (fYearType > 1) {
      if (now.getMonth() + 1 >= fYearType) {
        firstDay = new Date(now.getFullYear(), fYearType - 1, 1);
        lastDay = new Date(now.getFullYear() + 1, fYearType - 1, 0);
      } else {
        firstDay = new Date(now.getFullYear() - 1, fYearType - 1, 1);
        lastDay = new Date(now.getFullYear(), fYearType - 1, 0);
      }
    } else {
      firstDay = new Date(now.getFullYear(), 0, 1);
      lastDay = new Date(now.getFullYear(), 11, 31);
    }
  }

  return {fromDate: firstDay, toDate: lastDay};
}
export const formatQueryDate = (date: any) => {
  if(date) {
    date = new Date(date);
    const year = date?.getFullYear();
    const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date?.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};
export const BusinessfixedGridHeaderTop = {
  position: 'fixed',
  top: {
    xs: '56px',
    sm: '64px',
    md: '65px', // Desktops
  },


  zIndex: 23,
  transition: 'position 0.3s ease'
};

export const getAccountLevelColor = (level: number, maxLevel: number) => {
  if(level === 1) {
    return 'success'
  } else if(level === maxLevel) {
    return 'secondary'
  } else if(level === 2) {
    return 'warning'
  } else if(level === 3) {
    return maxLevel === 3 ? 'secondary' : 'info'
  } else if(level === 4) {
    return maxLevel === 3 ? 'info' : 'error'
  } else if(level === 5) {
    return 'error'
  } else {
    return 'secondary'
  }
}

export const getProjectDetail = ( projectType: number) => {
  if(projectType === 1) {
    return 'Floor/Block'
  } else if(projectType === 2) {
    return 'Floor'
  } else if(projectType === 3) {
    return 'Block'
  }

}
export const getProjectField = (projectType: number) => {
  switch (projectType) {
    case 1:
      return {

        fields: ['areaMarla', 'rateMarla', 'areaSqft'],
      };
    case 2:
      return {

        fields: ['rateMarla', 'areaSqft'],
      };
    case 3:
      return {

        fields: ['areaMarla', 'rateMarla'],
      };
    default:
      return {
        label: '',
        fields: [],
      };
  }
};

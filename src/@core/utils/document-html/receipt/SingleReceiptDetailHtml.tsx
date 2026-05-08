// src/core/utils/document/html/sale-agreements/SingleReceiptHtml.ts

import { LoginDataType } from 'src/context/types'
import { formatCurrency, formatDate, getProjectField, inWords } from '../../format'

// ------------ Types ------------
type ReceiptRef = {
  instellmentType?: string | null
  propertyType?: string | null
  propertyNo?: string | null
  floorName?: string | null
  amount?: number | null
}

type ReceiptInput = {
  recepitId?: number | null
  rno?: string | null
  recepitNo?: string | null
  actualAmount?: number | null
  distAmount?: number | null
  recepitAmount?: number | null
  customerCode?: string | null
  customerName?: string | null
  customerIdentityNo?: string | null
  recepitDate?: string | null
  paymentMode?: string | null
  manualRecpNo?: string | null
  remarks?: string | null
  guardianName?: string | null
  vMRptSingleRecepitRefrenceList?: ReceiptRef[] | null
}

// ------------ Helpers ------------
const safe = (v?: string | number | null) => (v ?? '') as string

// ------------ Main ------------
export const SingleReceiptHtml = (
  itemStr: string | null,
  user: LoginDataType | null,
  _name: string,
  defaultTanent: any,
) => {
  let item: ReceiptInput = {}
  try {
    item = JSON.parse(itemStr || '{}')
  } catch {
    // ignore
  }

  const projectInfo: any = getProjectField(user?.projectType ?? 1)
  const projectName = projectInfo?.projectName || defaultTanent?.name || 'Project-A'
  const now = new Date();
  const currentDateTime = now.toLocaleString();
  const city = defaultTanent?.city || ''
  const email = defaultTanent?.email || ''
  const url = defaultTanent?.url || ''
  const uan = defaultTanent?.uan || ''

  const receiptNo =
    safe(item.recepitNo) || safe(item.rno) || safe(item.recepitId)
  const receiptAmount = item.recepitAmount ?? item.actualAmount ?? 0
  const discount = item.distAmount ?? 0
  const amountInWords = receiptAmount
    ? ` ${inWords(receiptAmount, 'Pkr')}.`
    : ''

  const distAmountCode = safe((item as any).distAmount || '')
  const customerName = safe(item.customerName)
  const fatherName = safe(item.guardianName)

  const paymentMode = safe(item.paymentMode || 'Cash')

  const refs: ReceiptRef[] =
    Array.isArray(item.vMRptSingleRecepitRefrenceList)
      ? item.vMRptSingleRecepitRefrenceList!
      : []

  // ----- helper to render ONE copy (markup is your original .wrapper) -----
  const renderCopy = (copyLabel: string) => `
<div class="wrapper">


  <!-- Top header -->
  <div class="center">
    <div class="title-project">${safe(projectName)}</div>
    ${city ? `<div class="subtitle">${safe(city)}</div>` : ''}
    <div class="meta-line">
      ${email ? `E-Mail: ${safe(email)}&nbsp;&nbsp;&nbsp;` : 'E-Mail:&nbsp;&nbsp;&nbsp;'}
    </div>
    ${uan ? `<div class="meta-line">UAN: ${safe(uan)}</div>` : ''}
  </div>
  <div class="copy-label">
    ${copyLabel} - ${currentDateTime}
  </div>
  <div class="green-bar"></div>

  <div class="receipt-heading-row">
    <div style="width:25%"></div>
    <div class="receipt-title">Receipt</div>
  </div>

  <div class="hr-thick"></div>
  <div class="hr-thicksub"></div>

  <!-- Customer & receipt info -->
  <div class="header-grid">
    <!-- Left -->
    <div>
      <div class="field-box">
        <span class="field-label-inline">Name.</span>
        <span>${customerName}</span>
      </div>
      <div class="field-box">
        <span class="field-label-inline">Receipt No.</span>
        <span>${receiptNo}</span>
      </div>

      <div class="field-box">
        <span class="field-label-inline">Discount</span>
        <span>${distAmountCode}</span>
      </div>

      <div class="plain-text"><strong>Manual Receipt #</strong> ${safe(item.manualRecpNo)}</div>
      <div class="plain-text"><strong>Payment Received In ${paymentMode || 'Cash'}.</strong></div>
    </div>

    <!-- Right -->
    <div>
      <div class="right-box">
        <span class="right-label">S/o W/o D/o</span>
        <span class="right-value">${fatherName}</span>
      </div>

      <div class="right-box">
        <span class="right-label">Receipt Date</span>
        <span class="right-value">${formatDate(item.recepitDate)}</span>
      </div>
      <div class="right-box">
        <span class="right-label">Receipt Amount</span>
        <span class="right-value">${formatCurrency(receiptAmount, null)}</span>
      </div>
    </div>
  </div>

  <!-- Detail table -->
  <table class="details-table">
    <thead>
      <tr>
        <th class="col-sr">Sr.#</th>
        <th class="col-paytype">Payment Type</th>
        <th class="col-propno">Property No</th>
        <th class="col-block">Block / Floor</th>
        <th class="col-amt">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${
    refs.length
      ? refs
        .map((r, idx) => {
          const rowAmount =
            refs.length === 1 ? receiptAmount : (r.amount ?? null)
          return `
      <tr>
        <td class="col-sr">${idx + 1}</td>
        <td class="col-paytype">${safe(r.instellmentType)}</td>
        <td class="col-propno">${safe(r.propertyNo)}</td>
        <td class="col-block">${safe(r.floorName || r.propertyType)}</td>
        <td class="col-amt">${formatCurrency(rowAmount, null)}</td>
      </tr>`
        })
        .join('')
      : `
      <tr>
        <td class="col-sr">1</td>
        <td class="col-paytype"></td>
        <td class="col-propno"></td>
        <td class="col-block"></td>
        <td class="col-amt">${formatCurrency(receiptAmount, null)}</td>
      </tr>`
  }
    </tbody>
  </table>

  <!-- Totals -->
  <table style="width:100%; margin-top:4px; border-collapse:collapse;">
    <tr class="totals-row">
      <td class="totals-label">Total</td>
      <td class="totals-value">${formatCurrency(receiptAmount, null)}</td>
    </tr>
    ${
    discount
      ? `<tr class="totals-row">
      <td class="totals-label">Less: Discount</td>
      <td class="totals-value">${formatCurrency(discount, null)}</td>
    </tr>`
      : ''
  }
  </table>

  <!-- Amount in words -->
  <div class="amount-words"> Amount In Words : <span> ${amountInWords}</span></div>
  <div class="signs no-break">
    <div class="sigbox"><div class="sigline">Received &nbsp;By</div></div>
  </div>
</div>
`

  // ----- final HTML: Office copy + page-break + Client copy -----
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Receipt - ${projectName}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 10mm 12mm 14mm; }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #000000;
  }

  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 11px;
    line-height: 1.3;
  }

  .wrapper {
    width: 100%;
  }

  .center {
    text-align: center;
  }

  .title-project {
    font-size: 22px;
    font-weight: 700;
    margin-top: 12mm;
  }

  .subtitle {
    font-size: 10px;
    margin-top: 2px;
  }

  .meta-line {
    font-size: 9px;
    margin-top: 2px;
  }

  .green-bar {
    margin-top: 12px;
    height: 7px;
    background: #008000;
    border: 1px solid #000;
  }

  .receipt-heading-row {
    margin-top: 6px;
    align-items: center;
    justify-content: space-between;
  }

  .receipt-title {
    flex: 1;
    text-align: center;
    font-size: 22px;
    font-weight: 700;
  }

  .barcode {
    font-size: 12px;
    font-weight: 600;
  }

  .hr-thick {
    height: 2px;
    background: #000;
    margin-top: 6px;
    margin-bottom: 2px;
  }
  .hr-thicksub {
    height: 2px;
    background: #000;
    margin-top: 0px;
    margin-bottom: 10px;
  }

  .header-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.9fr;
    column-gap: 18px;
    margin-bottom: 14px;
  }

  .field-box {
    border: 2px solid #008000;
    padding: 4px 6px;
    margin-bottom: 6px;
    font-size: 11px;
  }

  .field-label-inline {
    font-weight: 700;
    margin-right: 6px;
  }

  .plain-text {
    font-size: 11px;
    margin: 3px 0;
  }

  .right-box {
    border: 2px solid #008000;
    padding: 4px 6px;
    margin-bottom: 6px;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .right-label {
    font-weight: 700;
  }

  .right-value {
    font-weight: 600;
  }

  /* Detail table */
  .details-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    table-layout: fixed;
  }

  .details-table th,
  .details-table td {
    border: 1px solid #000;
    padding: 4px 6px;
    font-size: 10.5px;
  }

  .details-table th {
    font-weight: 700;
    text-align: left;
  }

  .col-sr {
    width: 7%;
    text-align: center;
  }
  .col-paytype {
    width: 28%;
  }
  .col-propno {
    width: 30%;
  }
  .col-block {
    width: 20%;
  }
  .col-amt {
    width: 15%;
    text-align: right;
  }

  .totals-row td {
    border-top: none;
    font-weight: 700;
    padding-top: 8px;
  }

  .totals-label {
    text-align: right;
  }

  .totals-value {
    text-align: right;
    width: 60mm;
  }

  .amount-words {
    margin-top: 10px;
    font-size: 11px;
    font-weight: 700;
  }

  .mt-4 { margin-top: 4px; }

  .signs {
    display: grid;
    grid-template-columns: auto; /* one column */
    justify-content: end;        /* move to the right */
    margin-top: 8px;
    bottom: 0;
  }

  .sigbox {
    height: 80px;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .sigline {
    border-top: 0.6px solid #333;
    text-align: center;
    padding-top: 3px;
    font-size: 10px;
    font-weight: 700;
  }

  /* Copy label & page break */
  .copy-label {
    font-size: 11px;
    font-weight: 700;
    text-align: right;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .page-break {
    page-break-after: always;
  }

  /* Print helpers */
  .no-break { page-break-inside: avoid; }
</style>
</head>
<body>

${renderCopy('Office Copy')}

<!-- Dotted line for cutting -->
<p style="text-align: center; margin: 10px ;">
  .........................................................................................................................................................................................................................................................................................................................
</p>

${renderCopy(`Customer Copy`)}
</body>
</html>`
}

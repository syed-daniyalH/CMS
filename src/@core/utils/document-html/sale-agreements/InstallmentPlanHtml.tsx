// src/core/utils/document/html/sale-agreements/WelcomLetterHtml.ts

import { LoginDataType } from 'src/context/types'

type CustomerDetail = {
  firstName?: string | null
  secondName?: string | null
  gender?: string | null
  guardianName?: string | null
  email?: string | null
  phone1?: string | null
  identityNo?: string | null
  nationality?: string | null
  permAddress?: string | null
  tempAddress?: string | null
  imageUrl?: string | null
}

type LedgerInput = {
  // Property / pricing
  floorName?: string | null
  typeName?: string | null
  propertyNo?: string | null
  formNo?: string | null
  setupDate?: string | null
  currentStatus?: string | null
  status?: string | null
  areaSqft?: number | null
  ratePerSqft?: number | null
  areaMarla?: number | null
  marlaRate?: number | null
  marlaSize?: number | null
  orgPrice?: number | null
  saleablePrice?: number | null
  prefName?: string | null
  prefPercentage?: number | null
  prefAmount?: number | null
  secondNo?: string | null
  regNo?: string | null
  saleDate?: string | null
  distAmount?: number | null
  soldAmount?: number | null

  // Customer
  customerName?: string | null
  customerIdentityNo?: string | null
  customerDetail?: CustomerDetail

  // Agent
  agentName?: string | null
  agentIdentityNo?: string | null
  agentComAmount?: number | null
  agentComPercent?: number | null

  // Tables (backend shape)
  installmentSummary?: Array<{
    installmentId?: number
    instNo?: number
    instTypeDesc?: string
    instAmount?: number
    dueDate?: string
    recAmount?: number
    isCharged?: boolean
    vMRptInstRecevingDetails?: Array<{
      refId?: number
      recepitId?: number
      recepitNo?: string
      recepitDate?: string
      payementModeDesc?: string
      amount?: number
    }>
  }>
  otherCharges?: Array<{
    sr?: number
    type?: string
    amount?: number | null
    dueDate?: string | null
    paidAmount?: number | null
    receiptNo?: string | null
    date?: string | null
  }>
}

// ---------- Helpers ----------
const safe = (v?: string | number | null) => (v ?? '') as string
const comma = (n?: number | null) => (n != null ? Math.round(n).toLocaleString('en-PK') : '')
const fmtPKR = (n?: number | null) => (n != null ? `${comma(n)}/-` : '')
const fmtDate = (d?: string | null) => {
  if (!d) return ''
  const tryIso = new Date(d)
  if (!isNaN(tryIso.getTime())) {
    return tryIso
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(' ', '-')
  }
  return d
}
const maskPhone = (ph?: string | null) => {
  if (!ph) return ''
  const digits = ph.replace(/\D/g, '')
  const last = digits.slice(-3)
  return '*********' + last
}
const num = (v: any) => {
  const n = Number(v)
  return isFinite(n) ? n : 0
}

// ---------- Main ----------
export const InstallmentPlanHtml = (
  itemStr: string | null,
  _user: LoginDataType | null,
  _name: string,
  defaultTanent: any,
) => {
  let item: LedgerInput = {}
  try { item = JSON.parse(itemStr || '{}') } catch {}

  const c = item.customerDetail || {}
  const customerName =
    [safe(c.firstName), safe(c.secondName)].filter(Boolean).join(' ') || safe(item.customerName)
  const fatherLabel = c.gender?.toLowerCase() === 'female' ? 'D/O' : 'S/O'
  const nationality = c.nationality || 'Pakistani'
  const address = c.permAddress || c.tempAddress || ''
  const brand = defaultTanent?.name || ''

  const salePrice = item.saleablePrice ?? item.orgPrice ?? null
  const discount = item.distAmount ?? 0
  const received = item.soldAmount ?? 0
  const outstanding = (salePrice ?? 0) - received

  // ===== Flatten Installments → Receipt rows + compute balances & accumulated =====
  type DisplayRow = {
    sr: string | number
    dueDate: string
    type: string
    percent: string
    instAmount: number | null
    paidTotalForInst: number | null
    rcptNo: string
    rcptDate: string
    rcptAmt: number | null
    rcptType: string
    balanceAmt: number | null          // per-installment balance at this row
    accumulated: number | null         // grand accumulated across all receipts
    remarks: string
  }

  const installments = Array.isArray(item.installmentSummary) ? item.installmentSummary! : []
  installments.sort((a, b) => num(a.instNo) - num(b.instNo))

  let grandAccum = 0
  let totalInstAmount = 0
  let totalRecAmount = 0
  const flatRows: DisplayRow[] = []

  for (const inst of installments) {
    const srNo = num(inst.instNo) + 1 || ''
    const due = fmtDate(inst.dueDate)
    const instType = safe(inst.instTypeDesc)
    const instAmt = inst.instAmount ?? null
    const recAmtForInst = num(inst.recAmount || 0)

    totalInstAmount += num(inst.instAmount)
    totalRecAmount += recAmtForInst

    const receipts = Array.isArray(inst.vMRptInstRecevingDetails)
      ? inst.vMRptInstRecevingDetails!
      : []

    let instPaidSoFar = 0

    if (receipts.length) {
      receipts.forEach((r, idx) => {
        const rcptAmount = num(r.amount)
        instPaidSoFar += rcptAmount
        grandAccum += rcptAmount

        flatRows.push({
          sr: idx === 0 ? srNo : '',
          dueDate: idx === 0 ? due : '',
          type: idx === 0 ? instType : '',
          percent: '', // not in payload; left empty
          instAmount: idx === 0 ? instAmt : null,
          paidTotalForInst: idx === 0 ? recAmtForInst : null,
          rcptNo: safe(r.recepitNo),
          rcptDate: fmtDate(r.recepitDate),
          rcptAmt: rcptAmount || null,
          rcptType: safe(r.payementModeDesc),
          balanceAmt: instAmt != null ? instAmt - instPaidSoFar : null,
          accumulated: grandAccum || null,
          remarks: inst.isCharged ? 'Charged' : '',
        })
      })
    } else {
      // No receipts — still print a row
      const instBalance = instAmt != null ? instAmt - recAmtForInst : null
      flatRows.push({
        sr: srNo, dueDate: due, type: instType, percent: '',
        instAmount: instAmt, paidTotalForInst: recAmtForInst || null,
        rcptNo: '', rcptDate: '', rcptAmt: null, rcptType: '',
        balanceAmt: instBalance, accumulated: grandAccum || null,
        remarks: inst.isCharged ? 'Charged' : '',
      })
    }
  }

  // Totals
  const totalPaid = Math.max(grandAccum, totalRecAmount)
  const totalBalance = totalInstAmount - totalPaid

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>PROPERTY LEDGER / INSTALLMENT SCHEDULE</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 10mm 10mm 14mm; }

  *{ box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  html, body { margin:0; padding:0; background:#fff; color:#111; }
  /* Compact, Crestel-like typography */
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size:10.5px; line-height:1.35; }

  .hdr { text-align:center; margin-bottom:6px; }
  .brand { font-weight:700; font-size:12.5px; letter-spacing:.2px; }
  .title { font-weight:700; font-size:11.5px; text-decoration:underline; margin-top:2px; }

  /* Sections (summary tables) */
  .section { width:100%; border-collapse:collapse; border:0.6px solid #333; margin-top:8px; }
  .section th, .section td { border:0.6px solid #333; padding:4px 5px; vertical-align:top; }
  .section .head { font-weight:700; text-decoration:underline; padding:5px 6px; background:#f6f7f9; }
  .w25 { width:25%; }
  .muted { color:#666; }

  /* Main big table */
  .tbl { width:100%; border-collapse:collapse; margin-top:8px; table-layout:fixed; }
  .tbl th, .tbl td { border:0.6px solid #333; padding:4px 5px; }
  .tbl thead th {
    position: sticky; top: 0; background:#eef2f7; z-index: 2;
    font-weight:700; font-size:9.8px; letter-spacing:.2px;
  }
  .tbl tbody tr:nth-child(odd) { background:#fafbfc; }
  .tbl tbody tr { page-break-inside: avoid; }
  .ctr { text-align:center; }
  .num { text-align:right; font-variant-numeric: tabular-nums; }
  .totals td { font-weight:700; background:#f1f3f6; }

  /* Small caps labels inside group headers */
  .grp { font-weight:700; text-transform:uppercase; letter-spacing:.25px; }

  /* Signature boxes */
  .signs { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }
  .sigbox { border:0.6px solid #333; height:80px; display:flex; flex-direction:column; justify-content:flex-end; }
  .sigline { border-top:0.6px solid #333; text-align:center; padding-top:3px; font-size:10px; }

  /* Print helpers */
  .no-break { page-break-inside: avoid; }
</style>
</head>
<body>

  <!-- Header -->
  <div class="hdr">
    <div class="brand">${safe(brand)}</div>
    <div class="title">PROPERTY LEDGER / INSTALLMENT SCHEDULE</div>
  </div>

  <!-- Customer Details -->
  <table class="section no-break">
    <tr><td colspan="4" class="head">Customer Details :</td></tr>
    <tr>
      <td class="w25" style="font-weight:700;">Customer Name</td>
      <td class="w25">${customerName}</td>
      <td class="w25" style="font-weight:700;">S/O, W/O, D/O</td>
      <td class="w25">${fatherLabel} ${safe(c.guardianName)}</td>
    </tr>
    <tr>
      <td style="font-weight:700;">Mobile Number</td>
      <td>${maskPhone(c.phone1)}</td>
      <td style="font-weight:700;">Email</td>
      <td>${safe(c.email)}</td>
    </tr>
    <tr>
      <td style="font-weight:700;">CNIC</td>
      <td>${safe(c.identityNo || item.customerIdentityNo)}</td>
      <td style="font-weight:700;">Nationality</td>
      <td>${safe(nationality)}</td>
    </tr>
    <tr>
      <td style="font-weight:700;">Address</td>
      <td colspan="3">${safe(address)}</td>
    </tr>
  </table>

<!-- Property Details (readable order: IDs → location → dates → sizes) -->
<table class="section no-break">
  <tr><td colspan="4" class="head">Property Details :</td></tr>
  <tr>
    <td class="w25" style="font-weight:700;">Property No</td>
    <td class="w25">${safe(item.propertyNo)}</td>
    <td class="w25" style="font-weight:700;">Property Type</td>
    <td class="w25">${safe(item.typeName)}</td>
  </tr>
  <tr>
    <td style="font-weight:700;">Block/Floor</td>
    <td>${safe(item.floorName)}</td>
    <td style="font-weight:700;">Form No</td>
    <td>${safe((item as any).formNo)}</td>
  </tr>
  <tr>
    <td style="font-weight:700;">Registration No</td>
    <td>${safe(item.regNo)}</td>
    <td style="font-weight:700;">Sale Date</td>
    <td>${fmtDate(item.saleDate)}</td>
  </tr>
  <tr>
    <td style="font-weight:700;">Area (Marla)</td>
    <td>${safe(item.areaMarla)}</td>
    <td style="font-weight:700;">Area (Sqft)</td>
    <td>${safe(item.areaSqft)}</td>
  </tr>
</table>

<!-- Pricing Details (readable order: unit rates → prices → adjustments → payments) -->
<table class="section no-break">
  <tr><td colspan="4" class="head">Pricing Details :</td></tr>

  <!-- Unit Rates -->
  <tr>
    <td class="w25" style="font-weight:700;">Marla Rate</td>
    <td class="w25">${fmtPKR(item.marlaRate)}</td>
    <td class="w25" style="font-weight:700;">Rate per Sqft</td>
    <td class="w25">${fmtPKR(item.ratePerSqft)}</td>
  </tr>

  <!-- Base / Contract Prices -->
  <tr>
    <td style="font-weight:700;">Original Price</td>
    <td>${fmtPKR(item.orgPrice)}</td>
    <td style="font-weight:700;">Saleable Price</td>
    <td>${fmtPKR(salePrice)}</td>
  </tr>

  <!-- Adjustments -->
  <tr>
    <td style="font-weight:700;">Discount Amount</td>
    <td>${fmtPKR(discount)}</td>
    <td style="font-weight:700;">Preference</td>
    <td>
      ${safe(item.prefName) ? safe(item.prefName) + ' — ' : ''}${fmtPKR(item.prefAmount)}
      ${item.prefPercentage ? ` (${item.prefPercentage}%)` : ''}
    </td>
  </tr>

  <!-- Payments -->
  <tr>
    <td style="font-weight:700;">Received Amount</td>
    <td>${fmtPKR(received)}</td>
    <td style="font-weight:700;">Outstanding Amount</td>
    <td>${fmtPKR(outstanding)}</td>
  </tr>
</table>

  <!-- INSTALLMENTS / RECEIPTS / BALANCE -->
  <table class="tbl">
    <thead>
      <tr>
        <th colspan="6" class="ctr grp">Installments</th>
        <th colspan="4" class="ctr grp">Receipts</th>
        <th colspan="3" class="ctr grp">Balance</th>
      </tr>
      <tr>
        <th style="width:12px;"  class="ctr">Sr#</th>
        <th style="width:120px;">Due Date</th>
        <th>Type</th>
        <th style="width:48px;"  class="ctr">%</th>
        <th style="width:120px;" class="num">Amount</th>
        <th style="width:120px;" class="num">Paid</th>

        <th style="width:120px;">Receipt#</th>
        <th style="width:100px;">Date</th>
        <th style="width:120px;" class="num">Amount</th>
        <th style="width:100px;">Type</th>

        <th style="width:120px;" class="num">Amount</th>
        <th style="width:130px;" class="num">Accumulated</th>
        <th style="width:160px;">Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${flatRows.map(r => `
        <tr>
          <!-- INSTALLMENTS -->
          <td class="ctr">${r.sr}</td>
          <td>${safe(r.dueDate)}</td>
          <td>${safe(r.type)}</td>
          <td class="ctr">${safe(r.percent)}</td>
          <td class="num">${r.instAmount != null ? fmtPKR(r.instAmount) : ''}</td>
          <td class="num">${r.paidTotalForInst != null ? fmtPKR(r.paidTotalForInst) : ''}</td>

          <!-- RECEIPTS -->
          <td>${safe(r.rcptNo)}</td>
          <td>${safe(r.rcptDate)}</td>
          <td class="num">${r.rcptAmt != null ? fmtPKR(r.rcptAmt) : ''}</td>
          <td>${safe(r.rcptType)}</td>

          <!-- BALANCE -->
          <td class="num">${r.balanceAmt != null ? fmtPKR(r.balanceAmt) : ''}</td>
          <td class="num">${r.accumulated != null ? fmtPKR(r.accumulated) : ''}</td>
          <td>${safe(r.remarks)}</td>
        </tr>
      `).join('')}
      ${!flatRows.length ? `<tr><td colspan="13" class="ctr muted">— No installments —</td></tr>` : ``}
    </tbody>
    <tfoot>
      <tr class="totals">
        <td></td><td></td><td><span class="grp">Totals</span></td><td></td>
        <!-- Installments totals -->
        <td class="num">${fmtPKR(totalInstAmount)}</td>
        <td class="num">${fmtPKR(totalPaid)}</td>
        <!-- Receipts totals -->
        <td></td><td></td>
        <td class="num">${fmtPKR(totalPaid)}</td>
        <td></td>
        <!-- Balance totals -->
        <td class="num">${fmtPKR(totalBalance)}</td>
        <td class="num">${fmtPKR(totalPaid)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <!-- Other Charges (optional) -->
  <table class="section no-break">
    <tr><td colspan="6" class="head">Other Charges :</td></tr>
    <tr>
      <th class="ctr" style="width:50px;">Sr#</th>
      <th>Type</th>
      <th class="num" style="width:150px;">Amount</th>
      <th style="width:120px;">Due Date</th>
      <th class="num" style="width:150px;">Receipts</th>
      <th style="width:120px;">Date</th>
    </tr>
    ${(item.otherCharges || []).map((oc, i) => `
      <tr>
        <td class="ctr">${oc.sr ?? (i+1)}</td>
        <td>${safe(oc.type)}</td>
        <td class="num">${oc.amount != null ? fmtPKR(oc.amount) : ''}</td>
        <td>${fmtDate(oc.dueDate)}</td>
        <td class="num">${oc.paidAmount != null ? fmtPKR(oc.paidAmount) : ''}</td>
        <td>${fmtDate(oc.date)}</td>
      </tr>
    `).join('')}
    ${!(item.otherCharges || []).length ? `<tr><td colspan="6" class="ctr muted">— No other charges —</td></tr>` : ``}
  </table>

  <!-- Signatures -->
  <div class="signs no-break">
    <div class="sigbox"><div class="sigline">Applicant Signature / Thumb Impression</div></div>
    <div class="sigbox"><div class="sigline">Signature / Stamp / Date</div></div>
  </div>
</body>
</html>`
}

// src/core/utils/document/html/sale-agreements/WelcomLetterHtml.ts

import { LoginDataType } from 'src/context/types'

type PropertyDetail = {
  floorName: string | null
  typeName: string | null
  propertyNo: string | null
  setupDate: string | null
  currentStatus: string | null
  status: string | null
  areaSqft: number | null
  ratePerSqft: number | null
  areaMarla: number | null
  marlaRate: number | null
  marlaSize: number | null
  orgPrice: number | null
  saleablePrice: number | null
  prefName: string | null
  prefPercentage: number | null
  prefAmount: number | null
  secondNo: string | null
  regNo: string | null
  customerName: string | null
  customerIdentityNo: string | null
}

/** Helpers */
const safe = (v?: string | number | null) => (v ?? '') as string
const fmtPKR = (n?: number | null) => (n != null ? `PKR ${Math.round(n).toLocaleString('en-PK')}` : '')

const measuring = (item: PropertyDetail) => {
  const marla = item?.areaMarla ? `${item.areaMarla} ${item.areaMarla === 1 ? 'MARLA' : 'MARLAS'}` : ''
  const sqft = item?.areaSqft ? `${item.areaSqft} SQFT` : ''
  // PDF line shows “10 5.00 MARLAS” style; we’ll show Marla first, SQFT second if present
  return [marla, sqft].filter(Boolean).join('  ')
}

export const WelcomeLetterHtml = (
  itemStr: string | null,
  _user: LoginDataType | null,
  _name: string
) => {
  let item: PropertyDetail
  try {
    item = JSON.parse(itemStr || '{}') as PropertyDetail
  } catch {
    item = {} as PropertyDetail
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>WELCOME / INTIMATION LETTER</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:#ffffff; }

  @font-face {
    font-family: 'Karla';
    font-style: normal;
    font-weight: 400;
    src: url('https://fonts.gstatic.com/s/karla/v31/qkBbXvYC6trAT7RbLtyG5v-92_w.woff2') format('woff2');
  }

  :root{
    --ink:#1b1b1b;
    --muted:#6e6e6e;
    --line:#e6e6e6;
    --accent:#0b5cab;
  }

  .sheet{
    font-family:'Karla', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color:var(--ink);
    font-size:12px; line-height:1.55;
  }

  /* Header */
  .hdr{
    text-align:center;
    padding-bottom:10px;
    border-bottom:2px solid var(--accent);
    margin-bottom:14px;
  }
  .hdr-title{
    font-weight:800; letter-spacing:.04em;
    font-size:18px;
  }

  /* Subject band */
  .subject{
    display:flex; align-items:center; gap:10px; margin:10px 0 12px;
  }
  .subject .label{
    font-weight:700; text-transform:uppercase; letter-spacing:.03em;
  }
  .subject .txt{
    flex:1; padding:8px 10px; border:1px dashed var(--line); border-radius:6px; background:#fafafa;
  }

  /* 3-line customer block from PDF: Customer / S/O,D/O,W/O / Address */
  .block{
    border:1px solid var(--line); border-radius:8px;
    padding:10px 12px; margin-bottom:12px;
  }
  .row{ display:grid; grid-template-columns: 160px 1fr; gap:10px; padding:4px 0; }
  .k{ color:#3f3f3f; }
  .v{ color:#111; font-weight:600; }

  /* Body paragraphs */
  .p{ margin:10px 0; }

  /* 3-col short facts line: Plot No. / Measuring / REG (like line at PDF bottom) */
  .shortline{
    display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;
    border:1px solid var(--line); border-radius:8px; padding:8px 10px; margin:12px 0;
    background:#fff;
  }
  .cell .cap{ color:#3f3f3f; font-weight:700; text-transform:uppercase; letter-spacing:.03em; }
  .cell .val{ font-weight:800; margin-top:2px; }

  /* Details tables to keep the rest of fields available without clutter */
  .cols{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
  .card{ border:1px solid var(--line); border-radius:8px; overflow:hidden; }
  .card-h{ background:#f7f7f7; padding:8px 10px; font-weight:700; text-transform:uppercase; letter-spacing:.03em; }
  table.data{ width:100%; border-collapse:separate; border-spacing:0; }
  table.data tr:nth-child(odd){ background:#fbfbfb; }
  table.data td{ padding:8px 10px; vertical-align:top; }
  table.data td.k{ width:48%; color:#3f3f3f; }
  table.data td.v{ width:52%; text-align:right; color:#111; font-weight:600; }

  .muted{ color:var(--muted); }

  /* Footer sign */
  .sign{ margin-top:26px; }
  .sign .line{ margin-top:42px; border-top:1px solid var(--line); padding-top:6px; width:58%; }
</style>
</head>
<body>
  <div class="sheet">
    <!-- Title -->
    <div class="hdr">
      <div class="hdr-title">WELCOME / INTIMATION LETTER</div>
    </div>

    <!-- Subject line (as in PDF) -->
    <div class="subject">
      <div class="label">Subject</div>
      <div class="txt">ALLOCATION / BOOKING OF PLOT</div>
    </div>

    <!-- Customer, S/O,D/O,W/O, Address block -->
    <div class="block">
      <div class="row">
        <div class="k">Customer</div>
        <div class="v">${safe(item?.customerName)}</div>
      </div>
      <div class="row">
        <div class="k">S/O, D/O, W/O</div>
        <div class="v">${safe(item?.customerIdentityNo)}</div>
      </div>
      <div class="row">
        <div class="k">Address</div>
        <div class="v"></div>
      </div>
    </div>

    <!-- Welcome / body text per PDF -->
    <p class="p">Welcome aboard! Management is pleased to inform that you have been allocated.</p>
    <div class="shortline">
      <div class="cell">
        <div class="cap">Plot No.</div>
        <div class="val">${safe(item?.propertyNo)}</div>
      </div>
      <div class="cell">
        <div class="cap">Measuring</div>
        <div class="val">${measuring(item)}</div>
      </div>
      <div class="cell">
        <div class="cap">REG</div>
        <div class="val">${safe(item?.regNo)}</div>
      </div>
    </div>

    <p class="p">The payment schedule is attached. Provisional Allotment Certificate has also been issued.</p>
    <p class="p">Final allotment letter shall be issued to you on completion of total payment due against the plot. Possession shall be given upon payment of possession.</p>
    <p class="p">In your best interest, it is important that all installments be paid in time to avoid any inconvenience regarding cancellation of allotment and possession of plot.</p>
    <p class="p">Your cooperation is highly appreciated throughout, as we live here like a family.</p>
    <p class="p">We welcome you, as a prestigious member.</p>

    <!-- Extra details preserved (Floor/Type/Status/Prices etc.) -->
    <div class="cols">
      <div class="card">
        <div class="card-h">Plot Details</div>
        <table class="data">
          <tr><td class="k">Floor</td><td class="v">${safe(item?.floorName)}</td></tr>
          <tr><td class="k">Type</td><td class="v">${safe(item?.typeName)}</td></tr>
          <tr><td class="k">Marla Size</td><td class="v">${safe(item?.marlaSize)}</td></tr>
          <tr><td class="k">Allocation Date</td><td class="v">${safe(item?.setupDate)}</td></tr>
          <tr><td class="k">Current Status</td><td class="v">${safe(item?.currentStatus)}</td></tr>

        </table>
      </div>

      <div class="card">
        <div class="card-h">Pricing</div>
        <table class="data">
          <tr><td class="k">Rate per Sqft</td><td class="v">${fmtPKR(item?.ratePerSqft)}</td></tr>
          <tr><td class="k">Marla Rate</td><td class="v">${fmtPKR(item?.marlaRate)}</td></tr>
          <tr><td class="k">Original Price</td><td class="v">${fmtPKR(item?.orgPrice)}</td></tr>
          <tr><td class="k">Saleable Price</td><td class="v">${fmtPKR(item?.saleablePrice)}</td></tr>
        </table>
      </div>
    </div>

    <div class="sign">
      <div class="line">Regards,  ACCOUNTS</div>
    </div>
  </div>
</body>
</html>`
}

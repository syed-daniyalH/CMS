import { LoginDataType } from 'src/context/types'
import { getProjectDetail, getProjectField } from '../../format'

// ---------- Types ----------
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
}

// ---------- Helpers ----------
const safe = (v?: string | number | null) => (v ?? '') as string

const fmtDate = (d?: string | null) => {
  if (!d) return ''
  const tryIso = new Date(d)
  if (!isNaN(tryIso.getTime())) {
    return tryIso
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      .replace(' ', '-')
  }
  return d
}

// ---------- Main ----------
export const AllotmentCertificateHtml = (
  itemStr: string | null,
  user: LoginDataType | null,
  _name: string,
  defaultTanent: any
) => {
  let item: LedgerInput = {}
  try {
    item = JSON.parse(itemStr || '{}')
  } catch {}

  const c = item.customerDetail || {}

  const customerName =
    [safe(c.firstName), safe(c.secondName)].filter(Boolean).join(' ') ||
    safe(item.customerName)

  const fatherLabel = c.gender?.toLowerCase() === 'female' ? 'D/O' : 'S/O'
  const guardianName = safe(c.guardianName)
  const cnic = safe(c.identityNo || item.customerIdentityNo)
  const address = c.permAddress || c.tempAddress || ''
  const brand = safe(defaultTanent?.name) // e.g. "Connect-Sol"
  const projectLabel = getProjectDetail(user?.projectType ?? 1)
  const projectInfo: any = getProjectField(user?.projectType ?? 1)
  const projectName = projectInfo?.projectName || defaultTanent?.name || 'Project-A'

  const city = defaultTanent?.city || ''
  const email = defaultTanent?.email || ''
  const url = defaultTanent?.url || ''
  const uan = defaultTanent?.uan || ''

  const plotNo = safe(item.propertyNo)
  const areaMarla = item.areaMarla != null ? `${item.areaMarla} Marla` : ''
  const areaSqft =
    item.areaSqft != null ? `${item.areaSqft} SQFT` : ''
  const formNo = safe((item as any).formNo)
  const dated = fmtDate(item.saleDate || item.setupDate)

  // If you prefer regNo as File No, you can swap formNo/regNo below
  const fileNo = safe(item.regNo || formNo)

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Provisional Allotment Certificate</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page {
      size: A4;
      margin: 18mm 18mm 20mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    body {
      font-family: "Times New Roman", Georgia, "Cambria", serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
    }

    .page {
      width: 100%;
    }

    .title {
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      margin-top: 10px;
      margin-bottom: 30px;
      text-decoration: none;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .info-table td {
      padding: 2px 4px;
      vertical-align: middle;
      font-size: 12px;
    }

    .label {
      width: 10%;
      font-weight: 700;
      white-space: nowrap;
    }

    .value {
      width: 40%;
      padding-bottom: 2px;
    }

    .value.underline {
      border-bottom: 1px solid #000;
    }

    .value.multiline {
      padding-top: 6px;
      padding-bottom: 6px;
      min-height: 18px;
    }

    .body-text {
      text-align: justify;
      margin-top: 10px;
      font-size: 12px;
    }

    .body-text .u {
      border-bottom: 1px solid #000;
      padding: 0 2px;
      display: inline-block;
      min-width: 40px;
    }

    .footer {
      margin-top: 80px;
    }

    .closing {
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 700;
    }

    .closing-label {
      font-size: 12px;
    }
     .center {
    text-align: center;
  }
    .title-project {
    font-size: 22px;
    font-weight: 700;
    margin-top: 2px;
  }

  .subtitle {
    font-size: 10px;
    margin-top: 2px;
  }
    .meta-line {
    font-size: 9px;
    margin-top: 2px;
  }

  </style>
</head>
<body>
  <div class="page">
  <div class="center">
    <div class="title-project">${safe(projectName)}</div>
    ${city ? `<div class="subtitle">${safe(city)}</div>` : ''}
    <div class="meta-line">
      ${email ? `E-Mail: ${safe(email)}&nbsp;&nbsp;&nbsp;` : 'E-Mail:&nbsp;&nbsp;&nbsp;'}

    </div>
    ${uan ? `<div class="meta-line">UAN: ${safe(uan)}</div>` : ''}
  </div>
    <div class="title">Provisional Allotment Certificate</div>

    <!-- Top info block -->
    <table class="info-table">
      <tr>
        <td class="label">Name:</td>
        <td class="value underline">${customerName}</td>
        <td class="label">${fatherLabel}:</td>
        <td class="value underline">${guardianName}</td>
      </tr>
      <tr>
        <td class="label">CNIC:</td>
        <td class="value underline">${cnic}</td>
        <td class="label">File No:</td>
        <td class="value underline">${fileNo}</td>
      </tr>
      <tr>
        <td class="label" style="vertical-align: top;">Address:</td>
        <td colspan="3" class="value underline multiline">
          ${safe(address)}
        </td>
      </tr>
    </table>

    <!-- Main paragraph -->
    <p class="body-text">
      Dear Sir / Madam, we feel pleasure to inform you that provisional allotment certificate of
      Residence / Commercial ${projectLabel ? projectLabel + ' ' : ''}Plot No:
      <span class="u">${plotNo}</span>
      measuring
      ${
    areaMarla
      ? `<span class="u">${areaMarla}</span>`
      : ''
  }
      ${
    areaSqft
      ? `(<span class="u">${areaSqft}</span>)`
      : ''
  }
      in <span class="u">${brand}</span>, made in favor of you vide your App No / Form No.
      <span class="u">${formNo}</span> dated
      <span class="u">${dated}</span>, subject to terms &amp; conditions assuring you of our best
      cooperation &amp; services at all times.
    </p>

    <!-- Footer / signature -->
    <div class="footer">
      <p class="closing">Your Truly</p>
      <p class="closing-label">______________________________</p>
    </div>

  </div>
</body>
</html>`
}

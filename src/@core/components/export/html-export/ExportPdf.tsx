export const ExportPdfHtml = ({
                                pdfData,
                                columns,
                                companyName,
                                reportDate,
                                Journel,
                                Acceptable
                              }: any) => {

  const visibleColumnCount = (columns ?? []).filter((col: any) => col.isVisible).length;
  const minWidth = Math.max(visibleColumnCount * 150, 1200); // dynamic min-width

  return `
<style type="text/css" media="all">
  @font-face {
    font-family: 'Karla';
    font-style: normal;
    font-weight: 400;
    src: url('https://fonts.gstatic.com/s/karla/v31/qkBbXvYC6trAT7RbLtyG5v-92_w.woff2') format('woff2');
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Karla', sans-serif;
    font-size: 9pt;
    color: black;
    background: #ffffff;
  }

  .pcs-template {
    width: 100%;
    font-size: 9pt;
    color: black;
    background: #ffffff;
    border-collapse: collapse;
  }

  .pcs-template-body {
    padding: 10px;
  }

  .custom-hr {
    border: 1pt solid #efefef;
  }

  .company-heading {
    font-size: 1.2rem;
    font-weight: normal;
    color: #171616;
    margin-bottom: 5px;
  }

  .company-address {
    font-size: 0.8rem;
    font-weight: normal;
    color: #6b6b6b;
    margin-bottom: 5px;
  }

  .pcs-emp-detail {
    font-size: 0.8rem;
    color: #6b6b6b;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  th {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #f9f9f9;
    font-weight: 600;
  }

</style>

<div style="width: 100%; overflow-x: auto;">
  <div style="min-width: ${minWidth}px;">
    <div class="pcs-template">
      <div class="pcs-template-body">

        <table>
          <tr>
            <td>
              <div style="display: flex; justify-content: center;">
                <div style="text-align: center;">
                  <div class="company-address">${companyName}</div>
                  <div class="company-heading">${Journel}</div>
                  <div class="company-address">${Acceptable}</div>
                  <div class="company-address">${reportDate}</div>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <table style="margin-top: 20px;">
          <thead>
            <tr>${getItemHeaders(columns)}</tr>
          </thead>
          <tbody>
            ${getItemRows(pdfData ?? [], columns)}
          </tbody>
        </table>

        <hr class="custom-hr"/>

        <div style="text-align: right; margin-top: 10px;">
          <span class="pcs-emp-detail">This is a system generated report. No need for signatures.</span>
        </div>

      </div>
    </div>
  </div>
</div>
`;
};

const getItemHeaders = (columns: any): string => {
  let headers = "";
  const visibleColumns = (columns ?? [])
    .filter((col: any) => col.isVisible)
    .sort((a: any, b: any) => a.sortNo - b.sortNo);

  for (let i = 0; i < visibleColumns.length; i++) {
    const col = visibleColumns[i];
    const textAlign = col.isAlignRight ? 'right' : 'left';
    const wideTitle = ['description'];
    const descWidth = wideTitle.includes(col.columnTitle.toLowerCase()) ? '50%' : '20%';

    headers += `<th style="text-align:${textAlign}; width:${descWidth};">${col.columnTitle}</th>`;
  }

  return headers;
};

const getItemRows = (details: any[], columns: any): string => {
  let rowsHtml = "";
  const visibleColumns = (columns ?? [])
    .filter((col: any) => col.isVisible)
    .sort((a: any, b: any) => a.sortNo - b.sortNo);

  for (let i = 0; i < (details ?? []).length; i++) {
    const row = details[i];
    let rowHtml = "<tr>";

    for (let j = 0; j < visibleColumns.length; j++) {
      const col = visibleColumns[j];
      const key = col.formatedName ?? col.columnName;
      const val = row[key] ?? row[col.columnName] ?? '';
      const textAlign = col.isAlignRight ? 'right' : 'left';

      rowHtml += `<td style="text-align:${textAlign};">${val}</td>`;
    }

    rowHtml += "</tr>";
    rowsHtml += rowHtml;
  }

  return rowsHtml;
};

export default ExportPdfHtml;

import XLSX from 'xlsx-js-style';
import { formatDate, isDate } from '../format'

interface Column {
  columnName: string;
  columnTitle: string;
}

// Helper function to validate if a date is valid
function isValidDate(date: any): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

function exportToExcel(
  name: string,
  rows: any,
  filteredColumns: Column[],
  reportName: string,
  companyName: string,
  duration: string,
  currentNote?: any,
  loadingExcel?: boolean
) {

  const wb = XLSX.utils.book_new();

  let row = [{
    v: `${companyName ?? ""}`,
    t: "s",
    s: {
      font: { name: "Calibri", sz: 24 },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: "F1F3FF" } }
    }
  }];

  let a0_row = [{
    v: "",
    t: "s",
    s: {
      font: { name: "Calibri", sz: 24 },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: "F1F3FF" } }
    }
  }];

  let a_row = [{
    v: `${reportName}`,
    t: "s",
    s: {
      font: { name: "Calibri", sz: 22, color: { rgb: "860000" } },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: "F1F3FF" } }
    }
  }];

  let b_row = [{
    v: `${duration}`,
    t: "s",
    s: {
      font: { name: "Calibri", sz: 14 },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: "F1F3FF" } }
    }
  }];

  let c_row = [{
    v: `${name}`,
    t: "s",
    s: {
      font: { name: "Calibri", sz: 22, color: { rgb: "860000" } },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: "F1F3FF" } }
    }
  }];

  let row2: any | any[] = [];

  filteredColumns.forEach((headerGroup) => {
    let direction = "left";
    if (rows.length > 0) {
      let value = rows[0][headerGroup.columnName];

      if (typeof value === "number") {
        direction = headerGroup.columnName === "customerId" ? "left" : "right";
      }

      row2.push({
        v: `${headerGroup.columnTitle}`,
        t: "s",
        s: {
          font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "FFFFFF" } },
          alignment: { vertical: "center", horizontal: direction },
          fill: { fgColor: { rgb: "538dd5" } }
        }
      });
    }
  });

  let data_rows: any | any[] = [];
  if (rows.length > 0) {
    rows.forEach((row: any) => {
      let dataRow: any | any[] = [];

      filteredColumns.forEach((col: any) => {
        const rawValue = row[col.columnName] ?? "";
        const lowerCaseValue = typeof rawValue === "string" ? rawValue.toLowerCase() : "";

        // -------------------------
        // APPLY isDate(cellValue ?? "")
        // -------------------------
        let value;

        const isDateColumn =
          col.columnName.toLowerCase().includes("date") ||
          col.columnName.toLowerCase() === "date" ||
          col.columnName.toLowerCase() === "saledate" ||
          col.columnName.toLowerCase() === "monthdays" ||
          col.columnName.toLowerCase() === "payend" ||
          col.columnName.toLowerCase() === "paystart" ||
          col.columnName.toLowerCase() === "createdat" ||
          col.columnName.toLowerCase() === "duedate" ||
          col.columnName.toLowerCase() === "customercreatedat";

        const isNotTextDate =
          !(lowerCaseValue.includes("days")) &&
          !(lowerCaseValue.includes("current"));

        if (isDate(rawValue ?? "") && isDateColumn && isNotTextDate) {
          // ✨ Same logic as your component: <DateViewFormat date={cellValue} />
          // But for Excel, you used formatDate()
          const cleanValue =
            typeof rawValue === "string" && rawValue.includes(".")
              ? rawValue.substring(0, rawValue.indexOf("."))
              : rawValue;

          value = formatDate(cleanValue);
        } else {
          value = rawValue;
        }

        // -------------------------
        // Alignment logic — unchanged
        // -------------------------
        let direction = "left";
        if (typeof value === "number") {
          direction = col.columnName === "customerId" ? "left" : "right";
        }

        dataRow.push({
          v: value,
          t: `${typeof value === "number" ? "n" : "s"}`,
          s: {
            font: { name: "Calibri", sz: 12 },
            alignment: { vertical: "center", horizontal: direction },
            fill: { fgColor: { rgb: "F1F3FF" } }
          }
        });
      });


      data_rows.push(dataRow);
    });
  } else {
    let row2a = [
      { v: "", t: "s", s: { fill: { fgColor: { rgb: "538dd5" } } } },
      { v: `No Date Found`, t: "s", s: { font: { name: "Calibri", sz: 14, bold: true }, alignment: { vertical: "center", horizontal: "center" } } }
    ];
    data_rows.push(row2a);
  }

  let rowDate = [{
    v: `This report is printed on ${new Date().toDateString()}. This is system generated report`,
    t: "s",
    s: { font: { name: "Calibri", sz: 10, bold: false }, alignment: { vertical: "center", horizontal: "right" } }
  }];

  let rowNote = [{
    v: currentNote ?? "",
    t: "s",
    s: { font: { name: "Calibri", sz: 10, bold: false }, alignment: { vertical: "center", horizontal: "left" } }
  }];

  let pColLength = 0;
  let widthsCols: any | any[] = [];

  for (let i = 0; i < filteredColumns.length; i++) {
    pColLength++;
    let value = rows.length > 0 ? rows[0][filteredColumns[i].columnName] : "";
    if (filteredColumns[i].columnName === 'account') {
      widthsCols.push({ width: 60 });
    } else if (typeof value === 'number') {
      widthsCols.push({ width: 15 });
    } else {
      widthsCols.push({ width: 20 });
    }
  }

  const ws = XLSX.utils.aoa_to_sheet([row, a0_row, a_row, c_row, b_row, row2, ...data_rows, rowDate, rowNote]);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: pColLength - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: pColLength - 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: pColLength - 1 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: pColLength - 1 } },
    { s: { r: rows.length + 6, c: 0 }, e: { r: rows.length + 6, c: pColLength - 1 } },
    { s: { r: rows.length + 7, c: 0 }, e: { r: rows.length + 7, c: pColLength - 1 } }
  ];

  ws["!cols"] = widthsCols;
  XLSX.utils.book_append_sheet(wb, ws, `${reportName}`);

  XLSX.writeFile(wb, `${reportName}.xlsx`);
}

export default exportToExcel;

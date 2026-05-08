import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'

import {
  defaultReportSettings,
  ReportsSettingsData
} from 'src/views/reports/shared-components/ReportSettings'
import { formatCurrency, formatDate } from '../../../utils/format'

interface Column {
  columnName: string
  columnTitle: string
  sortNo: number
  isAlignRight?: boolean
  formatedName?: string
}

interface PDFExportOptions {
  data: any[]
  columns: Column[]
  title?: string
  subtitle?: string
  dateRange?: { fromDate?: Date; toDate?: Date }
  organizationName?: string
  reportName?: string
  download?: boolean
}

// ✅ Custom formatting function
const formatValue = (rawValue: any): string => {
  if (
    typeof rawValue === 'string' &&
    /^\d{4}-\d{2}-\d{2}T/.test(rawValue) &&
    moment(rawValue, moment.ISO_8601, true).isValid()
  ) {
    return moment(rawValue).format('DD MMM, YYYY')
  }
  return rawValue
}

export const exportPDFReport = ({
                                  data,
                                  columns,
                                  title = 'Report',
                                  subtitle,
                                  dateRange,
                                  organizationName = 'No Name',
                                  download = true,
                                  reportName = 'report'
                                }: PDFExportOptions) => {
  const localSettings = localStorage.getItem(reportName)
  const settings: ReportsSettingsData = {
    ...defaultReportSettings,
    ...(localSettings ? JSON.parse(localSettings) : {})
  }

  const orientation = settings.orientation || 'portrait'
  const pageSize = settings.pageSize || 'a4'
  const repeatHeaders = settings.repeatHeaders ?? true
  const reportTitle = settings.reportTitle || title
  const scale = settings.scale ?? 1

  // base font sizes (will be scaled)
  const FS_ORG = 9
  const FS_TITLE = 12
  const FS_SUB = 9
  const FS_DATE = 9
  const FS_FOOT_PAGE = 8
  const FS_FOOT_MSG = 7

  const sortedColumns = [...columns].sort((a, b) => a.sortNo - b.sortNo)

  const doc = new jsPDF(orientation, 'mm', pageSize)
  const pageWidth = doc.internal.pageSize.getWidth()
  const totalPagesExp = '{total_pages_count_string}'
  const currentDateStr = new Date()
  const margin = 14 * 2
  const usableWidth = pageWidth - margin

  // vertical spacings (scaled)
  const GAP_ORG_TO_TITLE = 7 * scale
  const GAP_TITLE_TO_SUB = 6 * scale
  const GAP_SUB_TO_DATE = 6 * scale
  const GAP_HEADER_TO_TABLE = 7 * scale

  let yPosition = 15

  // Organization
  doc.setFontSize(FS_ORG * scale)
  doc.text(organizationName, pageWidth / 2, yPosition, { align: 'center' })

  // Title
  yPosition += GAP_ORG_TO_TITLE
  doc.setFontSize(FS_TITLE * scale)
  doc.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' })

  // Subtitle
  if (subtitle) {
    yPosition += GAP_TITLE_TO_SUB
    doc.setFontSize(FS_SUB * scale)
    doc.text(subtitle, pageWidth / 2, yPosition, { align: 'center' })
  }

  // Date range
  if (dateRange?.fromDate && dateRange?.toDate) {
    yPosition += GAP_SUB_TO_DATE
    const dateText = `${moment(dateRange.fromDate).format('DD MMM YYYY')} to ${moment(
      dateRange.toDate
    ).format('DD MMM YYYY')}`
    doc.setFontSize(FS_DATE * scale)
    doc.text(dateText, pageWidth / 2, yPosition, { align: 'center' })
  }

  yPosition += GAP_HEADER_TO_TABLE
  const startY = yPosition

  // === Table Construction ===
  const tableColumnHeaders = sortedColumns.map(col => col.columnTitle.toUpperCase())

  const tableRows = data?.map(row =>
    sortedColumns.map(col => {
      const formattedValue = col.formatedName ? row[col.formatedName] : undefined
      const rawValue = formattedValue !== undefined ? formattedValue : row[col.columnName]

      if (rawValue === 0) return '-' // keep your zero→dash rule

      const normalized = formatValue(rawValue)

      // currency/right alignment (uses your util)
      if (col.isAlignRight) {
        return formatCurrency(rawValue, null)
      }


      return normalized
    })
  )

  // === Column Styles ===
  const columnStyles: any = {}
  const fixedWidths: Record<string, number> = {
    description: 40
  }

  let totalFixedWidth = 0
  const flexibleColumnIndices: number[] = []

  sortedColumns.forEach((col, idx) => {
    const key = col.columnName.toLowerCase()
    if (fixedWidths[key]) {
      columnStyles[idx] = {
        cellWidth: fixedWidths[key],
        halign: col.isAlignRight ? 'right' : 'left'
      }
      totalFixedWidth += fixedWidths[key]
    } else {
      flexibleColumnIndices.push(idx)
    }
  })

  const remainingWidth = usableWidth - totalFixedWidth
  const flexibleWidth =
    flexibleColumnIndices.length > 0 ? remainingWidth / flexibleColumnIndices.length : 0

  flexibleColumnIndices.forEach(idx => {
    columnStyles[idx] = {
      cellWidth: flexibleWidth,
      halign: sortedColumns[idx].isAlignRight ? 'right' : 'left'
    }
  })

  // === Render Table ===
  autoTable(doc, {
    head: [tableColumnHeaders],
    body: tableRows,
    startY,
    theme: 'grid',
    styles: {
      fontSize: 7 * scale,      // already scaled
      cellPadding: 3 * scale    // already scaled
    },
    columnStyles,
    headStyles: {
      fillColor: [234, 234, 234],
      textColor: 0,
      halign: 'left'
    },
    bodyStyles: { textColor: 0 },
    didParseCell: cellData => {
      const colIndex = cellData.column.index
      const rowIndex = cellData.row.index
      const isAlignRight = sortedColumns[colIndex]?.isAlignRight ?? false
      cellData.cell.styles.halign = isAlignRight ? 'right' : 'left'
      const rowData = data[rowIndex]
      if (rowData?.isTotalRowBold) {
        cellData.cell.styles.fontStyle = 'bold'
      }
    },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight()
      const pageNumber = doc.getNumberOfPages()

      doc.setFontSize(FS_FOOT_PAGE * scale)
      doc.text(`Page ${pageNumber} of ${totalPagesExp}`, 14, pageHeight - 10)

      doc.setFontSize(FS_FOOT_MSG * scale)
      const systemMsg = `This is a system-generated Report printed on ${currentDateStr}`
      doc.text(systemMsg, pageWidth - 14, pageHeight - 10, { align: 'right' })
    },
    showHead: repeatHeaders ? 'everyPage' : 'firstPage'
  })

  doc.putTotalPages(totalPagesExp)

  if (download) {
    doc.save(`${(reportName || title).replace(/\s+/g, '-')}.pdf`)
  } else {
    window.open(doc.output('bloburl') as unknown as string, '_blank')
  }
}

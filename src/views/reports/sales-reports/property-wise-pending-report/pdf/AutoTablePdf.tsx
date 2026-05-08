import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'
import { formatCurrency } from 'src/@core/utils/format'

interface Transfer {
  oldCustomerName: string
  newCustomerName: string
  transferDate: string
  transferBy: string
  transferCharges: number
  oldCustomerIdentityNo?: string
  oldCustomerContactNo?: string
  newCustomerIdentityNo?: string
  newCustomerContactNo?: string
}

interface Property {
  propertyId: number
  propertyNo: string
  floorName: string
  typeName: string
  status: string
  saleDate: string
  soldAmount?: number
  customerName: string
  customerIdentityNo?: string
  customerContactNo?: string
  vMPropertyTransferHistoriesDetail: Transfer[]
}

interface PDFExportOptions {
  data: Property[]
  title?: string
  organizationName?: string
  download?: boolean
  reportName?: string
  columns?: any
}

export const exportTransferPropertyPDF = ({
                                            data,
                                            title = 'Property Transfer Report',
                                            organizationName = 'No Name',
                                            columns = [],
                                            download = true,
                                            reportName = 'report'
                                          }: any) => {
  const doc = new jsPDF('portrait', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 15

  // --- Header ---
  doc.setFontSize(12)
  doc.text(organizationName, pageWidth / 2, yPos, { align: 'center' })

  yPos += 7
  doc.setFontSize(14)
  doc.text(title, pageWidth / 2, yPos, { align: 'center' })

  yPos += 10

  const tableColumns = ['Name / Info', 'Type', 'Status', 'Sale Date', 'Sold Amount', 'Transfer Date', 'Transfer By', 'Charges']
  const tableRows: any[] = []

  data.forEach((property:any) => {
    // --- Property row (bold) ---
    tableRows.push([
      property.propertyNo + ' - ' + property.floorName,
      property.typeName,
      property.status,
      moment(property.saleDate).format('DD MMM YYYY'),
      formatCurrency(property.soldAmount,null),
      '',
      '',
      ''
    ])

    // --- Customer row (indented) ---
    tableRows.push([
      `Current Owner: ${property.customerName}\nID: ${property.customerIdentityNo || '-'}\n Contact: ${property.customerContactNo || '-'}`,
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ])

    // --- Transfer rows (more indented) ---
    property.vMPropertyTransferHistoriesDetail.forEach((transfer:any) => {
      tableRows.push([
        `Transfer: ${transfer.oldCustomerName} >>> ${transfer.newCustomerName}\nID: ${transfer.oldCustomerIdentityNo || '-'}\n Contact: ${transfer.oldCustomerContactNo } `,
        '',
        '',
        '',
        '',
        moment(transfer.transferDate).format('DD MMM YYYY'),
        transfer.transferBy,
        formatCurrency(transfer.transferCharges,null)
      ])
    })
  })

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: yPos,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: [234, 234, 234], textColor: 0, halign: 'left' },
    didParseCell: (cell) => {
      // Bold property rows
      if (cell.section === 'body') {
        const text = cell.cell.raw as string
        if (!text.includes('Transfer') && !text.includes('Current Owner')) {
          cell.cell.styles.fontStyle = 'bold'
        }
      }
    }
  })

  if (download) {
    doc.save(`${reportName.replace(/\s+/g, '-')}.pdf`)
  } else {
    window.open(doc.output('bloburl') as unknown as string, '_blank')
  }
}

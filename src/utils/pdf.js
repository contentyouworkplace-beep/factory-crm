import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ORANGE = [249, 115, 22]
const BLUE = [37, 99, 235]
const DARK = [30, 30, 30]
const LIGHT = [248, 248, 248]

// jsPDF built-in fonts don't support ₹ — use Rs. prefix in PDFs
const Rs = 'Rs.'

function fmt(n) {
  return `${Rs}${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtInt(n) {
  return `${Rs}${(n || 0).toLocaleString('en-IN')}`
}

function addHeader(doc, company, title, subtitle = '') {
  doc.setFillColor(...ORANGE)
  doc.rect(0, 0, 210, 28, 'F')

  // Company logo — placed in the white strip below the orange bar
  const logoX = 14
  let textX = 14
  if (company.logo) {
    try {
      const fmt = company.logo.startsWith('data:image/png') ? 'PNG'
                : company.logo.startsWith('data:image/svg') ? 'SVG'
                : 'JPEG'
      doc.addImage(company.logo, fmt, logoX, 1, 22, 22)
      textX = 40
    } catch (_) { /* ignore bad logo data */ }
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(company.name || 'PackCRM', textX, 12)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(title, textX, 21)

  doc.setFontSize(8)
  doc.setTextColor(255, 240, 220)
  if (company.phone) doc.text(company.phone, 196, 10, { align: 'right' })
  if (company.email) doc.text(company.email, 196, 16, { align: 'right' })
  if (company.gst)   doc.text(`GST: ${company.gst}`, 196, 22, { align: 'right' })

  doc.setFillColor(...LIGHT)
  doc.rect(0, 28, 210, 13, 'F')
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  if (company.address) doc.text(company.address, 14, 36)
  if (subtitle) {
    doc.setTextColor(...BLUE)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(subtitle, 196, 36, { align: 'right' })
  }

  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'normal')
  return 47
}

function addFooter(doc, company) {
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(...ORANGE)
    doc.rect(0, 285, 210, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.text(`${company.name || ''} | ${company.address || ''}`, 14, 292)
    doc.text(`Page ${i} of ${pageCount}`, 196, 292, { align: 'right' })
  }
}

function infoBox(doc, y, left, right) {
  doc.setFillColor(255, 247, 237)
  doc.setDrawColor(...ORANGE)
  doc.roundedRect(14, y, 85, 32, 2, 2, 'FD')
  doc.roundedRect(111, y, 85, 32, 2, 2, 'FD')
  doc.setFontSize(8.5)
  doc.setTextColor(60, 60, 60)
  left.forEach((line, i) => doc.text(line, 18, y + 8 + i * 7))
  right.forEach((line, i) => doc.text(line, 115, y + 8 + i * 7))
  return y + 40
}

// ─── QUOTATION PDF ───────────────────────────────────────────────
export function generateQuotePDF(quote, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'QUOTATION', quote.quoteNo)

  y = infoBox(doc, y, [
    `To: ${quote.customer}`,
    `Date: ${quote.date}`,
    `Valid Until: ${quote.validUntil || '--'}`,
  ], [
    `Quote No: ${quote.quoteNo}`,
    `Status: ${quote.status}`,
    `Prepared By: ${company.name}`,
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product / Description', 'Qty', 'Unit Price', 'Amount']],
    body: [
      [1, quote.product, (quote.qty || 0).toLocaleString('en-IN'), fmt(quote.unitPrice), fmtInt(quote.total)],
      ['', '', '', 'GST (18%)', fmtInt(quote.gst)],
      ['', '', '', { content: 'GRAND TOTAL', styles: { fontStyle: 'bold', textColor: ORANGE } },
        { content: fmtInt(quote.grandTotal), styles: { fontStyle: 'bold', textColor: ORANGE } }],
    ],
    headStyles: { fillColor: ORANGE, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 10 }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [255, 247, 237] },
  })

  y = doc.lastAutoTable.finalY + 10
  if (quote.notes) {
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    doc.text(`Notes: ${quote.notes}`, 14, y)
    y += 10
  }

  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.text('Bank Details:', 14, y + 6)
  doc.text(company.bank || '', 14, y + 12)
  addFooter(doc, company)
  doc.save(`${quote.quoteNo}.pdf`)
}

// ─── INVOICE PDF ─────────────────────────────────────────────────
export function generateInvoicePDF(inv, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'TAX INVOICE', inv.invoiceNo)

  y = infoBox(doc, y, [
    `Bill To: ${inv.customer}`,
    `Order Ref: ${inv.orderNo || '--'}`,
    `Date: ${inv.date}`,
  ], [
    `Invoice No: ${inv.invoiceNo}`,
    `Due Date: ${inv.dueDate || '--'}`,
    `Status: ${inv.status}`,
  ])

  // Build body rows from items array or fall back to flat amount
  let tableBody = []
  let subtotal = 0
  let gstAmt = 0

  if (inv.items && inv.items.length > 0) {
    inv.items.forEach((item, i) => {
      tableBody.push([i + 1, item.description || item.product, item.hsn || '4819',
        (item.qty || 0).toLocaleString('en-IN'), fmt(item.rate), fmt(item.amount)])
      subtotal += (item.amount || 0)
    })
    gstAmt = inv.gstAmt || (inv.amount - subtotal)
  } else {
    const taxable = (inv.amount || 0) / 1.18
    gstAmt = (inv.amount || 0) - taxable
    subtotal = taxable
    tableBody.push([1, inv.product || 'Packaging Material', '4819', '--', '--', fmt(subtotal)])
  }

  tableBody.push(['', '', '', '', 'GST (18%)', fmt(gstAmt)])
  tableBody.push(['', '', '', '', { content: 'TOTAL', styles: { fontStyle: 'bold' } },
    { content: fmtInt(inv.amount), styles: { fontStyle: 'bold', textColor: BLUE } }])
  tableBody.push(['', '', '', '', 'Amount Paid', fmtInt(inv.paid || 0)])
  tableBody.push(['', '', '', '',
    { content: 'BALANCE DUE', styles: { fontStyle: 'bold', textColor: [220, 38, 38] } },
    { content: fmtInt(inv.balance || 0), styles: { fontStyle: 'bold', textColor: [220, 38, 38] } }])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Description', 'HSN', 'Qty', 'Rate', 'Amount']],
    body: tableBody,
    headStyles: { fillColor: BLUE, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 8 }, 2: { cellWidth: 18 }, 3: { cellWidth: 18, halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [239, 246, 255] },
  })

  const fy = doc.lastAutoTable.finalY + 12
  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.text('Bank Details:', 14, fy)
  doc.text(company.bank || '', 14, fy + 6)
  doc.setDrawColor(180, 180, 180)
  doc.line(150, fy + 18, 196, fy + 18)
  doc.setTextColor(60, 60, 60)
  doc.text('Authorised Signatory', 157, fy + 22)
  addFooter(doc, company)
  doc.save(`${inv.invoiceNo}.pdf`)
}

// ─── SALARY SLIP PDF ─────────────────────────────────────────────
export function generateSalarySlipPDF(emp, month, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'SALARY SLIP', `${month}`)

  y = infoBox(doc, y, [
    `Employee: ${emp.name}`,
    `ID: ${emp.empId}`,
    `Designation: ${emp.designation}`,
  ], [
    `Department: ${emp.department}`,
    `Bank A/C: ${emp.bankAccount || '--'}`,
    `Month: ${month}`,
  ])

  const basic = Math.round(emp.salary * 0.5)
  const hra = Math.round(emp.salary * 0.2)
  const ta = Math.round(emp.salary * 0.1)
  const other = emp.salary - basic - hra - ta
  const pf = Math.round(basic * 0.12)
  const esic = Math.round(emp.salary * 0.0075)
  const net = emp.salary - pf - esic

  autoTable(doc, {
    startY: y,
    head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
    body: [
      ['Basic Salary', fmtInt(basic), 'PF (12%)', fmtInt(pf)],
      ['HRA', fmtInt(hra), 'ESIC (0.75%)', fmtInt(esic)],
      ['Travel Allowance', fmtInt(ta), '', ''],
      ['Other Allowance', fmtInt(other), '', ''],
      [{ content: 'GROSS', styles: { fontStyle: 'bold' } }, { content: fmtInt(emp.salary), styles: { fontStyle: 'bold' } },
        { content: 'TOTAL DEDUCTION', styles: { fontStyle: 'bold' } }, { content: fmtInt(pf + esic), styles: { fontStyle: 'bold' } }],
    ],
    headStyles: { fillColor: ORANGE, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' } },
    styles: { fontSize: 9 },
  })

  const fy2 = doc.lastAutoTable.finalY + 8
  doc.setFillColor(...BLUE)
  doc.rect(14, fy2, 182, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('NET SALARY', 18, fy2 + 9)
  doc.text(fmtInt(net), 196, fy2 + 9, { align: 'right' })
  addFooter(doc, company)
  doc.save(`SalarySlip_${emp.name}_${month}.pdf`)
}

// ─── OFFER LETTER PDF ────────────────────────────────────────────
export function generateOfferLetterPDF(emp, company) {
  const doc = new jsPDF()
  addHeader(doc, company, 'OFFER LETTER', '')

  doc.setTextColor(...DARK)
  doc.setFontSize(9)
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  let y = 56
  doc.text(`Date: ${date}`, 14, y); y += 8
  doc.text('To,', 14, y); y += 5
  doc.setFont('helvetica', 'bold')
  doc.text(emp.name, 14, y); y += 8
  doc.setFont('helvetica', 'normal')
  doc.text(`Dear ${emp.name},`, 14, y); y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('Subject: Offer of Employment', 14, y); y += 8
  doc.setFont('helvetica', 'normal')
  const body = `We are pleased to offer you the position of ${emp.designation} in the ${emp.department} department at ${company.name}. Your employment is subject to the following terms and conditions:`
  const lines = doc.splitTextToSize(body, 182)
  doc.text(lines, 14, y); y += lines.length * 5 + 4

  autoTable(doc, {
    startY: y,
    body: [
      ['Position', emp.designation],
      ['Department', emp.department],
      ['Date of Joining', emp.joinDate],
      ['CTC (Annual)', `${Rs}${((emp.salary || 0) * 12).toLocaleString('en-IN')}`],
      ['Work Location', company.address],
    ],
    headStyles: { fillColor: ORANGE },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [255, 247, 237] } },
    styles: { fontSize: 9 },
  })

  const fy = doc.lastAutoTable.finalY + 14
  doc.setFontSize(9)
  doc.text('Please sign and return a copy of this letter as acceptance.', 14, fy)
  doc.text('We look forward to you joining our team.', 14, fy + 7)
  doc.text('Yours sincerely,', 14, fy + 20)
  doc.setFont('helvetica', 'bold')
  doc.text(company.name, 14, fy + 32)
  doc.setFont('helvetica', 'normal')
  doc.line(14, fy + 30, 80, fy + 30)
  addFooter(doc, company)
  doc.save(`OfferLetter_${emp.name}.pdf`)
}

// ─── PURCHASE ORDER PDF ──────────────────────────────────────────
export function generatePOPDF(po, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'PURCHASE ORDER', po.poNo)

  y = infoBox(doc, y, [
    `Vendor: ${po.vendor}`,
    `Contact: ${po.vendorContact || '--'}`,
    `Date: ${po.date}`,
  ], [
    `PO No: ${po.poNo}`,
    `Delivery By: ${po.deliveryDate || '--'}`,
    `Status: ${po.status}`,
  ])

  const items = po.items || [{ desc: po.item || 'Material', qty: po.qty || 0, unit: po.unit || 'KG', rate: 0, amount: po.amount || 0 }]
  autoTable(doc, {
    startY: y,
    head: [['#', 'Item / Description', 'Qty', 'Unit', 'Rate', 'Amount']],
    body: items.map((it, i) => [i + 1, it.desc, it.qty, it.unit, fmt(it.rate), fmtInt(it.amount)]),
    headStyles: { fillColor: ORANGE, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' } },
    styles: { fontSize: 9 },
  })

  addFooter(doc, company)
  doc.save(`${po.poNo}.pdf`)
}

// ─── JOB CARD PDF ────────────────────────────────────────────────
export function generateJobCardPDF(jc, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'PRODUCTION JOB CARD', jc.jobNo)

  y = infoBox(doc, y, [
    `Customer: ${jc.customer}`,
    `Order Ref: ${jc.orderNo || '--'}`,
    `Product: ${jc.product}`,
  ], [
    `Job No: ${jc.jobNo}`,
    `Date: ${jc.createdAt}`,
    `Deadline: ${jc.deadline || '--'}`,
  ])

  autoTable(doc, {
    startY: y,
    body: [
      ['Quantity', (jc.qty || 0).toLocaleString('en-IN'), 'Machine', jc.machine || '--'],
      ['Size', jc.size || '--', 'Colors', jc.colors || '--'],
      ['Material', jc.material || '--', 'Printing Type', jc.printType || '--'],
      ['Lamination', jc.lamination || 'None', 'Special Finish', jc.finish || 'None'],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [255, 247, 237] },
      2: { fontStyle: 'bold', fillColor: [255, 247, 237] },
    },
    styles: { fontSize: 9 },
  })

  const fy = doc.lastAutoTable.finalY + 8
  autoTable(doc, {
    startY: fy,
    head: [['Production Stage', 'Assigned To', 'Start', 'End', 'Status']],
    body: [
      ['Pre-Press', '', '', '', '[ ]'],
      ['Printing', '', '', '', '[ ]'],
      ['Lamination', '', '', '', '[ ]'],
      ['Die Cutting', '', '', '', '[ ]'],
      ['Finishing', '', '', '', '[ ]'],
      ['Packing', '', '', '', '[ ]'],
    ],
    headStyles: { fillColor: BLUE, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9 },
  })

  addFooter(doc, company)
  doc.save(`${jc.jobNo}.pdf`)
}

// ─── DELIVERY CHALLAN PDF ────────────────────────────────────────
export function generateChallanPDF(order, company) {
  const doc = new jsPDF()
  let y = addHeader(doc, company, 'DELIVERY CHALLAN', `DC-${order.orderNo}`)

  y = infoBox(doc, y, [
    `Deliver To: ${order.customer}`,
    `Order No: ${order.orderNo}`,
    `Date: ${new Date().toLocaleDateString('en-IN')}`,
  ], [
    `Vehicle No: ${order.vehicle || '--'}`,
    `LR No: ${order.lrNo || '--'}`,
    `Transporter: ${order.transporter || '--'}`,
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product Description', 'Quantity', 'Unit', 'Remarks']],
    body: [[1, order.product, (order.qty || 0).toLocaleString('en-IN'), 'Pcs', '']],
    headStyles: { fillColor: ORANGE, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9 },
  })

  const fy = doc.lastAutoTable.finalY + 20
  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.text('Receiver Signature & Stamp', 14, fy + 10)
  doc.line(14, fy + 8, 80, fy + 8)
  doc.text('Authorised Signatory', 150, fy + 10)
  doc.line(150, fy + 8, 196, fy + 8)
  addFooter(doc, company)
  doc.save(`DC-${order.orderNo}.pdf`)
}

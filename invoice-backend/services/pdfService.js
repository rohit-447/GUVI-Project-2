const PDFDocument = require('pdfkit'); 

// Main function to build the invoice PDF
function buildPDF(dataCallback, endCallback, data) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 }); // Create new PDF document

  // Register event listeners for streaming PDF data
  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // format dates as DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // format currency in USD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Header section with company info
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('INVOICE', 275, 50, { align: 'right' })
    .fontSize(10)
    .text('Your Company Name', 200, 65, { align: 'right' })
    .text('123 Main Street', 200, 80, { align: 'right' })
    .text('City, State, 12345', 200, 95, { align: 'right' })
    .moveDown();

  // Invoice and client details
  doc
    .fontSize(10)
    .text(`Invoice Number: ${data.invoiceInfo.number}`, 50, 200)
    .text(`Invoice Date: ${formatDate(data.invoiceInfo.date)}`, 50, 215)
    .text(`Due Date: ${formatDate(data.invoiceInfo.dueDate)}`, 50, 230)
    .text(data.client.name, 300, 200)
    .text(data.client.address, 300, 215)
    .text(`${data.client.city}, ${data.client.state}, ${data.client.zip}`, 300, 230)
    .moveDown(2);
    
  const invoiceTableTop = 330;

  // Table header for items
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop, 'Item', 'Unit Cost', 'Quantity', 'Line Total');
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  // List all invoice items
  const items = data.items || [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.description,
      formatCurrency(item.unitPrice),
      item.quantity,
      formatCurrency(item.quantity * item.unitPrice)
    );
    generateHr(doc, position + 20);
  }

  // Display subtotal, tax, and total
  const subtotalPosition = invoiceTableTop + (items.length + 1) * 30;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, subtotalPosition, '', '', 'Subtotal', formatCurrency(data.summary.subtotal));
  const taxPosition = subtotalPosition + 20;
  generateTableRow(doc, taxPosition, '', '', 'Tax (10%)', formatCurrency(data.summary.tax));
  const totalPosition = taxPosition + 20;
  generateTableRow(doc, totalPosition, '', '', 'Total', formatCurrency(data.summary.total));
  doc.font('Helvetica');

  // Footer message
  doc.fontSize(10).text('Payment is due within 15 days. Thank you for your business.', 50, 780, { align: 'center', width: 500 });

  doc.end(); // Finalize PDF
}

// generate a row in the invoice table
function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
  doc.fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

// generate a horizontal line
function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = { buildPDF };

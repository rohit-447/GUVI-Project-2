const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const { buildPDF } = require('./services/pdfService');
const Invoice = require('./models/invoiceModel');

const app = express();
const port = 3001;

// SendGrid API Key Setup 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const senderEmail = process.env.SENDER_EMAIL;

// --- Middleware ---
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());

// --- MongoDB Connection ---
const MONGO_URI = 'mongodb://localhost:27017/invoiceApp';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

// --- Routes ---

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
});

// Get the next sequential invoice number
app.get('/api/latest-invoice-number', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const latestInvoice = await Invoice.findOne({ "invoiceInfo.number": new RegExp(`^INV-${currentYear}`) }).sort({ createdAt: -1 });
        
        let nextNumber;
        const prefix = `INV-${currentYear}`;

        if (latestInvoice) {
            const lastNumber = latestInvoice.invoiceInfo.number;
            const parts = lastNumber.split('-');
            const lastSeq = parseInt(parts[2], 10);
            const newSeq = (lastSeq + 1).toString().padStart(3, '0');
            nextNumber = `${prefix}-${newSeq}`;
        } else {
            nextNumber = `${prefix}-001`;
        }
        
        res.status(200).json({ number: nextNumber });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching latest invoice number', error });
    }
});

//Update the status of an invoice
app.patch('/api/invoices/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { paymentStatus: status },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice status', error });
    }
});

// Save invoice data without generating a PDF
app.post('/api/save-invoice', async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = new Invoice(invoiceData);
    const savedInvoice = await newInvoice.save();
    res.status(201).json({ message: 'Invoice saved successfully!', invoice: savedInvoice });
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(500).json({ message: 'Error saving invoice', error });
  }
});

// Create an invoice, save it, and generate a PDF
app.post('/api/create-invoice', async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    buildPDF(
      (chunk) => res.write(chunk),
      () => res.end(),
      invoiceData
    );

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Error creating invoice', error });
  }
});

// Send invoice via email using SendGrid
app.post('/api/send-invoice', (req, res) => {
    const invoiceData = req.body;

    const pdfChunks = [];
    buildPDF(
        (chunk) => pdfChunks.push(chunk),
        async () => {
            const pdfBuffer = Buffer.concat(pdfChunks);

            try {
                const msg = {
                    to: invoiceData.client.email,
                    from: senderEmail,
                    subject: `Invoice #${invoiceData.invoiceInfo.number} from Your Company`,
                    text: `Hi ${invoiceData.client.name},\n\nPlease find attached your invoice #${invoiceData.invoiceInfo.number}.\n\nThank you for your business!\n\nSincerely,\nYour Company Name`,
                    attachments: [
                        {
                            content: pdfBuffer.toString('base64'),
                            filename: `invoice-${invoiceData.invoiceInfo.number}.pdf`,
                            type: 'application/pdf',
                            disposition: 'attachment',
                        },
                    ],
                };
                
                console.log("Attempting to send email via SendGrid...");
                await sgMail.send(msg);
                console.log("Email sent successfully!");
                res.status(200).json({ message: 'Email sent successfully!' });

            } catch (error) {
                console.error('Error sending email via SendGrid:', error);
                if (error.response) {
                    console.error(error.response.body)
                }
                res.status(500).json({ message: 'Error sending email', error: error.message });
            }
        },
        invoiceData
    );
});


//Start Server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
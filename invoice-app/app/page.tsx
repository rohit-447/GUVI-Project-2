"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import InvoiceHeader from './components/invoice/InvoiceHeader';
import InvoiceInfo from './components/invoice/InvoiceInfo';
import ClientDetails from './components/invoice/ClientDetails';
import ProjectDetails from './components/invoice/ProjectDetails';
import ItemizedBilling from './components/invoice/ItemizedBilling';
import InvoiceSummary from './components/invoice/InvoiceSummary';
import InvoiceActions from './components/invoice/InvoiceActions';
import { Item, Client, Project } from './types';

export default function HomePage() {
  const [client, setClient] = useState<Client>({
    name: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  const [project, setProject] = useState<Project>({
      name: '',
      id: '',
      description: ''
  });

  const [items, setItems] = useState<Item[]>([]);
  
  const [statusMessage, setStatusMessage] = useState('');
  
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  const [invoiceNumber, setInvoiceNumber] = useState('Loading...');

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchLatestInvoiceNumber = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/latest-invoice-number');
            if (!response.ok) {
                throw new Error('Could not fetch invoice number');
            }
            const data = await response.json();
            setInvoiceNumber(data.number);
        } catch (error) {
            console.error(error);
            setInvoiceNumber('INV-ERROR-001');
        }
    };

    fetchLatestInvoiceNumber();
    setInvoiceDate(formatDateForInput(new Date()));
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);
    setDueDate(formatDateForInput(futureDate));
  }, []);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'invoiceDate') {
        setInvoiceDate(value);
    } else if (name === 'dueDate') {
        setDueDate(value);
    }
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(e.target.value);
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const parsedValue = (field === 'quantity' || field === 'unitPrice') ? parseFloat(value as string) : value;
        return { ...item, [field]: isNaN(parsedValue as number) ? value : parsedValue };
      }
      return item;
    });
    setItems(newItems);
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getInvoiceData = () => ({
    invoiceInfo: { number: invoiceNumber, date: new Date(invoiceDate), dueDate: new Date(dueDate) },
    client: client,
    project: project,
    items: items,
    summary: { subtotal, tax, total },
    paymentStatus: paymentStatus,
  });

  const handleSaveInvoice = async () => {
    setStatusMessage('Saving...');
    try {
      const response = await fetch('http://localhost:3001/api/save-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getInvoiceData()),
      });

      if (!response.ok) { throw new Error('Network response was not ok'); }

      const result = await response.json();
      console.log(result);
      setStatusMessage('Invoice saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);

    } catch (error) {
      console.error('Error saving invoice:', error);
      setStatusMessage('Failed to save invoice.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleGeneratePdf = async () => {
    setStatusMessage('Generating PDF...');
    try {
      const response = await fetch('http://localhost:3001/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getInvoiceData()),
      });

      if (!response.ok) { throw new Error('Network response was not ok'); }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setStatusMessage('');

    } catch (error)      {
      console.error('Error generating PDF:', error);
      setStatusMessage('Failed to generate PDF.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // NEW: Handler to send the invoice via email
  const handleSendEmail = async () => {
    setStatusMessage('Sending email...');
    try {
        // First, save the invoice to ensure data is current
        await handleSaveInvoice();

        const response = await fetch('http://localhost:3001/api/send-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getInvoiceData()),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        const result = await response.json();
        console.log(result);
        setStatusMessage('Email sent successfully!');
        setTimeout(() => setStatusMessage(''), 3000);

    } catch (error) {
        console.error('Error sending email:', error);
        setStatusMessage('Failed to send email.');
        setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold text-gray-900">New Invoice</h1>
             {statusMessage && (
                <div className="p-2 text-center text-sm text-gray-700 bg-gray-100 rounded-lg">
                    {statusMessage}
                </div>
             )}
          </div>
          <InvoiceInfo 
            number={invoiceNumber} 
            invoiceDate={invoiceDate} 
            dueDate={dueDate}
            handleDateChange={handleDateChange} 
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ClientDetails client={client} handleChange={handleClientChange} />
            <ProjectDetails project={project} handleChange={handleProjectChange} />
          </div>
          <ItemizedBilling 
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            formatCurrency={formatCurrency}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <InvoiceSummary 
              subtotal={subtotal}
              tax={tax}
              total={total}
              formatCurrency={formatCurrency}
              paymentStatus={paymentStatus}
              handleStatusChange={handleStatusChange}
            />
            <InvoiceActions 
              handleGeneratePdf={handleGeneratePdf}
              handleSaveInvoice={handleSaveInvoice} 
              handleSendEmail={handleSendEmail}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

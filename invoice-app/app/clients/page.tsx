"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

interface Invoice {
  _id: string;
  invoiceInfo: {
    number: string;
    date: string;
  };
  client: {
    name: string;
  };
  summary: {
    total: number;
  };
  paymentStatus: string;
}

export default function ClientsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: State to track the pending status change for each invoice
  const [modifiedStatus, setModifiedStatus] = useState<{ [invoiceId: string]: string }>({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setInvoices(data);
        setError(null);
      } catch (err) {
        setError('Could not fetch invoices. Please make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Handler to temporarily store the selected status change
  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setModifiedStatus(prev => ({
      ...prev,
      [invoiceId]: newStatus,
    }));
  };

  // Handler to save the status update to the backend
  const handleStatusUpdate = async (invoiceId: string) => {
    const newStatus = modifiedStatus[invoiceId];
    if (!newStatus) return; // No change to save

    try {
        const response = await fetch(`http://localhost:3001/api/invoices/${invoiceId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        // Update the local state to reflect the change
        setInvoices(prevInvoices => 
            prevInvoices.map(invoice => 
                invoice._id === invoiceId ? { ...invoice, paymentStatus: newStatus } : invoice
            )
        );
        
        // Clear the modified status for this invoice, hiding the save button
        setModifiedStatus(prev => {
            const newState = { ...prev };
            delete newState[invoiceId];
            return newState;
        });

    } catch (err) {
        console.error('Error updating status:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Clients & Reports</h1>

          {loading && <p>Loading reports...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b">
                      <th className="p-4 font-medium">Invoice #</th>
                      <th className="p-4 font-medium">Client Name</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium text-right">Amount</th>
                      <th className="p-4 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice._id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{invoice.invoiceInfo.number}</td>
                          <td className="p-4">{invoice.client.name}</td>
                          <td className="p-4">{formatDate(invoice.invoiceInfo.date)}</td>
                          <td className="p-4 text-right">{formatCurrency(invoice.summary.total)}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <select
                                value={modifiedStatus[invoice._id] || invoice.paymentStatus}
                                onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                                disabled={invoice.paymentStatus === 'Paid'}
                                className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${invoice.paymentStatus === 'Paid' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Due">Due</option>
                              </select>
                              {/* Conditionally render the Save button */}
                              {modifiedStatus[invoice._id] && modifiedStatus[invoice._id] !== invoice.paymentStatus && (
                                <button
                                  onClick={() => handleStatusUpdate(invoice._id)}
                                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
                                >
                                  Save
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

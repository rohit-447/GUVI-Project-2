"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';

// Define a type for the invoice data we expect from the backend
interface Invoice {
  _id: string;
  summary: {
    total: number;
  };
  paymentStatus: string;
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Could not fetch dashboard data. Please make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);


  const { earned, pending, due } = useMemo(() => {
    let earned = 0;
    let pending = 0;
    let due = 0;
    invoices.forEach(invoice => {
      if (invoice.paymentStatus === 'Paid') {
        earned += invoice.summary.total;
      } else if (invoice.paymentStatus === 'Pending') {
        pending += invoice.summary.total;
      } else if (invoice.paymentStatus === 'Due') {
        due += invoice.summary.total;
      }
    });
    return { earned, pending, due };
  }, [invoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const totalRevenue = earned + pending + due;

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {loading && <p>Loading dashboard...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-green-600">Amount Earned</h2>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(earned)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-yellow-600">Amount Pending</h2>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(pending)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-red-600">Amount Due</h2>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(due)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React from 'react';

interface InvoiceSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: string;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  formatCurrency: (amount: number) => string;
}

export default function InvoiceSummary({ subtotal, tax, total, paymentStatus, handleStatusChange, formatCurrency }: InvoiceSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (GST 10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <span>Payment Status</span>
          <select
            name="paymentStatus"
            value={paymentStatus}
            onChange={handleStatusChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
        </div>
      </div>
    </div>
  );
}

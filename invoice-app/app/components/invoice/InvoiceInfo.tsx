import React from 'react';
import InputField from '../ui/InputField';

interface InvoiceInfoProps {
    number: string;
    invoiceDate: string;
    dueDate: string;
    handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InvoiceInfo({ number, invoiceDate, dueDate, handleDateChange }: InvoiceInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div>
        <label className="text-sm font-medium text-gray-500">Invoice #</label>
        <p className="text-lg font-semibold mt-1">{number}</p>
      </div>
      <InputField label="Invoice Date" name="invoiceDate" value={invoiceDate} onChange={handleDateChange} type="date" />
      <InputField label="Due Date" name="dueDate" value={dueDate} onChange={handleDateChange} type="date" />
    </div>
  );
}

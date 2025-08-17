import { Download, Send, Save } from 'lucide-react';

interface InvoiceActionsProps {
  handleGeneratePdf: () => void;
  handleSaveInvoice: () => void;
  handleSendEmail: () => void; // Add prop for the email function
}

export default function InvoiceActions({ handleGeneratePdf, handleSaveInvoice, handleSendEmail }: InvoiceActionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Invoice Actions</h2>
      <div className="space-y-3">
        <button 
          onClick={handleSaveInvoice}
          className="w-full flex justify-center items-center px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save size={20} className="mr-2" /> Save Invoice
        </button>
        <button 
          onClick={handleGeneratePdf} 
          className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download size={20} className="mr-2" /> Generate PDF & Save
        </button>
        <button 
          onClick={handleSendEmail}
          className="w-full flex justify-center items-center px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Send size={20} className="mr-2" /> Send via Email
        </button>
      </div>
    </div>
  );
}

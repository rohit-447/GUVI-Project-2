export default function InvoiceHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">New Invoice</h1>
      <div className="w-full sm:w-auto relative">
        <input type="text" placeholder="Search Invoices..." className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>
  );
}
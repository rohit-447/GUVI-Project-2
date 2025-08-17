import { Plus, Trash2 } from 'lucide-react';
import { Item } from '../../types'; 

interface ItemizedBillingProps {
  items: Item[];
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: keyof Item, value: string | number) => void;
  formatCurrency: (amount: number) => string;
}

export default function ItemizedBilling({ items, addItem, removeItem, updateItem, formatCurrency }: ItemizedBillingProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <h2 className="text-lg font-semibold mb-4">Itemized Billing</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="p-2 font-medium min-w-[250px]">Service Description</th>
              <th className="p-2 font-medium text-center w-24">Quantity</th>
              <th className="p-2 font-medium text-right w-32">Unit Price</th>
              <th className="p-2 font-medium text-right w-32">Amount</th>
              <th className="p-2 font-medium text-center w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2">
                  <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </td>
                <td className="p-2">
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-full p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </td>
                <td className="p-2">
                  <input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)} className="w-full p-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </td>
                <td className="p-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                <td className="p-2 text-center">
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addItem} className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
        <Plus size={16} className="mr-2" /> Add Item
      </button>
    </div>
  );
}
import React from 'react';
import InputField from '../ui/InputField';
import { Client } from '../../types';

// Props interface for ClientDetails component
interface ClientDetailsProps {
    client: Client; // Client object containing details
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
}

// Component to render client information form
export default function ClientDetails({ client, handleChange }: ClientDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Client Information</h2>
      
      <div className="space-y-4">
        {/* Individual input fields for client details */}
        <InputField label="Client Name" name="name" value={client.name} onChange={handleChange} />
        <InputField label="Address" name="address" value={client.address} onChange={handleChange} />
        <InputField label="Contact Person" name="contactPerson" value={client.contactPerson} onChange={handleChange} />
        
        {/* Email and phone fields side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Email" name="email" value={client.email} onChange={handleChange} type="email" />
          <InputField label="Phone" name="phone" value={client.phone} onChange={handleChange} type="tel" />
        </div>
      </div>
    </div>
  );
}

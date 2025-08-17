"use client";

import { FileText, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
          <span className="text-xl font-bold">Logo</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        <Link href="/dashboard" className={`flex items-center px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Home size={20} className="mr-3" /> Dashboard
        </Link>
        <Link href="/" className={`flex items-center px-4 py-2 rounded-lg ${isActive('/') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FileText size={20} className="mr-3" /> Invoice Generator
        </Link>
        <Link href="/clients" className={`flex items-center px-4 py-2 rounded-lg ${isActive('/clients') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Users size={20} className="mr-3" /> Clients
        </Link>
      </nav>

      <div className="flex-grow"></div> 
    </aside>
  );
}

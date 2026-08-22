'use client';

import { Bell, Bot, Building } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
      </div>
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="font-medium">Acme Corp</span>
        </div>
        
        <div className="h-4 w-px bg-gray-300"></div>
        
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 text-blue-500" />
          <span className="font-medium">LOCAL AI (Qwen)</span>
        </div>
        
        <div className="h-4 w-px bg-gray-300"></div>

        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-medium">Agent Active</span>
        </div>

        <div className="h-4 w-px bg-gray-300"></div>

        <button className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700 uppercase tracking-wider hover:bg-gray-200">
          Demo Mode
        </button>

        <button className="text-gray-400 hover:text-gray-500 relative">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

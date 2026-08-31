'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Users, Star, AlertTriangle, Zap, TrendingUp, Download } from 'lucide-react';
import Link from 'next/link';

// Mock fallback in case backend is down
const mockCustomers = [
  { id: 'CUST-84920', name: 'Acme Corp', email: 'billing@acme.com', ltv: 845000, transactions: 142, successRate: 98, failedPayments: 1, revenueAtRisk: 27500, revenueRecovered: 27500, probability: 87, segment: 'VIP', status: 'ACTIVE' },
  { id: 'CUST-84921', name: 'Beta Ltd', email: 'finance@betaltd.co', ltv: 125000, transactions: 45, successRate: 85, failedPayments: 3, revenueAtRisk: 15400, revenueRecovered: 0, probability: 45, segment: 'REGULAR', status: 'RECOVERING' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.items && data.items.length > 0 ? data.items : mockCustomers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch customers:", err);
        setCustomers(mockCustomers);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Customer Intelligence
          </h2>
          <p className="text-sm text-gray-500 mt-1">AI-driven insights for LTV optimization and churn prevention</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards Row 1 (4 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold truncate text-gray-900 mb-1">24,592</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Customers</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold truncate text-gray-900 mb-1">1,204</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">VIP Customers</p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <Star className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold truncate text-gray-900 mb-1">842</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">At-Risk</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold truncate text-gray-900 mb-1">5,420</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">High-Intent</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Summary Cards Row 2 (3 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold truncate text-gray-900 mb-1">{formatCurrency(185400000)}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Customer LTV</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded-lg relative z-10">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold truncate text-red-600 mb-1">{formatCurrency(4820000)}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue At Risk</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold truncate text-green-600 mb-1">{formatCurrency(2914000)}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue Recovered</p>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button className="flex flex-1 lg:flex-none items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <Filter className="h-4 w-4" /> Segment
            </button>
            <button className="flex flex-1 lg:flex-none items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <Filter className="h-4 w-4" /> Risk
            </button>
            <button className="flex flex-1 lg:flex-none items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <Filter className="h-4 w-4" /> Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">LTV</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Txns</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Success Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Failures</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">At Risk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Recovered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Recovery Prob.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Segment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cust.name}</div>
                    <div className="text-xs text-gray-500">{cust.id} | {cust.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(cust.ltv)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cust.transactions}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${cust.successRate > 90 ? 'text-green-600' : cust.successRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {cust.successRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cust.failedPayments > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {cust.failedPayments}
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {cust.revenueAtRisk > 0 ? formatCurrency(cust.revenueAtRisk) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {cust.revenueRecovered > 0 ? formatCurrency(cust.revenueRecovered) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cust.revenueAtRisk > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[50px]">
                          <div className={`h-1.5 rounded-full ${cust.probability > 70 ? 'bg-green-500' : cust.probability > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${cust.probability}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-600">{cust.probability}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cust.segment === 'VIP' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                      cust.segment === 'HIGH_INTENT' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                      cust.segment === 'AT_RISK' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {cust.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      cust.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 
                      cust.status === 'RECOVERING' ? 'bg-yellow-50 text-yellow-700' : 
                      'bg-red-50 text-red-700'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 bg-gray-50">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 font-mono">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24,592</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 z-10">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

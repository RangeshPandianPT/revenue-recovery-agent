'use client';
import { useState } from 'react';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Payment', value: 8499 },
  { name: 'Checkout', value: 15200 },
  { name: 'Receivable', value: 42000 },
  { name: 'Subscription', value: 2499 }
];

const opportunities = [
  { id: '78291', type: 'Payment', amount: '₹8,499', probability: 87, action: 'Smart Retry' },
  { id: '78122', type: 'Checkout', amount: '₹15,200', probability: 91, action: 'Payment Link' },
  { id: '77412', type: 'Receivable', amount: '₹42,000', probability: 74, action: 'Follow-up' },
  { id: '77391', type: 'Subscription', amount: '₹2,499', probability: 82, action: 'Retry' }
];

export default function Opportunities() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'High Value', 'Payment', 'Checkout', 'Receivables'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">AI Recovery Opportunities</h2>
          <p className="text-sm text-gray-500 mt-1">143 active opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search cases..." 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm">
            Run Batch
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-2">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Opportunity Value by Category (At Risk)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `₹${val >= 1000 ? val/1000 + 'k' : val}`} />
              <RechartsTooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter 
                  ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Case</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="relative px-6 py-3"><span className="sr-only">Options</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 font-mono">{opp.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {opp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 font-mono">{opp.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-10 font-mono">{opp.probability}%</span>
                      <div className="w-24 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden border border-gray-200">
                        <div 
                          className={`h-full rounded-full ${opp.probability >= 90 ? 'bg-green-500' : opp.probability >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${opp.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 font-medium">{opp.action}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100 p-1">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

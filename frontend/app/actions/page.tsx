'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Activity, CheckCircle2, XCircle, Clock, AlertTriangle, StopCircle, PlayCircle, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type RecoveryAction = {
  id: string;
  referenceId: string;
  customer: string;
  type: string;
  amount: number;
  confidence: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'RUNNING' | 'SUCCESSFUL' | 'FAILED' | 'STOPPED' | 'ESCALATED';
  createdAt: string;
  completedAt?: string;
};

const mockActions: RecoveryAction[] = [
  { id: 'ACT-9021', referenceId: 'TXN-88421', customer: 'Acme Ltd', type: 'Smart Retry', amount: 125000, confidence: 92, priority: 'HIGH', status: 'SUCCESSFUL', createdAt: '2026-08-25 09:12', completedAt: '2026-08-25 11:45' },
  { id: 'ACT-9022', referenceId: 'INV-77312', customer: 'Beta Corp', type: 'Payment Link SMS', amount: 45000, confidence: 78, priority: 'MEDIUM', status: 'RUNNING', createdAt: '2026-08-26 08:30' },
  { id: 'ACT-9023', referenceId: 'TXN-88433', customer: 'Delta Inc', type: 'Legal Escalation', amount: 350000, confidence: 15, priority: 'HIGH', status: 'ESCALATED', createdAt: '2026-08-20 14:22', completedAt: '2026-08-24 09:00' },
  { id: 'ACT-9024', referenceId: 'INV-77401', customer: 'Echo LLC', type: 'Automated Email', amount: 12000, confidence: 85, priority: 'LOW', status: 'PENDING', createdAt: '2026-08-26 13:10' },
  { id: 'ACT-9025', referenceId: 'TXN-88500', customer: 'Zenith Co', type: 'Smart Retry', amount: 89000, confidence: 65, priority: 'MEDIUM', status: 'FAILED', createdAt: '2026-08-25 15:45', completedAt: '2026-08-25 16:30' },
  { id: 'ACT-9026', referenceId: 'INV-77455', customer: 'Apex Global', type: 'Agent Call', amount: 210000, confidence: 45, priority: 'HIGH', status: 'STOPPED', createdAt: '2026-08-24 10:15', completedAt: '2026-08-24 10:20' },
  { id: 'ACT-9027', referenceId: 'TXN-88512', customer: 'Nova Tech', type: 'WhatsApp Reminder', amount: 55000, confidence: 88, priority: 'LOW', status: 'SUCCESSFUL', createdAt: '2026-08-26 09:00', completedAt: '2026-08-26 11:30' },
];

export default function RecoveryActions() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Metrics Dynamically
  const metrics = useMemo(() => {
    let total = mockActions.length;
    let pending = 0;
    let running = 0;
    let successful = 0;
    let failed = 0;
    let stopped = 0;
    let escalated = 0;
    let revenueRecovered = 0;

    mockActions.forEach(act => {
      switch (act.status) {
        case 'PENDING': pending++; break;
        case 'RUNNING': running++; break;
        case 'SUCCESSFUL': 
          successful++; 
          revenueRecovered += act.amount;
          break;
        case 'FAILED': failed++; break;
        case 'STOPPED': stopped++; break;
        case 'ESCALATED': escalated++; break;
      }
    });

    return { total, pending, running, successful, failed, stopped, escalated, revenueRecovered };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // 2. Filter Logic
  const filteredActions = useMemo(() => {
    return mockActions.filter(act => {
      const searchStr = `${act.customer} ${act.id} ${act.referenceId} ${act.type}`.toLowerCase();
      const searchMatch = searchStr.includes(searchTerm.toLowerCase());
      if (!searchMatch) return false;

      if (activeFilter === 'All') return true;
      return act.status === activeFilter;
    });
  }, [activeFilter, searchTerm]);

  const filterOptions = ['All', 'PENDING', 'RUNNING', 'SUCCESSFUL', 'FAILED', 'STOPPED', 'ESCALATED'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-purple-600" />
            Recovery Actions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Central execution center for AI-driven revenue recovery workflows</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Actions</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.pending}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pending Actions</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-blue-600 mb-1">{metrics.running}</p>
          <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Running</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-green-600 mb-1">{metrics.successful}</p>
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Successful</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-red-600 mb-1">{metrics.failed}</p>
          <p className="text-xs text-red-600 uppercase tracking-wider font-semibold">Failed</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-orange-600 mb-1">{metrics.stopped}</p>
          <p className="text-xs text-orange-600 uppercase tracking-wider font-semibold">Stopped</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-purple-700 mb-1">{metrics.escalated}</p>
          <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">Escalated</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-white shadow-sm p-4 relative overflow-hidden border-l-4 border-l-green-500">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{formatCurrency(metrics.revenueRecovered)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue Recovered</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Customer, ID, Type..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeFilter === filter 
                    ? 'bg-purple-100 border-purple-200 text-purple-700' 
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Action ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Txn / Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Action Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Timeline</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActions.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{act.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {act.referenceId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{act.customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{act.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(act.amount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${act.confidence >= 80 ? 'bg-green-500' : act.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${act.confidence}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{act.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      act.priority === 'HIGH' ? 'text-red-700 bg-red-50 border border-red-200' :
                      act.priority === 'MEDIUM' ? 'text-yellow-700 bg-yellow-50 border border-yellow-200' :
                      'text-blue-700 bg-blue-50 border border-blue-200'
                    }`}>
                      {act.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      act.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-800' : 
                      act.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                      act.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' : 
                      act.status === 'PENDING' ? 'bg-gray-100 text-gray-800' : 
                      act.status === 'STOPPED' ? 'bg-orange-100 text-orange-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {act.status === 'SUCCESSFUL' && <CheckCircle2 className="h-3 w-3" />}
                      {act.status === 'FAILED' && <XCircle className="h-3 w-3" />}
                      {act.status === 'RUNNING' && <PlayCircle className="h-3 w-3" />}
                      {act.status === 'PENDING' && <Clock className="h-3 w-3" />}
                      {act.status === 'STOPPED' && <StopCircle className="h-3 w-3" />}
                      {act.status === 'ESCALATED' && <AlertTriangle className="h-3 w-3" />}
                      {act.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      <div>Created: {act.createdAt}</div>
                      {act.completedAt && <div className="text-gray-400">Ended: {act.completedAt}</div>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredActions.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No actions match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

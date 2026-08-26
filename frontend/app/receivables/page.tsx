'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, FileText, TrendingUp, CalendarClock, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type Invoice = {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  riskScore: number;
  probability: number;
  promiseStatus: 'NONE' | 'PENDING' | 'KEPT' | 'BROKEN';
  recommendedAction: string;
  recoveryStatus: 'PENDING' | 'IN_PROGRESS' | 'RECOVERED' | 'ESCALATED' | 'FAILED';
};

const mockInvoices: Invoice[] = [
  { id: 'INV-9821', customer: 'Acme Ltd', amount: 120000, dueDate: '2026-08-08', daysOverdue: 18, riskScore: 82, probability: 72, promiseStatus: 'PENDING', recommendedAction: 'Follow-up + Promise-to-Pay', recoveryStatus: 'IN_PROGRESS' },
  { id: 'INV-9812', customer: 'Beta Corp', amount: 84000, dueDate: '2026-08-15', daysOverdue: 11, riskScore: 65, probability: 85, promiseStatus: 'NONE', recommendedAction: 'Automated Reminder', recoveryStatus: 'PENDING' },
  { id: 'INV-9781', customer: 'Delta Inc', amount: 240000, dueDate: '2026-07-25', daysOverdue: 32, riskScore: 94, probability: 41, promiseStatus: 'BROKEN', recommendedAction: 'Escalate to Legal', recoveryStatus: 'ESCALATED' },
  { id: 'INV-9844', customer: 'Echo LLC', amount: 45000, dueDate: '2026-08-28', daysOverdue: 0, riskScore: 12, probability: 98, promiseStatus: 'NONE', recommendedAction: 'No Action Required', recoveryStatus: 'PENDING' },
  { id: 'INV-9701', customer: 'Zenith Co', amount: 350000, dueDate: '2026-07-10', daysOverdue: 47, riskScore: 88, probability: 60, promiseStatus: 'KEPT', recommendedAction: 'Acknowledge Payment', recoveryStatus: 'RECOVERED' },
  { id: 'INV-9850', customer: 'Apex Global', amount: 92000, dueDate: '2026-08-27', daysOverdue: 0, riskScore: 45, probability: 89, promiseStatus: 'NONE', recommendedAction: 'Friendly Reminder', recoveryStatus: 'IN_PROGRESS' },
  { id: 'INV-9755', customer: 'Nova Tech', amount: 155000, dueDate: '2026-08-01', daysOverdue: 25, riskScore: 78, probability: 55, promiseStatus: 'PENDING', recommendedAction: 'Negotiate Payment Plan', recoveryStatus: 'IN_PROGRESS' },
];

export default function Receivables() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Metrics Dynamically
  const metrics = useMemo(() => {
    let totalOutstanding = 0;
    let overdueAmount = 0;
    let dueThisWeek = 0;
    let highRiskAmount = 0;
    let expectedRecovery = 0;
    let recoveredAmount = 0;
    let escalatedCount = 0;

    mockInvoices.forEach(inv => {
      if (inv.recoveryStatus === 'RECOVERED') {
        recoveredAmount += inv.amount;
      } else {
        totalOutstanding += inv.amount;
        expectedRecovery += (inv.amount * (inv.probability / 100));
        
        if (inv.daysOverdue > 0) overdueAmount += inv.amount;
        if (inv.daysOverdue === 0) dueThisWeek += inv.amount;
        if (inv.riskScore >= 75) highRiskAmount += inv.amount;
        if (inv.recoveryStatus === 'ESCALATED') escalatedCount += 1;
      }
    });

    const recoveryRate = (recoveredAmount / (recoveredAmount + totalOutstanding)) * 100;

    return { totalOutstanding, overdueAmount, dueThisWeek, highRiskAmount, expectedRecovery, recoveredAmount, recoveryRate, escalatedCount };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // 2. Filter Logic
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(inv => {
      // Search match
      const searchMatch = inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchMatch) return false;

      // Filter match
      switch (activeFilter) {
        case 'Due Soon': return inv.daysOverdue === 0 && inv.recoveryStatus !== 'RECOVERED';
        case 'Overdue': return inv.daysOverdue > 0 && inv.recoveryStatus !== 'RECOVERED';
        case 'High Risk': return inv.riskScore >= 75;
        case 'Promise Pending': return inv.promiseStatus === 'PENDING';
        case 'Promise Broken': return inv.promiseStatus === 'BROKEN';
        case 'Recovered': return inv.recoveryStatus === 'RECOVERED';
        case 'Escalated': return inv.recoveryStatus === 'ESCALATED';
        default: return true;
      }
    });
  }, [activeFilter, searchTerm]);

  const filterOptions = ['All', 'Due Soon', 'Overdue', 'High Risk', 'Promise Pending', 'Promise Broken', 'Recovered', 'Escalated'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-2 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          B2B Receivables Intelligence
        </h2>
        <p className="text-sm text-gray-500">AI Collection, Promise-to-Pay tracking, and Cashflow Simulation</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{formatCurrency(metrics.totalOutstanding)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Outstanding</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-red-600 mb-1">{formatCurrency(metrics.overdueAmount)}</p>
          <p className="text-xs text-red-500 uppercase tracking-wider font-semibold">Overdue Amount</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{formatCurrency(metrics.dueThisWeek)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Due This Week</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-orange-600 mb-1">{formatCurrency(metrics.highRiskAmount)}</p>
          <p className="text-xs text-orange-500 uppercase tracking-wider font-semibold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> High-Risk Receivables</p>
        </div>
        
        <div className="rounded-lg border border-blue-200 bg-blue-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-blue-600 mb-1">{formatCurrency(metrics.expectedRecovery)}</p>
          <p className="text-xs text-blue-500 uppercase tracking-wider font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Expected AI Recovery</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-green-600 mb-1">{formatCurrency(metrics.recoveredAmount)}</p>
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Recovered Amount</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.recoveryRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">AI Recovery Rate</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-purple-700 mb-1">{metrics.escalatedCount}</p>
          <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">Escalated Accounts</p>
        </div>
      </div>

      {/* Receivables Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices or customers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
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
                    ? 'bg-blue-100 border-blue-200 text-blue-700' 
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Invoice ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Overdue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Payment Prob.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Exp. Recovery</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Promise Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Recommended Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Recovery Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{inv.dueDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {inv.daysOverdue > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-bold"><AlertCircle className="h-3 w-3" /> {inv.daysOverdue}d</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${inv.riskScore >= 75 ? 'text-red-600' : inv.riskScore >= 40 ? 'text-orange-500' : 'text-green-600'}`}>
                      {inv.riskScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${inv.probability >= 70 ? 'bg-green-500' : inv.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${inv.probability}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{inv.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {inv.recoveryStatus === 'RECOVERED' ? '-' : formatCurrency(inv.amount * (inv.probability / 100))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {inv.promiseStatus !== 'NONE' && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        inv.promiseStatus === 'KEPT' ? 'bg-green-100 text-green-800' : 
                        inv.promiseStatus === 'BROKEN' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inv.promiseStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="truncate max-w-[180px] block">{inv.recommendedAction}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.recoveryStatus === 'RECOVERED' ? 'bg-green-100 text-green-800 border border-green-200' : 
                      inv.recoveryStatus === 'ESCALATED' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                      inv.recoveryStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {inv.recoveryStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No receivables match your current filters.
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

'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, CalendarCheck, CalendarX, TrendingUp, ShieldAlert, Clock, AlertTriangle, FileText, BadgeCheck } from 'lucide-react';

type PromiseToPay = {
  id: string;
  customer: string;
  invoiceId: string;
  amount: number;
  promiseDate: string;
  daysRemaining: number;
  probability: number;
  riskScore: number;
  status: 'PENDING' | 'DUE_TODAY' | 'DUE_SOON' | 'KEPT' | 'BROKEN' | 'ESCALATED' | 'CANCELLED';
  recommendedAction: string;
};

const mockPromises: PromiseToPay[] = [
  { id: 'PTP-1092', customer: 'Acme Ltd', invoiceId: 'INV-9821', amount: 120000, promiseDate: '2026-08-26', daysRemaining: 0, probability: 72, riskScore: 82, status: 'DUE_TODAY', recommendedAction: 'Send Reminder SMS' },
  { id: 'PTP-1093', customer: 'Beta Corp', invoiceId: 'INV-9812', amount: 84000, promiseDate: '2026-08-30', daysRemaining: 4, probability: 85, riskScore: 35, status: 'DUE_SOON', recommendedAction: 'Wait for Payment' },
  { id: 'PTP-1094', customer: 'Delta Inc', invoiceId: 'INV-9781', amount: 240000, promiseDate: '2026-08-15', daysRemaining: -11, probability: 12, riskScore: 94, status: 'BROKEN', recommendedAction: 'Escalate to Legal' },
  { id: 'PTP-1095', customer: 'Echo LLC', invoiceId: 'INV-9844', amount: 45000, promiseDate: '2026-09-10', daysRemaining: 15, probability: 98, riskScore: 12, status: 'PENDING', recommendedAction: 'No Action Required' },
  { id: 'PTP-1096', customer: 'Zenith Co', invoiceId: 'INV-9701', amount: 350000, promiseDate: '2026-08-20', daysRemaining: -6, probability: 100, riskScore: 5, status: 'KEPT', recommendedAction: 'Acknowledge Payment' },
  { id: 'PTP-1097', customer: 'Apex Global', invoiceId: 'INV-9850', amount: 92000, promiseDate: '2026-08-26', daysRemaining: 0, probability: 45, riskScore: 78, status: 'DUE_TODAY', recommendedAction: 'Call Customer' },
  { id: 'PTP-1098', customer: 'Nova Tech', invoiceId: 'INV-9755', amount: 155000, promiseDate: '2026-08-10', daysRemaining: -16, probability: 0, riskScore: 99, status: 'ESCALATED', recommendedAction: 'Debt Collection Agency' },
];

export default function Promises() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Metrics Dynamically
  const metrics = useMemo(() => {
    let totalPromises = mockPromises.length;
    let pendingCount = 0;
    let dueTodayCount = 0;
    let dueSoonCount = 0;
    let keptCount = 0;
    let brokenCount = 0;
    let amountPromised = 0;
    let amountRecovered = 0;

    mockPromises.forEach(ptp => {
      if (ptp.status !== 'CANCELLED') {
        amountPromised += ptp.amount;
      }
      if (ptp.status === 'KEPT') {
        amountRecovered += ptp.amount;
        keptCount++;
      } else if (ptp.status === 'BROKEN') {
        brokenCount++;
      } else if (ptp.status === 'DUE_TODAY') {
        dueTodayCount++;
      } else if (ptp.status === 'DUE_SOON') {
        dueSoonCount++;
      } else if (ptp.status === 'PENDING') {
        pendingCount++;
      }
    });

    // Calculate recovery rate based on resolved promises (Kept + Broken)
    const resolvedCount = keptCount + brokenCount;
    const recoveryRate = resolvedCount > 0 ? (keptCount / resolvedCount) * 100 : 0;

    return { totalPromises, pendingCount, dueTodayCount, dueSoonCount, keptCount, brokenCount, amountPromised, amountRecovered, recoveryRate };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // 2. Filter Logic
  const filteredPromises = useMemo(() => {
    return mockPromises.filter(ptp => {
      // Search match (Customer, Company, Invoice ID, Promise ID)
      const searchStr = `${ptp.customer} ${ptp.id} ${ptp.invoiceId}`.toLowerCase();
      const searchMatch = searchStr.includes(searchTerm.toLowerCase());
      if (!searchMatch) return false;

      // Filter match
      if (activeFilter === 'All') return true;
      return ptp.status === activeFilter;
    });
  }, [activeFilter, searchTerm]);

  const filterOptions = ['All', 'PENDING', 'DUE_TODAY', 'DUE_SOON', 'KEPT', 'BROKEN', 'ESCALATED', 'CANCELLED'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-2 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-blue-600" />
          Promise-to-Pay Intelligence
        </h2>
        <p className="text-sm text-gray-500">AI prediction and simulation for customer payment commitments</p>
      </div>

      {/* Summary Cards Row 1 (5 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.totalPromises}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Promises</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.pendingCount}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-orange-600 mb-1">{metrics.dueTodayCount}</p>
          <p className="text-xs text-orange-600 uppercase tracking-wider font-semibold">Due Today</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-blue-600 mb-1">{metrics.dueSoonCount}</p>
          <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Due Soon</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-purple-600 mb-1">{metrics.brokenCount}</p>
          <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">Promises Broken</p>
        </div>
      </div>

      {/* Summary Cards Row 2 (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{formatCurrency(metrics.amountPromised)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Amount Promised</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-green-600 mb-1">{formatCurrency(metrics.amountRecovered)}</p>
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Amount Recovered</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-white shadow-sm p-4 relative overflow-hidden border-l-4 border-l-green-500">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.keptCount}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Promises Kept</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.recoveryRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">PTP Recovery Rate</p>
        </div>
      </div>

      {/* Promise Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Customer, Company, Invoice, or ID..."
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
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Promise ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Customer / Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Promised Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Promise Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Days Remaining</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Payment Prob.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromises.map((ptp) => (
                <tr key={ptp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ptp.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ptp.customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {ptp.invoiceId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(ptp.amount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{ptp.promiseDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {ptp.daysRemaining > 0 ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium"><Clock className="h-3 w-3" /> {ptp.daysRemaining}d</span>
                    ) : ptp.daysRemaining === 0 ? (
                      <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-bold"><AlertTriangle className="h-3 w-3" /> Due Today</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-bold"><CalendarX className="h-3 w-3" /> {Math.abs(ptp.daysRemaining)}d Overdue</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${ptp.probability >= 70 ? 'bg-green-500' : ptp.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${ptp.probability}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{ptp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${ptp.riskScore >= 75 ? 'text-red-600' : ptp.riskScore >= 40 ? 'text-orange-500' : 'text-green-600'}`}>
                      {ptp.riskScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ptp.status === 'KEPT' ? 'bg-green-100 text-green-800 border border-green-200' : 
                      ptp.status === 'BROKEN' ? 'bg-red-100 text-red-800 border border-red-200' : 
                      ptp.status === 'DUE_TODAY' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                      ptp.status === 'DUE_SOON' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                      ptp.status === 'ESCALATED' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {ptp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="truncate max-w-[150px] block">{ptp.recommendedAction}</span>
                  </td>
                </tr>
              ))}
              {filteredPromises.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No promises match your current filters.
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

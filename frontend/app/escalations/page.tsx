'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, AlertOctagon, ArrowUpRight, FileText, UserCircle } from 'lucide-react';
import Link from 'next/link';

type Escalation = {
  id: string;
  customer: string;
  referenceId: string;
  amount: number;
  reason: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  recommendedAction: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'RECOVERED' | 'DISMISSED';
  createdAt: string;
};

const mockEscalations: Escalation[] = [
  { id: 'ESC-2041', customer: 'Acme Ltd', referenceId: 'TXN-88421', amount: 125000, reason: 'High-value customer failed 3 retries', riskLevel: 'HIGH', confidence: 92, recommendedAction: 'Personal phone call required', priority: 'CRITICAL', status: 'NEW', createdAt: '2026-08-25 09:12' },
  { id: 'ESC-2042', customer: 'Beta Corp', referenceId: 'INV-77312', amount: 45000, reason: 'AI detected dispute language in email', riskLevel: 'MEDIUM', confidence: 78, recommendedAction: 'Review dispute evidence', priority: 'HIGH', status: 'IN_REVIEW', createdAt: '2026-08-26 08:30' },
  { id: 'ESC-2043', customer: 'Delta Inc', referenceId: 'TXN-88433', amount: 350000, reason: 'Bankruptcy keyword matched', riskLevel: 'HIGH', confidence: 99, recommendedAction: 'Escalate to legal team', priority: 'CRITICAL', status: 'IN_REVIEW', createdAt: '2026-08-20 14:22' },
  { id: 'ESC-2044', customer: 'Echo LLC', referenceId: 'INV-77401', amount: 12000, reason: 'Customer requested extension', riskLevel: 'LOW', confidence: 85, recommendedAction: 'Approve 14-day extension', priority: 'LOW', status: 'NEW', createdAt: '2026-08-26 13:10' },
  { id: 'ESC-2045', customer: 'Zenith Co', referenceId: 'TXN-88500', amount: 89000, reason: 'Card marked stolen', riskLevel: 'HIGH', confidence: 100, recommendedAction: 'Block account, contact fraud team', priority: 'HIGH', status: 'RESOLVED', createdAt: '2026-08-25 15:45' },
  { id: 'ESC-2046', customer: 'Apex Global', referenceId: 'INV-77455', amount: 210000, reason: 'Promise-to-pay broken twice', riskLevel: 'HIGH', confidence: 95, recommendedAction: 'Send final notice', priority: 'HIGH', status: 'RECOVERED', createdAt: '2026-08-24 10:15' },
  { id: 'ESC-2047', customer: 'Nova Tech', referenceId: 'TXN-88512', amount: 55000, reason: 'Unrecognized error code from gateway', riskLevel: 'MEDIUM', confidence: 40, recommendedAction: 'Manual gateway review', priority: 'MEDIUM', status: 'NEW', createdAt: '2026-08-26 09:00' },
];

export default function Escalations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Metrics Dynamically
  const metrics = useMemo(() => {
    let total = mockEscalations.length;
    let newCount = 0;
    let highPriority = 0;
    let inReview = 0;
    let resolved = 0;
    let recovered = 0;
    let revenueAtRisk = 0;
    let revenueRecovered = 0;

    mockEscalations.forEach(esc => {
      if (esc.status === 'NEW') newCount++;
      if (esc.status === 'IN_REVIEW') inReview++;
      if (esc.status === 'RESOLVED') resolved++;
      if (esc.status === 'RECOVERED') {
        recovered++;
        revenueRecovered += esc.amount;
      }
      
      if (esc.priority === 'HIGH' || esc.priority === 'CRITICAL') {
        highPriority++;
      }

      if (esc.status === 'NEW' || esc.status === 'IN_REVIEW') {
        revenueAtRisk += esc.amount;
      }
    });

    return { total, newCount, highPriority, inReview, resolved, recovered, revenueAtRisk, revenueRecovered };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // 2. Filter Logic
  const filteredEscalations = useMemo(() => {
    return mockEscalations.filter(esc => {
      const searchStr = `${esc.customer} ${esc.id} ${esc.referenceId} ${esc.reason}`.toLowerCase();
      const searchMatch = searchStr.includes(searchTerm.toLowerCase());
      if (!searchMatch) return false;

      if (activeFilter === 'All') return true;
      return esc.status === activeFilter;
    });
  }, [activeFilter, searchTerm]);

  const filterOptions = ['All', 'NEW', 'IN_REVIEW', 'RESOLVED', 'RECOVERED', 'DISMISSED'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Human Escalation Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">Human-in-the-Loop review, decisioning, and audit center</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Escalations</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-red-600 mb-1">{metrics.newCount}</p>
          <p className="text-xs text-red-600 uppercase tracking-wider font-semibold">New Escalations</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-orange-600 mb-1">{metrics.highPriority}</p>
          <p className="text-xs text-orange-600 uppercase tracking-wider font-semibold">High Priority</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-blue-600 mb-1">{metrics.inReview}</p>
          <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">In Review</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.resolved}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Resolved</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-white shadow-sm p-4 relative overflow-hidden border-l-4 border-l-green-500">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">{metrics.recovered}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recovered</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-white shadow-sm p-4 relative overflow-hidden border-l-4 border-l-red-500">
          <p className="text-sm font-bold truncate text-red-600 mb-1">{formatCurrency(metrics.revenueAtRisk)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue at Risk</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 shadow-sm p-4 relative overflow-hidden">
          <p className="text-sm font-bold truncate text-green-600 mb-1">{formatCurrency(metrics.revenueRecovered)}</p>
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Revenue Recovered</p>
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
              placeholder="Search Case, Customer, Invoice, Reason..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
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
                    ? 'bg-red-100 border-red-200 text-red-700' 
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Case ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer / Co</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Txn / Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">AI Conf</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[150px]">Recommendation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEscalations.map((esc) => (
                <tr key={esc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{esc.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-gray-400" /> {esc.customer}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {esc.referenceId}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(esc.amount)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[200px]" title={esc.reason}>{esc.reason}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-xs font-bold ${
                      esc.riskLevel === 'HIGH' ? 'text-red-600' :
                      esc.riskLevel === 'MEDIUM' ? 'text-orange-500' :
                      'text-green-600'
                    }`}>
                      {esc.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5 hidden sm:block">
                        <div className={`h-1.5 rounded-full ${esc.confidence >= 90 ? 'bg-green-500' : esc.confidence >= 70 ? 'bg-blue-500' : esc.confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${esc.confidence}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{esc.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 truncate max-w-[150px]" title={esc.recommendedAction}>{esc.recommendedAction}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      esc.priority === 'CRITICAL' ? 'text-red-800 bg-red-100 border border-red-200' :
                      esc.priority === 'HIGH' ? 'text-orange-800 bg-orange-100 border border-orange-200' :
                      esc.priority === 'MEDIUM' ? 'text-yellow-800 bg-yellow-100 border border-yellow-200' :
                      'text-blue-800 bg-blue-100 border border-blue-200'
                    }`}>
                      {esc.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      esc.status === 'RECOVERED' ? 'bg-green-100 text-green-800' : 
                      esc.status === 'RESOLVED' ? 'bg-blue-100 text-blue-800' : 
                      esc.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' : 
                      esc.status === 'DISMISSED' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800' // NEW
                    }`}>
                      {esc.status === 'RECOVERED' && <CheckCircle2 className="h-3 w-3" />}
                      {esc.status === 'RESOLVED' && <CheckCircle2 className="h-3 w-3" />}
                      {esc.status === 'IN_REVIEW' && <Clock className="h-3 w-3" />}
                      {esc.status === 'NEW' && <AlertOctagon className="h-3 w-3" />}
                      {esc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      {esc.createdAt}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEscalations.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No escalations match your current filters.
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

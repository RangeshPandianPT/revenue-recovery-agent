'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Activity, Zap, Shield, Play } from 'lucide-react';
import Link from 'next/link';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStats, setSimStats] = useState({
    rate: 60.4,
    revenue: 2914000,
    cost: 128000
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/dashboard/recent-cases?limit=20');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e: any) {
      console.error('Failed to fetch cases', e.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const simulateRecovery = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('http://localhost:8000/api/batches/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: 'demo_merchant', case_count: 100 })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Simulation failed');
      }
      const data = await res.json();
      const rate = (data.successful_recoveries / Math.max(data.total_cases, 1)) * 100;
      setSimStats({
        rate: parseFloat(rate.toFixed(1)),
        revenue: data.net_revenue_recovered || 0,
        cost: data.recovery_costs || 0
      });
    } catch (error: any) {
      console.error('Simulation error:', error.message);
    } finally {
      setIsSimulating(false);
      fetchTransactions();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Transaction Intelligence</h2>
          <p className="text-sm text-gray-500 mt-1">AI-powered recovery tracking, simulation, and analysis</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
          <p className="text-sm font-bold truncate text-gray-900 mb-1">12,492</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Failed (30d)</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
          <p className="text-sm font-bold truncate text-red-600 mb-1">{formatCurrency(4820000)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue at Risk</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
          <p className="text-sm font-bold truncate text-green-600 mb-1">{formatCurrency(2914000)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recovered Revenue</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
          <p className="text-sm font-bold truncate text-blue-600 mb-1">60.4%</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">AI Recovery Rate</p>
        </div>
      </div>

      {/* Simulation Module */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Recovery Simulation Engine
            </h3>
            <p className="text-sm text-gray-500 mt-1">Compare recovery strategies against current risk portfolio</p>
          </div>
          <button 
            onClick={simulateRecovery}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70"
          >
            <Play className="h-4 w-4" />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 border-b pb-2">No Recovery</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Recovery Rate</p>
                <p className="text-sm font-bold text-gray-900">0%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Recovered Revenue</p>
                <p className="text-sm font-bold text-gray-900">₹0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cost of Recovery</p>
                <p className="text-sm font-bold text-gray-900">₹0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 border-b pb-2">Rule-Based</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Recovery Rate</p>
                <p className="text-sm font-bold text-blue-600">18.5%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Recovered Revenue</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(891700)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cost of Recovery (SMS/Email)</p>
                <p className="text-sm font-bold text-red-500">{formatCurrency(45000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-5 border border-purple-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Shield className="h-6 w-6 text-purple-300" />
            </div>
            <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-4 border-b border-purple-200 pb-2">RecoverAI (ML)</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-purple-600">Recovery Rate</p>
                <p className="text-sm font-bold text-green-600">{simStats.rate}%</p>
              </div>
              <div>
                <p className="text-xs text-purple-600">Recovered Revenue</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(simStats.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600">Cost of Recovery (Smart)</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(simStats.cost)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, customer, order..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out font-mono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer / Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Probability</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn: any) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id.substring(0, 12)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{txn.customer_name}</div>
                    <div className="text-xs text-gray-500">{txn.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(txn.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                        <div className={`h-1.5 rounded-full ${txn.recovery_probability * 100 > 70 ? 'bg-green-500' : txn.recovery_probability * 100 > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${txn.recovery_probability * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{Math.round(txn.recovery_probability * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{txn.recommended_action || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      txn.status === 'RECOVERED' ? 'bg-green-100 text-green-800' : 
                      txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/transactions/${txn.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1">
                      Details <ArrowUpRight className="h-3 w-3" />
                    </Link>
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

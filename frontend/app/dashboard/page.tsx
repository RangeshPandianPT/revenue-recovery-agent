'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { ArrowUpRight, IndianRupee, AlertCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [traceData, setTraceData] = useState<any>(null);

  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const apiData = await response.json();
      setData({
        revenueAtRisk: apiData.total_revenue_at_risk || 0,
        revenueRecovered: apiData.revenue_recovered || 0,
        netRevenueRecovered: apiData.revenue_recovered || 0, // Mock net as revenue for now
        recoveryRate: apiData.recovery_rate || 0,
        activeCases: apiData.total_cases || 0,
        actionsExecuted: apiData.actions_executed || 0,
        openEscalations: apiData.open_escalations || 0,
        byEventType: apiData.by_event_type || {}
      });

      const traceResponse = await fetch('http://localhost:8000/api/dashboard/recent-trace');
      if (traceResponse.ok) {
        const trace = await traceResponse.json();
        setTraceData(trace);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard summary:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunBatch = async () => {
    setIsBatchRunning(true);
    try {
      const response = await fetch('http://localhost:8000/api/batches/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: 'demo_merchant', case_count: 100 }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Batch execution failed');
      }
      await fetchDashboardData();
      toast.success('Batch executed successfully!');
    } catch (error: any) {
      console.error('Batch run error:', error.message);
      toast.error(error.message || 'Failed to execute batch run.');
    } finally {
      setIsBatchRunning(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dashboard_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (loading) {
    return <LoadingState message="Loading dashboard metrics..." />;
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState 
          title="No data available" 
          description="There are currently no metrics to display." 
          actionText="Run Simulator" 
          onAction={() => {}} 
        />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Revenue Recovery Overview
        </h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleExport}
            className="inline-flex items-center rounded bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Export
          </button>
          <button 
            onClick={handleRunBatch}
            disabled={isBatchRunning}
            className={`inline-flex items-center rounded px-3 py-1.5 text-sm font-medium text-white transition-colors shadow-sm ${
              isBatchRunning 
                ? 'bg-green-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isBatchRunning ? 'Running...' : 'Run Batch'}
          </button>
        </div>
      </div>

      {/* Overview Cards Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{formatCurrency(data.revenueAtRisk)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">At Risk</p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{formatCurrency(data.revenueRecovered)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recovered</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{data.recoveryRate}%</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recovery</p>
        </div>
      </div>

      {/* Overview Cards Row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{formatCurrency(data.netRevenueRecovered)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Net</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{data.openEscalations}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Escalated</p>
        </div>
      </div>

      {/* Real Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Revenue Recovery Chart</h3>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { name: 'Mon', recovered: 4000, atRisk: 2400 },
              { name: 'Tue', recovered: 3000, atRisk: 1398 },
              { name: 'Wed', recovered: 5000, atRisk: 9800 },
              { name: 'Thu', recovered: 2780, atRisk: 3908 },
              { name: 'Fri', recovered: 6890, atRisk: 4800 },
              { name: 'Sat', recovered: 2390, atRisk: 3800 },
              { name: 'Sun', recovered: 7490, atRisk: 4300 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="recovered" name="Recovered (₹)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#16a34a' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="atRisk" name="At Risk (₹)" stroke="#dc2626" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#dc2626' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Revenue Leakage Funnel</h3>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-700 gap-2">
            <span className="text-red-600 font-medium">At Risk</span>
            <span className="text-gray-400">{"->"}</span>
            <span className="text-orange-600 font-medium">Recoverable</span>
            <span className="text-gray-400">{"->"}</span>
            <span className="text-blue-600 font-medium">Actioned</span>
            <span className="text-gray-400">{"->"}</span>
            <span className="text-green-600 font-bold">Recovered</span>
          </div>
        </div>
      </div>

      {/* AI Agent Execution Detail */}
      <div className="mt-8 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Recent AI Recovery Trace</h3>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Transaction & Workflow */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 flex-1 bg-gray-50/50">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Transaction</p>
                <p className="text-sm font-medium text-gray-900 font-mono">{traceData ? traceData.transaction_id.split('-')[0] + '...' : 'TXN-78291'}</p>
                <p className="text-sm text-gray-600 mt-0.5 font-mono">{formatCurrency(traceData ? traceData.amount : 8499)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900 font-mono">{traceData ? traceData.customer_name : 'Customer #10492'}</p>
                <p className="text-sm text-gray-600 mt-0.5 font-mono">LTV: {formatCurrency(traceData ? traceData.customer_ltv : 84500)}</p>
              </div>
            </div>

            <div className="space-y-0 relative">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Execution Trace</p>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center relative z-10 border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Revenue Risk Detected</p>
                </div>
              </div>

              <div className="absolute left-[11px] top-[40px] bottom-8 w-0.5 bg-gray-200"></div>

              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Customer Context Loaded</p>
                </div>
              </div>

              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Root Cause Identified</p>
                </div>
              </div>
              
              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Recovery Probability: <span className="text-green-600 font-mono">{traceData ? traceData.recovery_probability : 87}%</span></p>
                </div>
              </div>
              
              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Strategy Selected: <span className="text-blue-600 font-bold uppercase text-xs tracking-wider">{traceData ? traceData.strategy : 'Smart Retry'}</span></p>
                </div>
              </div>
              
              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">Policy Validation: <span className="text-green-600 font-semibold">{traceData ? traceData.policy_decision : 'PASSED'}</span></p>
                </div>
              </div>
              
              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-blue-600 text-[12px] font-bold">→</span>
                </div>
                <div className="ml-4 pb-4">
                  <p className="text-sm font-medium text-gray-800">AI Reasoning</p>
                  <p className="text-sm text-gray-600 mt-1 italic leading-relaxed">{traceData ? traceData.ai_reasoning : 'Executing recovery...'}</p>
                </div>
              </div>
              
              <div className="flex items-start group relative z-10">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">Execution Status: <span className="text-gray-900 font-semibold">{traceData ? traceData.status : 'Recovered'}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recovery Result */}
          <div className="p-6 md:w-80 lg:w-96 bg-white flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Recovery Result</p>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Amount Recovered</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">{formatCurrency(traceData?.status === 'RECOVERED' ? traceData.amount : 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Recovery Probability</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">{traceData ? traceData.recovery_probability : 87}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Strategy</dt>
                  <dd className="text-sm font-medium text-gray-900">{traceData ? traceData.strategy : 'Smart Retry'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Expected Net Revenue</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">{formatCurrency(traceData ? traceData.expected_net_revenue : 7394)}</dd>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <dt className="text-sm font-medium text-gray-900">Actual Revenue</dt>
                  <dd className="text-sm font-bold text-green-600 font-mono">{formatCurrency(traceData?.status === 'RECOVERED' ? traceData.amount : 0)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Workflow Status</span>
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                  {traceData ? traceData.status : 'STOPPED'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Policy Decision</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${traceData?.policy_decision === 'PASSED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {traceData ? traceData.policy_decision : 'PASSED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { ArrowUpRight, IndianRupee, AlertCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

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
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
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
      if (!response.ok) throw new Error('Batch execution failed');
      await fetchDashboardData();
      toast.success('Batch executed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to execute batch run.');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard Summary
        </h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Export
          </button>
          <button 
            onClick={handleRunBatch}
            disabled={isBatchRunning}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isBatchRunning 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
            }`}
          >
            {isBatchRunning ? 'Running...' : 'Run Batch'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Revenue at Risk</dt>
                  <dd className="mt-1 flex items-baseline justify-between sm:block lg:flex">
                    <div className="flex items-baseline text-2xl font-bold text-gray-900">
                      {formatCurrency(data.revenueAtRisk)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IndianRupee className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Revenue Recovered</dt>
                  <dd className="mt-1 flex items-baseline justify-between sm:block lg:flex">
                    <div className="flex items-baseline text-2xl font-bold text-gray-900">
                      {formatCurrency(data.revenueRecovered)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpRight className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Net Revenue Recovered</dt>
                  <dd className="mt-1 flex items-baseline justify-between sm:block lg:flex">
                    <div className="flex items-baseline text-2xl font-bold text-gray-900">
                      {formatCurrency(data.netRevenueRecovered)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-purple-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Recovery Rate</dt>
                  <dd className="mt-1 flex items-baseline justify-between sm:block lg:flex">
                    <div className="flex items-baseline text-2xl font-bold text-gray-900">
                      {data.recoveryRate}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Details */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-8">
        <div className="rounded-lg bg-white shadow p-6 flex flex-col">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Risk by Event Type</h3>
          <div className="flex-1">
            {data.byEventType && Object.keys(data.byEventType).length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {Object.entries(data.byEventType).map(([type, stats]: [string, any]) => (
                  <li key={type} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{stats.count} cases</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(stats.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState 
                title="No Data" 
                description="No events found in the system." 
              />
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6 flex flex-col">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Action Summary</h3>
          <div className="flex-1 flex flex-col space-y-4">
             <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm font-medium text-blue-800">Total Cases</p>
                <p className="text-2xl font-bold text-blue-900">{data.activeCases}</p>
             </div>
             <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm font-medium text-green-800">Actions Executed</p>
                <p className="text-2xl font-bold text-green-900">{data.actionsExecuted}</p>
             </div>
             <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm font-medium text-red-800">Open Escalations</p>
                <p className="text-2xl font-bold text-red-900">{data.openEscalations}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

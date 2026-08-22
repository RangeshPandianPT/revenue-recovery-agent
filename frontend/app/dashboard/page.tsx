'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { ArrowUpRight, IndianRupee, AlertCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData({
        revenueAtRisk: 4820000,
        revenueRecovered: 2914000,
        netRevenueRecovered: 2786400,
        recoveryRate: 60.46,
        activeCases: 124,
        highPriority: 12,
        escalated: 8,
        stopped: 45
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Export
          </button>
          <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Run Batch
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
      
      {/* Empty Chart Placeholder */}
      <div className="mt-8 rounded-lg bg-white shadow p-6 h-96 flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recovery Pipeline</h3>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <EmptyState 
            title="Charts Placeholder" 
            description="Integration with Chart.js or Recharts will be implemented in the Analytics phase." 
          />
        </div>
      </div>
    </div>
  );
}

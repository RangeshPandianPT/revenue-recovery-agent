'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const apiData = await response.json();
        setData(apiData);
      } catch (error: any) {
        console.error('Error fetching analytics:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingState message="Loading analytics..." />;
  }

  if (!data) {
    return <EmptyState title="No Analytics Data" description="Check backend connectivity." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Analytics & Performance
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-8">
        {/* Strategy Performance Placeholder */}
        <div className="rounded-lg bg-white shadow p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">Strategy Performance</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center py-8">
            <div className="w-full max-w-sm space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-700">Smart Retry</span>
                 <span className="text-sm font-medium text-green-600">85% Success</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2.5">
                 <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
               </div>

               <div className="flex items-center justify-between mt-4">
                 <span className="text-sm font-medium text-gray-700">Payment Link</span>
                 <span className="text-sm font-medium text-green-600">62% Success</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2.5">
                 <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
               </div>

               <div className="flex items-center justify-between mt-4">
                 <span className="text-sm font-medium text-gray-700">Promise to Pay</span>
                 <span className="text-sm font-medium text-green-600">41% Success</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2.5">
                 <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '41%' }}></div>
               </div>
            </div>
          </div>
        </div>

        {/* Funnel Placeholder */}
        <div className="rounded-lg bg-white shadow p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recovery Funnel</h3>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
             <div className="space-y-2 w-full max-w-sm text-center">
                <div className="bg-blue-100 py-3 rounded-t-lg mx-0">
                  <p className="text-sm font-semibold text-blue-800">Total Cases ({data.total_cases})</p>
                </div>
                <div className="bg-blue-200 py-3 mx-4">
                  <p className="text-sm font-semibold text-blue-800">Actions Executed ({data.actions_executed})</p>
                </div>
                <div className="bg-blue-300 py-3 mx-8">
                  <p className="text-sm font-semibold text-blue-900">Recovered ({Math.floor(data.total_cases * (data.recovery_rate / 100))})</p>
                </div>
                <div className="bg-blue-400 py-3 mx-12 rounded-b-lg">
                  <p className="text-sm font-bold text-white">Net Revenue ₹{data.revenue_recovered}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Stopping Statistics */}
        <div className="rounded-lg bg-white shadow p-6 flex flex-col col-span-1 lg:col-span-2">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">Stopping Statistics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="border border-gray-200 rounded p-4 text-center">
                <p className="text-3xl font-bold text-gray-700">14</p>
                <p className="text-sm text-gray-500 mt-1">Max Retries Reached</p>
             </div>
             <div className="border border-gray-200 rounded p-4 text-center">
                <p className="text-3xl font-bold text-gray-700">{data.open_escalations}</p>
                <p className="text-sm text-gray-500 mt-1">Escalated to Human</p>
             </div>
             <div className="border border-gray-200 rounded p-4 text-center">
                <p className="text-3xl font-bold text-gray-700">3</p>
                <p className="text-sm text-gray-500 mt-1">Policy Violations Prevented</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

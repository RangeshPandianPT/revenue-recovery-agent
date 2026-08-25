'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function Batches() {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);

  const fetchBatches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/batches');
      if (!response.ok) throw new Error('Failed to fetch batches');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) return <LoadingState message="Loading batches..." />;

  if (batches.length === 0) {
    return (
      <EmptyState 
        title="No Batches Found" 
        description="Run a batch recovery simulation from the Dashboard to see it here."
        actionText="Refresh"
        onAction={fetchBatches}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Recovery Batches
        </h2>
        <button 
          onClick={fetchBatches}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-300 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Batch ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Cases</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">At Risk</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Recovered</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {batches.map((batch) => (
              <tr key={batch.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {batch.id.substring(0, 8)}...
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{batch.total_cases}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(batch.revenue_at_risk)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(batch.net_revenue_recovered)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {batch.revenue_at_risk > 0 ? ((batch.net_revenue_recovered / batch.revenue_at_risk) * 100).toFixed(1) : 0}%
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    batch.status === 'COMPLETED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                  }`}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

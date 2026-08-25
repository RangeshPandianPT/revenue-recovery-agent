'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function Escalations() {
  const [loading, setLoading] = useState(true);
  const [escalations, setEscalations] = useState<any[]>([]);

  useEffect(() => {
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/escalations');
      if (!response.ok) throw new Error('Failed to fetch escalations');
      const data = await response.json();
      setEscalations(data.items || []);
    } catch (error) {
      console.error('Error fetching escalations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/escalations/${id}/${action}`, {
        method: 'POST',
      });
      if (response.ok) {
        // Refresh the list
        fetchEscalations();
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
    }
  };

  if (loading) {
    return <LoadingState message="Loading escalations..." />;
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
          Human Escalation Queue
        </h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {escalations.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {escalations.map((esc) => (
              <li key={esc.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className={`h-5 w-5 mr-2 ${
                        esc.priority === 'HIGH' ? 'text-red-500' : 
                        esc.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {esc.customer_name} - {formatCurrency(esc.amount)}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        esc.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {esc.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex flex-col space-y-2">
                      <p className="flex items-center text-sm text-gray-500">
                        Risk Type: {esc.risk_type}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        Reason: {esc.reason}
                      </p>
                      <p className="flex items-center text-sm text-gray-500 font-medium">
                        AI Recommendation: {esc.ai_recommendation}
                      </p>
                    </div>
                    
                    {esc.status === 'OPEN' && (
                      <div className="mt-2 flex items-center text-sm sm:mt-0 space-x-2">
                        <button 
                          onClick={() => handleAction(esc.id, 'approve')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve Action
                        </button>
                        <button 
                          onClick={() => handleAction(esc.id, 'reject')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </button>
                        <button 
                          onClick={() => handleAction(esc.id, 'close')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Close Case
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <EmptyState 
              title="No pending escalations" 
              description="There are currently no cases requiring human review." 
            />
          </div>
        )}
      </div>
    </div>
  );
}

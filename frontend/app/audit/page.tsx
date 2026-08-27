'use client';

import { useState, useEffect } from 'react';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';

export default function AuditTrail() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/audit?limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data = await response.json();
        setLogs(data.items || []);
      } catch (error: any) {
        console.error('Error fetching audit logs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return <LoadingState message="Loading audit trail..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Audit Trail
        </h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {logs.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {log.action}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {log.actor}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex flex-col space-y-1">
                      <p className="flex items-center text-sm text-gray-500">
                        {log.reason || 'No reason provided.'}
                      </p>
                      {log.policy_decision && (
                        <p className="flex items-center text-sm text-gray-500">
                          Policy Decision: {log.policy_decision}
                        </p>
                      )}
                      {log.outcome && (
                        <p className="flex items-center text-sm text-gray-500">
                          Outcome: {log.outcome}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <EmptyState 
              title="No audit logs found" 
              description="The system has not recorded any actions yet." 
            />
          </div>
        )}
      </div>
    </div>
  );
}

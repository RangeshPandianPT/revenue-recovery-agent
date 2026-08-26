'use client';

import { useState } from 'react';
import { Play, Copy, X, ArrowDown, User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const caseData = [
  { name: 'Successful', value: 2913 },
  { name: 'Stopped', value: 1756 },
  { name: 'Escalated', value: 143 },
  { name: 'No Action Needed', value: 5188 }
];
const COLORS = ['#16a34a', '#f59e0b', '#dc2626', '#94a3b8'];

export default function Batches() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const startBatch = () => {
    setStatus('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Batch Recovery</h2>
          <p className="text-sm text-gray-500 mt-1">Run large-scale AI recovery workflows</p>
        </div>
        <button 
          onClick={startBatch}
          disabled={status === 'processing'}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm ${
            status === 'processing' 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Play className="h-4 w-4" />
          Run Batch Recovery
        </button>
      </div>

      {status === 'idle' && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Play className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Batch</h3>
          <p className="text-sm text-gray-500">Click "Run Batch Recovery" to start processing AUG-25-DEMO batch.</p>
        </div>
      )}

      {status === 'processing' && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Batch Recovery</p>
            <p className="text-sm font-medium text-gray-900 font-mono mb-6">Batch: AUG-25-DEMO</p>
            
            <p className="text-sm text-gray-700 mb-2 font-mono">Processing 10,000 revenue-risk cases...</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 font-mono w-10">{progress}%</span>
            </div>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-y-3">
              <div className="flex justify-between max-w-sm">
                <dt className="text-sm text-gray-600 font-mono">Analyzed</dt>
                <dd className="text-sm font-semibold text-gray-900 font-mono">10,000</dd>
              </div>
              <div className="flex justify-between max-w-sm">
                <dt className="text-sm text-gray-600 font-mono">Recoverable</dt>
                <dd className="text-sm font-semibold text-gray-900 font-mono">6,420</dd>
              </div>
              <div className="flex justify-between max-w-sm">
                <dt className="text-sm text-gray-600 font-mono">Actions</dt>
                <dd className="text-sm font-semibold text-gray-900 font-mono">4,812</dd>
              </div>
              <div className="flex justify-between max-w-sm">
                <dt className="text-sm text-gray-600 font-mono">Successful</dt>
                <dd className="text-sm font-semibold text-green-600 font-mono">2,913</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full max-w-xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">BATCH RECOVERY COMPLETE</p>
              <span className="text-green-600 text-lg font-bold">✓</span>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Revenue At Risk</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">₹48.20L</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Recoverable Revenue</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">₹36.80L</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Actions Executed</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">4,812</dd>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <dt className="text-sm text-gray-600 font-mono">Successful Recoveries</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">2,913</dd>
                </div>

                <div className="flex justify-between pt-2 border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Gross Revenue Recovered</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">₹29.14L</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Recovery Cost</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">₹1.28L</dd>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4 pt-2">
                  <dt className="text-sm font-bold text-gray-900 font-mono uppercase">NET REVENUE RECOVERED</dt>
                  <dd className="text-sm font-bold text-green-600 font-mono">₹27.86L</dd>
                </div>

                <div className="flex justify-between pt-2 border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Recovery Rate</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">60.46%</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Escalated Cases</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">143</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-sm text-gray-600 font-mono">Stopped Workflows</dt>
                  <dd className="text-sm font-semibold text-gray-900 font-mono">1,756</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-sm flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 mb-6 uppercase tracking-wider text-center">Case Resolution Breakdown</h3>
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {caseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [value.toLocaleString('en-IN'), 'Cases']}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Bounded Workflow Example Screen */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm w-full max-w-3xl border border-gray-200 text-gray-700 font-mono text-sm mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-gray-900 tracking-widest text-xs">CASE #98231</span>
          <Copy className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-900 font-bold mb-1">₹27,500</p>
            <p className="text-gray-500">Payment Recovery</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 mb-1">Attempt 1</p>
              <p className="flex items-center gap-2 text-red-600 font-semibold">
                <X className="h-4 w-4 stroke-[3]" /> Failed
              </p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Attempt 2</p>
              <p className="flex items-center gap-2 text-red-600 font-semibold">
                <X className="h-4 w-4 stroke-[3]" /> Failed
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-900 mb-2">Maximum retry limit reached</p>
            <div className="ml-1 mb-2">
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </div>
            <p className="flex items-center gap-3 text-gray-900 font-bold tracking-widest text-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)] border border-pink-400"></span>
              AUTOMATION STOPPED
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Reason:</p>
            <p className="text-gray-900 mb-2">Maximum retry policy reached</p>
            <div className="ml-1 mb-2">
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </div>
            <p className="flex items-center gap-2 text-gray-900 font-bold tracking-widest text-xs">
              <User className="h-4 w-4 text-purple-600 fill-purple-100" />
              HUMAN ESCALATION CREATED
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Priority:</p>
            <p className="text-gray-900">HIGH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

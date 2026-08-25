'use client';

import { useState } from 'react';
import { Target, TrendingUp, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Simulator() {
  const [inputs, setInputs] = useState({
    revenueRisk: 5000000,
    cases: 1000,
    avgTransaction: 5000,
  });

  const [results, setResults] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      // Rule-based vs AI simulation logic
      const ruleBasedRecoveryRate = 0.25;
      const aiRecoveryRate = 0.60;

      const ruleRecovered = inputs.revenueRisk * ruleBasedRecoveryRate;
      const aiRecovered = inputs.revenueRisk * aiRecoveryRate;

      setResults({
        noRecovery: { recovered: 0, net: 0, cost: 0, rate: 0 },
        ruleBased: {
          recovered: ruleRecovered,
          net: ruleRecovered - (inputs.cases * 15), // Assumed static cost per case
          cost: inputs.cases * 15,
          rate: ruleBasedRecoveryRate * 100,
        },
        ai: {
          recovered: aiRecovered,
          net: aiRecovered - (inputs.cases * 5), // AI optimizes strategy cost
          cost: inputs.cases * 5,
          rate: aiRecoveryRate * 100,
        }
      });
      setSimulating(false);
      toast.success("Simulation complete!");
    }, 1000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Recovery Simulator
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Compare the expected revenue recovery of traditional rule-based systems vs the RecoverAI Agent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 shadow rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Settings2 className="h-5 w-5 mr-2 text-blue-500" />
            Simulation Inputs
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Revenue at Risk (₹)</label>
              <input
                type="number"
                value={inputs.revenueRisk}
                onChange={(e) => setInputs({...inputs, revenueRisk: Number(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Cases</label>
              <input
                type="number"
                value={inputs.cases}
                onChange={(e) => setInputs({...inputs, cases: Number(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Avg Transaction (₹)</label>
              <input
                type="number"
                value={inputs.avgTransaction}
                onChange={(e) => setInputs({...inputs, avgTransaction: Number(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={simulating}
              className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              {simulating ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {results ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">Rule-Based Automation</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Recovery Rate</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{results.ruleBased.rate}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expected Recovery</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-700">{formatCurrency(results.ruleBased.recovered)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Net Revenue (After Cost)</dt>
                    <dd className="mt-1 text-xl font-bold text-blue-600">{formatCurrency(results.ruleBased.net)}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-blue-50 p-6 shadow rounded-lg border border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                   <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">Winner</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" /> RecoverAI Agent
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-blue-800">Recovery Rate</dt>
                    <dd className="mt-1 text-2xl font-bold text-blue-900">{results.ai.rate}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-blue-800">Expected Recovery</dt>
                    <dd className="mt-1 text-xl font-semibold text-blue-800">{formatCurrency(results.ai.recovered)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-blue-800">Net Revenue (After Cost)</dt>
                    <dd className="mt-1 text-2xl font-bold text-green-600 flex items-center">
                      {formatCurrency(results.ai.net)}
                      <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
                    </dd>
                  </div>
                </dl>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div>
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No simulation data</h3>
                <p className="mt-1 text-sm text-gray-500">Adjust the inputs on the left and run the simulator to compare performance.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

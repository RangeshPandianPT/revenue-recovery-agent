'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Bot, Zap, ShieldAlert, Activity } from 'lucide-react';

export default function LiveAgent() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAgentRun = async () => {
    setAnalyzing(true);
    setResult(null);

    // Mocking an agent analysis delay to simulate reasoning
    setTimeout(() => {
      setResult({
        revenueRecovered: 8499,
        strategy: 'Smart Retry',
        confidence: 91,
        policy: 'PASSED',
        workflow: 'STOPPED',
        reason: 'Payment successful',
        rootCause: 'Temporary bank failure'
      });
      setAnalyzing(false);
      toast.success('Agent analysis complete');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Live AI Recovery Agent</h2>
        <p className="text-lg text-gray-500">
          Run the agent on a sample revenue-risk event to see Detect → Diagnose → Decide → Act in real-time.
        </p>
        
        <button
          onClick={simulateAgentRun}
          disabled={analyzing}
          className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {analyzing ? (
            <>
              <Bot className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Agent Reasoning...
            </>
          ) : (
            <>
              <Zap className="-ml-1 mr-3 h-5 w-5" />
              RUN RECOVERY AGENT
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white overflow-hidden shadow rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-4">Agent Execution Report</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <ShieldAlert className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Root Cause</p>
                    <p className="text-base font-semibold text-gray-900">{result.rootCause}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Bot className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Selected Strategy</p>
                    <p className="text-base font-semibold text-gray-900">{result.strategy} (Confidence: {result.confidence}%)</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Activity className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue Recovered</p>
                    <p className="text-base font-semibold text-green-600">₹{result.revenueRecovered.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 h-full">
                  <h4 className="text-sm font-bold text-blue-900 mb-2">Workflow Trace</h4>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-center">✓ Revenue risk detected</li>
                    <li className="flex items-center">✓ Context loaded & diagnosed</li>
                    <li className="flex items-center">✓ Qwen agent selected intervention</li>
                    <li className="flex items-center">✓ Policy validation: <span className="ml-1 font-bold">{result.policy}</span></li>
                    <li className="flex items-center">✓ Executed bounded workflow</li>
                    <li className="flex items-center font-semibold mt-2">↳ Result: {result.workflow} ({result.reason})</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

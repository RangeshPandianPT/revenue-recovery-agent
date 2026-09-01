'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smartphone, ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';

export default function SimulatorPage() {
  const [phone, setPhone] = useState('');
  const [scenario, setScenario] = useState('b2b_overdue');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<null | 'success' | 'escalated'>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setResult(null);

    // Simulate backend call
    setTimeout(() => {
      setIsSimulating(false);
      setResult(scenario === 'fraud_risk' ? 'escalated' : 'success');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Live Attack & Simulation Playground</h2>
        <p className="text-gray-500 mt-1">Trigger edge cases and watch the Bounded AI react. Enter a real phone number to receive the recovery action.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSimulate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Edge Case Scenario</label>
              <select 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              >
                <option value="b2b_overdue">Enterprise B2B - Overdue Invoice ($50k)</option>
                <option value="retail_failed">Retail Customer - Insufficient Funds ($15)</option>
                <option value="high_ltv_churn">High LTV Churn Risk - Expired Card</option>
                <option value="fraud_risk">Anomalous Activity - Suspected Fraud (Risk!)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judge's Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5" 
                  placeholder="+91 98765 43210" 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">If provided, we will route the AI's action via Twilio SMS.</p>
            </div>

            <button 
              type="submit" 
              disabled={isSimulating}
              className={`w-full flex items-center justify-center gap-2 text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-all ${
                isSimulating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {isSimulating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSimulating ? 'AI is analyzing context...' : 'Inject Event & Trigger AI'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {!isSimulating && !result && (
            <div className="text-center opacity-50">
              <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 font-mono text-sm">Awaiting Injection Event...</p>
            </div>
          )}

          {isSimulating && (
            <div className="text-center w-full">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div className="font-mono text-indigo-400 text-sm">
                <p className="animate-pulse">Loading Context Aggregator...</p>
                <p className="animate-pulse delay-75">Evaluating Policy Gates...</p>
              </div>
            </div>
          )}

          {result === 'success' && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               className="text-center w-full bg-green-900/20 border border-green-500/30 p-6 rounded-xl backdrop-blur-sm"
             >
               <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
               <h3 className="text-xl font-bold text-green-400 mb-2">Intervention Deployed</h3>
               <p className="text-gray-300 text-sm">The policy engine approved a SMART_RETRY + PAYMENT_LINK.</p>
               {phone && (
                 <p className="text-green-300 text-xs mt-4 font-mono">SMS dispatched via Twilio to {phone}</p>
               )}
             </motion.div>
          )}

          {result === 'escalated' && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               className="text-center w-full bg-red-900/20 border border-red-500/30 p-6 rounded-xl backdrop-blur-sm"
             >
               <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
               <h3 className="text-xl font-bold text-red-400 mb-2">Action BLOCKED</h3>
               <p className="text-gray-300 text-sm">Policy Engine detected high risk. AI automation halted. Escalated to human team.</p>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

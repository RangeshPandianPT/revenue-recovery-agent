'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ShieldCheck, Terminal, AlertTriangle, Zap, CheckCircle2, Lock } from 'lucide-react';

export default function AgentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<{ id: number; text: string; type: 'info' | 'success' | 'warning' | 'error' | 'system' }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Receiving raw payment context...",
    "Extracting entity: B2B Enterprise Client (LTV: ₹8,40,000)",
    "Classifying failure: Insufficient Funds (Code: R04)",
    "Calculating baseline recovery probability...",
    "Probability: 0.76 (HIGH)",
    "Evaluating candidate interventions...",
    "SMART_RETRY [Ev: 0.31] | PAYMENT_LINK [Ev: 0.76] | REMINDER [Ev: 0.48]",
    "Selecting optimal intervention: PAYMENT_LINK",
    "Forwarding to Deterministic Policy Engine...",
    "Checking policy: MAX_RETRIES_EXCEEDED? [False]",
    "Checking policy: INCENTIVE_ALLOWED? [N/A]",
    "Policy Enforcement: APPROVED",
    "Executing API Call to generate link...",
    "Done."
  ];

  const triggerSimulation = () => {
    setIsProcessing(true);
    setLogs([]);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isProcessing && currentStep < steps.length) {
      const delay = Math.random() * 600 + 200; // Random delay between 200-800ms
      const timer = setTimeout(() => {
        let type: 'info' | 'success' | 'warning' | 'error' | 'system' = 'info';
        const text = steps[currentStep];
        
        if (text.includes("APPROVED") || text.includes("Done.")) type = 'success';
        if (text.includes("Evaluating") || text.includes("Checking")) type = 'system';
        if (text.includes("Probability: 0.76")) type = 'warning';
        
        setLogs(prev => [...prev, { id: currentStep, text, type }]);
        setCurrentStep(s => s + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (isProcessing && currentStep === steps.length) {
      setIsProcessing(false);
    }
  }, [isProcessing, currentStep, steps]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600 h-6 w-6" />
            AI Reasoning Engine
          </h2>
          <p className="text-gray-500 mt-1">Real-time visibility into the bounded AI decision framework.</p>
        </div>
        <button 
          onClick={triggerSimulation}
          disabled={isProcessing}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'}`}
        >
          {isProcessing ? 'Processing...' : 'Simulate Recovery Decision'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Hacker Terminal UI for CoT */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col relative font-mono">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-gray-800 backdrop-blur">
            <Terminal className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Chain of Thought Stream</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-gray-600 select-none text-xs mt-1">
                    {new Date().toISOString().substring(11, 23)}
                  </span>
                  <div className={`text-sm ${
                    log.type === 'success' ? 'text-green-400 font-bold' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    log.type === 'system' ? 'text-blue-400 opacity-80' :
                    'text-gray-300'
                  }`}>
                    {log.text}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-4 bg-gray-400 inline-block ml-24"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bounded Policy Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Policy Engine Gates
            </h3>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
             
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${currentStep > 9 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep > 9 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                   {currentStep > 9 ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Retry Limits</p>
                  <p className="text-xs text-gray-500">Maximum retries not exceeded</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${currentStep > 10 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep > 10 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                   {currentStep > 10 ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Incentive Risk</p>
                  <p className="text-xs text-gray-500">No high-risk incentives proposed</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${currentStep > 11 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep > 11 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                   {currentStep > 11 ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Compliance</p>
                  <p className="text-xs text-gray-500">Action permitted by enterprise policy</p>
                </div>
              </div>
            </div>

            {currentStep === steps.length && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-center"
              >
                <Zap className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-indigo-900">PAYMENT_LINK Executed</h4>
                <p className="text-xs text-indigo-700 mt-1">Successfully forwarded to communication gateway.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

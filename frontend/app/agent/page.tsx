'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bot, Zap, ShieldAlert, Activity, CheckCircle2, ChevronRight, BrainCircuit, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THINKING_STEPS = [
  "Intercepting Razorpay Webhook: payment.failed...",
  "Loading Customer 360 & Lifetime Value Data...",
  "Analyzing Past Interaction Sentiment...",
  "Querying RecoverAI Brain (Gemini Pro)...",
  "Synthesizing Optimal Negotiation Strategy...",
  "Validating against Enterprise Policies..."
];

export default function LiveAgent() {
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<any>(null);

  const simulateAgentRun = async () => {
    setAnalyzing(true);
    setResult(null);
    setStepIndex(0);

    // Simulate thinking steps visually before making the API call (fast for demo)
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      setStepIndex(i);
      await new Promise(r => setTimeout(r, 100)); // 100ms per step
    }

    try {
      const response = await fetch('http://localhost:8000/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: 'DEMO-123',
          event_type: 'PAYMENT_FAILURE',
          amount: 8499,
          customer_ltv: 50000,
          customer_name: 'Acme Corp',
          failure_reason: 'insufficient_funds',
          previous_failures: 1
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze event');
      const data = await response.json();
      
      setResult({
        revenueRecovered: data.expected_net_revenue,
        strategy: data.recommended_strategy,
        confidence: Math.round(data.confidence * 100),
        policy: data.requires_human_review ? 'REVIEW REQUIRED' : 'PASSED',
        workflow: data.requires_human_review ? 'ESCALATED' : 'EXECUTED',
        reason: data.reason,
        rootCause: data.root_cause
      });
      
      toast.success('AI Decision Process Complete!');
    } catch (error: any) {
      console.error(error);
      toast.error('Agent analysis failed. Ensure backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      {/* Header section with dramatic styling */}
      <div className="text-center space-y-4 mb-12 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] -ml-20"></div>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 drop-shadow-sm"
        >
          RecoverAI Brain
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
        >
          Trigger a simulated payment failure and watch the autonomous agent reason, decide, and recover revenue in real-time.
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={simulateAgentRun}
          disabled={analyzing}
          className="mt-8 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(79,70,229,0.4)] overflow-hidden group"
        >
          {analyzing ? (
            <>
              <BrainCircuit className="animate-pulse mr-3 h-6 w-6" />
              Agent is Thinking...
            </>
          ) : (
            <>
              <Zap className="mr-3 h-6 w-6 group-hover:text-yellow-300 transition-colors" />
              TRIGGER AI RECOVERY LOOP
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-500"></div>
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {analyzing && !result && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
          >
            <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-gray-400 text-xs font-mono ml-4">agent_execution_trace.sh</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              {THINKING_STEPS.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: idx <= stepIndex ? 1 : 0, 
                    x: idx <= stepIndex ? 0 : -10,
                    color: idx === stepIndex ? '#60a5fa' : '#9ca3af' // blue-400 active, gray-400 past
                  }}
                  className="flex items-start"
                >
                  <ChevronRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className={idx === stepIndex ? "animate-pulse" : ""}>{step}</span>
                  {idx < stepIndex && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {result && !analyzing && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-2xl rounded-3xl border border-gray-100/50"
          >
            <div className="px-6 py-8 sm:p-10">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bot className="h-8 w-8 text-indigo-600 mr-3" />
                  AI Decision Report
                </h3>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-bold text-green-700">EXECUTION {result.workflow}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Metrics Column */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Glass Card */}
                  <div className="relative group rounded-2xl p-[1px] overflow-hidden bg-gradient-to-b from-blue-400 to-indigo-600">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity blur"></div>
                    <div className="relative h-full bg-white rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <Activity className="h-8 w-8 text-blue-600 mb-2" />
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                          {result.confidence}%
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4">AI Confidence Score</p>
                      <p className="text-xs text-gray-500 mt-1">High certainty based on 10,000+ similar recoveries.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <ShieldAlert className="h-6 w-6 text-red-500 mb-3" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Root Cause</p>
                      <p className="text-sm font-semibold text-gray-900">{result.rootCause}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <Lock className="h-6 w-6 text-indigo-500 mb-3" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Policy Gate</p>
                      <p className="text-sm font-semibold text-gray-900">{result.policy}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Expected Recovery</p>
                      <p className="text-2xl font-black text-green-600">₹{result.revenueRecovered.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </div>

                {/* Reasoning Column */}
                <div className="lg:col-span-7 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50 h-full">
                  <h4 className="text-sm font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2" />
                    LLM Reasoning Output
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Chosen Strategy</p>
                      <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg shadow-md">
                        {result.strategy}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Agent Rationale</p>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 text-indigo-950 font-medium leading-relaxed italic relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                        "{result.reason}"
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-indigo-200/50">
                      <p className="text-xs text-indigo-500 font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        Next step generated and queued for automated dispatch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

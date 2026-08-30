'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Zap, ShieldCheck } from 'lucide-react';

const COMPANIES = ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex', 'Soylent', 'Initech'];
const STRATEGIES = ['Smart Retry', 'Discount Offer', 'Payment Plan', 'WhatsApp Nudge'];

export default function LiveFeed() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    // Initial data
    setFeed([
      { id: '1', amount: 4500, company: 'Acme Corp', strategy: 'Smart Retry', time: 'Just now' },
      { id: '2', amount: 12500, company: 'Stark Ind.', strategy: 'Payment Plan', time: '1m ago' },
    ]);

    const interval = setInterval(() => {
      const newEvent = {
        id: Math.random().toString(),
        amount: Math.floor(Math.random() * 20000) + 1000,
        company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
        strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
        time: 'Just now'
      };
      
      setFeed(prev => {
        const updated = [newEvent, ...prev.map(p => ({...p, time: p.time === 'Just now' ? '30s ago' : p.time}))];
        return updated.slice(0, 4); // Keep last 4
      });
    }, 4500); // Every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
      
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur">
        <h3 className="text-sm font-bold text-gray-100 flex items-center uppercase tracking-wider">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live AI Recoveries
        </h3>
        <Zap className="h-4 w-4 text-yellow-400" />
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {feed.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`bg-gray-800 rounded-xl p-3 border border-gray-700 flex items-center justify-between ${idx === 0 ? 'ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center text-green-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-100">{item.company}</p>
                  <p className="text-xs text-gray-400 font-mono text-[10px] mt-0.5">{item.strategy}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400 font-mono">+₹{item.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, RefreshCw, Send, AlertOctagon } from "lucide-react";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const txnId = resolvedParams.id || "txn_9281a";

  const mockTxn = {
    id: txnId,
    customer: "Acme Corp",
    amount: "₹45,000",
    rawAmount: 45000,
    eventType: "PAYMENT_FAILURE",
    method: "UPI / Recurring Mandate",
    status: "FAILED_RECOVERABLE",
    failureReason: "INSUFFICIENT_FUNDS_TEMPORARY (R04)",
    timestamp: "2026-09-05 21:14:02",
    recoveryProbability: 88,
    recommendedStrategy: "SMART_RETRY",
    expectedNetRevenue: "₹44,500",
    aiReasoning: "Customer has a high LTV (>₹1.5L) with zero previous defaults. Payment failure code R04 indicates temporary liquidity imbalance usually resolved within 48 hours. Smart retry recommended for early morning.",
    policies: [
      { name: "Max Retry Limit (2/2 remaining)", status: "PASSED" },
      { name: "Communication Frequency Limit (0 sent today)", status: "PASSED" },
      { name: "High-Value Escalation Threshold (<₹50,000)", status: "PASSED" },
      { name: "Incentive Cap Policy (0% applied)", status: "PASSED" }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Top Header */}
      <div>
        <Link
          href="/transactions"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Transaction Ledger
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Transaction Details: <span className="font-mono text-indigo-600">{mockTxn.id}</span>
            </h2>
            <p className="text-gray-500 mt-1">Detailed AI Diagnosis, Policy Audit, and Execution Controls.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
              {mockTxn.status}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Metadata & AI Reasoner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" /> Payment & Customer Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Customer</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{mockTxn.customer}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Amount at Risk</span>
                <p className="text-base font-bold text-indigo-600 mt-1">{mockTxn.amount}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Event Type</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">{mockTxn.eventType}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Payment Method</span>
                <p className="text-sm text-gray-700 mt-1">{mockTxn.method}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Failure Code</span>
                <p className="text-sm font-medium text-red-600 mt-1">{mockTxn.failureReason}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Event Time</span>
                <p className="text-xs text-gray-500 mt-1">{mockTxn.timestamp}</p>
              </div>
            </div>
          </div>

          {/* AI Diagnosis & Strategy Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h3 className="text-base font-bold text-white tracking-wide uppercase">AI Reasoner Output</h3>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-mono rounded-lg border border-indigo-500/30">
                Confidence: {mockTxn.recoveryProbability}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <span className="text-xs text-slate-400 font-medium">Recommended Action</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{mockTxn.recommendedStrategy}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Expected Net Revenue</span>
                <p className="text-lg font-bold text-indigo-300 mt-0.5">{mockTxn.expectedNetRevenue}</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium">Reasoning & Root Cause Context</span>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 font-sans">
                "{mockTxn.aiReasoning}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Policy Audit & Execution Controls */}
        <div className="space-y-6">
          {/* Policy Gate Checklist */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Bounded Policy Checklist
            </h3>
            <div className="space-y-3 pt-2">
              {mockTxn.policies.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-medium text-gray-700">{p.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Intervention Execution Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Execute Intervention</h3>
            <p className="text-xs text-gray-500">Perform bounded action or override AI decision manually.</p>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => alert(`Triggering Smart Retry for ${txnId}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Trigger Smart Retry Now
              </button>
              <button
                onClick={() => alert(`Generating Payment Link for ${txnId}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
              >
                <Send className="w-4 h-4" /> Send Payment Link (SMS/WA)
              </button>
              <button
                onClick={() => alert(`Escalating ${txnId} to Human Queue`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium text-sm rounded-xl transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-amber-600" /> Escalate to Human Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

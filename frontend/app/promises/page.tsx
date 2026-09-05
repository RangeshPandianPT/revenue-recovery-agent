"use client";

import React, { useState, useEffect } from "react";
import { Handshake, Calendar, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, DollarSign } from "lucide-react";

export default function PromiseToPayPage() {
  const [promises, setPromises] = useState([
    {
      id: "ptp_101",
      client: "Stark Tech Systems",
      amount: "₹1,20,000",
      rawAmount: 120000,
      promiseDate: "2026-09-15",
      confidence: "HIGH",
      status: "PENDING",
      invoiceId: "INV-2026-88"
    },
    {
      id: "ptp_102",
      client: "Cyberdyne Logistics",
      amount: "₹50,000",
      rawAmount: 50000,
      promiseDate: "2026-09-05",
      confidence: "MEDIUM",
      status: "KEPT",
      invoiceId: "INV-2026-82"
    },
    {
      id: "ptp_103",
      client: "Acme Enterprises",
      amount: "₹85,000",
      rawAmount: 85000,
      promiseDate: "2026-09-02",
      confidence: "LOW",
      status: "BROKEN",
      invoiceId: "INV-2026-79"
    },
    {
      id: "ptp_104",
      client: "Wayne Tech Solutions",
      amount: "₹2,10,000",
      rawAmount: 210000,
      promiseDate: "2026-09-20",
      confidence: "HIGH",
      status: "PENDING",
      invoiceId: "INV-2026-95"
    }
  ]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const actionParam = newStatus.toLowerCase();
      await fetch(`http://localhost:8000/api/promises/${id}/${actionParam}`, { method: "POST" });
    } catch {
      // Local optimistic update
    }
    setPromises((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-indigo-600" /> Promise to Pay (PTP) Tracker
          </h2>
          <p className="text-gray-500 mt-1">Autonomous tracking of B2B payment commitments and automatic broken-promise escalations.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Commitments</span>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">₹3.30L</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Promises Kept</span>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">₹50,000</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Broken Promises</span>
            <p className="text-2xl font-bold text-rose-600 mt-0.5">₹85,000</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Active & Historical Commitments</h3>
          <span className="text-xs text-gray-400 font-mono">B2B Workflow Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client / Company</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Committed Amount</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promised Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Confidence</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promises.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-gray-900">{p.client}</td>
                  <td className="p-4 text-sm text-gray-600 font-mono">{p.invoiceId}</td>
                  <td className="p-4 text-sm font-bold text-indigo-600">{p.amount}</td>
                  <td className="p-4 text-sm text-gray-700 font-medium">{p.promiseDate}</td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        p.confidence === "HIGH"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.confidence === "MEDIUM"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.confidence}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                        p.status === "KEPT"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.status === "BROKEN"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {p.status === "KEPT" && <CheckCircle2 className="w-3 h-3" />}
                      {p.status === "BROKEN" && <XCircle className="w-3 h-3" />}
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-right space-x-2">
                    {p.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(p.id, "KEPT")}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Mark Kept
                        </button>
                        <button
                          onClick={() => updateStatus(p.id, "BROKEN")}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Mark Broken
                        </button>
                      </>
                    )}
                    {p.status !== "PENDING" && (
                      <span className="text-xs text-gray-400 font-medium">Logged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { ArrowLeft, User, AlertCircle, Activity, Shield, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TransactionDetail({ params }: { params: { id: string } }) {
  // Mock data for the detailed view
  const txn = {
    id: params.id || 'TXN-98231',
    customer: 'Acme Corp (Enterprise)',
    customerId: 'CUST-84920',
    ltv: 845000,
    amount: 27500,
    status: 'RECOVERED',
    rootCause: 'Soft Decline - Insufficient Funds (Temporary)',
    paymentMethod: 'UPI / HDFC Bank',
    probability: 87,
    aiRecommendation: 'Smart Retry (Optimal Window)',
    expectedRecovery: 27500,
    expectedNet: 27485, // minus tiny retry cost
    policyValidation: 'PASSED (Retry count: 1/3)',
    revenueImpact: 27500
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 font-mono pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <Link href="/transactions" className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            {txn.id} 
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              {txn.status}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Transaction Intelligence & Recovery Trace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Context & Overview */}
        <div className="space-y-6 lg:col-span-1">
          {/* Overview */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Transaction Overview</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-gray-500 mb-1">Amount</dt>
                <dd className="text-xl font-bold text-gray-900">{formatCurrency(txn.amount)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Payment Method</dt>
                <dd className="text-sm font-medium text-gray-900">{txn.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Failure Root Cause</dt>
                <dd className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">{txn.rootCause}</dd>
              </div>
            </dl>
          </div>

          {/* Customer Intel */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Customer Intelligence
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <dt className="text-xs text-gray-500">Customer</dt>
                <dd className="text-sm font-medium text-gray-900">{txn.customer}</dd>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <dt className="text-xs text-gray-500">ID</dt>
                <dd className="text-sm font-medium text-gray-900">{txn.customerId}</dd>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <dt className="text-xs text-gray-500">Lifetime Value</dt>
                <dd className="text-sm font-medium text-green-600">{formatCurrency(txn.ltv)}</dd>
              </div>
              <div className="flex justify-between items-center pt-1">
                <dt className="text-xs text-gray-500">Risk Segment</dt>
                <dd className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">VIP / LOW RISK</dd>
              </div>
            </dl>
          </div>

          {/* Revenue Impact */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Revenue Impact
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gross Recovered</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(txn.expectedRecovery)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Recovery Cost</span>
                <span className="text-sm font-bold text-red-500">-{formatCurrency(txn.expectedRecovery - txn.expectedNet)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-semibold text-gray-900">Net Revenue Retained</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(txn.expectedNet)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI & Workflow */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* AI Decision Engine */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl text-gray-300">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <Shield className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Recovery Engine</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">ML Recovery Probability</p>
                <p className="text-3xl font-bold text-white">{txn.probability}%</p>
                <p className="text-xs text-green-400 mt-1">High Confidence</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Recommended Action</p>
                <p className="text-lg font-bold text-blue-400">{txn.aiRecommendation}</p>
              </div>
              <div className="col-span-2 bg-black/30 p-4 rounded-lg border border-gray-800 mt-2">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Business Explanation (Chain of Thought)</p>
                <p className="text-sm leading-relaxed text-gray-300">
                  <span className="text-purple-400 font-bold">REASONING:</span> Customer has high LTV and no prior failure history. Root cause (Soft Decline) implies temporary liquidity issue. 
                  <br/><br/>
                  <span className="text-blue-400 font-bold">DECISION:</span> Scheduled smart retry during peak success window (10:00 AM IST) instead of immediate aggressive collection. Avoiding SMS/Email to preserve customer experience.
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-between border-t border-gray-800 pt-4 mt-2">
                <span className="text-sm text-gray-400">Policy Validation</span>
                <span className="text-sm font-bold text-green-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> {txn.policyValidation}</span>
              </div>
            </div>
          </div>

          {/* Workflow Timeline / Audit Trail */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Complete Audit Trail</h3>
            
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
              
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-red-100 border-2 border-red-500 rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Payment Failed</h4>
                    <p className="text-xs text-gray-500 mt-1">Gateway reported: Insufficient Funds</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Aug 25, 09:12 AM</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">AI Analyzed Transaction</h4>
                    <p className="text-xs text-gray-500 mt-1">Probability calculated, policy checked.</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Aug 25, 09:12 AM</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Smart Retry Queued</h4>
                    <p className="text-xs text-gray-500 mt-1">Scheduled for optimal window (10:00 AM)</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Aug 25, 09:13 AM</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-green-100 border-2 border-green-500 rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Payment Recovered</h4>
                    <p className="text-xs text-gray-500 mt-1">Retry successful via Gateway. ₹27,500 secured.</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Aug 25, 10:01 AM</span>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Workflow Stopped</h4>
                    <p className="text-xs text-gray-500 mt-1">Reason: Successful Recovery</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Aug 25, 10:01 AM</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

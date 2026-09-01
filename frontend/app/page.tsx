import LiveFeed from '@/components/LiveFeed';
import { Target, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-gray-500 mt-1">Real-time recovery metrics and live agent activity.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+14.2%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Recovery Rate</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">64.8%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Revenue Recovered</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹32.4L</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">AI Decisions</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">4,291</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">-3.1%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Escalation Rate</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">5.2%</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[400px]">
           {/* Placeholder for real-time chart, can add later if time permits */}
           <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Recovery Value Trajectory</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Detailed visualizations of AI-driven recovery vs traditional rule-based retries over the last 30 days.
              </p>
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Generate Report
              </button>
           </div>
        </div>
        
        <div className="lg:col-span-1">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}

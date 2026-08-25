'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Platform Settings
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Configure your AI agent limits, integrations, and global policies.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">AI Agent Configuration</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Select the AI provider and set global bounded limits.</p>
          </div>
          <form className="mt-5 space-y-6">
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">AI Provider</label>
                <div className="mt-1">
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                    <option>Local AI (Qwen via Ollama)</option>
                    <option>Cloud AI (Gemini)</option>
                    <option>Demo Fallback Engine</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Min. Recovery Probability</label>
                <div className="mt-1">
                  <input type="number" defaultValue={30} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Action blocked below this %</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Max Payment Retries</label>
                <div className="mt-1">
                  <input type="number" defaultValue={2} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Max Communication Limits</label>
                <div className="mt-1">
                  <input type="number" defaultValue={2} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Integrations</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Manage connection with your payment gateway.</p>
          </div>
          <div className="mt-5">
             <div className="flex items-center justify-between border border-gray-200 p-4 rounded-md">
                <div className="flex items-center">
                   <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center font-bold text-blue-600 text-xl">R</div>
                   <div className="ml-4">
                     <p className="font-medium text-gray-900">Razorpay</p>
                     <p className="text-sm text-gray-500">Connected in Test Mode</p>
                   </div>
                </div>
                <button className="px-3 py-1 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-50">
                  Configure
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <p className="text-gray-500 mt-1">Configure deterministic policy gates and AI thresholds.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy Name</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parameter</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Value</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Max Automated Retries</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">max_retries</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">3</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Yesterday</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Active</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">High Value Escalate Threshold</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">ltv_threshold_inr</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹1,00,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Last Week</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Active</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Min AI Confidence</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">min_confidence</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">0.70</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Yesterday</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Active</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

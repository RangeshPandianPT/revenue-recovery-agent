
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recovery Analytics</h2>
        <p className="text-gray-500 mt-1">Deep dive into recovery performance and AI ROI.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metric</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Period</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Previous Period</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delta</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Recovery Rate</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">64.8%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">50.6%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">+14.2%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Healthy</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">False Interventions</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">14</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">215</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">-93.4%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Excellent</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Escalation Rate</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">5.2%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">8.3%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">-3.1%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Healthy</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

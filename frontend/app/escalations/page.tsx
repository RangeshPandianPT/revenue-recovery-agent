
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Human Escalation Queue</h2>
        <p className="text-gray-500 mt-1">Cases that exceeded AI policy limits or require manual review.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">ESC-091</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Massive Dynamic</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹2,10,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Policy: High Value Risk</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">Review Required</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">ESC-092</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Hooli</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹85,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Max Retries Exceeded</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">Review Required</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

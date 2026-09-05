
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recovery Opportunities</h2>
        <p className="text-gray-500 mt-1">AI-identified revenue at risk ready for intervention.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Confidence</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Acme Corp</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹45,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">High</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">92%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Pending AI Decision</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Stark Ind.</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹1,20,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Medium</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">76%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Evaluating Policies</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Wayne Ent.</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹8,500</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md inline-block">Low</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">98%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md inline-block">Action Recommended</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Globex</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹2,34,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">High</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">45%</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">Escalated</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
